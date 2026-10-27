<!-- 组件库示例索引 http://127.0.0.1:100/#/pages-sub/demo/wd/wd -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <wd-navbar title="组件库示例索引"/>

    <!-- 搜索框 -->
    <view class="fixed z-10 w-100vw">
      <wd-search
        v-model="keyword"
        light
        placeholder="搜索组件"
        @change="handleSearch"
        @clear="handleClear"
      >
        <template #suffix>
          <view class="px-4 text-xs">共{{ filteredCount }}条记录</view>
        </template>
      </wd-search>
    </view>

    <!-- 组件分类列表 -->
    <view class="px-4 pb-8 pt-15">
      <!-- 基础组件 -->
      <wd-cell-group v-if="filteredComponents.basic.length" title="基础组件" custom-class="mb-4">
        <wd-cell
          v-for="component in filteredComponents.basic"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 布局组件 -->
      <wd-cell-group v-if="filteredComponents.layout.length" title="布局组件" custom-class="mb-4">
        <wd-cell
          v-for="component in filteredComponents.layout"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 导航组件 -->
      <wd-cell-group
        v-if="filteredComponents.navigation.length"
        title="导航组件"
        custom-class="mb-4"
      >
        <wd-cell
          v-for="component in filteredComponents.navigation"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 表单组件 -->
      <wd-cell-group v-if="filteredComponents.form.length" title="表单组件" custom-class="mb-4">
        <wd-cell
          v-for="component in filteredComponents.form"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 展示组件 -->
      <wd-cell-group v-if="filteredComponents.display.length" title="展示组件" custom-class="mb-4">
        <wd-cell
          v-for="component in filteredComponents.display"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 反馈组件 -->
      <wd-cell-group v-if="filteredComponents.feedback.length" title="反馈组件" custom-class="mb-4">
        <wd-cell
          v-for="component in filteredComponents.feedback"
          :key="component.id"
          :title="component.name"
          is-link
          @click="navigateToPage(component.id, component.category)"
        />
      </wd-cell-group>

      <!-- 无搜索结果提示 -->
      <wd-status-tip v-if="isNoResults" image="search" tip="未找到相关组件" />
    </view>
  </view>
</template>

<script setup lang="ts">
// 搜索关键词
import { ref } from 'vue'

/** 分享功能 */
const { handleShareAppMessage, handleShareTimeline } = useShare()
defineExpose({
  onShareAppMessage: handleShareAppMessage,
  onShareTimeline: handleShareTimeline,
})

const keyword = ref('')

