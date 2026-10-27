<!-- Tabs 标签页 用于在不同的内容区域之间进行切换。 -->
<template>
  <template v-if="sticky">
    <wd-sticky-box>
      <view
        :class="`wd-tabs ${customClass} ${innerSlidable ? 'is-slide' : ''} ${!showScrollbar ? 'is-hide-scrollbar' : ''} ${mapNum < (isItemsMode ? items.length : children.length) && mapNum !== 0 ? 'is-map' : ''}`"
        :style="customStyle"
      >
        <wd-sticky :offset-top="offsetTop">
          <view class="wd-tabs__nav wd-tabs__nav--sticky">
            <view class="wd-tabs__nav--wrap">
              <scroll-view
                :scroll-x="innerSlidable"
                scroll-with-animation
                :scroll-left="state.scrollLeft"
                :show-scrollbar="showScrollbar"
              >
                <view class="wd-tabs__nav-container">
                  <!-- Items 模式：通过 items 数组渲染标签项 -->
                  <template v-if="isItemsMode">
                    <view
                      v-for="(item, index) in items"
                      :key="index"
                      :class="`wd-tabs__nav-item ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                      :style="
                        state.activeIndex === index
                          ? color
                            ? `color:${color}`
                            : ''
                          : inactiveColor
                            ? `color:${inactiveColor}`
                            : ''
                      "
                      @click="handleSelect(index)"
                    >
                      <wd-badge
                        v-if="item.badgeProps"
                        v-bind="item.badgeProps"
                        custom-class="wd-tabs__nav-item-badge"
                      >
                        <text class="wd-tabs__nav-item-text">
                          {{ item.title }}
                        </text>
                      </wd-badge>
                      <text v-else class="wd-tabs__nav-item-text">
                        {{ item.title }}
                      </text>
                      <view
                        v-if="state.activeIndex === index && state.useInnerLine"
                        class="wd-tabs__line wd-tabs__line--inner"
                      />
                    </view>
                  </template>

                  <!-- 子组件模式：使用 wd-tab 子组件 -->
                  <template v-else>
                    <view
                      v-for="(item, index) in children"
                      :key="`child-${index}`"
                      :class="`wd-tabs__nav-item ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                      :style="
                        state.activeIndex === index
                          ? color
                            ? `color:${color}`
                            : ''
                          : inactiveColor
                            ? `color:${inactiveColor}`
                            : ''
                      "
                      @click="handleSelect(index)"
                    >
                      <wd-badge
                        v-if="item.badgeProps"
                        v-bind="item.badgeProps"
                        custom-class="wd-tabs__nav-item-badge"
                      >
                        <text class="wd-tabs__nav-item-text">
                          {{ item.title }}
                        </text>
                      </wd-badge>
                      <text v-else class="wd-tabs__nav-item-text">
                        {{ item.title }}
                      </text>
                      <view
                        v-if="state.activeIndex === index && state.useInnerLine"
                        class="wd-tabs__line wd-tabs__line--inner"
                      />
                    </view>
                  </template>

                  <view class="wd-tabs__line" :style="state.lineStyle" />
                </view>
              </scroll-view>
            </view>
            <view
              v-if="
                mapNum < (isItemsMode ? items.length : children.length) &&
                mapNum !== 0
              "
              class="wd-tabs__map"
            >
              <view
                :class="`wd-tabs__map-btn ${state.animating ? 'is-open' : ''}`"
                @click="toggleMap"
              >
                <view :class="`wd-tabs__map-arrow ${state.animating ? 'is-open' : ''}`">
                  <wd-icon name="down" />
                </view>
              </view>
              <view
                class="wd-tabs__map-header"
                :style="`${state.mapShow ? '' : 'display:none;'} ${state.animating ? 'opacity:1;' : ''}`"
              >
                {{ mapTitle || translate('all') }}
              </view>
              <view
                :class="`wd-tabs__map-body ${state.animating ? 'is-open' : ''}`"
                :style="state.mapShow ? '' : 'display:none'"
              >
                <!-- Items 模式的地图导航 -->
                <template v-if="isItemsMode">
                  <view
                    v-for="(item, index) in items"
                    :key="`map-item-${index}`"
                    class="wd-tabs__map-nav-item"
                    @click="handleSelect(index)"
                  >
                    <view
                      :class="`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                      :style="
                        state.activeIndex === index
                          ? color
                            ? `color:${color};border-color:${color}`
                            : ''
                          : inactiveColor
                            ? `color:${inactiveColor}`
                            : ''
                      "
                    >
                      {{ item.title }}
                    </view>
                  </view>
                </template>

                <!-- 子组件模式的地图导航 -->
                <template v-else>
                  <view
                    v-for="(item, index) in children"
                    :key="`map-child-${index}`"
                    class="wd-tabs__map-nav-item"
                    @click="handleSelect(index)"
                  >
                    <view
                      :class="`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                      :style="
                        state.activeIndex === index
                          ? color
                            ? `color:${color};border-color:${color}`
                            : ''
                          : inactiveColor
                            ? `color:${inactiveColor}`
                            : ''
                      "
                    >
                      {{ item.title }}
                    </view>
                  </view>
                </template>
              </view>
            </view>
          </view>
        </wd-sticky>

        <view
          class="wd-tabs__container"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @touchcancel="onTouchEnd"
        >
          <view
            class="wd-tabs__body"
            :class="[animated ? 'is-animated' : '']"
            :style="bodyStyle"
          >
            <!-- Items 模式：通过 items 数组渲染内容 -->
            <template v-if="isItemsMode">
              <view
                v-for="(item, index) in items"
                :key="index"
                class="wd-tab"
                :style="`width: 100%; flex-shrink: 0; box-sizing: border-box;${shouldTabRender(item, index) ? '' : 'display: none;'}`"
              >
                <view
                  v-if="shouldTabRender(item, index)"
                  class="wd-tab__body"
                  :class="[{ 'wd-tab__body--inactive': state.activeIndex !== index }]"
                >
                  <!-- 自定义内容插槽 -->
                  <slot
                    v-if="item.useSlot"
                    :name="item.slotName || `item-${index}`"
                    :item="item"
                    :index="index"
                  />
                  <!-- 默认内容插槽 -->
                  <slot v-else :item="item" :index="index" />
                </view>
              </view>
            </template>

            <!-- 子组件模式：使用 wd-tab 子组件 -->
            <slot v-else />
          </view>
        </view>

        <view
          class="wd-tabs__mask"
          :style="`${state.mapShow ? '' : 'display:none;'} ${state.animating ? 'opacity:1;' : ''}`"
          @click="toggleMap"
        />
      </view>
    </wd-sticky-box>
  </template>

  <template v-else>
    <view
      :class="`wd-tabs ${customClass} ${innerSlidable ? 'is-slide' : ''} ${!showScrollbar ? 'is-hide-scrollbar' : ''} ${mapNum < (isItemsMode ? items.length : children.length) && mapNum !== 0 ? 'is-map' : ''}`"
      :style="customStyle"
    >
      <view class="wd-tabs__nav">
        <view class="wd-tabs__nav--wrap">
          <scroll-view
            :scroll-x="innerSlidable"
            scroll-with-animation
            :scroll-left="state.scrollLeft"
            :show-scrollbar="showScrollbar"
          >
            <view class="wd-tabs__nav-container">
              <!-- Items 模式：通过 items 数组渲染标签项 -->
              <template v-if="isItemsMode">
                <view
                  v-for="(item, index) in items"
                  :key="`sticky-item-${index}`"
                  :class="`wd-tabs__nav-item ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                  :style="
                    state.activeIndex === index
                      ? color
                        ? `color:${color}`
                        : ''
                      : inactiveColor
                        ? `color:${inactiveColor}`
                        : ''
                  "
                  @click="handleSelect(index)"
                >
                  <wd-badge
                    v-if="item.badgeProps"
                    v-bind="item.badgeProps"
                    custom-class="wd-tabs__nav-item-badge"
                  >
                    <text class="wd-tabs__nav-item-text">
                      {{ item.title }}
                    </text>
                  </wd-badge>
                  <text v-else class="wd-tabs__nav-item-text">
                    {{ item.title }}
                  </text>
                  <view
                    v-if="state.activeIndex === index && state.useInnerLine"
                    class="wd-tabs__line wd-tabs__line--inner"
                  />
                </view>
              </template>

              <!-- 子组件模式：使用 wd-tab 子组件 -->
              <template v-else>
                <view
                  v-for="(item, index) in children"
                  :key="`sticky-child-${index}`"
                  :class="`wd-tabs__nav-item ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                  :style="
                    state.activeIndex === index
                      ? color
                        ? `color:${color}`
                        : ''
                      : inactiveColor
                        ? `color:${inactiveColor}`
                        : ''
                  "
                  @click="handleSelect(index)"
                >
                  <wd-badge
                    v-if="item.badgeProps"
                    v-bind="item.badgeProps"
                    custom-class="wd-tabs__nav-item-badge"
                  >
                    <text class="wd-tabs__nav-item-text">
                      {{ item.title }}
                    </text>
                  </wd-badge>
                  <text v-else class="wd-tabs__nav-item-text">
                    {{ item.title }}
                  </text>
                  <view
                    v-if="state.activeIndex === index && state.useInnerLine"
                    class="wd-tabs__line wd-tabs__line--inner"
                  />
                </view>
              </template>

              <view class="wd-tabs__line" :style="state.lineStyle" />
            </view>
          </scroll-view>
        </view>
        <view
          v-if="
            mapNum < (isItemsMode ? items.length : children.length) &&
            mapNum !== 0
          "
          class="wd-tabs__map"
        >
          <view class="wd-tabs__map-btn" @click="toggleMap">
            <view :class="`wd-tabs__map-arrow ${state.animating ? 'is-open' : ''}`">
              <wd-icon name="down" />
            </view>
          </view>
          <view
            class="wd-tabs__map-header"
            :style="`${state.mapShow ? '' : 'display:none;'} ${state.animating ? 'opacity:1;' : ''}`"
          >
            {{ mapTitle || translate('all') }}
          </view>
          <view
            :class="`wd-tabs__map-body ${state.animating ? 'is-open' : ''}`"
            :style="state.mapShow ? '' : 'display:none'"
          >
            <!-- Items 模式的地图导航 -->
            <template v-if="isItemsMode">
              <view
                v-for="(item, index) in items"
                :key="index"
                class="wd-tabs__map-nav-item"
                @click="handleSelect(index)"
              >
                <view
                  :class="`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                >
                  {{ item.title }}
                </view>
              </view>
            </template>

            <!-- 子组件模式的地图导航 -->
            <template v-else>
              <view
                v-for="(item, index) in children"
                :key="`normal-map-child-${index}`"
                class="wd-tabs__map-nav-item"
                @click="handleSelect(index)"
              >
                <view
                  :class="`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`"
                >
                  {{ item.title }}
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>

      <view
        class="wd-tabs__container"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <view
          class="wd-tabs__body"
          :class="[animated ? 'is-animated' : '']"
          :style="bodyStyle"
        >
          <!-- Items 模式：通过 items 数组渲染内容 -->
          <template v-if="isItemsMode">
            <view
              v-for="(item, index) in items"
              :key="`content-item-${index}`"
              class="wd-tab"
              :style="`width: 100%; flex-shrink: 0; box-sizing: border-box;${shouldTabRender(item, index) ? '' : 'display: none;'}`"
            >
              <view
                v-if="shouldTabRender(item, index)"
                class="wd-tab__body"
                :class="[{ 'wd-tab__body--inactive': state.activeIndex !== index }]"
              >
                <!-- 自定义内容插槽 -->
                <slot
                  v-if="item.useSlot"
                  :name="item.slotName || `item-${index}`"
                  :item="item"
                  :index="index"
                />
                <!-- 默认内容插槽 -->
                <slot v-else :item="item" :index="index" />
              </view>
            </view>
          </template>

          <!-- 子组件模式：使用 wd-tab 子组件 -->
          <slot v-else />
        </view>
      </view>

      <view
        class="wd-tabs__mask"
        :style="`${state.mapShow ? '' : 'display:none;'} ${state.animating ? 'opacity:1' : ''}`"
        @click="toggleMap"
      />
    </view>
  </template>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { TabItem, TabsSlidable } from './wd-tabs-key'
