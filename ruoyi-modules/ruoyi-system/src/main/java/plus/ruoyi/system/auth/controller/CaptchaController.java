package plus.ruoyi.system.auth.controller;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.dromara.sms4j.api.SmsBlend;
import org.dromara.sms4j.api.entity.SmsResponse;
import org.dromara.sms4j.core.factory.SmsFactory;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.hutool.captcha.AbstractCaptcha;
import cn.hutool.captcha.generator.CodeGenerator;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import plus.ruoyi.common.core.constant.Constants;
import plus.ruoyi.common.core.constant.GlobalConstants;
import plus.ruoyi.common.core.constant.I18nKeys;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.exception.ServiceException;
import plus.ruoyi.common.core.exception.user.CaptchaException;
import plus.ruoyi.common.core.exception.user.CaptchaExpireException;
import plus.ruoyi.common.core.service.ConfigService;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.core.utils.StringUtils;
import plus.ruoyi.common.core.utils.reflect.ReflectUtils;
import plus.ruoyi.common.mail.config.properties.MailProperties;
import plus.ruoyi.common.mail.utils.MailUtils;
import plus.ruoyi.common.ratelimiter.annotation.RateLimiter;
import plus.ruoyi.common.ratelimiter.enums.LimitType;
import plus.ruoyi.common.redis.utils.RedisUtils;
import plus.ruoyi.common.sms.config.properties.SmsCaptchaProperties;
import plus.ruoyi.common.social.config.properties.SocialLoginConfigProperties;
import plus.ruoyi.common.social.config.properties.SocialProperties;
import plus.ruoyi.common.tenant.helper.TenantHelper;
import plus.ruoyi.common.web.config.properties.CaptchaProperties;
import plus.ruoyi.common.web.enums.CaptchaType;
import plus.ruoyi.system.auth.domain.vo.CaptchaVo;
import plus.ruoyi.system.tenant.service.ISysTenantService;

/**
 * 验证码控制器
 * 提供各种类型验证码的生成和校验功能，包括图片验证码、短信验证码和邮箱验证码
 *
 * @author Lion Li
 */
