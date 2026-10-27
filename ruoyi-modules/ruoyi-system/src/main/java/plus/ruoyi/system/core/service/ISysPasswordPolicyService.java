package plus.ruoyi.system.core.service;

import plus.ruoyi.system.core.domain.vo.PasswordStatusVo;

import java.util.Date;

/**
 * 密码策略服务接口
 * <p>
 * 承载等保二级 8.1.4.1 a「身份鉴别信息具有复杂度要求并定期更换」的全部判定逻辑。
 * 策略参数全部来自 sys_config，可在「系统管理 → 参数设置」中在线调整，无需改代码重启。
 *
 * @author 抓蛙师
 */
public interface ISysPasswordPolicyService {

    /**
     * 校验密码复杂度
     * <p>
     * 不满足时抛出 ServiceException，异常消息中含具体的不满足项（长度不够 / 字符种类不足等），
     * 直接可作为前端提示。校验通过时无返回值。
     *
     * @param password 明文密码
     * @param userName 用户账号，用于「密码不得包含账号」的校验；为空时跳过该项
     */
    void validateComplexity(String password, String userName);

    /**
     * 校验新密码是否与最近 N 次历史密码重复
     * <p>
     * 重复时抛出 ServiceException。参数 system.password.history-count 为 0 时直接放行。
     *
     * @param userId      用户ID
     * @param newPassword 新密码明文
     */
    void validateNotReused(Long userId, String newPassword);

    /**
     * 记录一条密码历史，并清理超出保留数量的旧记录
     * <p>
     * 应在密码真正更新成功后调用。参数 history-count 为 0 时不记录（既然不校验就不必留存）。
     *
     * @param userId           用户ID
     * @param encryptedPassword 已经过 BCrypt 加密的密文，<b>不要传明文</b>
     */
    void recordHistory(Long userId, String encryptedPassword);

    /**
     * 计算当前登录用户的密码状态
     *
     * @param pwdUpdateDate 密码最后修改时间，为 null 表示从未改过（移动端用户此时不强制改密）
     * @param userType      用户类型（pc_user / app_user…），决定取哪一档有效期参数、是否参与首次强制改密
     * @return 密码状态；任何参数异常都不会抛错，退化为「一切正常」，避免影响登录主流程
     */
    PasswordStatusVo resolveStatus(Date pwdUpdateDate, String userType);

    /**
     * 是否开启「首次登录强制改密」
     *
     * @return true 表示开启
     */
    boolean isForceChangeOnInit();
}
