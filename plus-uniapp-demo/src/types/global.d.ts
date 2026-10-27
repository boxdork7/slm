import type { ComponentInternalInstance as ComponentInstance } from 'vue'

/**
 * 全局类型定义 (global.d.ts)
 *
 * 为整个应用提供统一的 TypeScript 类型系统，定义项目中通用的接口和类型。
 * 所有类型均为全局声明，在项目任何位置都可直接使用，无需手动导入。
 *
 * 🎯 设计原则:
 * - 全局可用: 避免频繁的 import 操作，提升开发效率
 * - 类型安全: 为 API 调用、UI 组件、数据结构提供完整的类型检查
 * - 统一标准: 确保项目中相同概念使用一致的类型定义
 * - 易于维护: 集中管理所有通用类型，便于统一更新和维护
 *
 * 📋 包含类型分类:
 *
 * 【组件相关】
 * - ComponentInternalInstance: Vue 组件实例类型
 *
 * 【API 交互】
 * - Result<T>: 统一的 API 响应格式 [错误, 数据]
 * - PageResult<T>: 标准化分页响应数据结构
 * - R<T>: 标准 API 响应结构 包含状态码、消息和数据
 * - PageQuery: 分页查询参数接口
 *
 * 【UI 控制】
 * - FieldVisibilityConfig: 字段显示/隐藏控制配置
 * - DialogState: 弹窗状态管理配置
 * - DictItem: 字典数据项配置（下拉选择、标签等）
 *
 */
declare global {
  /** Vue 组件实例类型 */
  declare type ComponentInternalInstance = ComponentInstance

  /**
   * 统一 API 响应类型
   * @description 定义所有 API 请求的统一返回格式 [错误, 数据]
   * @template T 响应数据的类型
   */
  declare type Result<T = any> = Promise<[Error | null, T | null]>

  /**
   * 分页响应数据类型
   * @description 标准化的分页数据结构，与后端 PageResult 保持一致
   * @template T 列表项的类型
   */
  declare interface PageResult<T = any> {
    /** 数据记录列表 */
    records: T[]
    /** 总记录数 */
    total: number
    /** 总页数 */
    pages: number
    /** 当前页码 */
    current: number
    /** 每页大小 */
    size: number
    /** 是否为最后一页 */
    last: boolean
  }

  /**
   * 标准 API 响应结构
   * @description 后端返回的标准响应格式，包含状态码、消息和数据
   * @template T 数据字段的类型
   */
  declare interface R<T = any> {
    /** 响应状态码 */
    code: number
    /** 响应消息 */
    msg: string
    /** 响应数据 */
    data: T
  }

  /**
   * 分页查询基础参数
   * @description 用于后端分页查询的通用参数接口
   */
  declare interface PageQuery {
    /** 当前页码，从1开始 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序字段 */
    orderByColumn?: string
    /** 排序方向 asc/desc */
    isAsc?: string
    /** 模糊搜索关键词 */
    searchValue?: string
    /** 扩展查询参数 */
    params?: Record<string, any>
  }

  /**
   * 字段可见性配置
   * @description 用于控制界面字段的显示/隐藏状态，支持层级结构
   */
  declare interface FieldVisibilityConfig {
    /** 字段唯一标识 */
    key: string | number
    /** 字段名称 */
    field: string
    /** 字段显示标签 */
    label: string
    /** 是否可见 */
    visible: boolean
    /** 子字段配置，支持层级结构 */
    children?: Array<FieldVisibilityConfig>
  }

  /**
   * 弹窗状态配置
   * @description 用于管理弹窗的显示状态和基本属性
   * 移动端通常使用 uni.showModal 或自定义 popup 组件
   */
  declare interface DialogState {
    /** 弹窗标题 */
    title?: string
    /** 弹窗是否显示 */
    visible: boolean
    /** 是否显示取消按钮（移动端特有） */
    showCancel?: boolean
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
  }

  /**
   * 字典项配置
   * @description 用于下拉选择、标签等组件的选项数据，支持 Element UI 标签样式
   */
  declare interface DictItem {
    /** 显示标签文本 */
    label: string
    /** 实际存储的值 */
    value: string
    /** 状态标识 */
    status?: string
    /** Element UI Tag 组件的类型 */
    elTagType?: ElTagType
    /** Element UI Tag 组件的自定义类名 */
    elTagClass?: string
  }
}

/**
 * 空导出语句
 * 确保此文件被 TypeScript 视为模块而非全局脚本
 */
export {}

// // 全局要用的类型放到这里
//
// declare global {
//   type IResData<T> = {
//     code: number
//     msg: string
//     data: T
//   }
//
//   // uni.uploadFile文件上传参数
//   type IUniUploadFileOptions = {
//     file?: File
//     files?: UniApp.UploadFileOptionFiles[]
//     filePath?: string
//     name?: string
//     formData?: any
//   }
//
//   type IUserInfo = {
//     nickname?: string
//     avatar?: string
//     /** 微信的 openid，非微信没有这个字段 */
//     openid?: string
//     token?: string
//   }
// }
//
// export {} // 防止模块污染
