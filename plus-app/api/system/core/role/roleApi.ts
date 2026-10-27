// 角色 API
import type { SysRoleDeptTree, SysRoleQuery, SysRoleVo } from './roleTypes'

/**
 * 查询角色列表
 * @param query 查询参数
 * @returns {Result<PageResult<SysRoleVo>>} 结果
 */
export const pageRoles = (query: SysRoleQuery): Result<PageResult<SysRoleVo>> => {
  return http.get<PageResult<SysRoleVo>>('/system/role/pageRoles', query)
}

/**
 * 通过roleIds查询角色
 * @param roleIds 角色ID数组
 * @returns {Result<SysRoleVo[]>} 结果
 */
export const getRoleOptions = (roleIds?: (number | string)[]): Result<SysRoleVo[]> => {
  return http.get<SysRoleVo[]>('/system/role/getRoleOptions', { roleIds })
}

/**
 * 查询角色详细
 * @param roleId 角色ID
 * @returns {Result<SysRoleVo>} 结果
 */
export const getRole = (roleId: string | number): Result<SysRoleVo> => {
  return http.get<SysRoleVo>(`/system/role/getRole/${roleId}`)
}

/**
 * 新增角色
 * @param data 角色数据
 * @returns {Result<void>} 结果
 */
export const addRole = (data: any): Result<void> => {
  return http.post<void>('/system/role/addRole', data)
}

/**
 * 修改角色
 * @param data 角色数据
 * @returns {Result<void>} 结果
 */
export const updateRole = (data: any): Result<void> => {
  return http.put<void>('/system/role/updateRole', data)
}

/**
 * 角色数据权限
 * @param data 权限数据
 * @returns {Result<void>} 结果
 */
export const updateRoleDataScope = (data: any): Result<void> => {
  return http.put<void>('/system/role/updateRoleDataScope', data)
}

/**
 * 角色状态修改
 * @param roleId 角色ID
 * @param status 状态
 * @returns {Result<void>} 结果
 */
export const changeRoleStatus = (roleId: string | number, status: string): Result<void> => {
  const data = {
    roleId,
    status,
  }
  return http.put<void>('/system/role/changeRoleStatus', data)
}

/**
 * 删除角色
 * @param roleId 角色ID
 * @returns {Result<void>} 结果
 */
export const deleteRoles = (roleId: Array<string | number> | string | number): Result<void> => {
  return http.del<void>(`/system/role/deleteRoles/${roleId}`)
}

/**
 * 根据角色ID查询部门树结构
 * @param roleId 角色ID
 * @returns {Result<SysRoleDeptTree>} 结果
 */
export const getRoleDeptTree = (roleId: string | number): Result<SysRoleDeptTree> => {
  return http.get<SysRoleDeptTree>(`/system/role/getRoleDeptTree/${roleId}`)
}
