<!-- 菜单标签 -->
<template>
  <view>
    <wd-navbar title="点餐" />

    <view class="wraper">
      <wd-sidebar v-model="active" @change="handleChange">
        <wd-sidebar-item
          v-for="(item, index) in categories"
          :key="index"
          :value="index"
          :label="item.label"
        />
      </wd-sidebar>
      <scroll-view
        class="content"
        scroll-y
        :scroll-with-animation="scrollWithAnimation"
        :scroll-top="scrollTop"
        :throttle="false"
        @scroll="onScroll"
      >
        <view v-for="(item, index) in categories" :key="index" class="category">
          <wd-cell-group :title="item.title" border>
            <wd-cell
              v-for="(cell, cellIndex) in item.items"
              :key="cellIndex"
              :title="cell.title"
              :label="cell.label"
            >
              <wd-icon name="github-fill" size="24px" />
            </wd-cell>
          </wd-cell-group>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { CommonUtil } from '@/wd'

const active = ref<number>(0)
const scrollTop = ref<number>(0)
const itemScrollTop = ref<number[]>([])
const scrollWithAnimation = ref<boolean>(true)
const isScrolling = ref<boolean>(false)

const { proxy } = getCurrentInstance() as any

const subCategories = Array.from({ length: 24 }).fill(
  { title: '标题文字', label: '这是描述这是描述' },
  0,
  24,
)

const categories = ref([
  {
    label: '分类一',
    title: '标题一',
    items: subCategories,
  },
  {
    label: '分类二',
    title: '标题二',
    items: subCategories,
  },
  {
    label: '分类三',
    title: '标题三',
    items: subCategories.slice(0, 18),
  },
  {
    label: '分类四',
    title: '标题四',
    items: subCategories.slice(0, 21),
  },
  {
    label: '分类五',
    title: '标题五',
    items: subCategories,
  },
  {
    label: '分类六',
    title: '标题六',
    items: subCategories.slice(0, 18),
  },
  {
    label: '分类七',
    title: '标题七',
    items: subCategories,
  },
])

onMounted(() => {
  CommonUtil.getRect('.category', true, proxy).then((rects) => {
    if (CommonUtil.isArray(rects)) {
      itemScrollTop.value = rects.map((item) => item.top || 0)
      scrollTop.value = rects[active.value].top || 0
    }
  })
})

/**
 * 动态调整动画状态的优化滚动
 * 根据滚动距离智能调整滚动策略
 */
function handleChangeOptimized(targetValue: number) {
  const currentScrollTop = scrollTop.value
  const targetScrollTop = itemScrollTop.value[targetValue]
  const distance = Math.abs(targetScrollTop - currentScrollTop)

  // 设置滚动状态，防止重复触发
  isScrolling.value = true

  if (distance > 2000) {
    // 超长距离滚动：先关闭动画快速跳转，再开启动画微调
    console.log('超长距离滚动，距离:', distance)

    // 第一步：关闭动画，快速跳转到接近目标位置
    scrollWithAnimation.value = false
    const jumpPosition = targetScrollTop - 100 // 跳转到目标位置前100px
    scrollTop.value = jumpPosition

    // 第二步：短暂延迟后开启动画，精确滚动到目标位置
    setTimeout(() => {
      scrollWithAnimation.value = true
      scrollTop.value = targetScrollTop

      // 第三步：滚动完成后重置状态
      setTimeout(() => {
        isScrolling.value = false
      }, 300)
    }, 50)

  } else if (distance > 800) {
    // 中等距离滚动：使用动画但缩短时间
    console.log('中等距离滚动，距离:', distance)

    scrollWithAnimation.value = true
    scrollTop.value = targetScrollTop

    // 400ms后重置状态
    setTimeout(() => {
      isScrolling.value = false
    }, 400)

  } else {
    // 短距离滚动：正常滚动动画
    console.log('短距离滚动，距离:', distance)

    scrollWithAnimation.value = true
    scrollTop.value = targetScrollTop

    // 300ms后重置状态
    setTimeout(() => {
      isScrolling.value = false
    }, 300)
  }
}

/**
 * 处理侧边栏切换事件
 */
function handleChange({ value }) {
  // 如果正在滚动中，忽略新的切换请求
  if (isScrolling.value) {
    console.log('正在滚动中，忽略切换请求')
    return
  }

  console.log('切换到分类:', value, '当前分类:', active.value)

  // 更新活动分类
  active.value = value

  // 执行优化滚动
  handleChangeOptimized(value)
}

/**
 * 处理内容滚动事件
 */
function onScroll(e) {
  // 如果是程序控制的滚动，不响应用户滚动事件
  if (isScrolling.value) {
    return
  }

  const { scrollTop: currentScrollTop } = e.detail
  const threshold = 50 // 阈值：下一个标题与顶部的距离

  // 如果滚动到顶部附近，激活第一个分类
  if (currentScrollTop < threshold) {
    if (active.value !== 0) {
      active.value = 0
    }
    return
  }

  // 查找当前应该激活的分类
  const index = itemScrollTop.value.findIndex(
    (top) => top > currentScrollTop && top - currentScrollTop <= threshold,
  )

  // 如果找到了匹配的分类且与当前不同，则更新
  if (index > -1 && active.value !== index) {
    active.value = index
  }
}
</script>

<style lang="scss" scoped>
.wraper {
  display: flex;
  height: calc(100vh - var(--window-top));
  height: calc(100vh - var(--window-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom));
}

.content {
  flex: 1;
  background: #fff;
}
</style>
