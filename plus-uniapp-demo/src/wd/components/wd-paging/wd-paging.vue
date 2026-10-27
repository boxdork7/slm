<!--
/**
 * wd-paging - 智能分页组件
 *
 * - 基于scroll-view实现，无需页面生命周期处理
 * - 自动管理分页逻辑，对接标准PageResult接口
 * - 使用wd-tabs组件，支持徽标和粘性布局
 * - 使用wd-backtop组件，平滑回到顶部
 * - 内置wd-search组件搜索功能，支持下拉刷新
 * - 使用官方wd-status-tip组件展示空数据状态
 * - 支持radio-group选项筛选功能
 * - 支持禁用自动分页加载功能
 * - 支持清空数据缓存功能
 * - 完整TypeScript支持，UnoCSS样式
 *
 * 使用示例：
 * <template>
 *   <wd-paging
 *     :fetch="pageUsers"
 *     :tabs="tabsConfig"
 *     :radio-group-config="radioGroupConfig"
 *     show-search
 *     :disabled-auto-load="true"
 *     :max-records="5"
 *     custom-style="margin-top: 20rpx;"
 *     custom-class="my-paging-wrapper"
 *     @tab-change="handleTabChange"
 *     @radio-change="handleRadioChange"
 *   >
 *     <template #item="{ item }">
 *       <UserCard :user="item" />
 *     </template>
 *     <template #after-items="{ currentTabData, currentPageData }">
 *       <AddButton v-if="shouldShowAddButton" />
 *     </template>
 *   </wd-paging>
 * </template>
 *
 * <script>
 * const tabsConfig = [
 *   {
 *     name: 'all',
 *     title: '全部用户',
 *     data: {}
 *   },
 *   {
 *     name: 'vip',
 *     title: 'VIP用户',
 *     data: { userType: 'vip' },
 *     // 这个tab使用独立的radio配置，会覆盖全局radioGroupConfig
 *     radioGroupConfig: {
 *       field: 'level',
 *       defaultValue: '1',
 *       options: [
 *         { label: '铜牌', value: '1' },
 *         { label: '银牌', value: '2' },
 *         { label: '金牌', value: '3' }
 *       ]
 *     }
 *   },
 *   {
 *     name: 'active',
 *     title: '活跃用户',
 *     data: { userType: 'normal', isActive: true },
 *      // 这个tab没有配置radioGroupConfig，会使用全局的radioGroupConfig
 *   }
 * ]
 *
 * // 全局radio配置，作为默认配置
 * const radioGroupConfig = {
 *   field: 'priority',
 *   defaultValue: '2',
 *   options: [
 *     { label: '耐心', value: '1' },
 *     { label: '正常', value: '2' },
 *     { label: '快速', value: '3' }
 *   ]
 * }
 *
 * // 当切换到"活跃用户"tab且选择"快速"选项时，fetch函数会收到：
 * // { pageNum: 1, pageSize: 10, userType: 'normal', isActive: true, priority: '3' }

 * const pageUsers = async (query) => {
 *   console.log('查询参数:', query)
 *   return await api.getUsers(query)
 * }
 * </script>
 */
-->

<template>
  <view
    :class="`w-full ${customClass}`"
    :style="`${background ? `background: ${background};` : ''}${customStyle}`"
  >
    <!-- Tabs 区域 - 手动实现粘性定位 -->
    <view
      v-if="showTabs"
      :class="{ 'sticky z-90': tabsFixed }"
      :style="tabsStickyStyle"
    >
      <wd-tabs
        v-model="currentTabIndex"
        :items="tabs"
        :sticky="false"
        @change="handleTabChange"
      />
    </view>

    <!-- Radio Group 区域 - 支持水平滚动 -->
    <view
      v-if="showRadioGroup"
      class="border-b border-gray-100 bg-white"
      :class="{ 'sticky z-80': tabsFixed || radioGroupSticky }"
      :style="radioGroupStickyStyle"
    >
      <view class="px-4 py-3">
        <!-- 水平滚动容器 -->
        <scroll-view
          :scroll-x="shouldRadioScroll"
          scroll-with-animation
          :scroll-left="radioScrollLeft"
          :show-scrollbar="false"
          class="radio-scroll-container"
        >
          <view class="radio-scroll-content">
            <wd-radio-group
              v-model="currentRadioValue"
              inline
              shape="button"
              size="small"
              :options="getCurrentRadioGroupConfig.options"
              item-width="auto"
              @change="handleRadioChange"
            />
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 搜索区域 -->
    <view
      v-if="showSearch"
      class="border-b border-gray-100 bg-white"
      :class="{ 'sticky z-70': searchSticky }"
      :style="searchStickyStyle"
    >
      <wd-search
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        clearable
        :hide-cancel="!showTotal"
        @search="handleSearch"
        @change="handleSearchChange"
        @clear="handleSearchClear"
      >
        <template v-if="showTotal && currentPageData.total > 0" #suffix>
          <view class="bg-white px-4 text-xs text-gray-600">
            共{{ currentPageData.total }}条记录
          </view>
        </template>
      </wd-search>
    </view>

    <!-- 列表内容区域 -->
    <view class="w-full">
      <!-- 统一的flex布局容器 - 无论是否有数据都使用同一个布局 -->
      <view class="w-full flex flex-wrap">
        <!-- 数据项容器 - 只有当有数据时才渲染 -->
        <template v-if="currentPageData.records.length > 0">
          <!--
            🔴 key 必须用 itemIndex，不能用 item.id：
            uni-app 在小程序端把「v-for 中的作用域插槽」编译成
              父：<view wx:for wx:key="下标" slot="item-{下标}">
              子：<block wx:for wx:key="本 key"><slot name="item-{下标}"/></block>
            slot 名两边都按「渲染下标」生成。若这里改用 item.id 做 key，
            父按下标复用节点、子按 id 销毁重建 outlet，两边节点复用策略不同步，
            列表长度变化（切 tab 回来 / 搜索 / 刷新）时就会出现
            「数据 N 条、父侧 N 个 slot 节点，实际只渲染出 M 条」的错位丢失。
          -->
          <block v-for="(item, itemIndex) in displayRecords" :key="itemIndex">
            <slot
              name="item"
              :item="item"
              :index="itemIndex"
              :current-tab="currentTabIndex"
              :current-tab-data="currentTabData"
              :current-radio-value="currentRadioValue"
              :current-radio-data="currentRadioData"
            >
              <view class="w-full">
                <view class="rounded-lg bg-white p-4 shadow-sm">
                  <text>{{ JSON.stringify(item) }}</text>
                </view>
              </view>
            </slot>
          </block>
        </template>

        <!-- 数据项后的插槽 - 在所有情况下都显示，包括空状态 -->
        <slot
          name="after-items"
          :current-tab="currentTabIndex"
          :current-tab-data="currentTabData"
          :current-radio-value="currentRadioValue"
          :current-radio-data="currentRadioData"
          :current-page-data="currentPageData"
          :display-records="displayRecords"
        />
      </view>

      <!-- 空数据状态提示 - 只在没有数据且不在加载中时显示 -->
      <view
        v-if="currentPageData.records.length === 0 && !loading && !firstLoading"
        class="flex items-center justify-center"
        :style="{ minHeight: emptyMinHeight }"
      >
        <slot
          name="empty"
          :current-tab="currentTabIndex"
          :current-tab-data="currentTabData"
          :current-radio-value="currentRadioValue"
          :current-radio-data="currentRadioData"
        >
          <wd-status-tip :image="emptyImage" :tip="emptyText" />
        </slot>
      </view>

      <!-- 加载提示 -->
      <view
        v-if="currentPageData.records.length > 0"
        class="flex items-center justify-center pb-6 pt-2 text-sm"
      >
        <wd-loading v-if="loading" :text="loadingText" size="16px" />
        <text v-else-if="isReachEnd" class="text-gray-400">
          {{ finishedText }}
        </text>
        <text v-else-if="!disabledAutoLoad" class="text-gray-500">
          {{ loadMoreText }}
        </text>
        <text v-else class="text-gray-400">
          {{ maxRecordsReachedText }}
        </text>
      </view>

      <!-- 加载更多触发器 - 只有在启用自动加载且未到达限制时才显示 -->
      <view v-if="shouldShowLoadMoreTrigger" class="load-more-trigger h-1 w-full" />

      <!-- 手动加载更多按钮 - 当禁用自动加载但还有更多数据时显示 -->
      <view v-if="shouldShowManualLoadButton" class="flex items-center justify-center py-4">
        <wd-button
          size="small"
          type="primary"
          plain
          :loading="loading"
          :disabled="loading"
          @click="loadMore"
        >
          {{ loading ? loadingText : manualLoadMoreText }}
        </wd-button>
      </view>

      <!-- 底部安全距离 -->
      <view
        v-if="currentPageData.records.length > 0"
        :style="{ height: bottomSafeArea }"
        class="w-full"
      />

      <!-- 首次加载 -->
      <view
        v-if="firstLoading"
        class="flex items-center justify-center"
        :style="{ minHeight: loadingMinHeight }"
      >
        <wd-loading :text="loadingText" />
      </view>
    </view>

    <!-- 回到顶部 scroll-top>top才会显示 页面大于1则显示 -->
    <wd-backtop v-if="showBackTop && currentPageData.current > 1" :scroll-top="1" :top="0" />
  </view>