// 完整的组件列表
const allComponents = [
  // 基础组件
  { id: 'button', name: 'Button 按钮', category: 'basic' },
  { id: 'icon', name: 'Icon 图标', category: 'basic' },
  { id: 'text', name: 'Text 文本', category: 'basic' },
  { id: 'transition', name: 'Transition 动画', category: 'basic' },
  { id: 'resize', name: 'Resize 监听元素尺寸', category: 'basic' },
  { id: 'configProvider', name: 'ConfigProvider 配置', category: 'basic' },

  // 布局组件
  { id: 'rowCol', name: 'Row-Col 行列布局', category: 'layout' },
  { id: 'grid', name: 'Grid 宫格', category: 'layout' },
  { id: 'gap', name: 'Gap 间隙槽', category: 'layout' },
  { id: 'divider', name: 'Divider 分割线', category: 'layout' },
  { id: 'sticky', name: 'Sticky 吸顶布局', category: 'layout' },

  // 导航组件
  { id: 'navbar', name: 'Navbar 导航栏', category: 'navigation' },
  { id: 'tabbar', name: 'Tabbar 标签栏', category: 'navigation' },
  { id: 'tabs', name: 'Tabs 标签页', category: 'navigation' },
  { id: 'segmented', name: 'Segmented 分段器', category: 'navigation' },
  { id: 'sidebar', name: 'Sidebar 侧边栏', category: 'navigation' },
  { id: 'indexBar', name: 'IndexBar 索引栏', category: 'navigation' },
  { id: 'pagination', name: 'Pagination 分页', category: 'navigation' },
  { id: 'paging', name: 'Paging 分页加载', category: 'navigation' },
  { id: 'backtop', name: 'Backtop 回到顶部', category: 'navigation' },

  // 表单组件
  { id: 'input', name: 'Input 输入框', category: 'form' },
  { id: 'textarea', name: 'Textarea 文本域', category: 'form' },
  { id: 'inputNumber', name: 'InputNumber 计数器', category: 'form' },
  { id: 'passwordInput', name: 'PasswordInput 密码', category: 'form' },
  { id: 'search', name: 'Search 搜索', category: 'form' },
  { id: 'checkbox', name: 'Checkbox 复选框', category: 'form' },
  { id: 'radio', name: 'Radio 单选框', category: 'form' },
  { id: 'switch', name: 'Switch 开关', category: 'form' },
  { id: 'rate', name: 'Rate 评分', category: 'form' },
  { id: 'slider', name: 'Slider 滑块', category: 'form' },
  { id: 'picker', name: 'Picker 选择器', category: 'form' },
  { id: 'pickerView', name: 'PickerView 选择器视图', category: 'form' },
  { id: 'colPicker', name: 'ColPicker 多列选择器', category: 'form' },
  { id: 'selectPicker', name: 'SelectPicker 单复选', category: 'form' },
  { id: 'datetimePicker', name: 'DatetimePicker 时间', category: 'form' },
  { id: 'datetimePickerView', name: 'DatetimePickerView', category: 'form' },
  { id: 'calendar', name: 'Calendar 日历', category: 'form' },
  { id: 'calendarView', name: 'CalendarView 日历板', category: 'form' },
  { id: 'upload', name: 'Upload 上传', category: 'form' },
  { id: 'form', name: 'Form 表单', category: 'form' },
  { id: 'signature', name: 'Signature 签名', category: 'form' },
  { id: 'voiceRecorder', name: 'Recorder 录音', category: 'form' },
  { id: 'slideVerify', name: 'SlideVerify 滑动验证', category: 'form' },

  // 展示组件
  { id: 'cell', name: 'Cell 单元格', category: 'display' },
  { id: 'badge', name: 'Badge 徽标', category: 'display' },
  { id: 'tag', name: 'Tag 标签', category: 'display' },
  { id: 'card', name: 'Card 卡片', category: 'display' },
  { id: 'collapse', name: 'Collapse 折叠面板', category: 'display' },
  { id: 'steps', name: 'Steps 步骤条', category: 'display' },
  { id: 'table', name: 'Table 表格', category: 'display' },
  { id: 'img', name: 'Img 图片', category: 'display' },
  { id: 'imgCropper', name: 'ImgCropper 图片裁剪', category: 'display' },
  { id: 'swiper', name: 'Swiper 轮播图', category: 'display' },
  { id: 'skeleton', name: 'Skeleton 骨架屏', category: 'display' },
  { id: 'curtain', name: 'Curtain 幕帘', category: 'display' },
  { id: 'watermark', name: 'Watermark 水印', category: 'display' },
  { id: 'avatar', name: 'Avatar 头像', category: 'display' },

  // 反馈组件
  { id: 'actionSheet', name: 'ActionSheet 上拉菜单', category: 'feedback' },
  { id: 'popup', name: 'Popup 弹出层', category: 'feedback' },
  { id: 'overlay', name: 'Overlay 遮罩层', category: 'feedback' },
  { id: 'messageBox', name: 'MessageBox 弹框', category: 'feedback' },
  { id: 'toast', name: 'Toast 轻提示', category: 'feedback' },
  { id: 'notify', name: 'Notify 消息通知', category: 'feedback' },
  { id: 'loading', name: 'Loading 加载指示器', category: 'feedback' },
  { id: 'progress', name: 'Progress 进度条', category: 'feedback' },
  { id: 'circle', name: 'Circle 环形进度条', category: 'feedback' },
  { id: 'loadmore', name: 'Loadmore 加载更多', category: 'feedback' },
  { id: 'statusTip', name: 'StatusTip 缺省提示', category: 'feedback' },
  { id: 'tooltip', name: 'Tooltip 文字提示', category: 'feedback' },
  { id: 'popover', name: 'Popover 气泡', category: 'feedback' },
  { id: 'dropMenu', name: 'DropMenu 下拉菜单', category: 'feedback' },
  { id: 'floatingPanel', name: 'FloatingPanel 浮动面板', category: 'feedback' },
  { id: 'swipeAction', name: 'SwipeAction 滑动操作', category: 'feedback' },
  { id: 'sortButton', name: 'SortButton 排序按钮', category: 'feedback' },
  { id: 'noticeBar', name: 'NoticeBar 通知栏', category: 'feedback' },
  { id: 'countDown', name: 'CountDown 倒计时', category: 'feedback' },
  { id: 'countTo', name: 'CountTo 数字滚动', category: 'feedback' },
  { id: 'keyboard', name: 'Keyboard 虚拟键盘', category: 'feedback' },
  { id: 'numberKeyboard', name: 'NumberKeyboard 数字', category: 'feedback' },
  { id: 'fab', name: 'Fab 悬浮按钮', category: 'feedback' },
]

// 定义分类映射表，方便搜索时匹配
const categoryMap = {
  basic: '基础组件',
  layout: '布局组件',
  navigation: '导航组件',
  form: '表单组件',
  display: '展示组件',
  feedback: '反馈组件',
}

// 按分类过滤后的组件列表
const filteredComponents = computed(() => {
  const filtered = keyword.value
    ? allComponents.filter((component) => {
        const searchTerm = keyword.value.toLowerCase()
        const categoryName = categoryMap[component.category] || ''
        const categoryKey = component.category.toLowerCase()

        return (
          component.name.toLowerCase().includes(searchTerm) ||
          component.id.toLowerCase().includes(searchTerm) ||
          categoryName.includes(keyword.value) || // 支持中文分类名搜索
          categoryKey.includes(searchTerm) // 支持英文分类名模糊搜索
        )
      })
    : allComponents

  return {
    basic: filtered.filter((c) => c.category === 'basic'),
    layout: filtered.filter((c) => c.category === 'layout'),
    navigation: filtered.filter((c) => c.category === 'navigation'),
    form: filtered.filter((c) => c.category === 'form'),
    display: filtered.filter((c) => c.category === 'display'),
    feedback: filtered.filter((c) => c.category === 'feedback'),
  }
})

// 筛选后的组件总数
const filteredCount = computed(() => {
  const filtered = filteredComponents.value
  return (
    filtered.basic.length +
    filtered.layout.length +
    filtered.navigation.length +
    filtered.form.length +
    filtered.display.length +
    filtered.feedback.length
  )
})

// 是否无搜索结果
const isNoResults = computed(() => {
  return keyword.value && filteredCount.value === 0
})

/**
 * 处理搜索
 */
const handleSearch = () => {
  // 搜索逻辑由 computed 自动处理
}

/**
 * 处理清空搜索
 */
const handleClear = () => {
  keyword.value = ''
}

/**
 * 导航到组件示例页面
 * @param componentId 组件ID
 */
const navigateToPage = (componentId: string, category: string) => {
  uni.navigateTo({
    url: `/pages-sub/${category}/${componentId}`,
  })
}

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped lang="scss">
:deep(.wd-cell__left) {
  flex: 2;
}
</style>
