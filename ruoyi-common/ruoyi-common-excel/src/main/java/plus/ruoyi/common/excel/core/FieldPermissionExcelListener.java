package plus.ruoyi.common.excel.core;

import cn.idev.excel.context.AnalysisContext;
import cn.idev.excel.metadata.CellExtra;
import cn.idev.excel.metadata.data.ReadCellData;
import lombok.RequiredArgsConstructor;

import java.util.Map;

/**
 * 字段权限导入监听器装饰器
 *
 * <p>包装业务 {@link ExcelListener}，在每行数据转发给它之前，把当前用户无权修改的列置 null。</p>
 *
 * <p><b>为什么必须逐行拦而不能读完再拦</b>：自定义 Listener 常在 {@code invoke()} 里直接入库
 * （如 {@code SysUserImportListener} 逐行调 {@code insertUser} / {@code updateUser}），
 * 等 {@code doRead()} 返回后再处理 {@code getExcelResult().getList()}，数据早已落库，拦了个寂寞。</p>
 *
 * <p>除 {@code invoke} 外的全部方法原样委派，不改变业务 Listener 的任何行为
 * （校验、错误收集、汇总消息都由它自己负责）。</p>
 *
 * @param <T> ImportVo 类型
 */
@RequiredArgsConstructor
public class FieldPermissionExcelListener<T> implements ExcelListener<T> {

    /**
     * 业务监听器：真正干活的那个
     */
    private final ExcelListener<T> delegate;

    /**
     * ImportVo 类，用于反查资源与字段档位
     */
    private final Class<T> clazz;

    @Override
    public void invoke(T data, AnalysisContext context) {
        // 先拦再转发：业务 Listener 可能在 invoke 里就入库了
        ExcelSensitiveHelper.guardImportedRow(data, clazz);
        delegate.invoke(data, context);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        delegate.doAfterAllAnalysed(context);
    }

    @Override
    public void onException(Exception exception, AnalysisContext context) throws Exception {
        delegate.onException(exception, context);
    }

    @Override
    public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
        delegate.invokeHead(headMap, context);
    }

    @Override
    public void extra(CellExtra extra, AnalysisContext context) {
        delegate.extra(extra, context);
    }

    @Override
    public boolean hasNext(AnalysisContext context) {
        return delegate.hasNext(context);
    }

    @Override
    public ExcelResult<T> getExcelResult() {
        return delegate.getExcelResult();
    }
}