@SaIgnore
@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class CaptchaController {

    // 业务服务
    private final ConfigService configService;
    private final ISysTenantService tenantService;

    // 配置属性
    private final CaptchaProperties captchaProperties;
    private final MailProperties mailProperties;
    private final SmsCaptchaProperties smsCaptchaProperties;
    private final SocialProperties socialProperties;

    /**
     * 生成图片验证码
     * 根据配置生成对应类型的图片验证码
     *
     * @return 验证码信息，包括验证码图片的Base64编码和UUID
     */
    @GetMapping("/imgCode")
    public R<CaptchaVo> imgCode() {
        // 检查验证码功能是否启用
        boolean captchaEnabled = configService.getBooleanValue(
            CaptchaProperties.CAPTCHA_ENABLED_KEY, true);
        if (!captchaEnabled) {
            // 验证码未启用，只回登录页需要的各项开关，不生成图片
            CaptchaVo captchaVo = new CaptchaVo();
            fillLoginFlags(captchaVo);
            captchaVo.setCaptchaEnabled(false);
            return R.ok(captchaVo);
        }

        // 调用实际的验证码生成实现方法（使用AOP代理以支持限流）
        return R.ok(SpringUtils.getAopProxy(this).getCodeImpl());
    }

    /**
     * 图片验证码生成实现方法
     * 独立方法避免验证码关闭之后仍然走限流逻辑，限制每IP每60秒最多请求10次
     *
     * @return 验证码信息对象
     */
    @RateLimiter(time = 60, count = 20, limitType = LimitType.IP)
    public CaptchaVo getCodeImpl() {
        // 生成唯一标识
        String uuid = IdUtil.simpleUUID();
        // 构建验证码缓存键
        String verifyKey = GlobalConstants.CAPTCHA_CODE_KEY + uuid;

        // 获取验证码类型配置（数学计算或字符验证码）
        CaptchaType captchaType = captchaProperties.getType();
        boolean isMath = CaptchaType.MATH == captchaType;

        // 根据配置确定验证码长度
        Integer length = isMath ? captchaProperties.getNumberLength() : captchaProperties.getCharLength();

        // 创建验证码生成器
        CodeGenerator codeGenerator = ReflectUtils.newInstance(captchaType.getClazz(), length);

        // 创建验证码实例
        AbstractCaptcha captcha = SpringUtils.getBean(captchaProperties.getCategory().getClazz());
        captcha.setGenerator(codeGenerator);

        // 生成验证码
        captcha.createCode();

        // 如果是数学验证码，使用SpEL表达式计算结果
        String code = captcha.getCode();
        if (isMath) {
            ExpressionParser parser = new SpelExpressionParser();
            Expression exp = parser.parseExpression(StringUtils.remove(code, "="));
            code = exp.getValue(String.class);
        }

        // 将验证码存入Redis，有效期为配置的验证码过期时间
        RedisUtils.setCacheObject(verifyKey, code, Duration.ofMinutes(Constants.CAPTCHA_EXPIRATION));

        // 构建并返回验证码信息
        CaptchaVo captchaVo = new CaptchaVo();
        fillLoginFlags(captchaVo);
        captchaVo.setUuid(uuid);
        captchaVo.setImg("data:image/gif;base64," + captcha.getImageBase64());
        return captchaVo;
    }

    /**
     * 填充登录页需要的各项开关
     * <p>
     * 抽成独立方法是因为 imgCode 有「验证码关闭」与「正常生成」两条分支，
     * 它们要回的开关完全一致；分散在两处写，以后加字段极易漏改其中一条。
     *
     * @param captchaVo 待填充的验证码信息对象
     */
    private void fillLoginFlags(CaptchaVo captchaVo) {
        captchaVo.setTenantEnabled(TenantHelper.isEnable());
        if (captchaVo.getTenantEnabled()) {
            captchaVo.setTenantId(TenantHelper.getTenantId());
            captchaVo.setTenantTitle(tenantService.getTenantTitle());
        }
        // 是否开启了注册
        boolean registerEnabled = configService.getBooleanValue("system.account.register-enabled");
        captchaVo.setRegisterEnabled(registerEnabled);
        // 已配置的社交登录类型
        captchaVo.setSocialTypes(getConfiguredSocialTypes());
        // 社交登录自动注册开关（只有注册开关开启时才有效）
        captchaVo.setSocialAutoRegisterEnabled(
            registerEnabled && configService.getBooleanValue("system.social.auto-register-enabled", false)
        );
        /*
          手机验证码登录：开关打开【且】模板ID已配置才算可用。
          只开开关不配模板，页签点进去发码必然失败（厂商要求模板 code 非空），
          与其让用户点了才报错，不如直接不显示。判据与 smsCode 的前置校验保持一致。
        */
        captchaVo.setSmsEnabled(
            Boolean.TRUE.equals(smsCaptchaProperties.getEnabled())
                && StringUtils.isNotBlank(smsCaptchaProperties.getTemplateId())
        );
        /*
          邮箱验证码登录：要邮件能力(mail.enabled)与登录入口开关(mail.captcha.enabled)同时打开。
          判据与上面的 smsEnabled 对称 —— 前者决定「能不能发出邮件」，后者决定「要不要开放这个登录入口」。
          只看 mail.enabled 的话，系统一旦需要发业务邮件就被迫暴露邮箱登录，关不掉。
        */
        captchaVo.setEmailEnabled(
            Boolean.TRUE.equals(mailProperties.getEnabled())
                && Boolean.TRUE.equals(mailProperties.getCaptcha().getEnabled())
        );
    }

    /**
     * 获取短信验证码
     * 生成随机验证码并发送到指定手机号
     * <p>
     * 手机号必须做格式校验，原因有两个，都不只是"参数干净"这么简单：
     * 1. 下游 smsCodeImpl 的限流 key 是 #phone，不校验就等于把 key 空间开放给调用方，
     *    随机串每次都命中新 key，而限流 key 在 Redis 里默认存活 1 天（timeout=86400），
     *    低成本就能堆出大量垃圾 key 撑爆内存；
     * 2. 验证码缓存键是 CAPTCHA_CODE_KEY + phone，与图片验证码的 CAPTCHA_CODE_KEY + uuid
     *    共用同一段 key 空间，phone 不受约束时可构造出与他人 uuid 相同的键覆盖其图片验证码。
     * 注：正则按中国大陆号段编写，若后续要支持国际号码需同步放宽。
     *
     * @param phone 用户手机号
     * @param code 图形验证码，图形验证码开关开启时必填
     * @param uuid 图形验证码唯一标识，由 /auth/imgCode 下发
     * @return 发送结果
     */
    @GetMapping("/smsCode")
    public R<Void> smsCode(
        @NotBlank(message = I18nKeys.User.PHONE_REQUIRED)
        @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确") String phone,
        String code, String uuid) {
        // 检查短信验证码功能是否启用
        if (!smsCaptchaProperties.getEnabled()) {
            return R.fail("当前系统没有开启短信功能！");
        }
        // 模板ID缺失会被厂商判为参数错误，提前拦下并给出可定位的提示
        if (StringUtils.isBlank(smsCaptchaProperties.getTemplateId())) {
            log.error("短信验证码模板未配置，请设置 sms.captcha.template-id");
            return R.fail("短信验证码模板未配置！");
        }

        /*
          图形验证码前置校验：把"一个 HTTP 请求 = 一条短信"抬高为"先解一次验证码才发一条短信"。
          必须跟随 <参数设置> 里的图形验证码总开关：开关关闭时 imgCode 不再下发图片，
          前端也就拿不到 uuid/code，此时若仍强制校验会让短信功能直接不可用。
          校验刻意放在限流链之前：验证码是一次性的，错一次就得重新取图，
          正常用户输错不该白白吃掉 IP 限流配额。
        */
        boolean captchaEnabled = configService.getBooleanValue(
            CaptchaProperties.CAPTCHA_ENABLED_KEY, true);
        if (captchaEnabled) {
            validateImgCaptcha(code, uuid);
        }

        // 进入三级限流链：IP 维度 → 全局维度 → 手机号维度（使用AOP代理以支持限流）
        SpringUtils.getAopProxy(this).smsCodeIpLimit(phone);
        return R.ok();
    }

    /**
     * 校验图形验证码
     * <p>
     * 与 SysRegisterService.validateCaptcha 的差别：本方法不写登录日志。
     * 发短信不是登录行为，此处也没有 userName 可记，硬套登录日志只会污染 sys_logininfor。
     * 抛出的异常类型保持一致，前端错误处理无需区分来源。
     *
     * @param code 用户提交的验证码
     * @param uuid 验证码唯一标识
     */
    private void validateImgCaptcha(String code, String uuid) {
        String verifyKey = GlobalConstants.CAPTCHA_CODE_KEY + StringUtils.blankToDefault(uuid, "");
        String captcha = RedisUtils.getCacheObject(verifyKey);
        // 无论校验成败都立即删除：验证码只能用一次，否则同一张图能被反复用来发短信
        RedisUtils.deleteObject(verifyKey);

        if (captcha == null) {
            throw new CaptchaExpireException();
        }
        // 用 captcha 作接收者，code 为 null（前端漏传）时走 false 分支，不会 NPE
        if (!captcha.equalsIgnoreCase(code)) {
            throw new CaptchaException();
        }
    }

    /**
     * 短信验证码 IP 维度限流层
     * <p>
     * 为什么必须单独一层：{@link RateLimiter} 未标注 {@code @Repeatable}，
     * 同一个方法上无法叠加多条限流规则，每个限流维度只能各占一个方法。
     * <p>
     * 为什么必须有 IP 维度：下游 smsCodeImpl 的限流 key 是 #phone，只能拦住
     * "同一个号被反复发"，拦不住遍历号段 —— 攻击者每换一个号码都是"首次"，
     * 手机号维度和 SMS4J 自身的 minute-max / account-max（同样按手机号计数）
     * 会一起失效，可被用来打短信轰炸，烧掉短信余额并招致签名被运营商封停。
     * <p>
     * 阈值取每 IP 每小时 20 次：正常用户一小时不会要 20 条验证码；
     * 若线上存在大量 NAT 共享出口（园区网、运营商大内网）导致误伤，可上调此值。
     *
     * @param phone 用户手机号
     */
    @RateLimiter(time = 3600, count = 20, limitType = LimitType.IP,
        message = "操作过于频繁，请稍后再试")
    public void smsCodeIpLimit(String phone) {
        SpringUtils.getAopProxy(this).smsCodeGlobalLimit(phone);
    }

    /**
     * 短信验证码全局熔断层
     * <p>
     * IP 维度在代理池 / 秒拨环境下会失效（每个请求都是新 IP），这一层是短信费用的最后兜底。
     * <p>
     * count 需要按真实业务峰值调整，建议取峰值的 3~5 倍：设置过低会在业务高峰误伤全部用户，
     * 过高则失去兜底意义。触发本层意味着"要么正在被攻击，要么业务量突增"，
     * 两种情况都需要人工介入，建议对该日志接入告警。
     *
     * @param phone 用户手机号
     */
    @RateLimiter(key = "smsCode:global", time = 3600, count = 500,
        message = "系统繁忙，请稍后再试")
    public void smsCodeGlobalLimit(String phone) {
        SpringUtils.getAopProxy(this).smsCodeImpl(phone);
    }

    /**
     * 短信验证码实现方法
     * 独立方法避免功能未开启时仍走限流逻辑，限制每60秒只能发送1次
     *
     * @param phone 用户手机号
     */
    @RateLimiter(key = "#phone", time = 60, count = 1)
    public void smsCodeImpl(String phone) {
        // 构建缓存键，用于存储验证码
        String key = GlobalConstants.CAPTCHA_CODE_KEY + phone;
        // 生成4位随机数字验证码
        String code = RandomUtil.randomNumbers(4);
        // 将验证码存入Redis，有效期为配置的过期时间（默认为2分钟）
        RedisUtils.setCacheObject(key, code, Duration.ofMinutes(Constants.CAPTCHA_EXPIRATION));

        // 构建短信模板参数，将验证码放入map中
        LinkedHashMap<String, String> map = new LinkedHashMap<>(1);
        map.put("code", code);

        // 获取短信发送服务实例，configId 对应 sms.blends 下的配置键
        String configId = smsCaptchaProperties.getConfigId();
        SmsBlend smsBlend = SmsFactory.getSmsBlend(configId);
        // 配置键写错时 SMS4J 返回 null，不判空会在下一行抛出难以定位的 NPE
        if (smsBlend == null) {
            log.error("短信配置 {} 不存在，请检查 sms.blends", configId);
            throw ServiceException.of("短信服务未正确配置！");
        }

        // 发送短信
        SmsResponse smsResponse = smsBlend.sendMessage(phone, smsCaptchaProperties.getTemplateId(), map);

        // 检查短信发送结果
        if (!smsResponse.isSuccess()) {
            log.error("验证码短信发送异常 => {}", smsResponse);
            // getData 可能为 null，用 String.valueOf 避免拼接时再抛 NPE
            throw ServiceException.of(String.valueOf(smsResponse.getData()));
        }
    }

    /**
     * 获取邮箱验证码
     * 生成随机验证码并发送到指定邮箱
     * <p>
     * 邮箱同样要做格式校验，理由与 smsCode 一致：下游 emailCodeImpl 的限流 key 是 #email，
     * 不校验就等于把限流 key 空间开放给调用方，随机串每次命中新 key 并在 Redis 里存活 1 天；
     * 且验证码缓存键 CAPTCHA_CODE_KEY + email 与图片验证码的 uuid 共用同一段 key 空间。
     *
     * @param email 邮箱地址
     * @param code 图形验证码，图形验证码开关开启时必填
     * @param uuid 图形验证码唯一标识，由 /auth/imgCode 下发
     * @return 发送结果
     */
    @GetMapping("/emailCode")
    public R<Void> emailCode(
        @NotBlank(message = I18nKeys.User.EMAIL_REQUIRED)
        @Email(message = "邮箱格式不正确") String email,
        String code, String uuid) {
        // 检查邮件发送能力是否启用（SMTP 配置）
        if (!mailProperties.getEnabled()) {
            return R.fail("当前系统没有开启邮箱功能！");
        }
        // 再检查邮箱验证码登录入口是否开放：能发邮件不等于要开放这个登录方式，两者分开控制
        if (!Boolean.TRUE.equals(mailProperties.getCaptcha().getEnabled())) {
            return R.fail("当前系统没有开启邮箱验证码登录！");
        }

        // 图形验证码前置校验，规则与 smsCode 完全一致（含随总开关跳过、放在限流链之前）
        boolean captchaEnabled = configService.getBooleanValue(
            CaptchaProperties.CAPTCHA_ENABLED_KEY, true);
        if (captchaEnabled) {
            validateImgCaptcha(code, uuid);
        }

        // 进入三级限流链：IP 维度 → 全局维度 → 邮箱维度（使用AOP代理以支持限流）
        SpringUtils.getAopProxy(this).emailCodeIpLimit(email);
        return R.ok();
    }

    /**
     * 邮箱验证码 IP 维度限流层
     * <p>
     * 与短信同理：下游限流 key 是 #email，只能防"同一个邮箱被反复发"，
     * 防不住遍历邮箱地址 —— 每换一个地址都是"首次"。
     * <p>
     * 邮件单条成本远低于短信，但被刷穿的代价是 SMTP 配额耗尽、发件域名被判垃圾源，
     * 恢复起来比补充短信余额更麻烦，所以阈值与短信保持一致，不额外放宽。
     *
     * @param email 邮箱地址
     */
    @RateLimiter(time = 3600, count = 20, limitType = LimitType.IP,
        message = "操作过于频繁，请稍后再试")
    public void emailCodeIpLimit(String email) {
        SpringUtils.getAopProxy(this).emailCodeGlobalLimit(email);
    }

    /**
     * 邮箱验证码全局熔断层
     * <p>
     * 兜底 IP 维度在代理池下失效的情况，阈值需按真实业务峰值调整并接告警，说明同 smsCodeGlobalLimit。
     *
     * @param email 邮箱地址
     */
    @RateLimiter(key = "emailCode:global", time = 3600, count = 500,
        message = "系统繁忙，请稍后再试")
    public void emailCodeGlobalLimit(String email) {
        SpringUtils.getAopProxy(this).emailCodeImpl(email);
    }

    /**
     * 邮箱验证码实现方法
     * 独立方法避免验证码关闭之后仍然走限流逻辑，限制每60秒只能发送1次
     *
     * @param email 邮箱地址
     */
    @RateLimiter(key = "#email", time = 60, count = 1)
    public void emailCodeImpl(String email) {
        // 构建验证码缓存键
        String key = GlobalConstants.CAPTCHA_CODE_KEY + email;
        // 生成四位数字验证码
        String code = RandomUtil.randomNumbers(4);
        // 将验证码存入Redis，有效期为配置的验证码过期时间
        RedisUtils.setCacheObject(key, code, Duration.ofMinutes(Constants.CAPTCHA_EXPIRATION));

        try {
            // 发送包含验证码的邮件
            MailUtils.sendText(email, "登录验证码",
                "您本次验证码为：" + code + "，有效性为" + Constants.CAPTCHA_EXPIRATION + "分钟，请尽快填写。");
        } catch (Exception e) {
            log.error("验证码邮件发送异常 => {}", e.getMessage());
            throw ServiceException.of(e.getMessage());
        }
    }

    /**
     * 获取已配置的社交登录类型
     * 遍历社交登录配置，筛选出已配置的类型（clientId和clientSecret不包含*）
     *
     * @return 逗号分隔的社交登录类型字符串
     */
    private String getConfiguredSocialTypes() {
        if (socialProperties == null || socialProperties.getType() == null) {
            return "";
        }

        // 筛选出已配置的社交登录类型
        List<String> configuredTypes = socialProperties.getType().entrySet().stream()
            .filter(entry -> {
                SocialLoginConfigProperties config = entry.getValue();
                // 判断clientId和clientSecret是否包含*（未配置的标志）
                boolean clientIdConfigured = StrUtil.isNotBlank(config.getClientId())
                    && !config.getClientId().contains("*");
                boolean clientSecretConfigured = StrUtil.isNotBlank(config.getClientSecret())
                    && !config.getClientSecret().contains("*");
                return clientIdConfigured && clientSecretConfigured;
            })
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // 返回逗号分隔的字符串
        return String.join(",", configuredTypes);
    }

}