import { computed, getCurrentInstance, onMounted, reactive, watch } from 'vue'
import {
  addUnit,
  checkNumRange,
  debounce,
  getRect,
  isDef,
  isNumber,
  isString,
  objToStyle,
} from '../common/util'
import { useChildren } from '../composables/useChildren'
import { useTouch } from '../composables/useTouch'
import { useTranslate } from '../composables/useTranslate'
import wdBadge from '../wd-badge/wd-badge.vue'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdStickyBox from '../wd-sticky-box/wd-sticky-box.vue'
import wdSticky from '../wd-sticky/wd-sticky.vue'
import { TABS_KEY } from './wd-tabs-key'

defineOptions({
  name: 'WdTabs',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 标签页组件属性接口
 */
interface WdTabsProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 标签页数据数组 */
  items?: TabItem[]
  /** 绑定值 */
  modelValue?: string | number
  /** 标签数超过阈值可滑动 */
  slidableNum?: number
  /** 标签数超过阈值显示导航地图 */
  mapNum?: number
  /** 导航地图的标题 */
  mapTitle?: string
  /** 粘性布局 */
  sticky?: boolean
  /** 粘性布局吸顶位置 */
  offsetTop?: number
  /** 开启手势滑动 */
  swipeable?: boolean
  /** 自动调整底部条宽度，设置了 lineWidth 后无效 */
  autoLineWidth?: boolean
  /** 底部条宽度，单位像素 */
  lineWidth?: string | number
  /** 底部条高度，单位像素 */
  lineHeight?: string | number
  /** 颜色 */
  color?: string
  /** 非活动状态颜色 */
  inactiveColor?: string
  /** 是否开启切换标签内容时的过渡动画 */
  animated?: boolean
  /** 切换动画过渡时间，单位毫秒 */
  duration?: number
  /** 是否开启滚动导航 */
  slidable?: TabsSlidable
  /** 是否显示滚动条 */
  showScrollbar?: boolean
}

/**
 * 标签页组件事件接口
 */
interface WdTabsEmits {
  /** 绑定值变化时触发 */
  'update:modelValue': [value: string | number]
  /** 切换标签时触发 */
  change: [event: { index: number; name: string | number }]
  /** 点击禁用标签时触发 */
  disabled: [event: { index: number; name: string | number }]
  /** 点击标签时触发 */
  click: [event: { index: number; name: string | number }]
}

/**
 * Tabs 组件暴露的方法接口
 */
interface WdTabsExpose {
  /** 设置激活的标签页 */
  setActive: (value: string | number, init?: boolean, setScroll?: boolean) => void
  /** 滚动到当前激活的标签页可视区域 */
  scrollIntoView: () => void
  /** 更新底部指示线的样式 */
  updateLineStyle: (animation?: boolean) => Promise<void>
}

/**
 * 插槽参数接口
 */
interface TabSlotProps {
  item: TabItem
  index: number
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdTabsProps>(), {
  customStyle: '',
  customClass: '',
  items: () => [],
  modelValue: 0,
  slidableNum: 6,
  slidable: 'auto',
  mapNum: 10,
  mapTitle: '',
  sticky: false,
  offsetTop: 0,
  swipeable: false,
  autoLineWidth: false,
  color: '',
  inactiveColor: '',
  animated: false,
  duration: 300,
  showScrollbar: false,
})

// 定义组件事件
const emit = defineEmits<WdTabsEmits>()

// 定义插槽类型
defineSlots<{
  default?: (props?: TabSlotProps) => any
  [key: `item-${number}`]: (props: TabSlotProps) => any
}>()

// 选择器常量
const $item = '.wd-tabs__nav-item'
const $itemText = '.wd-tabs__nav-item-text'
const $container = '.wd-tabs__nav-container'

// 响应式状态
const state = reactive({
  activeIndex: 0, // 选中值的索引，默认第一个
  lineStyle: 'display:none;', // 激活项边框线样式
  useInnerLine: false, // 是否使用内部激活项边框线，当外部激活下划线未成功渲染时显示内部定位的
  inited: false, // 是否初始化
  animating: false, // 是否动画中
  mapShow: false, // map的开关
  scrollLeft: 0, // scroll-view偏移量
})

// 子组件管理（用于兼容 wd-tab 子组件模式）
const { children, linkChildren } = useChildren(TABS_KEY)

// 多语言
const { translate } = useTranslate('tabs')

// 获取组件实例
const { proxy } = getCurrentInstance() as any

// 触摸手势
const touch = useTouch()

// 创建异步任务队列
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 20))