</template>

<script setup lang="ts">
// ==================== 类型定义 ====================
import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue'
import { getCurrentInstance } from 'vue'
import type { RadioOption } from '../wd-radio-group/wd-radio-group.vue'
import { addUnit } from '../common/util'

/** Tabs配置 */
export interface PagingTabItem {
  /** 标签名称，作为唯一标识 */
  name?: string | number
  /** 标题 */
  title: string
  /** 是否禁用 */
  disabled?: boolean
  /** 徽标属性，参考 Badge 组件 */
  badgeProps?: {
    modelValue?: string | number
    max?: number
    isDot?: boolean
    right?: string
    showZero?: boolean
  }
  /** 自定义数据，会传递给查询参数 */
  data?: any
  /** 单选框选项配置 */
  radioGroupConfig?: PagingRadioGroupConfig
}

/** RadioGroup配置 */
export interface PagingRadioGroupConfig {
  /** 查询字段名，将作为查询参数的key */
  field: string
  /** 默认选中的值 */
  defaultValue?: string | number | boolean
  /** 选项列表 */
  options: RadioOption[]
  /** 是否启用水平滚动，当选项超过此数量时启用，默认为3 */
  scrollThreshold?: number
}

/**
 * 组件Props
 */
interface WdPagingProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** API请求函数，接收PageQuery参数，返回PageResult */
  fetch: (query: PageQuery) => Result<PageResult<any>>
  /** 查询参数，会合并到PageQuery中 */
  params?: Record<string, any>
  /** 是否自动加载 */
  auto?: boolean
  /** 每页大小 */
  pageSize?: number

  /** 是否禁用自动分页加载 */
  disabledAutoLoad?: boolean
  /** 最大记录数限制，0表示无限制 */
  maxRecords?: number
  /** 是否显示手动加载更多按钮（当禁用自动加载时） */
  showManualLoadButton?: boolean

  /** 是否显示搜索 */
  showSearch?: boolean
  /** 搜索占位符 */
  searchPlaceholder?: string
  /** 搜索框是否粘性定位 */
  searchSticky?: boolean

  /** Tabs 配置 */
  tabs?: PagingTabItem[]
  /** 默认选中的 Tab */
  defaultTab?: number | string
  /** 是否固定Tab */
  tabsFixed?: boolean

  /** 全局RadioGroup 配置，作为默认配置，tab内的radioGroupConfig优先级更高 */
  radioGroupConfig?: PagingRadioGroupConfig
  /** RadioGroup 是否粘性定位（独立于 tabsFixed） */
  radioGroupSticky?: boolean

  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否显示回顶部 */
  showBackTop?: boolean

  /** 背景色 */
  background?: string
  /** 底部安全距离 */
  bottomSafeArea?: string
  /** 空数据区域最小高度 */
  emptyMinHeight?: string
  /** 加载区域最小高度 */
  loadingMinHeight?: string

  /** 加载文本 */
  loadingText?: string
  /** 加载更多文本 */
  loadMoreText?: string
  /** 手动加载更多文本 */
  manualLoadMoreText?: string
  /** 完成文本 */
  finishedText?: string
  /** 达到最大记录数限制文本 */
  maxRecordsReachedText?: string
  /** 空数据文本 */
  emptyText?: string
  /** 空数据图片类型 */
  emptyImage?: string

  /** 导航栏高度（px），用于粘性定位的偏移量 */
  navbarHeight?: number
  /** Tabs 高度（px），用于计算其他元素的粘性定位偏移量 */
  tabsHeight?: number
  /** RadioGroup 高度（px），用于计算搜索框的粘性定位偏移量 */
  radioGroupHeight?: number
}

