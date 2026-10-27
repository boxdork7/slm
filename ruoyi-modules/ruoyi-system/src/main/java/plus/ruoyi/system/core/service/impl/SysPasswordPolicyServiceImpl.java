package plus.ruoyi.system.core.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plus.ruoyi.common.core.enums.UserType;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.utils.DateUtils;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.system.config.service.ISysConfigService;
import plus.ruoyi.system.core.dao.ISysUserDao;
import plus.ruoyi.system.core.domain.vo.PasswordStatusVo;
import plus.ruoyi.system.core.service.ISysPasswordPolicyService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 密码策略服务实现
 * <p>
 * 等保二级 8.1.4.1 a 的落地实现。所有阈值来自 sys_config，读不到时退回本类的
 * DEFAULT_* 常量 —— <b>这个兜底不是可选项</b>：多租户下新建租户不会自动拥有这批参数，
 * ISysConfigService.getConfigByKey 取不到会返回空串，没有兜底就会在登录链路上抛
 * NumberFormatException，导致新租户完全无法登录。
 *
 * @author 抓蛙师
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysPasswordPolicyServiceImpl implements ISysPasswordPolicyService {

    /**
     * 参数键名 —— 与 sys_config.config_key 一一对应
     */
    private static final String KEY_MIN_LENGTH = "system.password.min-length";
    private static final String KEY_COMPLEXITY = "system.password.complexity";
    private static final String KEY_EXPIRE_DAYS_PC = "system.password.expire-days.pc";
    private static final String KEY_EXPIRE_DAYS_APP = "system.password.expire-days.app";
    private static final String KEY_EXPIRE_NOTIFY_DAYS = "system.password.expire-notify-days";
    private static final String KEY_HISTORY_COUNT = "system.password.history-count";
    private static final String KEY_FORCE_CHANGE_INIT = "system.password.force-change-init";

    /**
     * 参数缺失时的兜底默认值，与 sys_config 初始化数据保持一致
     */
    private static final int DEFAULT_MIN_LENGTH = 8;
    private static final int DEFAULT_COMPLEXITY = 3;
    private static final int DEFAULT_EXPIRE_DAYS_PC = 180;
    private static final int DEFAULT_EXPIRE_DAYS_APP = 0;
    private static final int DEFAULT_EXPIRE_NOTIFY_DAYS = 15;
    private static final int DEFAULT_HISTORY_COUNT = 3;
    private static final boolean DEFAULT_FORCE_CHANGE_INIT = true;

    /**
     * 密码中允许出现的特殊字符集合
     */
    private static final String SPECIAL_CHARS = "~!@#$%^&*()-_=+[]{}|;:'\",.<>/?\\`";

    /**
     * 「密码不得包含账号连续片段」的片段长度阈值
     */
    private static final int USER_NAME_FRAGMENT_LENGTH = 3;

    /**
     * 历史密码串的分隔符
     * <p>
     * BCrypt 密文的字符集是 [./A-Za-z0-9$]，不含逗号，所以逗号可安全用作分隔符。
     */
    private static final String HISTORY_SEPARATOR = ",";

    /**
     * 历史密码的保留条数上限
     * <p>
     * sys_user.pwd_history 是 varchar(1000)，一条 BCrypt 密文固定 60 字符加 1 个分隔符，
     * 15 条约 915 字符仍在容量内。参数配得比这更大时会被夹到这里 ——
     * MySQL 非严格模式下超长会静默截断，那会直接把密文写坏且不报错。
     */
    private static final int MAX_HISTORY_COUNT = 15;

    private final ISysConfigService configService;
    private final ISysUserDao userDao;

    /**
     * 校验密码复杂度
     *
     * @param password 明文密码
     * @param userName 用户账号，用于「密码不得包含账号」的校验；为空时跳过该项
     */
    @Override
    public void validateComplexity(String password, String userName) {
        if (StringUtils.isBlank(password)) {
            throw ServiceException.of("密码不能为空");
        }

        int minLength = getIntConfig(KEY_MIN_LENGTH, DEFAULT_MIN_LENGTH);
        if (password.length() < minLength) {
            throw ServiceException.of("密码长度不能少于 " + minLength + " 位");
        }

        int requiredKinds = getIntConfig(KEY_COMPLEXITY, DEFAULT_COMPLEXITY);
        // 复杂度参数被配成 0 或负数时视为「不校验字符种类」，仍保留长度与账号包含检查
        if (requiredKinds > 0) {
            int actualKinds = countCharKinds(password);
            if (actualKinds < requiredKinds) {
                throw ServiceException.of(
                    "密码需至少包含 大写字母、小写字母、数字、特殊字符 中的 " + requiredKinds + " 类，当前仅 " + actualKinds + " 类");
            }
        }

        // 密码含账号片段会大幅降低爆破成本（如 admin → admin@2026），测评也会重点关注
        if (StringUtils.isNotBlank(userName) && containsUserNameFragment(password, userName)) {
            throw ServiceException.of("密码不能包含用户账号的连续片段");
        }
    }

    /**
     * 校验新密码是否与最近 N 次历史密码重复
     *
     * @param userId      用户ID
     * @param newPassword 新密码明文
     */
    @Override
    public void validateNotReused(Long userId, String newPassword) {
        int historyCount = resolveHistoryCount();
        if (userId == null || historyCount <= 0 || StringUtils.isBlank(newPassword)) {
            return;
        }
        // BCrypt 每次加盐结果都不同，无法用等值比较命中，只能逐条 checkpw
        for (String history : splitHistory(userDao.selectPwdHistory(userId))) {
            if (BCrypt.checkpw(newPassword, history)) {
                throw ServiceException.of("新密码不能与最近 " + historyCount + " 次使用过的密码相同");
            }
        }
    }

    /**
     * 记录一条密码历史，并清理超出保留数量的旧记录
     *
     * @param userId            用户ID
     * @param encryptedPassword 已经过 BCrypt 加密的密文
     */
    @Override
    public void recordHistory(Long userId, String encryptedPassword) {
        int historyCount = resolveHistoryCount();
        // 既然不校验重用，就没必要留存历史，避免无意义的数据增长
        if (userId == null || historyCount <= 0 || StringUtils.isBlank(encryptedPassword)) {
            return;
        }
        List<String> histories = splitHistory(userDao.selectPwdHistory(userId));
        // 最新的放最前，超出保留条数时直接丢掉尾部最老的几条。
        // 整串一次性覆盖写入，没有「先插入再删除」的中间态，因此不需要事务
        histories.add(0, encryptedPassword);
        if (histories.size() > historyCount) {
            histories = histories.subList(0, historyCount);
        }
        userDao.updatePwdHistory(userId, String.join(HISTORY_SEPARATOR, histories));
    }

    /**
     * 读取历史保留条数，并按字段容量夹紧上限
     *
     * @return 实际生效的保留条数，非正数表示不做重用校验
     */
    private int resolveHistoryCount() {
        return Math.min(getIntConfig(KEY_HISTORY_COUNT, DEFAULT_HISTORY_COUNT), MAX_HISTORY_COUNT);
    }

    /**
     * 拆分历史密码串
     *
     * @param raw 逗号分隔的 BCrypt 密文串，可为 null
     * @return 可变列表（调用方会往里插入新记录），无历史时返回空列表而非 null
     */
    private List<String> splitHistory(String raw) {
        List<String> histories = new ArrayList<>();
        if (StringUtils.isBlank(raw)) {
            return histories;
        }
        for (String item : raw.split(HISTORY_SEPARATOR)) {
            if (StringUtils.isNotBlank(item)) {
                histories.add(item);
            }
        }
        return histories;
    }

    /**
     * 计算当前登录用户的密码状态
     *
     * @param pwdUpdateDate 密码最后修改时间，为 null 表示从未改过
     * @param userType      用户类型，决定取哪一档有效期参数
     * @return 密码状态
     */
    @Override
    public PasswordStatusVo resolveStatus(Date pwdUpdateDate, String userType) {
        PasswordStatusVo status = new PasswordStatusVo();
        int expireDays = getExpireDaysByUserType(userType);
        status.setExpireDays(expireDays);

        // 从未改过密码 → 强制改密（新建用户 / 管理员刚重置过）
        if (pwdUpdateDate == null) {
            // 移动端用户不参与首次强制改密：小程序 / 公众号 / 短信登录自动注册的账号根本没有密码，
            // 「初始密码」无从谈起；移动端也没有改密页，拦下来只会让用户所有功能全挂、且无路可走。
            // 移动端账号的密码约束只由 expire-days.app 这一档有效期参数管
            status.setMustChangePwd(!isAppUser(userType) && isForceChangeOnInit());
            return status;
        }

        // 有效期配成 0（或任何非正数）即「永不过期」，直接返回正常状态。
        // 这里必须写 <= 0 而不是 == 0：有人把参数填成 -1 表达「不过期」时同样要能兜住，
        // 若写 == 0 则 -1 会被当成「有效期 -1 天」，导致所有人立刻过期、天天被要求改密。
        if (expireDays <= 0) {
            return status;
        }

        long passedDays = daysBetween(pwdUpdateDate, DateUtils.getNowDate());
        if (passedDays >= expireDays) {
            status.setPwdExpired(true);
            status.setMustChangePwd(true);
            return status;
        }

        long remainDays = expireDays - passedDays;
        int notifyDays = getIntConfig(KEY_EXPIRE_NOTIFY_DAYS, DEFAULT_EXPIRE_NOTIFY_DAYS);
        if (notifyDays > 0 && remainDays <= notifyDays) {
            status.setExpireInDays(remainDays);
        }
        return status;
    }

    /**
     * 是否开启「首次登录强制改密」
     *
     * @return true 表示开启
     */
    @Override
    public boolean isForceChangeOnInit() {
        String value = getConfigSafely(KEY_FORCE_CHANGE_INIT);
        if (StringUtils.isBlank(value)) {
            return DEFAULT_FORCE_CHANGE_INIT;
        }
        // 框架约定 '1' = 是、'0' = 否；同时兼容 true/false 写法
        return "1".equals(value.trim()) || Boolean.parseBoolean(value.trim());
    }

    /**
     * 按用户类型取对应档位的密码有效期
     * <p>
     * 分档的现实意义：管理端账号数量可控、权限高，适合严格执行定期更换；
     * C 端海量注册用户强制改密不现实，默认给 0（永不过期）。
     *
     * @param userType 用户类型标识
     * @return 有效期天数，小于等于 0 表示永不过期
     */
    private int getExpireDaysByUserType(String userType) {
        if (isAppUser(userType)) {
            return getIntConfig(KEY_EXPIRE_DAYS_APP, DEFAULT_EXPIRE_DAYS_APP);
        }
        return getIntConfig(KEY_EXPIRE_DAYS_PC, DEFAULT_EXPIRE_DAYS_PC);
    }

    /**
     * 是否移动端（C 端）用户
     *
     * @param userType 用户类型标识，可为空
     * @return true 表示移动端用户；为空或其它类型一律按管理端处理（从严）
     */
    private boolean isAppUser(String userType) {
        return StringUtils.isNotBlank(userType) && StringUtils.contains(userType, UserType.APP_USER.getUserType());
    }

    /**
     * 统计密码中出现的字符种类数（大写 / 小写 / 数字 / 特殊字符）
     *
     * @param password 明文密码
     * @return 命中的种类数，取值 0-4
     */
    private int countCharKinds(String password) {
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpper = true;
            } else if (Character.isLowerCase(c)) {
                hasLower = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            } else if (SPECIAL_CHARS.indexOf(c) >= 0) {
                hasSpecial = true;
            }
            // 其余字符（如中文、空格）不计入任何种类，也不直接判失败，交给长度与种类数决定
        }
        int kinds = 0;
        if (hasUpper) {
            kinds++;
        }
        if (hasLower) {
            kinds++;
        }
        if (hasDigit) {
            kinds++;
        }
        if (hasSpecial) {
            kinds++;
        }
        return kinds;
    }

    /**
     * 判断密码是否包含用户账号的连续片段（忽略大小写）
     *
     * @param password 明文密码
     * @param userName 用户账号
     * @return true 表示命中，应当拒绝
     */
    private boolean containsUserNameFragment(String password, String userName) {
        String lowerPwd = password.toLowerCase();
        String lowerName = userName.toLowerCase();
        // 账号本身很短（如 2 位）时不做片段拆分，只做整体包含判断，避免误伤正常密码
        if (lowerName.length() <= USER_NAME_FRAGMENT_LENGTH) {
            return lowerPwd.contains(lowerName);
        }
        for (int i = 0; i + USER_NAME_FRAGMENT_LENGTH <= lowerName.length(); i++) {
            if (lowerPwd.contains(lowerName.substring(i, i + USER_NAME_FRAGMENT_LENGTH))) {
                return true;
            }
        }
        return false;
    }

    /**
     * 计算两个时间相差的整天数
     *
     * @param from 起始时间
     * @param to   结束时间
     * @return 相差天数，from 晚于 to 时返回 0
     */
    private long daysBetween(Date from, Date to) {
        long diff = to.getTime() - from.getTime();
        if (diff <= 0) {
            return 0;
        }
        return TimeUnit.MILLISECONDS.toDays(diff);
    }

    /**
     * 读取整型参数，缺失或格式非法时退回默认值
     * <p>
     * 绝不让配置问题冒泡到登录链路 —— 一个填错的参数不该让所有人登不上系统。
     *
     * @param configKey    参数键名
     * @param defaultValue 兜底默认值
     * @return 参数值
     */
    private int getIntConfig(String configKey, int defaultValue) {
        String value = getConfigSafely(configKey);
        if (StringUtils.isBlank(value)) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.warn("密码策略参数 [{}] 配置值 [{}] 不是合法整数，已退回默认值 {}", configKey, value, defaultValue);
            return defaultValue;
        }
    }

    /**
     * 读取参数，任何异常都吞掉并返回空串
     * <p>
     * 多租户场景下新建租户可能没有这批参数，缓存层也可能临时不可用，
     * 这些都不应影响登录与改密主流程。
     *
     * @param configKey 参数键名
     * @return 参数值，取不到时为空串
     */
    private String getConfigSafely(String configKey) {
        try {
            return configService.getConfigByKey(configKey);
        } catch (Exception e) {
            log.warn("读取密码策略参数 [{}] 失败，将使用默认值", configKey, e);
            return StringUtils.EMPTY;
        }
    }
}