/**
 * 判断是否使用 items 模式
 * 当传入 items 数组且有内容时，使用 items 模式
 */
const isItemsMode = computed(() => {
  return props.items?.length > 0
})

/**
 * 是否可滑动
 */
const innerSlidable = computed(() => {
  const totalCount = isItemsMode.value ? props.items.length : children.length
  return props.slidable === 'always' || totalCount > props.slidableNum
})

/**
 * 计算标签页内容区域样式
 */
const bodyStyle = computed(() => {
  if (!props.animated) {
    return ''
  }

  return objToStyle({
    left: `${-100 * state.activeIndex}%`,
    'transition-duration': `${props.duration}ms`,
    '-webkit-transition-duration': `${props.duration}ms`,
  })
})

/**
 * 提供数据给子组件（仅在子组件模式下使用）
 */
linkChildren({
  state,
  props,
  children,
})

/**
 * 获取标签名称
 * @param tab 标签数据或组件实例
 * @param index 索引
 */
const getTabName = (tab: any, index: number) => {
  return isDef(tab.name) ? tab.name : index
}

/**
 * 获取激活项索引
 * @param value 激活值
 */
const getActiveIndex = (value: number | string) => {
  const totalCount = isItemsMode.value ? props.items.length : children.length
  const dataSource = isItemsMode.value ? props.items : children

  // name代表的索引超过了children长度的边界，自动用0兜底
  if (isNumber(value) && value >= totalCount) {
    console.error(
      `warning(wd-tabs): the type of tabs' value is Number shouldn't be less than its children`,
    )
    value = 0
  }
  // 如果是字符串直接匹配，匹配不到用0兜底
  if (isString(value)) {
    const index = dataSource.findIndex((item: any) => item.name === value)
    value = index === -1 ? 0 : index
  }

  return value
}