/**
 * 组件事件
 */
interface WdPagingEmits {
  load: [data: PageResult<any>, tabIndex?: number]
  search: [keyword: string]
  'tab-change': [event: { index: number; name: string | number; tab: PagingTabItem }]
  'radio-change': [
    event: {
      value: string | number | boolean
      option: RadioOption
      field: string
      tabIndex: number
    },
  ]
  error: [error: Error]
  'manual-load-more': [event: { currentRecords: number; maxRecords: number }]
}

/**
 * Paging 组件暴露的方法接口
 */
interface WdPagingExpose {
  /** 刷新数据 */
  refresh: () => Promise<void>
  /** 加载更多数据 */
  loadMore: () => Promise<void>
  /** 滚动到顶部 */
  scrollToTop: () => void
  /** 切换到指定Tab */
  switchTab: (nameOrIndex: string | number) => void
  /** 切换到指定Radio选项 */
  switchRadio: (value: string | number | boolean) => void
  /** 滚动Radio到可视区域 */
  scrollRadioIntoView: () => Promise<void>

  /** 清空所有数据，重置到初始状态 */
  clearAllData: () => void
  /** 清空指定tab的数据 */
  clearTabData: (tabIndex?: number) => void
  /** 清空指定tab+radio组合的数据 */
  clearTabRadioData: (tabIndex?: number, radioValue?: string | number | boolean) => void

  /** 当前分页数据 */
  pageData: ComputedRef<PageResult<any>>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 当前Tab索引 */
  currentTabIndex: Ref<number>
  /** 当前Tab数据 */
  currentTabData: ComputedRef<PagingTabItem | null>
  /** 当前Radio值 */
  currentRadioValue: ComputedRef<string | number | boolean>
  /** 当前Radio数据 */
  currentRadioData: ComputedRef<RadioOption | null>
  /** 是否可以加载更多 */
  canLoadMore: () => boolean
  /** 是否到达结束状态 */
  isReachEnd: ComputedRef<boolean>
  /** 实际显示的记录 */
  displayRecords: ComputedRef<any[]>
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<WdPagingProps>(), {
  customStyle: '',
  customClass: '',
  params: () => ({}),
  auto: true,
  pageSize: 10,

  disabledAutoLoad: false,
  maxRecords: 0,
  showManualLoadButton: false,

  showSearch: false,
  searchPlaceholder: '请输入搜索关键词',
  searchSticky: false,

  tabs: () => [],
  defaultTab: 0,
  tabsFixed: false,

  radioGroupConfig: undefined,

  showTotal: false,
  showBackTop: true,

  background: '',
  bottomSafeArea: '72rpx',
  emptyMinHeight: '600rpx',
  loadingMinHeight: '600rpx',

  loadingText: '加载中...',
  loadMoreText: '上拉加载更多',
  manualLoadMoreText: '点击加载更多',
  finishedText: '没有更多了',
  maxRecordsReachedText: '已显示全部数据',
  emptyText: '暂无数据',
  emptyImage: 'content',

  navbarHeight: 0,
  tabsHeight: 48,
  radioGroupHeight: 60,
})

const emit = defineEmits<WdPagingEmits>()

const { proxy } = getCurrentInstance() as any

// ==================== 响应式数据 ====================
/**
 * 实际生效的每页条数
 * 外部通过 :params 传入的 pageSize 优先，其次才是组件的 pageSize prop。
 * 修复前 buildQuery 用 props.pageSize 无条件覆盖，导致 :params="{ pageSize: 20 }" 静默失效。
 */
const effectivePageSize = computed<number>(() => Number(props.params?.pageSize) || props.pageSize)

/** 分页数据映射 - 每个 tab+radio组合 独立维护数据 */
const tabDataMap = ref<Map<string, PageResult<any>>>(new Map())

/** 创建一个空的分页结果 */
const createEmptyPageResult = (): PageResult<any> => ({
  records: [],
  total: 0,
  pages: 0,
  current: 1,
  size: effectivePageSize.value,
  last: false,
})

/**
 * 空分页结果的稳定引用
 * 用于「该 tab 还没有数据」时的占位返回值。必须是稳定引用（computed 缓存），
 * 否则 currentPageData 每次求值都返回新对象，小程序端会被判定为数据变化而重复 setData。
 */
const emptyPageResult = computed<PageResult<any>>(() => createEmptyPageResult())

/** 无 tabs 时的分页数据 */
const pageData = ref<PageResult<any>>(createEmptyPageResult())

/**
 * 请求序号
 * 每发起一次请求就自增，响应回来时比对；不相等说明期间已切换 tab/radio 或重新搜索，
 * 该响应已过期必须丢弃，否则会把 A tab 的数据写进 B tab 的数据槽。
 */
const requestSeq = ref(0)

/** 加载状态 */
const loading = ref(false)
const firstLoading = ref(false)

/** 搜索相关 */
const searchValue = ref('')

/** 当前选中的tab索引 */
const currentTabIndex = ref(0)

/** 当前选中的radio值 - 每个tab独立维护 */
const tabRadioValues = ref<Map<string | number, string | number | boolean>>(new Map())

/** 交叉观察器 */
const intersectionObserver = ref(null)

/** Radio 滚动相关 */
const radioScrollLeft = ref(0)

// ==================== 计算属性 ====================
const showTabs = computed(() => props.tabs && props.tabs.length > 0)

/** 当前tab数据 */
const currentTabData = computed<PagingTabItem>(() => {
  if (!showTabs.value) return null

  const currentValue = currentTabIndex.value

  let tabIndex: number

  // 如果是字符串，查找对应的索引
  if (typeof currentValue === 'string') {
    tabIndex = props.tabs.findIndex((tab) => tab.name === currentValue)

    // 如果找不到，默认为0
    if (tabIndex === -1) {
      tabIndex = 0
    }
  } else {
    // 如果是数字，直接使用
    tabIndex = currentValue
  }

  // 确保索引在有效范围内
  tabIndex = Math.max(0, Math.min(tabIndex, props.tabs.length - 1))

  return props.tabs[tabIndex] || null
})

