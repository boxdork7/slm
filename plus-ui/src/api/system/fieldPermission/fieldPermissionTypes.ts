// 字段级权限类型定义

/** 访问档位：0隐藏 1脱敏 2只读 3可写（对应字典 sys_field_access） */
export type FieldAccessType = '0' | '1' | '2' | '3'

/** 授权主体类型：1角色 2部门 3用户（对应字典 sys_field_subject） */
export type FieldSubjectType = '1' | '2' | '3'

/** 类角色：1读出口VO 2写入口BO 3导入ImportVo */
export type FieldClassType = '1' | '2' | '3'

/** 字段权限资源查询类型 */
export interface FieldResourceQuery {
  /** 资源名称（模糊） */
  resourceName?: string

  /** 所属模块分组 */
  moduleName?: string

  /** 状态 */
  status?: string
}

/** 字段权限资源表单类型（只含可改的元信息，资源标识与类绑定由注解扫描维护） */
export interface FieldResourceBo {
  /** 主键id */
  id?: string | number

  /** 资源名称 */
  resourceName?: string

  /** 所属模块分组 */
  moduleName?: string

  /** 排序值 */
  sortOrder?: number

  /** 状态 */
  status?: string

  /** 备注 */
  remark?: string
}

/** 资源绑定的类（只读展示，让管理员看见配置的实际覆盖范围） */
export interface FieldResourceClassVo {
  /** 主键id */
  id: string | number

  /** 资源标识 */
  resourceKey: string

  /** 类全限定名 */
  className: string

  /** 类角色 */
  classType: FieldClassType

  /** 类角色中文说明 */
  classTypeLabel: string

  /** 类简名，列表默认展示这个 */
  simpleName: string
}

/** 字段权限资源视图类型 */
export interface FieldResourceVo {
  /** 主键id */
  id: string | number

  /** 资源标识（与菜单权限前缀一致） */
  resourceKey: string

  /** 资源名称 */
  resourceName: string

  /** 所属模块分组 */
  moduleName: string

  /** 排序值 */
  sortOrder: number

  /** 状态 */
  status: string

  /** 是否由注解扫描自动登记 */
  isAuto: string

  /** 备注 */
  remark: string

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string

  /** 绑定的类清单（只读） */
  classes: FieldResourceClassVo[]

  /** 已配置差异化权限的字段数（左树数字徽标） */
  configuredFieldCount: number
}

/** 字段元数据（矩阵的行） */
export interface FieldMetaVo {
  /** 字段名 */
  fieldName: string

  /** 中文标签 */
  label: string

  /** Java 类型简名 */
  javaType: string

  /** 是否带 @Sensitive 注解——决定基线是脱敏还是可写 */
  sensitive: boolean

  /** @Sensitive 的策略枚举名 */
  sensitiveStrategy?: string

  /** 带注解但字段非 String：注解实际不生效，只能靠动态配置兜底 */
  annotationUncovered: boolean

  /** 该字段出现在哪些类里 */
  sourceClasses: string[]
}

/** 授权主体选项（矩阵的列） */
export interface FieldSubjectVo {
  /** 主体类型 */
  subjectType: FieldSubjectType

  /** 主体ID */
  subjectId: string | number

  /** 主体名称 */
  subjectName: string

  /** 父ID，仅部门主体有值，供前端构树 */
  parentId?: string | number

  /** 是否超管角色：走旁路配了也不生效，渲染成不可编辑的「全权」 */
  superAdmin: boolean
}

/** 矩阵单元格（一条差异配置） */
export interface FieldMatrixCellVo {
  /** 字段名 */
  fieldName: string

  /** 主体类型 */
  subjectType: FieldSubjectType

  /** 主体ID */
  subjectId: string | number

  /** 访问档位 */
  accessType: FieldAccessType

  /** 脱敏策略（accessType=1 时生效） */
  strategy?: string