/**
 * 更新 underline的偏移量
 * @param animation 是否开启动画
 */
const updateLineStyle = async (animation: boolean = true) => {
  if (!state.inited) return
  const { autoLineWidth, lineWidth, lineHeight } = props
  try {
    const lineStyle: CSSProperties = {}
    if (isDef(lineWidth)) {
      lineStyle.width = addUnit(lineWidth)
    } else {
      if (autoLineWidth) {
        const textRects = await getRect($itemText, true, proxy)
        const textWidth = Number(textRects[state.activeIndex].width)
        lineStyle.width = addUnit(textWidth)
      }
    }
    if (isDef(lineHeight)) {
      lineStyle.height = addUnit(lineHeight)
      lineStyle.borderRadius = `calc(${addUnit(lineHeight)} / 2)`
    }
    const rects = await getRect($item, true, proxy)
    const rect = rects[state.activeIndex]
    const left =
      rects.slice(0, state.activeIndex).reduce((prev, curr) => prev + Number(curr.width), 0) +
      Number(rect.width) / 2
    if (left) {
      lineStyle.transform = `translateX(${left}px) translateX(-50%)`
      if (animation) {
        lineStyle.transition =
          'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);'
      }
      state.useInnerLine = false
      state.lineStyle = objToStyle(lineStyle)
    }
  } catch (error) {
    console.error('error(wd-tabs): update line style failed', error)
  }
}

