// 用户管理类型
import { SysRoleVo } from '@/api/system/core/role/roleTypes'
import { SysPostVo } from '@/api/system/core/post/postTypes'

/** 用户信息查询类型 */
export interface SysUserQuery extends PageQuery {
  /** 用户账号 */
  userName?: string

  /** 手机号码 */
  phone?: string

  /** 帐号状态 */
  status?: string

  /** 部门id */
  deptId?: string | number

  /** 角色id */
  roleId?: string | number

  /**用户id列表*/
  userIds?: string | number
}

/** 用户信息表单类型 */
export interface SysUserBo {
  /** 用户ID */
  userId?: string | number

  /** 部门ID */
  deptId?: string | number

  /** 用户账号 */
  userName: string

  /** 用户昵称 */
  nickName?: string

  /** 密码 */
  password: string

  /** 手机号码 */
  phone?: string

  /** 用户邮箱 */
  email?: string

  /** 用户性别 */
  gender?: string

  /** 帐号状态 */
  status: string

  /** 备注 */
  remark?: string

  /**岗位id列表*/
  postIds: string[]

  /**角色id列表*/
  roleIds: string[]
}

/** 用户信息视图类型 */
export interface SysUserVo {
  /** 用户ID */
  userId: string | number

  /** 租户id */
  tenantId: string

  /** 部门ID */
  deptId: string | number

  /** 用户账号 */
  userName: string

  /** 用户昵称 */
  nickName: string

  /** 用户类型 */
  userType: string

  /** 用户邮箱 */
  email: string

  /** 手机号码 */
  phone: string

  /** 用户性别 */
  gender: string

  /** 头像地址 */
  avatar: string

  /** 帐号状态 */
  status: string

  /** 最后登录IP */
  loginIp: string

  /** 最后登录时间 */
  loginDate: string

  /** 备注 */
  remark: string

  /** 部门名称 */
  deptName: string

  /**角色列表*/
  roles: SysRoleVo[]

  /** 角色id列表 */
  roleIds: any

  /**岗位id列表*/
  postIds: any

  /**角色id*/
  roleId: any

  /**是否管理员*/
  admin: boolean

  /**创建时间*/
  createTime?: string
}

/**
 * 用户信息
 */
export interface UserInfoVo {
  /**用户基本信息*/
  user: SysUserVo

  /**角色标识符列表*/
  roles: string[]

  /**权限标识符列表*/
  permissions: string[]

  /**密码状态（等保二级 8.1.4.1 a）*/
  passwordStatus?: PasswordStatusVo

  /**
   * 字段权限快照：资源标识 → (字段名 → 档位码 0隐藏/1脱敏/2只读)
   *
   * 只含受限字段，绝大多数用户是空对象。供前端隐藏列 / 禁用表单项。
   * 🔴 仅体验优化，不是安全边界 —— 真正的隔离由后端四个出口保证。
   */
  fieldPermissions?: Record<string, Record<string, string>>
}

/**
 * 密码状态（等保二级 8.1.4.1 a：鉴别信息复杂度与定期更换）
 *
 * 这些标记不阻断登录 —— 阻断会让用户连改密页面都进不去。
 * 拦截由路由守卫完成，只放行改密相关路由。
 */
export interface PasswordStatusVo {
  /**是否必须修改密码（从未改过密码，或密码已过期）*/
  mustChangePwd?: boolean

  /**密码是否已过期*/
  pwdExpired?: boolean

  /**距离密码到期还剩多少天，仅在进入提醒窗口时才有值*/
  expireInDays?: number

  /**密码有效期天数，0 表示永不过期*/
  expireDays?: number
}

/** 用户密码信息 */
export interface SysUserPasswordBo {
  /**旧密码*/
  oldPassword: string

  /**新密码*/
  newPassword: string

  /**确认新密码*/
  confirmPassword: string
}

export interface ProfileVo {
  /**用户信息*/
  user: SysUserVo

  /**用户所属角色组*/
  roleGroup: string

  /**用户所属岗位组*/
  postGroup: string
}

/**用户信息*/
export interface SysUserInfoVo {
  /**用户信息*/
  user: SysUserVo

  /**角色列表*/
  roles: SysRoleVo[]

  /**角色ID列表*/
  roleIds: string[]

  /**岗位列表*/
  posts: SysPostVo[]

  /**岗位ID列表*/
  postIds: string[]
}