/**
 * 获取当前tab的radio配置
 * 优先使用tab内的radioGroupConfig，其次使用全局radioGroupConfig
 */
const getCurrentRadioGroupConfig = computed<PagingRadioGroupConfig | null>(() => {
  // 优先使用当前tab的radioGroupConfig
  if (currentTabData.value?.radioGroupConfig) {
    return currentTabData.value.radioGroupConfig
  }

  // 其次使用全局radioGroupConfig
  if (props.radioGroupConfig) {
    return props.radioGroupConfig
  }

  return null
})

const showRadioGroup = computed(() => {
  const radioGroupConfig = getCurrentRadioGroupConfig.value
  return radioGroupConfig && radioGroupConfig.options && radioGroupConfig.options.length > 0
})

/**
 * 判断是否需要启用 Radio 水平滚动
 */
const shouldRadioScroll = computed(() => {
  const radioGroupConfig = getCurrentRadioGroupConfig.value
  if (!radioGroupConfig) return false

  const threshold = radioGroupConfig.scrollThreshold || 3
  return radioGroupConfig.options.length > threshold
})

/** 当前选中的radio值 */
const currentRadioValue = computed(() => {
  if (!showRadioGroup.value) return ''

  let key: string | number

  if (showTabs.value) {
    const tab = currentTabData.value
    key = tab?.name ?? currentTabIndex.value

    // 如果当前tab有独立的radio配置，使用tab的key
    if (tab?.radioGroupConfig) {
      return tabRadioValues.value.get(key) || ''
    }
  }

  // 如果当前tab没有独立配置，但有全局配置，使用全局key
  if (props.radioGroupConfig) {
    return tabRadioValues.value.get('global') || ''
  }

  return ''
})

/** 当前radio数据 */
const currentRadioData = computed<RadioOption | null>(() => {
  if (!showRadioGroup.value) return null

  const radioGroupConfig = getCurrentRadioGroupConfig.value
  if (!radioGroupConfig) return null

  return radioGroupConfig.options.find((option) => option.value === currentRadioValue.value) || null
})

/**
 * Tabs粘性定位样式
 */
const tabsStickyStyle = computed(() => {
  if (!props.tabsFixed) return {}

  return {
    top: addUnit(props.navbarHeight),
    backgroundColor: '#fff',
    zIndex: 90,
  }
})

/**
 * RadioGroup粘性定位样式
 */
const radioGroupStickyStyle = computed(() => {
  // 如果既不是tabs固定模式也不是独立的radio固定模式，则不需要粘性定位
  if (!props.tabsFixed && !props.radioGroupSticky) return {}

  let topOffset = props.navbarHeight

  // 如果有固定的tabs，需要加上tabs的高度
  if (props.tabsFixed && showTabs.value) {
    topOffset += props.tabsHeight
  }

  return {
    top: addUnit(topOffset),
    backgroundColor: '#fff',
    zIndex: 80,
  }
})

/**
 * 搜索框粘性定位样式
 */
const searchStickyStyle = computed(() => {
  if (!props.searchSticky) return {}

  let topOffset = props.navbarHeight

  // 如果有固定的tabs，需要加上tabs的高度
  if (props.tabsFixed && showTabs.value) {
    topOffset += props.tabsHeight
  }

  // 如果有固定的radio group，需要加上radio group的高度
  if ((props.tabsFixed || props.radioGroupSticky) && showRadioGroup.value) {
    topOffset += props.radioGroupHeight
  }

  return {
    top: addUnit(topOffset),
    backgroundColor: '#fff',
    zIndex: 70,
  }
})

/**
 * 生成数据缓存的唯一key
 * 格式：tab-{tabIndex}-radio-{radioValue}
 */
const getDataKey = (tabIndex?: number, radioValue?: string | number | boolean): string => {
  const tab = tabIndex !== undefined ? tabIndex : currentTabIndex.value
  const radio = radioValue !== undefined ? radioValue : currentRadioValue.value

  let key = ''

  if (showTabs.value) {
    const tabData = props.tabs[tab]
    const tabKey = tabData?.name ?? tab
    key += `tab-${tabKey}`
  } else {
    key += 'no-tab'
  }

  // 检查是否有radio配置（tab内的或全局的）
  const tabData = showTabs.value ? props.tabs[tab] : null
  const hasRadio = tabData?.radioGroupConfig || props.radioGroupConfig
  if (hasRadio) {
    key += `-radio-${radio}`
  }

  return key
}

/**
 * 获取指定条件的数据（只读，不产生任何副作用）
 *
 * 🔴 这里绝对不能往 tabDataMap 里写空数据占位：
 * 本函数被 currentPageData 这个 computed 调用，在 computed 求值过程中修改自身依赖，
 * 会让 computed 立刻自我失效并额外触发一轮渲染。小程序端 setData 是异步批量的，
 * 多余的渲染轮次会造成父子组件插槽数据不同步。
 * map 里没有 key 就等于「这个 tab 还没数据」，无需预先占位。
 */
const getTabData = (tabIndex?: number, radioValue?: string | number | boolean): PageResult<any> => {
  const tab = tabIndex !== undefined ? tabIndex : currentTabIndex.value
  const tabData = showTabs.value ? props.tabs[tab] : null

  // 检查是否有radio配置（tab内的或全局的）
  const hasRadio = tabData?.radioGroupConfig || props.radioGroupConfig

  // 如果没有tabs且没有radio配置，使用原来的单一数据
  if (!showTabs.value && !hasRadio) return pageData.value

  const key = getDataKey(tabIndex, radioValue)

  return tabDataMap.value.get(key) ?? emptyPageResult.value
}

const currentPageData = computed(() => {
  const tab = currentTabIndex.value
  const tabData = showTabs.value ? props.tabs[tab] : null

  // 检查是否有radio配置（tab内的或全局的）
  const hasRadio = tabData?.radioGroupConfig || props.radioGroupConfig

  if (!showTabs.value && !hasRadio) return pageData.value
  return getTabData()
})

/**
 * 实际显示的记录（受maxRecords限制）
 */
const displayRecords = computed(() => {
  const records = currentPageData.value.records
  if (props.maxRecords <= 0) return records
  return records.slice(0, props.maxRecords)
})

/**
 * 是否到达结束状态（所有数据已加载完毕或达到最大记录数限制）
 */
