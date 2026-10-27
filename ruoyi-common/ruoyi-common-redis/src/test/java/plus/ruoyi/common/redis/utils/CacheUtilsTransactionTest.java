package plus.ruoyi.common.redis.utils;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import plus.ruoyi.common.test.base.BaseSpringTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * CacheUtils 事务语义回归测试
 *
 * <p>钉死线上事故根因：CacheManager 默认 transactionAware=true，Spring 的
 * TransactionAwareCacheDecorator 会把 put/evict/clear 推迟到事务 afterCommit，
 * 而 get 始终直连底层缓存。于是「写完立刻读」在事务中必然读不到，
 * 曾导致 OssFactory 自愈失败并抛出 “'local'配置信息不存在!”。</p>
 *
 * <p>判定事务是否活跃的唯一依据是 {@code TransactionSynchronizationManager.isSynchronizationActive()}，
 * 因此这里用手动激活同步来精确模拟「处于 @Transactional 方法内」，
 * 无需真实数据库事务，测试更轻更稳定。</p>
 *
 * @author 抓蛙师
 */
@Tag("dev")
@DisplayName("CacheUtils事务语义测试")
public class CacheUtilsTransactionTest extends BaseSpringTest {

    /**
     * 测试使用的缓存组名称
     */
    private static final String TEST_CACHE_NAME = "testTxCache";

    /**
     * 测试使用的key列表，用于清理
     */
    private final List<String> testKeys = new ArrayList<>();

    @AfterEach
    public void tearDown() {
        // 确保同步状态不泄漏到其它用例
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
        for (String key : testKeys) {
            try {
                CacheUtils.evict(TEST_CACHE_NAME, key);
            } catch (Exception ignored) {
            }
        }
        testKeys.clear();
    }

    /**
     * 生成测试key并记录，便于收尾清理
     */
    private String genTestKey(String suffix) {
        String key = "test:tx:" + suffix + ":" + System.nanoTime();
        testKeys.add(key);
        return key;
    }

    // ==================== 根因复现 ====================

    @Test
    @DisplayName("复现事故根因：事务中 put 之后立刻 get 读不到")
    void testPutInTransactionIsNotVisibleImmediately() {
        String key = genTestKey("put-invisible");
        TransactionSynchronizationManager.initSynchronization();
        try {
            CacheUtils.put(TEST_CACHE_NAME, key, "value");

            // put 被登记为 afterCommit 回调，底层缓存此刻仍然没有数据
            String actual = CacheUtils.get(TEST_CACHE_NAME, key);
            assertThat(actual)
                .as("事务中 CacheUtils.put 被推迟到 afterCommit，写完立刻读必然为 null —— 这正是 OSS 配置自愈失效的原因")
                .isNull();
        } finally {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    @DisplayName("对照组：非事务中 put 之后立刻 get 可以读到")
    void testPutWithoutTransactionIsVisibleImmediately() {
        String key = genTestKey("put-visible");
        assertThat(TransactionSynchronizationManager.isSynchronizationActive())
            .as("对照组必须在无事务上下文执行")
            .isFalse();

        CacheUtils.put(TEST_CACHE_NAME, key, "value");

        String actual = CacheUtils.get(TEST_CACHE_NAME, key);
        assertThat(actual)
            .as("非事务上下文写入立即生效，这就是框架自带上传接口不出事、业务事务接口出事的原因")
            .isEqualTo("value");
    }

    @Test
    @DisplayName("事务回滚后 put 彻底丢失（故障会持续而不会自愈）")
    void testPutInTransactionIsDiscardedOnRollback() {
        String key = genTestKey("put-rollback");
        TransactionSynchronizationManager.initSynchronization();
        try {
            CacheUtils.put(TEST_CACHE_NAME, key, "value");
        } finally {
            // 只清同步不触发 afterCommit，等价于事务回滚
            TransactionSynchronizationManager.clearSynchronization();
        }

        String actual = CacheUtils.get(TEST_CACHE_NAME, key);
        assertThat(actual)
            .as("异常抛出导致事务回滚时 afterCommit 不会执行，缓存永远补不回来，只能靠外部清缓存/重启恢复")
            .isNull();
    }

    @Test
    @DisplayName("语义确认：常规 evict 在事务中同样延迟（这是正确行为，不要改）")
    void testRegularEvictStaysDeferredInsideTransaction() {
        String key = genTestKey("evict-deferred");
        // 先在无事务上下文写入，确保底层缓存里确实有值
        CacheUtils.put(TEST_CACHE_NAME, key, "value");

        TransactionSynchronizationManager.initSynchronization();
        try {
            CacheUtils.evict(TEST_CACHE_NAME, key);

            String actual = CacheUtils.get(TEST_CACHE_NAME, key);
            assertThat(actual)
                .as("改完数据再失效缓存必须等事务提交，否则回滚后缓存已被误删，因此 evict 保持延迟语义是正确的")
                .isEqualTo("value");
        } finally {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }
}