/**
 * 滚动到可视区域
 */
const scrollIntoView = () => {
  if (!state.inited) return
  Promise.all([getRect($item, true, proxy), getRect($container, false, proxy)]).then(
    ([navItemsRects, navRect]) => {
      // 选中元素
      const selectItem = navItemsRects[state.activeIndex]
      // 选中元素之前的节点的宽度总和
      const offsetLeft = (navItemsRects as any)
        .slice(0, state.activeIndex)
        .reduce((prev: any, curr: any) => prev + curr.width, 0)
      // scroll-view滑动到selectItem的偏移量
      const left = offsetLeft - ((navRect as any).width - Number(selectItem.width)) / 2
      if (left === state.scrollLeft) {
        state.scrollLeft = left + Math.random() / 10000
      } else {
        state.scrollLeft = left
      }
    },
  )
}

/**
 * 设置激活标签
 */
const setActiveTab = () => {
  if (!state.inited) return
  const dataSource = isItemsMode.value ? props.items : children
  const name = getTabName(dataSource[state.activeIndex], state.activeIndex)
  if (name !== props.modelValue) {
    emit('change', {
      index: state.activeIndex,
      name,
    })
    emit('update:modelValue', name)
  }
}

/**
 * 更新激活项
 * @param value 激活值
 * @param init 是否已初始化
 * @param setScroll 是否设置scroll-view滚动
 */
