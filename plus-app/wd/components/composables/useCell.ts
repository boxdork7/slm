// 单元格
import { computed } from 'vue'
import { useParent } from './useParent'
import { CELL_GROUP_KEY, type CellGroupProvide } from '../wd-cell-group/wd-cell-group-key'

/**
 * Cell 组件的组合式 API Hook
 * 用于处理 Cell 组件与 Cell Group 父组件之间的关联逻辑
 *
 * @returns 返回 Cell 组件相关的响应式状态和方法
 */
export const useCell = () => {
  // 获取父组件 Cell Group 的实例和当前 Cell 在父组件中的索引
  const { parent: cellGroup, index } = useParent<CellGroupProvide>(CELL_GROUP_KEY)

  /**
   * 计算是否显示边框
   * 边框显示的条件：
   * 1. 存在父组件 Cell Group
   * 2. 父组件启用了 border 属性
   * 3. 当前 Cell 不是第一个子组件（index > 0）
   *
   * 这样可以避免第一个 Cell 显示上边框，保持视觉上的统一
   */
  const border = computed(() => {
    return cellGroup?.props.border && index.value > 0
  })

  return {
    /** 是否显示边框的响应式状态 */
    border,
  }
}
