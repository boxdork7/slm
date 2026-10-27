package plus.ruoyi.common.web.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import plus.ruoyi.common.core.domain.R;
import plus.ruoyi.common.core.field.FieldPermissionHelper;

import java.util.List;

/**
 * 字段权限写入反馈
 *
 * <p>把本次请求中被 {@code FieldWriteGuardAspect} 拦下的字段追加到响应 {@code msg}，
 * 让使用者知道"这些字段没改动"，而不是看到"操作成功"却发现数据没变。</p>
 *
 * <p><b>为什么必须有这层反馈</b>：写入拦截是静默重置（报错会让批量提交整个失败），
 * 但静默的代价是"改了→提示成功→刷新没变"，用户会当成系统丢数据来报障。
 * 走响应 msg 而不是改各个 Controller，是因为这样 85 个存量页面零改动即可获得提示
 * ——前端的 {@code showMsgSuccess} 本来就展示 msg。</p>
 *
 * <p>只加工成功响应：失败响应的 msg 是错误原因，追加字段提示会喧宾夺主。</p>
 */
@Slf4j
@RestControllerAdvice
public class FieldWriteGuardAdvice implements ResponseBodyAdvice<Object> {

    /**
     * 提示语前缀。与 msg 之间用中文分号分隔，避免和原文糊在一起
     */
    private static final String HINT_PREFIX = "；以下字段无修改权限，已忽略：";

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends org.springframework.http.converter.HttpMessageConverter<?>> converterType) {
        // 只处理返回 R 的接口；其余（文件流、String 等）不介入
        return R.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends org.springframework.http.converter.HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (!(body instanceof R<?> result)) {
            return body;
        }
        try {
            List<String> ignored = FieldPermissionHelper.getIgnoredFields();
            if (ignored.isEmpty()) {
                return body;
            }
            // 失败响应的 msg 是错误原因，不追加
            if (result.getCode() != R.SUCCESS) {
                return body;
            }
            result.setMsg(result.getMsg() + HINT_PREFIX + String.join("、", ignored));
        } catch (Exception e) {
            // 提示失败不能影响正常响应
            log.warn("字段权限：追加写入拦截提示失败 => {}", e.getMessage());
        }
        return body;
    }
}