const isReachEnd = computed(() => {
  // 后端数据已经全部加载完毕
  if (currentPageData.value.last) return true

  // 或者达到了最大记录数限制
  if (props.maxRecords > 0 && currentPageData.value.records.length >= props.maxRecords) return true

  return false
})

/**
 * 是否应该显示加载更多触发器
 */
const shouldShowLoadMoreTrigger = computed(() => {
  // 没有数据时不显示
  if (currentPageData.value.records.length === 0) return false

  // 禁用自动加载时不显示
  if (props.disabledAutoLoad) return false

  // 已到达结束状态时不显示
  if (isReachEnd.value) return false

  return true
})

/**
 * 是否应该显示手动加载更多按钮
 */
const shouldShowManualLoadButton = computed(() => {
  // 没有开启手动加载按钮功能
  if (!props.showManualLoadButton) return false

  // 没有数据时不显示
  if (currentPageData.value.records.length === 0) return false

  // 未禁用自动加载时不显示
  if (!props.disabledAutoLoad) return false

  // 已到达结束状态时不显示
  if (isReachEnd.value) return false

  return true
})

// ==================== 核心方法 ====================

/**
 * 初始化默认选中的 Tab
 */
const initDefaultTab = () => {
  if (!showTabs.value) return

  if (typeof props.defaultTab === 'string') {
    const index = props.tabs.findIndex((tab) => tab.name === props.defaultTab)
    currentTabIndex.value = index >= 0 ? index : 0
  } else {
    currentTabIndex.value = Math.min(props.defaultTab, props.tabs.length - 1)
  }
}

/**
 * 初始化默认选中的 Radio
 */
const initDefaultRadio = () => {
  // 如果有全局radio配置，先设置全局默认值
  if (props.radioGroupConfig) {
    const globalKey = 'global'
    let defaultValue: string | number | boolean = ''
    if (props.radioGroupConfig.defaultValue !== undefined) {
      defaultValue = props.radioGroupConfig.defaultValue
    } else if (props.radioGroupConfig.options.length > 0) {
      defaultValue = props.radioGroupConfig.options[0].value
    }
    tabRadioValues.value.set(globalKey, defaultValue)
  }

  // 如果有tabs，为每个有radio配置的tab初始化默认值
  if (showTabs.value) {
    props.tabs.forEach((tab, index) => {
      if (tab.radioGroupConfig) {
        const key = tab.name ?? index

        let defaultValue: string | number | boolean = ''
        if (tab.radioGroupConfig.defaultValue !== undefined) {
          defaultValue = tab.radioGroupConfig.defaultValue
        } else if (tab.radioGroupConfig.options.length > 0) {
          defaultValue = tab.radioGroupConfig.options[0].value
        }

        tabRadioValues.value.set(key, defaultValue)
      }
    })
  }
}

/**
 * 销毁交叉观察器
 */
const destroyIntersectionObserver = () => {
  if (intersectionObserver.value) {
    try {
      intersectionObserver.value.disconnect()
    } catch (error) {
      console.error('WdPaging: 销毁交叉观察器失败', error)
    }
    intersectionObserver.value = null
  }
}

/**
 * 清空所有数据，重置到初始状态
 * 这会清空所有tab+radio组合的缓存数据，让组件回到未访问过的状态
 */
const clearAllData = (): void => {
  // 清空所有tab数据映射
  tabDataMap.value.clear()

  // 重置单一数据
  pageData.value = createEmptyPageResult()

  // 作废飞行中的请求，避免清空之后旧响应又把数据写回来
  requestSeq.value++

  // 重置加载状态
  loading.value = false
  firstLoading.value = false

  // 销毁交叉观察器
  destroyIntersectionObserver()
}

/**
 * 清空指定tab的数据
 * @param tabIndex 要清空的tab索引，不传则清空当前tab
 */
const clearTabData = (tabIndex?: number): void => {
  const tab = tabIndex !== undefined ? tabIndex : currentTabIndex.value
  const tabData = showTabs.value ? props.tabs[tab] : null

  // 如果没有tabs且没有radio配置，清空单一数据
  if (!showTabs.value && !props.radioGroupConfig) {
    pageData.value = createEmptyPageResult()
    return
  }

  // 清空该tab相关的所有radio组合数据
  if (showTabs.value) {
    const tabName = tabData?.name ?? tab
    const keysToDelete: string[] = []

    // 找出所有包含该tab的key
    tabDataMap.value.forEach((_, key) => {
      if (key.startsWith(`tab-${tabName}`)) {
        keysToDelete.push(key)
      }
    })

    // 删除相关数据
    keysToDelete.forEach((key) => {
      tabDataMap.value.delete(key)
    })
  } else {
    // 没有tabs，但有全局radio配置时，清空所有radio组合
    tabDataMap.value.clear()
  }
}

/**
 * 清空指定tab+radio组合的数据
 * @param tabIndex tab索引
 * @param radioValue radio值
 */
const clearTabRadioData = (tabIndex?: number, radioValue?: string | number | boolean): void => {
  const key = getDataKey(tabIndex, radioValue)
  tabDataMap.value.delete(key)
}

/**
 * 滚动到选中的 Radio 选项，确保其完全可见
 * 参考 wd-tabs 组件的 scrollIntoView 逻辑
 */