const updateActive = (
  value: number | string = 0,
  init: boolean = false,
  setScroll: boolean = true,
) => {
  const totalCount = isItemsMode.value ? props.items.length : children.length
  const dataSource = isItemsMode.value ? props.items : children

  // 没有tab子元素，不执行任何操作
  if (totalCount === 0) return

  value = getActiveIndex(value)
  // 被禁用，不执行任何操作
  if (dataSource[value].disabled) return

  state.activeIndex = value
  if (setScroll) {
    updateLineStyle(init === false)
    scrollIntoView()
  }
  setActiveTab()
}

/**
 * 修改选中的tab Index
 * @param value 激活值
 * @param init 是否伴随初始化操作
 */
const setActive = debounce(updateActive, 100, { leading: true })

/**
 * 切换地图显示状态
 */
const toggleMap = () => {
  if (state.mapShow) {
    state.animating = false
    setTimeout(() => {
      state.mapShow = false
    }, 300)
  } else {
    state.mapShow = true
    setTimeout(() => {
      state.animating = true
    }, 100)
  }
}

/**
 * 处理标签选择
 * @param index 索引
 */
const handleSelect = (index: number) => {
  if (index === undefined) return
  const dataSource = isItemsMode.value ? props.items : children
  const { disabled } = dataSource[index]
  const name = getTabName(dataSource[index], index)

  if (disabled) {
    emit('disabled', {
      index,
      name,
    })
    return
  }
  state.mapShow && toggleMap()
  setActive(index)
  emit('click', {
    index,
    name,
  })
}

/**
 * 触摸开始
 * @param event 事件对象
 */
const onTouchStart = (event: any) => {
  if (!props.swipeable) return
  touch.touchStart(event)
}

/**
 * 触摸移动
 * @param event 事件对象
 */
const onTouchMove = (event: any) => {
  if (!props.swipeable) return
  touch.touchMove(event)
}

/**
 * 触摸结束
 */
const onTouchEnd = () => {
  if (!props.swipeable) return
  const { direction, deltaX, offsetX } = touch
  const minSwipeDistance = 50
  const totalCount = isItemsMode.value ? props.items.length : children.length

  if (direction.value === 'horizontal' && offsetX.value >= minSwipeDistance) {
    if (deltaX.value > 0 && state.activeIndex !== 0) {
      setActive(state.activeIndex - 1)
    } else if (deltaX.value < 0 && state.activeIndex !== totalCount - 1) {
      setActive(state.activeIndex + 1)
    }
  }
}

/**
 * 计算标签页内容区域的样式（用于 items 模式）
 * @param index 项目索引
 */
const getTabBodyStyle = (index: number) => {
  const style: CSSProperties = {}
  if (state.activeIndex !== index && !props.animated) {
    style.display = 'none'
  }
  return objToStyle(style)
}

/**
 * 判断标签页是否应该渲染（用于 items 模式）
 * @param item 标签项数据
 * @param index 项目索引
 */
const shouldTabRender = (item: TabItem, index: number) => {
  const isActive = state.activeIndex === index
  const isLazy = item.lazy !== false // 默认为 true
  return !isLazy || isActive
}

