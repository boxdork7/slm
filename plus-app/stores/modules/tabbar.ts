// 标签栏状态
import type { WdTabbarItemProps } from '@/wd/components/wd-tabbar-item/wd-tabbar-item.vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentPage } from '@/utils/route'
import { objectToQuery } from '@/utils/string'
import { isDef } from '@/wd/components/common/util'

/**
 * Tabbar 状态管理
 *
 * @description 管理底部标签页的状态、徽标显示和页面跳转
 *
 * const tabbarStore = useTabbarStore()
 *
 * // 跳转到购物车页面
 * tabbarStore.toTab(2)
 *
 * // 更新购物车徽章
 * tabbarStore.updateBadge(2, 5)
 *
 * // 显示我的页面小红点
 * tabbarStore.updateDot(3, true)
 */
/** 应用模块名称 */
const TABBAR_MODULE = 'tabbar'

export const useTabbarStore = defineStore(TABBAR_MODULE, () => {
  /** Tabbar 页面路径 */
  const TABBAR_PAGE_PATH = 'pages/index/index'

  /** 当前激活的标签页索引 */
  const currentTab = ref(0)

  /**
   * 标签页列表
   */
  const tabs = ref<WdTabbarItemProps[]>([
    { title: '首页', icon: 'home', isDot: false, value: 0, loaded: true },
    { title: '点餐', icon: 'shop', isDot: false, value: 0, loaded: false },
    { title: '我的', icon: 'user', isDot: false, value: 0, loaded: false },
  ])

  /**
   * 清除标签页徽标
   *
   * @param index 标签页索引
   *
   * @description
   * 同时清除指定标签页的数字徽章和小红点
   *
   * @example
   * ```typescript
   * // 清除购物车页面所有徽标
   * tabbarStore.clearBadge(2)
   * ```
   */
  const clearBadge = (index: number) => {
    if (index < 0 || index >= tabs.value.length) return

    tabs.value[index].value = 0
    tabs.value[index].isDot = false
  }

  /**
   * 跳转到指定标签页
   *
   * @param index 标签页索引
   * @param params 可选的跳转参数，会附加到 URL 查询参数中
   *
   * 智能判断当前页面环境：
   * - 如果在 tabbar 页面内，直接切换标签
   * - 如果在其他页面，跳转到 tabbar 页面并显示指定标签
   *
   * // 跳转到购物车
   * tabbarStore.toTab(2)
   *
   * // 跳转到我的页面并传递参数
   * tabbarStore.toTab(3, { showOrders: true })
   */
  const toTab = async (index: number | string, params?: Record<string, any>) => {
    index = isDef(index) ? (typeof index === 'string' ? Number(index) : index) : 0
    if (index < 0 || index >= tabs.value.length) return

    // 更新当前标签页状态
    currentTab.value = index
    // 标记目标页面为已加载
    tabs.value[index].loaded = true

    // 检查是否在 tabbar 页面
    const isInTabbar = getCurrentPage()?.route === TABBAR_PAGE_PATH

    if (!isInTabbar) {
      // 不在 tabbar 页面，需要跳转
      const query = objectToQuery({
        tab: index.toString(),
        ...params,
      })

      await uni.navigateTo({
        url: `/${TABBAR_PAGE_PATH}?${query}`,
      })
    }

    // 清除徽标
    clearBadge(index)
  }

  /**
   * 更新标签页小红点状态
   *
   * @param index 标签页索引
   * @param isDot 是否显示小红点
   *
   * // 显示我的页面小红点
   * tabbarStore.updateDot(3, true)
   *
   * // 隐藏小红点
   * tabbarStore.updateDot(3, false)
   * ```
   */
  const updateDot = (index: number, isDot: boolean) => {
    if (index < 0 || index >= tabs.value.length) return

    tabs.value[index].isDot = isDot
    if (isDot) {
      tabs.value[index].value = 0
    }
  }

  /**
   * 更新标签页徽章数值
   *
   * @param index 标签页索引
   * @param value 徽章数值，0 或负数会隐藏徽章
   *
   * @description
   * 更新指定标签页的数字徽章，当设置数值时会自动隐藏小红点
   *
   * @example
   * ```typescript
   * // 设置购物车徽章为 5
   * tabbarStore.updateBadge(2, 5)
   *
   * // 隐藏徽章
   * tabbarStore.updateBadge(2, 0)
   * ```
   */
  const updateBadge = (index: number, value: number) => {
    if (index < 0 || index >= tabs.value.length) return

    tabs.value[index].value = Math.max(0, value)
    if (value > 0) {
      tabs.value[index].isDot = false
    }
  }

  return {
    // 状态
    currentTab,
    tabs,

    // 方法
    toTab,
    updateDot,
    updateBadge,
    clearBadge,
  }
})