const scrollRadioIntoView = async () => {
  if (!shouldRadioScroll.value || !showRadioGroup.value) return

  try {
    // 延迟执行，确保DOM更新完成
    await new Promise((resolve) => setTimeout(resolve, 100))

    const radioGroupConfig = getCurrentRadioGroupConfig.value
    if (!radioGroupConfig) return

    // 查找当前选中的radio选项索引
    const currentIndex = radioGroupConfig.options.findIndex(
      (option) => option.value === currentRadioValue.value,
    )

    if (currentIndex === -1) return

    // 使用Promise封装查询操作
    const getRect = (selector: string, all = false): Promise<any> => {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(proxy)
        const operation = all ? query.selectAll(selector) : query.select(selector)
        operation
          .boundingClientRect((result) => {
            resolve(result)
          })
          .exec()
      })
    }

    // 查询滚动容器
    const containerRect = await getRect('.radio-scroll-container')

    // 查询所有radio选项
    const radioRects = await getRect('.radio-scroll-content .wd-radio', true)

    if (!containerRect || !radioRects || currentIndex >= radioRects.length) {
      console.log('WdPaging: 查询元素失败', { containerRect, radioRects, currentIndex })
      return
    }

    const selectedRect = radioRects[currentIndex]
    if (!selectedRect) return

    // 计算所有选项的累计宽度和间距
    let totalContentWidth = 0
    let offsetLeft = 0

    for (let i = 0; i < radioRects.length; i++) {
      if (i < currentIndex) {
        offsetLeft += radioRects[i].width
        if (i < radioRects.length - 1) offsetLeft += 12 // gap间距
      }
      totalContentWidth += radioRects[i].width
      if (i < radioRects.length - 1) totalContentWidth += 12 // gap间距
    }

    let scrollLeft = 0
    const containerWidth = containerRect.width
    const selectedWidth = selectedRect.width

    // 计算选中元素右边界相对于容器的位置
    const selectedRightEdge = offsetLeft + selectedWidth

    console.log('WdPaging: 滚动计算', {
      currentIndex,
      totalOptions: radioRects.length,
      offsetLeft,
      selectedWidth,
      selectedRightEdge,
      containerWidth,
      totalContentWidth,
    })

    // 判断滚动策略
    if (selectedRightEdge > containerWidth) {
      // 如果选中项会超出右边界，需要向右滚动
      if (currentIndex >= radioRects.length - 2) {
        // 最后两个选项：滚动到最右侧
        scrollLeft = Math.max(0, totalContentWidth - containerWidth + 40) // 40rpx余量
      } else {
        // 其他情况：让选中项的右边缘距离容器右边缘有一定余量
        scrollLeft = selectedRightEdge - containerWidth + 60 // 60rpx余量
      }
    } else if (offsetLeft < radioScrollLeft.value) {
      // 如果选中项在当前可视区域左侧，需要向左滚动
      scrollLeft = Math.max(0, offsetLeft - 60) // 60rpx余量
    } else {
      // 选中项在可视区域内，可能不需要滚动
      // 但如果是手动点击，仍然居中显示
      scrollLeft = Math.max(0, offsetLeft - (containerWidth - selectedWidth) / 2)
    }

    // 确保滚动位置合理
    scrollLeft = Math.max(0, Math.min(scrollLeft, totalContentWidth - containerWidth + 40))

    // 添加小幅随机值避免相同值不触发滚动
    if (Math.abs(radioScrollLeft.value - scrollLeft) < 1) {
      scrollLeft += Math.random() * 0.1
    }

    console.log('WdPaging: 最终滚动位置', {
      oldScrollLeft: radioScrollLeft.value,
      newScrollLeft: scrollLeft,
      diff: scrollLeft - radioScrollLeft.value,
    })

    // 更新滚动位置
    radioScrollLeft.value = scrollLeft
  } catch (error) {
    console.error('WdPaging: Radio scrollIntoView failed', error)
  }
}

/**
 * 构建查询参数
 *
 * 查询逻辑说明：
 * 1. 基础参数：pageNum, pageSize, 外部传入的params
 * 2. 搜索参数：如果有搜索值，添加searchValue
 * 3. Tab参数：直接合并tab.data中的自定义数据到查询参数
 * 4. Radio参数：使用radio配置的field作为key，当前选中的value作为值
 *
 * 示例：
 * radioGroupConfig: { field: 'priority', options: [...] }
 * 当前选中radio值为'3'时，查询参数会添加：{ priority: '3' }
 *
 * tabs: [
 *   { name: 'all', title: '全部订单', data: {} },
 *   { name: 'pending', title: '待付款', data: { status: 'pending' } },
 *   { name: 'urgent', title: '紧急订单', data: { status: 'pending', priority: 'high' } }
 * ]
 *
 * 当切换到"紧急订单"tab时，查询参数：
 * { pageNum: 1, pageSize: 10, status: 'pending', priority: 'high' }
 */
const buildQuery = (pageNum = 1): PageQuery => {
  const query: any = {
    ...props.params,
    pageNum,
    // 外部 params 里显式写的 pageSize 优先，其次才是组件的 pageSize prop
    pageSize: effectivePageSize.value,
  }

  if (searchValue.value) {
    query.searchValue = searchValue.value
  }

  // 添加当前选中的 tab 数据
  if (currentTabData.value?.data) {
    Object.assign(query, currentTabData.value.data)
  }

  // 添加当前选中的 radio 数据
  if (
    showRadioGroup.value &&
    currentRadioValue.value !== undefined &&
    currentRadioValue.value !== ''
  ) {
    const radioGroupConfig = getCurrentRadioGroupConfig.value
    if (radioGroupConfig) {
      query[radioGroupConfig.field] = currentRadioValue.value
    }
  }

  return query
}

const scrollToTop = (): void => {
  // 使用uni.pageScrollTo实现页面滚动到顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
}

/**
 * 检查是否应该创建观察器
 */
const shouldCreateObserver = () => {
  // 如果禁用了自动加载，不需要观察器
  if (props.disabledAutoLoad) {
    return false
  }

  // 如果没有数据，不需要观察器
  if (currentPageData.value.records.length === 0) {
    return false
  }

  // 如果已到达结束状态，不需要观察器
  if (isReachEnd.value) {
    return false
  }

  // 如果正在加载中，不需要观察器
  if (loading.value) {
    return false
  }

  return true
}

/**
 * 创建交叉观察器
 */
const createObserver = () => {
  try {
    intersectionObserver.value = uni
      .createIntersectionObserver(proxy)
      .relativeToViewport({ bottom: 100 }) // 距离视口底部100px时触发
      .observe('.load-more-trigger', (res) => {
        // 当加载触发器进入视口时，且不在加载中，且还有更多数据，且未禁用自动加载
        if (
          res.intersectionRatio > 0 &&
          !loading.value &&
          !isReachEnd.value &&
          !props.disabledAutoLoad
        ) {
          loadMore()
        }
      })
  } catch (error) {
    console.error('WdPaging: 创建交叉观察器失败', error)
  }
}

/**
 * 初始化加载更多的交叉观察器
 */
const initIntersectionObserver = async () => {
  // 销毁之前的观察器
  destroyIntersectionObserver()

  // 检查是否需要创建观察器
  if (!shouldCreateObserver()) {
    return
  }

  // 延迟一下确保DOM渲染完成，并检查元素是否存在
  setTimeout(() => {
    // 再次检查是否需要创建观察器（因为数据可能在延迟期间发生变化）
    if (!shouldCreateObserver()) {
      return
    }
    createObserver()
  }, 100)
}

