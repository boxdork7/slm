<template>
  <view class="fab-tool">
    <!-- 触发器容器：用于承载触发浮动工具的元素 -->
    <view id="toolfab">
      <slot />
    </view>

    <!-- 浮动工具内容容器：根据计算的位置样式进行定位 -->
    <view id="placementfab" class="fab-tool-content" :style="placementStyle">
      <!-- 只有在visible为true时才渲染内容插槽 -->
      <slot v-if="visible" name="content" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, getCurrentInstance } from 'vue'

// 获取当前组件实例，用于DOM查询
const { proxy } = getCurrentInstance() as any

// ========== 组件属性定义 ==========
interface FabToolProps {
  /** 控制浮动工具显示/隐藏 */
  visible?: boolean
  /**
   * 浮动工具的位置策略
   * - 'auto': 自动计算最佳位置
   * - 'top-start': 顶部左对齐
   * - 'top-center': 顶部居中对齐
   * - 'top-end': 顶部右对齐
   * - 'bottom-start': 底部左对齐
   * - 'bottom-center': 底部居中对齐
   * - 'bottom-end': 底部右对齐
   */
  placement?: string
}

const props = withDefaults(defineProps<FabToolProps>(), {
  visible: false,
  placement: 'auto',
})

// ========== 响应式数据 ==========
/** 浮动内容的高度偏移量（负值表示向上偏移） */
const placementHeight = ref<string>('0')

/** 实际使用的位置类型（经过auto计算后的结果） */
const placementType = ref<string>('')

// ========== 监听器 ==========
/**
 * 监听visible属性变化，当显示时重新计算位置
 */
watch(
  () => props.visible,
  (newVal: boolean) => {
    if (newVal) {
      // 获取屏幕宽度，用于auto模式下的位置计算
      const { screenWidth } = uni.getSystemInfoSync()

      nextTick(() => {
        let placementWidth = 0

        // 获取浮动内容的尺寸信息
        uni
          .createSelectorQuery()
          .in(proxy)
          .select('#placementfab')
          .boundingClientRect((res: any) => {
            // 设置高度偏移量（负值向上偏移）
            placementHeight.value = `${-res.height}px`
            placementWidth = res.width
          })
          .exec()

        // 开启自动模式后，根据剩余空间计算最佳位置
        if (props.placement === 'auto') {
          uni
            .createSelectorQuery()
            .in(proxy)
            .select('#toolfab')
            .boundingClientRect((res: any) => {
              const leftRemain = res.left        // 左侧剩余空间
              const rightRemain = screenWidth - leftRemain  // 右侧剩余空间

              // 根据剩余空间选择最佳位置
              if (rightRemain > placementWidth) {
                // 右侧空间充足，左对齐显示
                placementType.value = 'bottom-start'
              } else if (leftRemain > placementWidth) {
                // 左侧空间充足，右对齐显示
                placementType.value = 'bottom-end'
              } else {
                // 两侧空间都不足，居中显示
                placementType.value = 'bottom-center'
              }
            })
            .exec()
        }
      })
    }
  },
)

// ========== 计算属性 ==========
/**
 * 根据位置类型计算浮动内容的CSS样式
 * 支持6种定位模式：上下 × 左中右
 */
const placementStyle = computed(() => {
  let position: Record<string, string> = {}

  switch (placementType.value) {
    case 'top-start':
      // 顶部左对齐：向上偏移，左边缘对齐
      position = {
        top: placementHeight.value,
        left: '0',
      }
      break
    case 'top-center':
      // 顶部居中：向上偏移，水平居中
      position = {
        top: placementHeight.value,
        left: '50%',
        transform: 'translateX(-50%)',
      }
      break
    case 'top-end':
      // 顶部右对齐：向上偏移，右边缘对齐
      position = {
        top: placementHeight.value,
        right: '0',
      }
      break
    case 'bottom-start':
      // 底部左对齐：向下偏移，左边缘对齐
      position = {
        bottom: placementHeight.value,
        left: '0',
      }
      break
    case 'bottom-center':
      // 底部居中：向下偏移，水平居中
      position = {
        bottom: placementHeight.value,
        left: '50%',
        transform: 'translateX(-50%)',
      }
      break
    case 'bottom-end':
      // 底部右对齐：向下偏移，右边缘对齐
      position = {
        bottom: placementHeight.value,
        right: '0',
      }
      break
    default:
      // 默认情况不设置任何位置样式
      break
  }

  return position
})

// ========== 初始化 ==========
// 设置初始位置类型（如果不是auto模式，直接使用props中的placement）
placementType.value = props.placement
</script>

<style lang="scss" scoped>
.fab-tool {
  /* 相对定位，作为浮动内容的定位基准 */
  position: relative;

  .fab-tool-content {
    /* 绝对定位，脱离文档流进行浮动显示 */
    position: absolute;
    z-index: 999;

    /* 浮动工具的视觉样式 */
    background-color: #ffffff;
    box-shadow:
      -2px -2px 4px rgba(0, 0, 0, 0.05),  /* 左上阴影 */
      2px 2px 4px rgba(0, 0, 0, 0.05);    /* 右下阴影 */
    border-radius: 12rpx;
    box-sizing: border-box;
  }
}
</style>
