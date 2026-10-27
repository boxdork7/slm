/** OSS对象存储视图类型 */
export interface SysOssVo {
  /** 对象存储主键 */
  ossId: string | number

  /** 所属目录ID */
  directoryId: string | number

  /** 所属目录 */
  directoryName: string

  /** 文件名 */
  fileName: string

  /** 原名 */
  originalName: string

  /** 文件后缀名 */
  fileSuffix: string

  /** 文件大小(字节) */
  fileSize: number

  /** URL地址（预览用，私有库会自动生成预签名URL） */
  url: string

  /** 原始URL地址（存储用，不含预签名参数） */
  originalUrl: string

  /** 创建名称 */
  createByName: string

  /** 服务商 */
  service: string

  /** 更新时间 */
  updateTime: string
}