/**
 * 检查是否可以继续加载
 */
const canLoadMore = (): boolean => {
  // 如果正在加载中，不能加载
  if (loading.value) return false

  // 如果后端数据已经全部加载完毕，不能加载
  if (currentPageData.value.last) return false

  // 如果设置了最大记录数限制且已达到限制，不能加载
  if (props.maxRecords > 0 && currentPageData.value.records.length >= props.maxRecords) return false

  return true
}

/** 休眠 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取数据
 *
 * 🔴 竞态处理（切 tab / 连续搜索时必须保证数据不串槽、不丢请求）：
 * 1. 进入时自增 requestSeq，每个 await 之后都比对序号，过期响应直接丢弃 —— 修复前
 *    目标 key 是在 await 之后才求值的，请求飞行中切 tab 会把 A 的数据写进 B 的数据槽；
 * 2. 查询参数、目标数据槽 key、追加基准三者在同一时刻快照，保证写回时严格对应；
 * 3. 不再用 `if (loading.value) return` 静默吞掉新请求 —— 那会让切过去的 tab 永远空白。
 *    只有「加载更多」仍需串行，避免同一页被重复追加。
 *
 * @param pageNum    请求页码，1 表示首屏/刷新
 * @param isLoadMore true=追加到已有数据尾部，false=整页替换
 */
const fetchData = async (pageNum = 1, isLoadMore = false): Promise<void> => {
  // 加载更多必须串行；首屏/刷新则允许后发请求取代先发请求
  if (isLoadMore && loading.value) return

  const seq = ++requestSeq.value

  try {
    loading.value = true
    if (pageNum === 1 && !isLoadMore) {
      firstLoading.value = true
    }

    // 休眠100毫秒，防止调用了旧的参数和fetch函数
    await sleep(100)
    // sleep 期间已被更新的请求取代
    if (seq !== requestSeq.value) return

    // 与 query 同一时刻快照目标数据槽，避免 await 期间切 tab 导致写错位置
    const query = buildQuery(pageNum)
    const targetKey = getDataKey()
    const targetTab = currentTabIndex.value
    const targetTabData = showTabs.value ? props.tabs[targetTab] : null
    const useTabDataMap =
      showTabs.value || !!(targetTabData?.radioGroupConfig || props.radioGroupConfig)
    // 追加模式的基准数据也必须此刻取，否则可能拼上别的 tab 的记录
    const baseRecords = isLoadMore ? currentPageData.value.records : []

    const [error, result] = await props.fetch(query)

    // 响应回来时若 tab/radio/搜索词已变，本次响应作废
    if (seq !== requestSeq.value) return

    if (error) {
      throw error
    }

    if (!result) {
      throw new Error('接口返回数据为空')
    }

    // 加载更多拼接数据，首次/刷新整页替换
    let newRecords = isLoadMore ? [...baseRecords, ...result.records] : result.records

    // 如果设置了最大记录数限制，截取数据
    if (props.maxRecords > 0 && newRecords.length > props.maxRecords) {
      newRecords = newRecords.slice(0, props.maxRecords)
    }

    const newData = {
      ...result,
      records: newRecords,
    }

    if (useTabDataMap) {
      tabDataMap.value.set(targetKey, newData)
    } else {
      pageData.value = newData
    }

    // 数据加载完成后回到顶部
    if (!isLoadMore && pageNum === 1) {
      scrollToTop()
    }

    emit('load', result, showTabs.value ? targetTab : undefined)

    // 数据加载完成后，重新初始化观察器
    if (pageNum === 1) {
      await nextTick()
      // 延迟初始化，确保DOM渲染完成
      setTimeout(() => {
        if (seq !== requestSeq.value) return
        initIntersectionObserver()
      }, 1000)
    }
  } catch (error) {
    console.error('WdPaging: 数据加载失败', error)
    emit('error', error as Error)
  } finally {
    // 只有最新一次请求才有资格复位 loading，否则过期请求会把进行中的加载提前关掉
    if (seq === requestSeq.value) {
      loading.value = false
      firstLoading.value = false
    }
  }
}

/**
 * 刷新数据
 */
const refresh = async (): Promise<void> => {
  await fetchData(1, false)
}

/**
 * 加载更多 需要改为function声明
 */
async function loadMore(): Promise<void> {
  if (!canLoadMore()) return

  const nextPage = currentPageData.value.current + 1

  // 发送手动加载更多事件
  if (props.disabledAutoLoad) {
    emit('manual-load-more', {
      currentRecords: currentPageData.value.records.length,
      maxRecords: props.maxRecords,
    })
  }

  await fetchData(nextPage, true)
}

// ==================== Tabs 方法 ====================
/**
 * Tab 变化处理
 */
const handleTabChange = async ({ index, name }): Promise<void> => {
  const previousIndex = currentTabIndex.value
  currentTabIndex.value = index
  const tab = props.tabs[index]
  const event = {
    index,
    name,
    tab,
  }

  emit('tab-change', event)

  // Tab切换后，需要重新滚动到选中的radio选项
  setTimeout(() => {
    scrollRadioIntoView()
  }, 200)

  // tab切换后，检查当前tab+radio组合是否有数据
  const currentData = getTabData()
  if (currentData.records.length === 0) {
    // 没有数据时先加载数据，数据加载完成后会在fetchData中重新初始化观察器
    // 🔴 这里不能再用 !loading.value 拦截：上一个 tab 的请求还在飞时，
    // 新 tab 会被静默跳过而永远空白。并发已由 fetchData 内部的 requestSeq 处理。
    fetchData(1, false)
  } else {
    // 如果已有数据，延迟重新初始化观察器，确保DOM更新完成
    nextTick(() => {
      // 再次延迟，确保切换动画完成
      setTimeout(() => {
        initIntersectionObserver()
      }, 1000)
    })
  }
}

const switchTab = (nameOrIndex: string | number): void => {
  if (typeof nameOrIndex === 'string') {
    const index = props.tabs.findIndex((tab) => tab.name === nameOrIndex)
    currentTabIndex.value = index >= 0 ? index : 0
  } else {
    currentTabIndex.value = Math.min(nameOrIndex, props.tabs.length - 1)
  }
}

// ==================== Radio 方法 ====================
/**
 * Radio 变化处理
 */
