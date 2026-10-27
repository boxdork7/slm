// 字段级权限 API
import type {
  FieldAffectedQuery,
  FieldAffectedVo,
  FieldMatrixBo,
  FieldMatrixQuery,
  FieldMatrixVo,
  FieldPreviewQuery,
  FieldPreviewVo,
  FieldResourceBo,
  FieldResourceQuery,
  FieldResourceVo,
  FieldSubjectType,
  FieldSubjectVo
} from './fieldPermissionTypes'

/**
 * 查询字段权限资源列表（配置页左树）
 * @param query 查询参数
 * @returns {Result<FieldResourceVo[]>} 结果
 */
export const listFieldResources = (query?: FieldResourceQuery): Result<FieldResourceVo[]> => {
  return http.get<FieldResourceVo[]>('/system/fieldResource/listFieldResources', query)
}

/**
 * 查询字段权限资源详细
 * @param id 资源ID
 * @returns {Result<FieldResourceVo>} 结果
 */
export const getFieldResource = (id: string | number): Result<FieldResourceVo> => {
  return http.get<FieldResourceVo>(`/system/fieldResource/getFieldResource/${id}`)
}

/**
 * 修改字段权限资源元信息
 * @description 只能改中文名/分组/排序/状态/备注；资源标识与类绑定由 @FieldResource 注解扫描维护
 * @param data 资源数据
 * @returns {Result<void>} 结果
 */
export const updateFieldResource = (data: FieldResourceBo): Result<void> => {
  return http.put<void>('/system/fieldResource/updateFieldResource', data)
}

/**
 * 查询字段权限矩阵
 * @description 只返回已配置的差异格；未命中的格子按字段的注解基线渲染
 * @param query 查询参数
 * @returns {Result<FieldMatrixVo>} 结果
 */
export const getFieldMatrix = (query: FieldMatrixQuery): Result<FieldMatrixVo> => {
  return http.get<FieldMatrixVo>('/system/fieldPermission/getFieldMatrix', query)
}

/**
 * 保存字段权限矩阵（覆盖式）
 * @description subjectIds 必须完整传入本次编辑涉及的所有主体，否则遗漏主体的既有配置不会被清除
 * @param data 矩阵数据
 * @returns {Result<number>} 实际落库的差异行数
 */
export const updateFieldMatrix = (data: FieldMatrixBo): Result<number> => {
  return http.put<number>('/system/fieldPermission/updateFieldMatrix', data)
}

/**
 * 查询授权主体选项（矩阵的列候选）
 * @description 用户类型不返回全量，由前端用户选择器按需检索
 * @param subjectType 主体类型
 * @returns {Result<FieldSubjectVo[]>} 结果
 */
export const listFieldSubjects = (subjectType: FieldSubjectType): Result<FieldSubjectVo[]> => {
  return http.get<FieldSubjectVo[]>(`/system/fieldPermission/listFieldSubjects/${subjectType}`)
}

/**
 * 效果预览
 * @description 按真实用户看该资源每个字段的最终档位，走与运行期相同的合并逻辑，所见即所得
 * @param query 查询参数
 * @returns {Result<FieldPreviewVo>} 结果
 */
export const previewFieldEffect = (query: FieldPreviewQuery): Result<FieldPreviewVo> => {
  return http.get<FieldPreviewVo>('/system/fieldPermission/previewFieldEffect', query)
}

/**
 * 收权后果计数
 * @description 回答"把该字段对此主体收紧后，还有多少人因其他主体仍能看到"，供单元格 ⚠ N 角标使用
 * @param query 查询参数
 * @returns {Result<FieldAffectedVo>} 结果
 */
export const countAffectedUsers = (query: FieldAffectedQuery): Result<FieldAffectedVo> => {
  return http.get<FieldAffectedVo>('/system/fieldPermission/countAffectedUsers', query)
}