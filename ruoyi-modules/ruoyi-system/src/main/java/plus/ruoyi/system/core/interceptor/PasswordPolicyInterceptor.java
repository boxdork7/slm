package plus.ruoyi.system.core.interceptor;

import cn.dev33.satoken.stp.StpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerInterceptor;
import plus.ruoyi.common.core.constant.HttpStatus;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.domain.model.LoginUser;
import plus.ruoyi.common.core.utils.SpringUtils;
import plus.ruoyi.common.json.utils.JsonUtils;
import plus.ruoyi.common.satoken.utils.LoginHelper;
import plus.ruoyi.system.core.domain.vo.PasswordStatusVo;
import plus.ruoyi.system.core.service.ISysPasswordPolicyService;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * 强制改密拦截器（等保二级 8.1.4.1 a）
 * <p>
 * <b>为什么后端也要拦：</b>
 * 强制改密原本只做在 PC 前端的路由守卫里，那只是 UI 层的引导 ——
 * 拿着 token 直接调接口（curl / Postman / 脚本）可以完全绕过，移动端也未实现该守卫。
 * 测评时只要动手验证一次就会暴露，因此把判定下沉到服务端，前端守卫退化为「体验优化」。
 * <p>
 * <b>为什么不查库：</b>
 * 判定依据 {@code pwdUpdateDate} 随 {@link LoginUser} 存在 Sa-Token 的 token session 里
 * （见 {@code LoginHelper.login}），每个请求只做一次内存读，不产生数据库查询。
 * <p>
 * <b>为什么直接写响应而不是抛 ServiceException：</b>
 * 全局异常处理器对 ServiceException 会调 {@code recordErrorLogAsync} 落一条错误日志。
 * 被拦住的用户在改密前每次请求都会触发，几分钟就能把 sys_error_log 刷满 ——
 * 这是可预期的策略拦截，不是系统异常，不该进错误日志。
 *
 * @author 抓蛙师
 */
@Slf4j
public class PasswordPolicyInterceptor implements HandlerInterceptor {

    /**
     * 放行路径
     * <p>
     * 取舍原则：<b>改密页自身能完整加载所需的一切</b>，外加登录/登出与公共资源。
     * 少放一个，用户就会卡在一个功能残缺、还不停弹错误提示的页面上，
     * 反而看不到「去改密码」这个唯一出口。
     * <p>
     * 这里放行的都是「读自己的数据」或「公共字典」，不涉及任何业务写操作，
     * 因此不会削弱本拦截器的约束力。
     */
    private static final List<String> EXCLUDE_PATTERNS = List.of(
        // 认证相关：登录、登出、验证码 —— 被拦的用户至少要能退出登录
        "/auth/**",
        // 改密接口本身，以及改密页要用的用户信息
        "/system/user/updateUserPwd",
        "/system/user/getUserInfo",
        "/system/user/getUserProfile",
        // 路由与菜单：拿不到路由，前端连改密页都跳不过去
        "/system/menu/getRouters",
        // 字典与公共配置：页面渲染的基础数据
        "/system/dictData/**",
        "/common/**",
        // 个人中心其余页签用到的只读接口，放行以免页面报一堆错
        "/system/user/profile/**",
        "/system/social/getSocialBindingList",
        "/monitor/online/listCurrentUserOnlines",
        "/system/notice/getNoticeUnreadCount"
    );

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 未登录的请求交给 Sa-Token 的登录拦截器处理，这里不重复判断
        if (!StpUtil.isLogin()) {
            return true;
        }
        String uri = request.getRequestURI();
        if (isExcluded(uri)) {
            return true;
        }
        LoginUser loginUser = LoginHelper.getLoginUser();
        // OpenAPI 等场景可能取不到会话用户，缺依据时放行，避免误伤正常调用
        if (loginUser == null) {
            return true;
        }

        // 懒取而非构造注入：WebMvcConfigurer 在 Spring 启动很早期就初始化，
        // 那时把业务 Service 拽进来会让它连同整条依赖链提前实例化，容易触发循环依赖。
        // 框架的 SecurityAutoConfiguration 取 AllUrlHandler 也是这个写法。
        ISysPasswordPolicyService passwordPolicyService = SpringUtils.getBean(ISysPasswordPolicyService.class);
        PasswordStatusVo status = passwordPolicyService.resolveStatus(
            loginUser.getPwdUpdateDate(), loginUser.getUserType());
        if (!Boolean.TRUE.equals(status.getMustChangePwd())) {
            return true;
        }

        String message = Boolean.TRUE.equals(status.getPwdExpired())
            ? "密码已超过有效期，请先修改密码后再使用其他功能"
            : "请先修改初始密码后再使用其他功能";
        log.warn("[强制改密] 拦截请求 URL[{}] 用户[{}] 已过期[{}]",
            uri, loginUser.getUserName(), status.getPwdExpired());
        writeResponse(response, message);
        return false;
    }

    /**
     * 判断请求路径是否在放行名单内
     *
     * @param uri 请求路径
     * @return true 表示放行
     */
    private boolean isExcluded(String uri) {
        for (String pattern : EXCLUDE_PATTERNS) {
            if (PATH_MATCHER.match(pattern, uri)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 直接向响应写入 602 结果
     * <p>
     * 用 602 而非 401/403：401 会让前端判定登录失效并跳登录页，而重新登录拿到的仍是
     * 同一状态，形成死循环；403 的语义是「无此权限」，前端无法据此把用户引到改密页。
     *
     * @param response 响应对象
     * @param message  提示文案
     */
    private void writeResponse(HttpServletResponse response, String message) {
        // HTTP 层返回 200，业务码放在响应体里 —— 与框架其它业务失败的表达方式保持一致。
        // 用 SC_OK 而不是 org.springframework.http.HttpStatus.OK：后者与项目的
        // plus.ruoyi.common.core.constant.HttpStatus 同名，同时 import 会冲突
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.write(JsonUtils.toJsonString(R.fail(HttpStatus.PASSWORD_CHANGE_REQUIRED, message)));
        } catch (IOException e) {
            log.error("[强制改密] 写出拦截响应失败", e);
        }
    }
}