/**
 * 监听绑定值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (!isNumber(newValue) && !isString(newValue)) {
      console.error('error(wd-tabs): the type of value should be number or string')
    }
    // 保证不为非空字符串，小于0的数字
    if (newValue === '' || !isDef(newValue)) {
      console.error(`error(wd-tabs): tabs's value cannot be '' null or undefined`)
    }
    if (typeof newValue === 'number' && newValue < 0) {
      console.error(`error(wd-tabs): tabs's value cannot be less than zero`)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

/**
 * 监听绑定值变化并更新激活项
 */
watch(
  () => props.modelValue,
  (newValue) => {
    const index = getActiveIndex(newValue)
    setActive(newValue, false, index !== state.activeIndex)
  },
  {
    immediate: false,
    deep: true,
  },
)

/**
 * 监听子组件数量变化（仅在子组件模式下）
 */
watch(
  () => children.length,
  async () => {
    if (state.inited && !isItemsMode.value) {
      await nextTick()
      setActive(props.modelValue)
    }
  },
)

/**
 * 监听items数量变化（仅在items模式下）
 */
watch(
  () => props.items?.length,
  async () => {
    if (state.inited && isItemsMode.value) {
      await nextTick()
      setActive(props.modelValue)
    }
  },
)

/**
 * 监听可滑动数量阈值变化
 */
watch(
  () => props.slidableNum,
  (newValue) => {
    checkNumRange(newValue, 'slidableNum')
  },
)

/**
 * 监听地图导航数量阈值变化
 */
watch(
  () => props.mapNum,
  (newValue) => {
    checkNumRange(newValue, 'mapNum')
  },
)

/**
 * 组件挂载后初始化
 */
onMounted(async () => {
  state.inited = true
  await nextTick()
  updateActive(props.modelValue, true)
  state.useInnerLine = true
})

// 暴露给父组件的方法和属性
defineExpose<WdTabsExpose>({
  setActive,
  scrollIntoView,
  updateLineStyle,
})

/** Tabs 组件实例类型 */
export type TabsInstance = ComponentPublicInstance<WdTabsProps, WdTabsExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable';
@import '../common/abstracts/mixin';

// 暗色主题样式
.wot-theme-dark {
  @include b(tabs) {
    background: $-dark-background2;

    @include e(nav) {
      background: $-dark-background2;
    }

    @include e(nav-item) {
      color: $-dark-color3;

      @include when(active) {
        font-weight: 600;
        color: $-dark-color;
      }

      @include when(disabled) {
        color: $-dark-color-gray;
      }
    }

    @include e(map-nav-btn) {
      background-color: $-dark-background4;
      color: $-dark-color3;

      @include when(active) {
        color: $-dark-color;
        border: 1rpx solid $-tabs-nav-active-color;
        background-color: $-dark-background;
      }

      @include when(disabled) {
        color: $-dark-color-gray;
        border-color: #f4f4f4;
      }
    }

    @include e(map-btn) {
      background: $-dark-background2;
      color: $-dark-color3;
    }

    @include e(map-header) {
      background: $-dark-background2;
      color: $-dark-color;

      &::after {
        background: $-dark-background4;
      }
    }

    @include e(map-body) {
      background: $-dark-background2;
    }
  }
}

