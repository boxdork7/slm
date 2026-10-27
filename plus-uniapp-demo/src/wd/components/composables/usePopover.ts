import { getCurrentInstance, ref } from 'vue'
import { getRect, isObj } from '../common/util'

/**
 * 弹出层定位组合式函数
 *
 * 提供弹出层的定位计算功能，支持：
 * - 12种不同的弹出位置
 * - 箭头指示器
 * - 自适应偏移量
 * - 响应式样式计算
 *
 * @param visibleArrow - 是否显示箭头，默认为 true
 * @returns 包含样式状态和控制方法的对象
 *
 * @example
 * ```typescript
 * const { popStyle, arrowStyle, arrowClass, init, control } = usePopover(true)
 *
 * // 初始化弹出层
 * init('top', true, 'tooltip')
 *
 * // 控制弹出层位置
 * control('top', 10)
 * ```
 */
export const usePopover = (visibleArrow = true) => {
  const { proxy } = getCurrentInstance() as any

  // 响应式状态
  const popStyle = ref<string>('') // 弹出层样式
  const arrowStyle = ref<string>('') // 箭头样式
  const showStyle = ref<string>('') // 显示样式
  const arrowClass = ref<string>('') // 箭头类名
  const popWidth = ref<number>(0) // 弹出层宽度
  const popHeight = ref<number>(0) // 弹出层高度
  const left = ref<number>(0) // 目标元素左边距
  const bottom = ref<number>(0) // 目标元素底边距
  const width = ref<number>(0) // 目标元素宽度
  const height = ref<number>(0) // 目标元素高度
  const top = ref<number>(0) // 目标元素顶边距

  /**
   * 空操作函数
   */
  const noop = () => {}

  /**
   * 初始化弹出层
   *
   * @param placement - 弹出位置
   * @param visibleArrow - 是否显示箭头
   * @param selector - 选择器名称，用于生成箭头类名
   */
  const init = (
    placement:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
      | 'right'
      | 'right-start'
      | 'right-end',
    visibleArrow: boolean,
    selector: string,
  ) => {
    // 初始化箭头类名
    if (visibleArrow) {
      const arrowClassArr = [
        `wd-${selector}__arrow`,
        placement === 'bottom' || placement === 'bottom-start' || placement === 'bottom-end'
          ? `wd-${selector}__arrow-up`
          : '',
        placement === 'left' || placement === 'left-start' || placement === 'left-end'
          ? `wd-${selector}__arrow-right`
          : '',
        placement === 'right' || placement === 'right-start' || placement === 'right-end'
          ? `wd-${selector}__arrow-left`
          : '',
        placement === 'top' || placement === 'top-start' || placement === 'top-end'
          ? `wd-${selector}__arrow-down`
          : '',
      ]
      arrowClass.value = arrowClassArr.join(' ')
    }

    // 获取目标元素尺寸信息
    getRect('#target', false, proxy).then((rect) => {
      if (!rect) return
      left.value = rect.left as number
      bottom.value = rect.bottom as number
      width.value = rect.width as number
      height.value = rect.height as number
      top.value = rect.top as number
    })

    // 获取弹出层尺寸信息（使用透明度可在初始化时获取到尺寸）
    getRect('#pos', false, proxy).then((rect) => {
      if (!rect) return
      popWidth.value = rect.width as number
      popHeight.value = rect.height as number
    })
  }

  /**
   * 控制弹出层位置
   *
   * @param placement - 弹出位置
   * @param offset - 偏移量，支持数字、数组或对象格式
   */
  const control = (
    placement:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
      | 'right'
      | 'right-start'
      | 'right-end',
    offset: number | number[] | Record<'x' | 'y', number>,
  ) => {
    // 箭头尺寸
    const arrowSize = visibleArrow ? 9 : 0
    // 上下位（纵轴）对应的距离左边的距离
    const verticalX = width.value / 2
    // 上下位（纵轴）对应的距离底部的距离
    const verticalY = arrowSize + height.value + 5
    // 左右位（横轴）对应的距离左边的距离
    const horizontalX = width.value + arrowSize + 5
    // 左右位（横轴）对应的距离底部的距离
    const horizontalY = height.value / 2

    let offsetX = 0
    let offsetY = 0

    // 处理不同格式的偏移量
    if (Array.isArray(offset)) {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset[0]
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + (offset[1] ? offset[1] : offset[0])
    } else if (isObj(offset)) {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset.x
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + offset.y
    } else {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + offset
    }

    // 定义各种位置的样式映射
    const placements = new Map([
      // 上方位置
      [
        'top',
        [
          `left: ${verticalX}px; bottom: ${verticalY}px; transform: translateX(-50%);`,
          'left: 50%;',
        ],
      ],
      [
        'top-start',
        [
          `left: ${offsetX}px; bottom: ${verticalY}px;`,
          `left: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px;`,
        ],
      ],
      [
        'top-end',
        [
          `right: ${offsetX}px; bottom: ${verticalY}px;`,
          `right: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px; transform: translateX(50%);`,
        ],
      ],
      // 下方位置
      [
        'bottom',
        [`left: ${verticalX}px; top: ${verticalY}px; transform: translateX(-50%);`, 'left: 50%;'],
      ],
      [
        'bottom-start',
        [
          `left: ${offsetX}px; top: ${verticalY}px;`,
          `left: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px;`,
        ],
      ],
      [
        'bottom-end',
        [
          `right: ${offsetX}px; top: ${verticalY}px;`,
          `right: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px; transform: translateX(50%);`,
        ],
      ],
      // 左侧位置
      [
        'left',
        [
          `right: ${horizontalX}px; top: ${horizontalY}px; transform: translateY(-50%);`,
          'top: 50%',
        ],
      ],
      [
        'left-start',
        [
          `right: ${horizontalX}px; top: ${offsetY}px;`,
          `top: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px;`,
        ],
      ],
      [
        'left-end',
        [
          `right: ${horizontalX}px; bottom: ${offsetY}px;`,
          `bottom: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px; transform: translateY(50%);`,
        ],
      ],
      // 右侧位置
      [
        'right',
        [`left: ${horizontalX}px; top: ${horizontalY}px; transform: translateY(-50%);`, 'top: 50%'],
      ],
      [
        'right-start',
        [
          `left: ${horizontalX}px; top: ${offsetY}px;`,
          `top: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px;`,
        ],
      ],
      [
        'right-end',
        [
          `left: ${horizontalX}px; bottom: ${offsetY}px;`,
          `bottom: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px; transform: translateY(50%);`,
        ],
      ],
    ])

    // 设置弹出层和箭头样式
    popStyle.value = placements.get(placement)![0]
    arrowStyle.value = placements.get(placement)![1]
  }

  return {
    popStyle, // 弹出层样式
    arrowStyle, // 箭头样式
    showStyle, // 显示样式
    arrowClass, // 箭头类名
    init, // 初始化方法
    control, // 位置控制方法
    noop, // 空操作方法
  }
}
