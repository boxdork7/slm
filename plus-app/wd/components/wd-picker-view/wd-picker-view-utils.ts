// 选择器工具
import type { PickerViewValue } from '../wd-picker-view/wd-picker-view.vue'
import type { ColumnItem } from './wd-picker-view.vue'
import { getType, isArray, isDef } from '@/wd/components/common/util'

/**
 * 格式化传入的列数据
 * 列数据统一格式化为二维数组
 * @param array 列数据
 * @param valueKey 值键名
 * @param labelKey 标签键名
 * @returns 格式化后的二维数组
 */
export const formatArray = (
  array: Array<string | number | ColumnItem | Array<string | number | ColumnItem>>,
  valueKey: string,
  labelKey: string,
): ColumnItem[][] => {
  let tempArray: Array<string | number | ColumnItem | Array<string | number | ColumnItem>> =
    isArray(array) ? array : [array]

  // 判断数组第一层的数据类型，如果存在多种类型，则抛错
  const firstLevelTypeList = new Set(array.map(getType))

  /**
   * 存在三种类型的合法数据
   * 1.数组是一维元素，所有元素都是原始值
   * 2.数组是一维元素，所有元素都是object
   * 3.数组是二维元素，二维元素可以是任意内容
   */
  if (firstLevelTypeList.size !== 1 && firstLevelTypeList.has('object')) {
    // 原始值和引用类型不用混用
    throw new Error('The columns are correct')
  }

  /**
   * 简单处理，如果数组第一项不是数组则认为它是一个一维数组
   * 所以需要把一维的转成二维，这样方便统一处理
   */
  if (!isArray(array[0])) {
    tempArray = [tempArray as Array<string | number | ColumnItem>]
  }

  // 转化为二维数组后需要将每一项包装成ColumnItem
  const result: Array<Array<ColumnItem>> = (
    tempArray as Array<Array<string | number | ColumnItem>>
  ).map((col) => {
    return col.map((row) => {
      // 非对象类型直接将值作为label和value
      if (!isArray(row) && typeof row !== 'object') {
        return {
          [valueKey]: row,
          [labelKey]: row,
        }
      }

      /**
       * 针对已经是object的，修补成{valueKey,labelKey}
       * 如果没有labelKey，用valueKey代替
       * 如果没有valueKey，用labelKey代替
       * valueKey,labelKey都没有，直接抛错
       */
      const item = row as ColumnItem
      // eslint-disable-next-line no-prototype-builtins
      if (!item.hasOwnProperty(valueKey) && !item.hasOwnProperty(labelKey)) {
        throw new Error(`Can't find valueKey and labelKey in columns`)
      }
      // eslint-disable-next-line no-prototype-builtins
      if (!item.hasOwnProperty(labelKey)) {
        item[labelKey] = item[valueKey]
      }
      // eslint-disable-next-line no-prototype-builtins
      if (!item.hasOwnProperty(valueKey)) {
        item[valueKey] = item[labelKey]
      }
      return item
    })
  })

  return result
}

/**
 * 解析传入的值，支持字符串、数组等多种格式
 * @param value 原始值
 * @returns 解析后的数组
 */
export const parseInputValue = (value: PickerViewValue): (string | number | boolean)[] => {
  if (!isDef(value) || value === '') {
    return []
  }

  if (isArray(value)) {
    return value as Array<string> | Array<number>
  }

  // 如果是字符串且包含逗号，解析为数组
  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map((item) => item.trim())
  }

  // 否则作为单个值处理
  return [value]
}