const handleRadioChange = async (value: string | number | boolean): Promise<void> => {
  let key: string | number

  if (showTabs.value) {
    const tab = currentTabData.value
    key = tab?.name ?? currentTabIndex.value

    // 如果当前tab有独立的radio配置，使用tab的key
    if (tab?.radioGroupConfig) {
      tabRadioValues.value.set(key, value)
    } else if (props.radioGroupConfig) {
      // 如果当前tab没有独立配置，但有全局配置，使用全局key
      tabRadioValues.value.set('global', value)
    }
  } else {
    // 没有tabs，使用全局配置
    tabRadioValues.value.set('global', value)
  }

  const radioGroupConfig = getCurrentRadioGroupConfig.value
  const option = radioGroupConfig?.options.find((opt) => opt.value === value)
  const event = {
    value,
    option: option!,
    field: radioGroupConfig?.field || '',
    tabIndex: currentTabIndex.value,
  }

  emit('radio-change', event)

  // Radio选择后，滚动到可视区域
  setTimeout(() => {
    scrollRadioIntoView()
  }, 150)

  // radio切换后一律重新拉第一页（有无缓存都要刷新），并发由 fetchData 内部的 requestSeq 处理
  fetchData(1, false)
}

const switchRadio = (value: string | number | boolean): void => {
  let key: string | number

  if (showTabs.value) {
    const tab = currentTabData.value
    key = tab?.name ?? currentTabIndex.value

    if (tab?.radioGroupConfig) {
      tabRadioValues.value.set(key, value)
    } else if (props.radioGroupConfig) {
      tabRadioValues.value.set('global', value)
    }
  } else {
    tabRadioValues.value.set('global', value)
  }

  handleRadioChange(value)
}

// ==================== 搜索方法 ====================
const handleSearch = ({ value }): void => {
  searchValue.value = value
  emit('search', value)
  refresh()
}

const handleSearchChange = ({ value }): void => {
  searchValue.value = value
}

const handleSearchClear = (): void => {
  searchValue.value = ''
  refresh()
}

// ==================== 监听器 ====================
watch(() => props.params, refresh, { deep: true })
watch(() => props.defaultTab, initDefaultTab)
watch(() => [props.tabs, props.radioGroupConfig], initDefaultRadio, { deep: true })

// 监听radio值变化，自动滚动到可视区域
watch(
  () => currentRadioValue.value,
  () => {
    // 延迟执行，确保DOM渲染完成
    setTimeout(() => {
      scrollRadioIntoView()
    }, 150)
  },
)

// 监听禁用自动加载状态变化，重新初始化观察器
watch(
  () => props.disabledAutoLoad,
  () => {
    nextTick(() => {
      setTimeout(() => {
        initIntersectionObserver()
      }, 300)
    })
  },
)

// 监听最大记录数变化，重新初始化观察器
watch(
  () => props.maxRecords,
  () => {
    nextTick(() => {
      setTimeout(() => {
        initIntersectionObserver()
      }, 300)
    })
  },
)

// ==================== 生命周期 ====================
onMounted(async () => {
  // 初始化默认tab
  initDefaultTab()

  // 初始化默认radio
  initDefaultRadio()

  // 自动加载数据
  if (props.auto) {
    await fetchData(1)
  }

  // 初始化后滚动到选中的radio
  setTimeout(() => {
    scrollRadioIntoView()
  }, 300)
})

onUnmounted(() => {
  // 销毁交叉观察器
  destroyIntersectionObserver()
})

// ==================== 暴露方法 ====================
defineExpose<WdPagingExpose>({
  refresh,
  loadMore,
  scrollToTop,
  switchTab,
  switchRadio,
  scrollRadioIntoView,
  clearAllData,
  clearTabData,
  clearTabRadioData,
  pageData: currentPageData,
  loading,
  currentTabIndex,
  currentTabData,
  currentRadioValue,
  currentRadioData,
  canLoadMore,
  isReachEnd,
  displayRecords,
})

/** Paging 组件实例类型 */
export type PagingInstance = ComponentPublicInstance<WdPagingProps, WdPagingExpose>
</script>

<style scoped>
/* 确保粘性定位正常工作 */
.sticky {
  position: sticky;
  position: -webkit-sticky; /* Safari 兼容 */
}

/* 为粘性元素添加阴影效果，增强视觉层次 */
.sticky {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Radio 水平滚动样式 */
.radio-scroll-container {
  width: 100%;
  white-space: nowrap;
}

.radio-scroll-content {
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  padding-right: 20rpx; /* 右侧留出余量 */
}

/* 覆盖 radio-group 的换行样式 */
.radio-scroll-content :deep(.wd-radio-group) {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  white-space: nowrap;
  gap: 20rpx; /* 使用gap控制间距，更精确 */
}

/* 确保 radio 选项不换行，调整间距 */
.radio-scroll-content :deep(.wd-radio) {
  flex-shrink: 0;
  white-space: nowrap;
  margin-right: 0; /* 清除默认margin，使用gap控制 */
}

/* 按钮模式下的特殊处理 */
.radio-scroll-content :deep(.wd-radio.is-button) {
  margin-right: 0; /* 清除按钮模式默认的20rpx间距 */
  display: inline-block; /* 改为inline-block避免flex影响 */
}

/* 按钮模式下确保shape完全不占用空间 */
.radio-scroll-content :deep(.wd-radio.is-button .wd-radio__shape) {
  display: none;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  visibility: hidden;
}

/* 按钮模式下的label样式优化 */
.radio-scroll-content :deep(.wd-radio.is-button .wd-radio__label) {
  min-width: auto;
  padding: 10rpx 20rpx; /* 减少左右padding */
  margin: 0; /* 确保没有额外margin */
  display: block;
  width: 100%;
}

/* 小尺寸按钮的调整 */
.radio-scroll-content :deep(.wd-radio.is-button.is-small .wd-radio__label) {
  padding: 4rpx 12rpx; /* 小尺寸减少padding */
}

/* 大尺寸按钮的调整 */
.radio-scroll-content :deep(.wd-radio.is-button.is-large .wd-radio__label) {
  padding: 14rpx 30rpx;
}

/* 最后一个选项的样式 */
.radio-scroll-content :deep(.wd-radio:last-child) {
  margin-right: 0;
}

/* 隐藏滚动条 */
.radio-scroll-container :deep(::-webkit-scrollbar) {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