// 标签页容器样式
@include b(tabs) {
  position: relative;
  background: #fff;
  width: 100%;

  @include e(nav) {
    left: 0;
    right: 0;
    height: $-tabs-nav-height;
    background-color: #fff;
    width: 100%;
    position: relative;

    @include m(wrap) {
      height: 100%;
      overflow: hidden;
    }

    @include m(sticky) {
      width: 100vw;
    }
  }

  @include e(nav-container) {
    position: relative;
    display: flex;
    user-select: none;
  }

  @include e(nav-item) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 0;
    height: $-tabs-nav-height;
    font-size: $-tabs-nav-fs;
    color: $-tabs-nav-color;
    transition: color 0.3s;

    @include when(active) {
      font-weight: 600;
    }

    @include when(disabled) {
      color: $-tabs-nav-disabled-color;
    }
  }

  @include e(nav-item-text) {
    @include lineEllipsis();
  }

  @include edeep(nav-item-badge) {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    min-width: 0;
  }

  @include e(line) {
    position: absolute;
    bottom: 8rpx;
    left: 0;
    z-index: 1;
    height: $-tabs-nav-line-height;
    width: $-tabs-nav-line-width;
    background: $-tabs-nav-line-bg-color;
    border-radius: calc($-tabs-nav-line-height / 2);

    @include m(inner) {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @include e(container) {
    overflow: hidden;
  }

  @include e(body) {
    position: relative;
    width: 100%;
    height: 100%;

    @include when(animated) {
      display: flex;
      transition-property: left;
    }
  }

  @include e(map) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  @include e(map-btn) {
    position: absolute;
    right: 0;
    top: 0;
    width: $-tabs-nav-height;
    height: $-tabs-nav-height;
    line-height: $-tabs-nav-height;
    text-align: center;
    color: $-tabs-nav-map-arrow-color;
    z-index: 1;
    background: $-tabs-nav-bg;
    -webkit-tap-highlight-color: transparent;

    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: -48rpx;
      width: 48rpx;
      height: $-tabs-nav-height - 1;
      background: $-tabs-nav-map-btn-before-bg;
    }
  }

  @include e(map-arrow) {
    display: block;
    transition: transform 0.3s;

    @include when(open) {
      transform: rotate(180deg);
    }
  }

  @include e(map-header) {
    position: relative;
    padding-left: 34rpx;
    height: $-tabs-nav-height;
    line-height: $-tabs-nav-height;
    font-size: $-tabs-nav-map-fs;
    color: $-tabs-nav-map-color;
    transition: opacity 0.3s;
    background: #fff;
    opacity: 0;

    @include halfPixelBorder;

    &::after {
      z-index: 3;
    }
  }

  @include e(map-body) {
    display: flex;
    flex-wrap: wrap;
    padding: 40rpx 30rpx 20rpx;
    background: #fff;
    transition: transform 0.3s;
    transform: scaleY(0);
    transform-origin: center top;

    @include when(open) {
      transform: scaleY(1);
    }
  }

  @include e(map-nav-item) {
    flex-basis: 33%;

    &:nth-child(3n + 2) {
      text-align: center;
    }

    &:nth-child(3n + 3) {
      text-align: right;
    }
  }

  @include e(map-nav-btn) {
    @include buttonClear;
    @include lineEllipsis;
    display: inline-block;
    width: 214rpx;
    height: 64rpx;
    line-height: 64rpx;
    background-color: $-tabs-nav-map-button-back-color;
    border-color: transparent;
    margin-bottom: 20rpx;
    border-radius: $-tabs-nav-map-button-radius;
    color: $-tabs-nav-map-color;
    font-size: $-tabs-nav-map-fs;
    text-align: center;
    transition:
      color 0.3s,
      border-color 0.3s;

    @include when(active) {
      color: $-tabs-nav-active-color;
      border: 1rpx solid $-tabs-nav-active-color;
      background-color: $-tabs-nav-bg;
    }

    @include when(disabled) {
      color: $-tabs-nav-disabled-color;
      border-color: #f4f4f4;
    }
  }

  @include e(mask) {
    position: absolute;
    top: $-tabs-nav-height;
    left: 0;
    right: 0;
    bottom: 0;
    background: $-tabs-nav-map-modal-bg;
    opacity: 0;
    transition: opacity 0.3s;
  }

  @include when(slide) {
    .wd-tabs__nav-item {
      flex: 0 0 auto;
      padding: 0 34rpx;
    }
  }

  @include when(map) {
    .wd-tabs__nav--wrap {
      padding-right: 80rpx;
    }
  }
}

// Tab 标签页样式
@include b(tab) {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;

  @include e(body) {
    @include m(inactive) {
      height: 0;
      transition: height 0.3s ease-in-out;
    }
  }
}

@media screen and (max-width: 330px) {
  .wd-tabs__map-nav-btn {
    width: 180rpx;
  }
}

// 隐藏滚动条
:deep(::-webkit-scrollbar) {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

@include b(tabs) {
  @include when(hide-scrollbar) {
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