  /** 部门主体是否含子部门（仅 subjectType=2 生效） */
  includeSub?: string
}

/** 矩阵完整数据 */
export interface FieldMatrixVo {
  /** 资源标识 */
  resourceKey: string

  /** 资源名称 */
  resourceName: string

  /** 绑定的类清单 */
  classes: FieldResourceClassVo[]

  /** 矩阵的行：字段清单 */
  fields: FieldMetaVo[]

  /** 矩阵的列：主体清单 */
  subjects: FieldSubjectVo[]

  /** 已配置的差异格（不含「跟随基线」的格子，前端按 fieldName + subjectId 索引） */
  cells: FieldMatrixCellVo[]
}

/** 矩阵保存参数（覆盖式：subjectIds 必须完整传入本次编辑涉及的所有主体） */
export interface FieldMatrixBo {
  /** 资源标识 */
  resourceKey: string

  /** 主体类型 */
  subjectType: FieldSubjectType

  /** 本次编辑涉及的全部主体ID（覆盖式保存的删除范围） */
  subjectIds: Array<string | number>

  /** 差异格。只传与基线不同的格子 */
  cells: FieldMatrixCellVo[]
}

/** 效果预览的单个字段结果 */
export interface FieldPreviewItem {
  /** 字段名 */
  fieldName: string

  /** 中文标签 */
  label: string

  /** 最终档位 */
  accessType: FieldAccessType

  /** 档位中文标签 */
  accessLabel: string

  /** 是否带 @Sensitive 注解 */
  sensitive: boolean

  /** 档位是否由动态配置决定：false 表示回落注解基线或无限制 */
  fromConfig: boolean

  /** 脱敏档实际使用的策略名 */
  strategy?: string
}

/** 效果预览结果（按指定用户合并角色/部门/个人配置后的真实档位） */
export interface FieldPreviewVo {
  /** 资源标识 */
  resourceKey: string

  /** 资源名称 */
  resourceName: string

  /** 被预览的用户ID */
  userId: string | number

  /** 被预览的用户昵称 */
  nickName: string

  /** 是否超管：超管走旁路，所有字段均可写 */
  superAdmin: boolean

  /** 逐字段的最终效果 */
  items: FieldPreviewItem[]
}

/** 效果预览查询参数 */
export interface FieldPreviewQuery {
  /** 资源标识 */
  resourceKey: string

  /** 被预览的用户 */
  userId: string | number
}

/** 收权后果计数的受影响用户 */
export interface FieldAffectedUser {
  /** 用户ID */
  userId: string | number

  /** 用户昵称 */
  nickName: string

  /** 放行来源 */
  grantedBy: string

  /** 该用户最终的档位 */
  finalAccess: string
}

/** 收权后果计数结果（矩阵单元格 ⚠ N 角标的数据源） */
export interface FieldAffectedVo {
  /** 命中该主体的用户总数 */
  totalUsers: number

  /** 其中因其他主体仍能看到该字段的人数——收权对这些人无效 */
  stillVisibleUsers: number

  /** 前若干个仍可见用户的明细（hover 展示），最多 10 条 */
  samples: FieldAffectedUser[]

  /** 用户数过多时只给总数不逐个算，此时为 true */
  approximate: boolean
}

/** 收权后果计数查询参数 */
export interface FieldAffectedQuery {
  /** 资源标识 */
  resourceKey: string

  /** 主体类型 */
  subjectType: FieldSubjectType

  /** 主体ID */
  subjectId: string | number

  /** 字段名 */
  fieldName: string

  /** 打算设置的档位 */
  accessType: FieldAccessType
}

/** 矩阵查询参数 */
export interface FieldMatrixQuery {
  /** 资源标识 */
  resourceKey: string

  /** 主体类型 */
  subjectType: FieldSubjectType

  /** 要显示的主体ID；不传则取该类型的默认集合 */
  subjectIds?: Array<string | number>
}