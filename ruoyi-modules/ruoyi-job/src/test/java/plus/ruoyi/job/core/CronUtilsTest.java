package plus.ruoyi.job.core;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import plus.ruoyi.common.test.base.BaseUnitTest;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * CronUtils 工具类测试。
 * <p>
 * 重点覆盖「时区」——本类存在的首要目的就是不让调度时间跟随 JVM 默认时区漂移，
 * 而这类缺陷在测试环境（通常恰好也是东八区）里根本复现不出来，只能靠断言固定时区来守住。
 *
 * @author 抓蛙师
 */
@Tag("dev")
@DisplayName("CronUtils 定时表达式工具测试")
class CronUtilsTest extends BaseUnitTest {

    /**
     * 东八区，用于构造与断言时间
     */
    private static final ZoneId CST = ZoneId.of("Asia/Shanghai");

    @Test
    @DisplayName("测试运行在 UTC 下（前置条件，保证下面的时区断言真正有效）")
    void testJvmRunsInUtc() {
        // 由本模块 pom 的 surefire argLine 设置 -Duser.timezone=UTC。
        // 这个前置断言很关键：若哪天该配置被删掉，测试 JVM 退回东八区，
        // 下面的时区断言会变成「怎么写都通过」的假绿灯，本用例可及时暴露。
        assertThat(ZoneId.systemDefault()).isNotEqualTo(CST);
    }

    @Test
    @DisplayName("调度时区固定为东八区，不跟随 JVM 默认时区")
    void testZoneIsFixedToShanghai() {
        assertThat(CronUtils.ZONE).isEqualTo(CST);
        // 与 JVM 默认时区不同，才证明「固定」二字名副其实
        assertThat(CronUtils.ZONE).isNotEqualTo(ZoneId.systemDefault());
    }

    @Test
    @DisplayName("JVM 时区为 UTC 时，下次执行时间仍按东八区计算（不偏移 8 小时）")
    void testNextIgnoresJvmDefaultZone() {
        // 基准：东八区 2026-08-01 01:00:00，cron 为每天 03:00
        Date base = dateOf(2026, 8, 1, 1, 0, 0);
        Date next = CronUtils.next("0 0 3 * * ?", base);

        assertThat(next).isNotNull();
        // 必须落在东八区的 03:00。若实现改用 systemDefault()（此处为 UTC），
        // 算出的会是 UTC 03:00，换算成东八区即 11:00，本断言立即失败。
        LocalDateTime actual = LocalDateTime.ofInstant(next.toInstant(), CST);
        assertThat(actual).isEqualTo(LocalDateTime.of(2026, 8, 1, 3, 0, 0));
    }

    @Test
    @DisplayName("计算下次执行时间 - 跨天场景")
    void testNextAcrossDay() {
        // 基准 04:00 已过当天 03:00，下次应顺延到次日
        Date base = dateOf(2026, 8, 1, 4, 0, 0);
        Date next = CronUtils.next("0 0 3 * * ?", base);

        LocalDateTime actual = LocalDateTime.ofInstant(next.toInstant(), CST);
        assertThat(actual).isEqualTo(LocalDateTime.of(2026, 8, 2, 3, 0, 0));
    }

    @Test
    @DisplayName("计算下次执行时间 - 每 5 分钟步长")
    void testNextWithStep() {
        Date base = dateOf(2026, 8, 1, 10, 1, 30);
        Date next = CronUtils.next("0 0/5 * * * ?", base);

        LocalDateTime actual = LocalDateTime.ofInstant(next.toInstant(), CST);
        assertThat(actual).isEqualTo(LocalDateTime.of(2026, 8, 1, 10, 5, 0));
    }

    @ParameterizedTest
    @DisplayName("合法 cron 校验通过（Spring 6 位含秒）")
    @ValueSource(strings = {
        "0 * * * * ?",          // 每分钟
        "0 0 3 * * ?",          // 每天 3 点
        "0 0/5 * * * ?",        // 每 5 分钟
        "0 0 0 ? * MON",        // 每周一
        "0 0 0 1 * ?",          // 每月 1 号
        "0 0/30 * * * ?"        // 每 30 分钟
    })
    void testIsValidWithLegalCron(String cron) {
        assertThat(CronUtils.isValid(cron)).isTrue();
    }

    @ParameterizedTest
    @DisplayName("非法 cron 校验失败（含 Quartz 7 位，Spring 不支持）")
    @ValueSource(strings = {
        "not-a-cron",
        "0 0 3 * *",             // 只有 5 位
        "0 0 3 * * ? 2026",      // Quartz 7 位带年，Spring 不支持
        "99 0 3 * * ?"           // 秒超出范围
    })
    void testIsValidWithIllegalCron(String cron) {
        assertThat(CronUtils.isValid(cron)).isFalse();
    }

    @Test
    @DisplayName("空白 cron 视为非法，不抛异常")
    void testIsValidWithBlank() {
        assertThat(CronUtils.isValid(null)).isFalse();
        assertThat(CronUtils.isValid("")).isFalse();
        assertThat(CronUtils.isValid("   ")).isFalse();
    }

    @Test
    @DisplayName("nowInZone 返回东八区当前时间")
    void testNowInZone() {
        LocalDateTime expected = LocalDateTime.now(CST);
        LocalDateTime actual = CronUtils.nowInZone();
        // 允许 5 秒误差，避免执行间隔导致的偶发失败
        assertThat(java.time.Duration.between(expected, actual).abs().getSeconds())
            .isLessThanOrEqualTo(5);
    }

    /**
     * 构造东八区的指定时刻。
     *
     * @return 对应的 Date
     */
    private Date dateOf(int year, int month, int day, int hour, int minute, int second) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(CST));
        cal.clear();
        cal.set(year, month - 1, day, hour, minute, second);
        return cal.getTime();
    }
}
