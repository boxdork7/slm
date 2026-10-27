/**
 * 字典数据管理 (useDictStore)
 *
 * 基于 Pinia 的字典数据管理模块，提供统一的字典数据存储、访问和转换功能。
 *
 * 包含以下功能：
 * - 字典存储: 集中管理应用中的所有字典数据 (dict)
 * - 字典访问: 快速获取指定类型的字典数据 (getDict)
 * - 字典设置: 动态添加或更新字典项 (setDict)
 * - 标签转换: 根据字典值获取对应的显示标签 (getDictLabel, getDictLabels)
 * - 值转换: 根据显示标签获取对应的字典值 (getDictValue)
 * - 对象获取: 获取字典项的完整对象数据 (getDictItem)
 * - 数据清理: 支持删除单个或所有字典数据 (removeDict, cleanDict)
 */

/**应用模块名称*/
const DICT_MODULE = 'dict'

export const useDictStore = defineStore(DICT_MODULE, () => {
  /**
   * 字典数据集合
   * @description 使用Map存储多个字典数据，key为字典类型，value为字典选项数组
   * @example
   * {
   *   'sys_user_gender': [
   *     { label: '男', value: '0' ... },
   *     { label: '女', value: '1' ... }
   *   ],
   *   'sys_enable_status': [
   *     { label: '正常', value: '0' ... },
   *     { label: '停用', value: '1' ... }
   *   ]
   * }
   */
  const dict = ref<Map<string, DictItem[]>>(new Map())

  /**
   * 获取字典
   * @param key 字典key
   * @returns 字典数据数组或null
   * @example getDict('sys_user_gender')
   */
  const getDict = (key: string): DictItem[] | null => {
    if (!key) {
      return null
    }
    return dict.value.get(key) || null
  }

  /**
   * 设置字典
   * @param key 字典key
   * @param value 字典value
   * @returns 是否设置成功
   * @example
   * setDict('sys_user_gender', [
   *   { label: '男', value: '0' },
   *   { label: '女', value: '1' }
   * ])
   */
  const setDict = (key: string, value: DictItem[]): boolean => {
    if (!key) {
      return false
    }
    try {
      dict.value.set(key, value)
      return true
    } catch (e) {
      console.error('设置字典时发生错误:', e)
      return false
    }
  }

  /**
   * 根据字典类型或字典数据和值获取标签
   * @param keyOrData 字典类型或字典数据
   * @param value 字典值
   * @returns 对应的标签名
   * @example
   * getDictLabel('sys_user_gender', '0') // 返回 '男'
   * getDictLabel(dictData, '0') // 直接使用字典数据获取标签
   */
  const getDictLabel = (
    keyOrData: string | Ref<DictItem[]> | DictItem[],
    value: string | number,
  ): string => {
    let dictData: Ref<DictItem[]> | undefined

    if (typeof keyOrData === 'string') {
      dictData = ref(getDict(keyOrData))
    } else if (isRef(keyOrData)) {
      dictData = keyOrData
    } else {
      // 处理 DictItem[] 类型
      dictData = ref(keyOrData)
    }

    if (!dictData) return ''
    const item = dictData.value.find((item) => item.value === String(value))
    return item ? item.label : ''
  }

  /**
   * 批量获取字典标签
   * @param keyOrData 字典类型或字典数据
   * @param values 字典值数组
   * @returns 对应的标签数组
   * @example
   * getDictLabels('sys_user_gender', ['0', '1']) // 返回 ['男', '女']
   * getDictLabels(dictData, ['0', '1']) // 直接使用字典数据获取标签数组
   */
  const getDictLabels = (
    keyOrData: string | Ref<DictItem[]>,
    values: (string | number)[],
  ): string[] => {
    if (!values || values.length === 0) return []

    let dictData: Ref<DictItem[]> | undefined

    if (typeof keyOrData === 'string') {
      dictData = ref(getDict(keyOrData))
    } else {
      dictData = keyOrData
    }

    if (!dictData) return values.map(() => '')

    return values.map((value) => {
      const item = dictData.value.find((item) => item.value === value)
      return item ? item.label : ''
    })
  }

  /**
   * 获取字典项的完整对象
   * @param keyOrData 字典类型或字典数据
   * @param value 字典值
   * @returns 完整的字典项对象或null
   * @example
   * getDictItem('sys_user_gender', '0') // 返回 { label: '男', value: '0' }
   * getDictItem(dictData, '0') // 直接使用字典数据获取字典项
   */
  const getDictItem = (keyOrData: string | DictItem[], value: string | number): DictItem | null => {
    let dictData: DictItem[] | undefined

    if (typeof keyOrData === 'string') {
      dictData = getDict(keyOrData)
    } else {
      dictData = keyOrData
    }

    if (!dictData) return null

    return dictData.find((item) => item.value === value) || null
  }
  /**
   * 根据标签获取字典值
   * @param key 字典类型
   * @param label 字典标签
   * @returns 对应的字典值
   * @example getDictValue('sys_user_gender', '男') // 返回 '0'
   */
  const getDictValue = (key: string, label: string): string | number | null => {
    const dictData = getDict(key)
    if (!dictData) return null

    const item = dictData.find((item) => item.label === label)
    return item ? item.value : null
  }

  /**
   * 删除字典
   * @param key 字典key
   * @returns 是否删除成功
   * @example removeDict('sys_user_gender')
   */
  const removeDict = (key: string): boolean => {
    if (!key) {
      return false
    }
    try {
      return dict.value.delete(key)
    } catch (e) {
      console.error('删除字典时发生错误:', e)
      return false
    }
  }

  /**
   * 清空字典
   * @description 清空所有字典数据
   * @example cleanDict()
   */
  const cleanDict = (): void => {
    dict.value.clear()
  }

  return {
    dict,
    getDict,
    setDict,
    getDictLabel,
    getDictLabels,
    getDictItem,
    getDictValue,
    removeDict,
    cleanDict,
  }
})
