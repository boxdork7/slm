import { listDictDatasByDictType } from '@/api/system/dict/dictData/dictDataApi'
import type { Ref } from 'vue'

/**
 * 字典类型枚举
 */
export enum DictTypes {
  /** 审核状态 */
  sys_audit_status = 'sys_audit_status',
  /** 逻辑标志 */
  sys_boolean_flag = 'sys_boolean_flag',
  /** 显示设置 */
  sys_display_setting = 'sys_display_setting',
  /** 启用状态 */
  sys_enable_status = 'sys_enable_status',
  /** 文件类型 */
  sys_file_type = 'sys_file_type',
  /** 消息类型 */
  sys_message_type = 'sys_message_type',
  /** 通知状态 */
  sys_notice_status = 'sys_notice_status',
  /** 通知类型 */
  sys_notice_type = 'sys_notice_type',
  /** 操作结果 */
  sys_oper_result = 'sys_oper_result',
  /** 业务操作类型 */
  sys_oper_type = 'sys_oper_type',
  /** 支付方式 */
  sys_payment_method = 'sys_payment_method',
  /** 平台类型 */
  sys_platform_type = 'sys_platform_type',
  /** 用户性别 */
  sys_user_gender = 'sys_user_gender',
  /** 数据权限类型 */
  sys_data_scope = 'sys_data_scope',
}

/**
 * 字典数据钩子函数 (useDict)
 *
 * 包含以下功能：
 * - 字典获取: 支持同时获取多个字典类型的数据
 * - 缓存利用: 优先从缓存获取数据，减少不必要的API请求
 * - 自动缓存: 自动将API获取的字典数据存入缓存
 * - 状态跟踪: 提供加载状态指示器 (dictLoading)
 * - 并行加载: 支持多个字典类型的并行请求
 * - 错误处理: 单个字典加载失败不影响其他字典的加载
 * - 类型转换: 统一转换为标准字典格式，便于在UI组件中使用
 */

/** 字典结果 */
interface DataResult {
  // 字典加载状态，是一个响应式的布尔值 Ref
  // @ts-expect-error: 忽略类型不兼容的错误
  dictLoading: Ref<boolean>
  // 索引签名，允许使用字符串作为 key，值为字典数据选项数组
  // 这意味着可以通过字符串 key 动态访问不同类型的字典数据
  [key: string]: DictItem[]
}

/**
 * 获取字典数据的组合式API
 *
 * 此钩子用于从缓存或API动态获取字典数据，支持同时请求多个字典类型。
 * 返回的对象中包含每个请求的字典类型作为属性，以及加载状态。
 *
 * @param args 需要获取的字典类型数组
 * @returns 包含所有请求字典类型的响应式对象以及加载状态
 *
 * @example
 * // 基本用法 loading为false代表加载完毕
 * const { sys_user_gender, sys_enable_status, dictLoading } = useDict(DictTypes.sys_user_gender, DictTypes.sys_enable_status);
 *
 * // 在模板中使用
 * // <el-select v-model="form.gender" :loading="dictLoading">
 * //   <el-option v-for="dict in sys_user_gender" :key="dict.value" :label="dict.label" :value="dict.value" />
 * // </el-select>
 */
export const useDict = (...args: string[]): DataResult => {
  const dictStore = useDictStore()
  // 存储所有字典数据的响应式对象
  const dictObject = reactive<Record<string, DictItem[]>>({})
  // 字典加载状态标志 false代表加载完毕
  const dictLoading = ref(true)

  // 收集所有字典请求的Promise，用于跟踪加载完成状态
  const promises: Promise<void>[] = []

  // 处理每个请求的字典类型
  args.forEach((dictType) => {
    // 初始化为空数组，确保在加载前模板可以正常渲染
    dictObject[dictType] = []

    // 尝试从缓存获取字典
    const cachedDict = dictStore.getDict(dictType)
    let promise: Promise<void>

    if (cachedDict) {
      // 缓存命中，直接使用缓存数据
      dictObject[dictType] = cachedDict
      promise = Promise.resolve()
    } else {
      // 缓存未命中，从API获取数据
      promise = listDictDatasByDictType(dictType).then(([err, data]) => {
        if (err) {
          // 错误处理后Promise仍然解析为fulfilled状态，不影响其他字典的加载
          console.error(`获取字典[${dictType}]失败:`, err)
          return
        }
        // 转换API返回的数据为标准字典格式
        const dictData = data.map(
          (p): DictItem => ({
            // 显示标签
            label: p.dictLabel,
            // 实际值
            value: p.dictValue,
            // 状态
            status: p.status,
            // 标签类型，用于渲染不同样式
            elTagType: p.listClass,
            // 自定义CSS类
            elTagClass: p.cssClass,
          }),
        )

        // 更新响应式对象中的字典数据
        dictObject[dictType] = dictData
        // 将数据存入缓存，避免重复请求
        dictStore.setDict(dictType, dictData)
      })
    }

    promises.push(promise)
  })

  // 当所有字典请求完成后，更新加载状态
  Promise.all(promises).finally(() => {
    dictLoading.value = false
  })

  return {
    // 将字典对象的每个属性转为ref，便于解构使用
    ...toRefs(dictObject),
    // 整体加载状态 false代表加载完毕
    dictLoading,
  } as DataResult
}
