<!-- Watermark 水印组件 http://127.0.0.1:100/#/pages-sub/demo/wd/watermark -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Watermark 水印组件" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的文字和图片水印">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="文字水印">
          <wd-button @click="showTextWatermark">显示文字水印</wd-button>
        </wd-cell>

        <wd-cell title="图片水印">
          <wd-button @click="showImageWatermark">显示图片水印</wd-button>
        </wd-cell>

        <wd-cell title="清除水印">
          <wd-button @click="clearWatermark">清除水印</wd-button>
        </wd-cell>
      </wd-cell-group>

      <!-- 基本水印展示 -->
      <wd-watermark
        v-if="basicWatermarkType === 'text'"
        content="wot-design-uni"
        :width="130"
        :height="140"
        :opacity="0.3"
        :full-screen="true"
      />

      <wd-watermark
        v-if="basicWatermarkType === 'image'"
        image="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
        :width="130"
        :height="140"
        :image-width="38"
        :image-height="38"
        :opacity="0.3"
        :full-screen="true"
      />

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 文字水印" :code="codes.basic.textTemplate" />
        <DemoCode title="模板 - 图片水印" :code="codes.basic.imageTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 局部水印示例 -->
    <DemoSection title="局部水印" desc="在指定容器内显示水印">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="局部水印演示">
            <wd-button @click="toggleLocalWatermark">
              {{ localWatermarkVisible ? '隐藏' : '显示' }}局部水印
            </wd-button>
          </wd-cell>
        </wd-cell-group>

        <!-- 局部水印容器 -->
        <view class="relative mx-4 h-64 rounded-lg bg-gray-50 p-4">
          <view class="mb-4 text-center text-lg font-medium">局部水印演示区域</view>
          <view class="text-gray-600">
            这是一个演示局部水印的容器，水印只会在这个区域内显示。可以用于保护特定内容区域的版权信息。
          </view>

          <!-- 局部水印 -->
          <wd-watermark
            v-if="localWatermarkVisible"
            content="Local Watermark"
            :width="120"
            :height="80"
            :opacity="0.2"
            :full-screen="false"
            :rotate="-15"
            color="#1890ff"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 局部水印" :code="codes.local.template" />
        <DemoCode title="脚本 - 局部水印" :code="codes.local.script" />
      </template>
    </DemoSection>

    <!-- 自定义样式示例 -->
    <DemoSection title="自定义样式" desc="自定义水印的外观和属性">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="水印类型" vertical>
            <view class="flex flex-wrap gap-2">
              <wd-button
                size="small"
                :type="customType === 'default' ? 'primary' : 'default'"
                @click="setCustomType('default')"
              >
                默认样式
              </wd-button>
              <wd-button
                size="small"
                :type="customType === 'large' ? 'primary' : 'default'"
                @click="setCustomType('large')"
              >
                大尺寸
              </wd-button>
              <wd-button
                size="small"
                :type="customType === 'colorful' ? 'primary' : 'default'"
                @click="setCustomType('colorful')"
              >
                彩色水印
              </wd-button>
              <wd-button
                size="small"
                :type="customType === 'dense' ? 'primary' : 'default'"
                @click="setCustomType('dense')"
              >
                密集排列
              </wd-button>
            </view>
          </wd-cell>

          <wd-cell title="透明度调节" vertical>
            <view class="flex items-center gap-4">
              <wd-button size="small" @click="decreaseOpacity">降低</wd-button>
              <view class="text-sm">{{ Math.round(customOpacity * 100) }}%</view>
              <wd-button size="small" @click="increaseOpacity">提高</wd-button>
            </view>
          </wd-cell>

          <wd-cell title="旋转角度调节" vertical>
            <view class="flex items-center gap-4">
              <wd-button size="small" @click="decreaseRotate">减少</wd-button>
              <view class="text-sm">{{ customRotate }}°</view>
              <wd-button size="small" @click="increaseRotate">增加</wd-button>
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 自定义样式演示区域 -->
        <view class="relative mx-4 h-48 border rounded-lg bg-white p-4">
          <view class="text-center text-gray-600">自定义样式演示区域</view>

          <!-- 默认样式水印 -->
          <wd-watermark
            v-if="customType === 'default'"
            content="Default Style"
            :width="100"
            :height="60"
            :opacity="customOpacity"
            :rotate="customRotate"
            :full-screen="false"
          />

          <!-- 大尺寸水印 -->
          <wd-watermark
            v-if="customType === 'large'"
            content="Large Size"
            :width="160"
            :height="100"
            :size="36"
            :opacity="customOpacity"
            :rotate="customRotate"
            :full-screen="false"
          />

          <!-- 彩色水印 -->
          <wd-watermark
            v-if="customType === 'colorful'"
            content="Colorful"
            :width="120"
            :height="80"
            :opacity="customOpacity"
            :rotate="customRotate"
            color="#ff4757"
            :full-screen="false"
          />

          <!-- 密集排列水印 -->
          <wd-watermark
            v-if="customType === 'dense'"
            content="Dense"
            :width="80"
            :height="50"
            :gutter-x="10"
            :gutter-y="10"
            :opacity="customOpacity"
            :rotate="customRotate"
            :full-screen="false"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 默认样式" :code="codes.custom.defaultTemplate" />
        <DemoCode title="模板 - 大尺寸水印" :code="codes.custom.largeTemplate" />
        <DemoCode title="模板 - 彩色水印" :code="codes.custom.colorfulTemplate" />
        <DemoCode title="模板 - 密集排列" :code="codes.custom.denseTemplate" />
        <DemoCode title="脚本 - 自定义样式" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和实际应用场景">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="多行文字水印">
            <wd-button @click="toggleMultiLineWatermark">
              {{ multiLineVisible ? '隐藏' : '显示' }}多行水印
            </wd-button>
          </wd-cell>

          <wd-cell title="图文混合水印">
            <wd-button @click="toggleMixedWatermark">
              {{ mixedVisible ? '隐藏' : '显示' }}混合水印
            </wd-button>
          </wd-cell>

          <wd-cell title="版权保护水印">
            <wd-button @click="toggleCopyrightWatermark">
              {{ copyrightVisible ? '隐藏' : '显示' }}版权水印
            </wd-button>
          </wd-cell>
        </wd-cell-group>

        <!-- 高级配置演示区域 -->
        <view
          class="relative mx-4 min-h-48 rounded-lg from-blue-50 to-purple-50 bg-gradient-to-br p-4"
        >
          <view class="mb-4 text-center text-lg font-medium">高级配置演示</view>
          <view class="text-gray-600 leading-relaxed">
            这里展示了水印组件的高级功能，包括多样式配置、复杂场景应用等。适用于需要版权保护、品牌宣传等场景。
          </view>

          <!-- 多行文字水印 -->
          <wd-watermark
            v-if="multiLineVisible"
            content="Multi Line Watermark"
            :width="150"
            :height="80"
            :opacity="0.15"
            :rotate="-30"
            :size="24"
            :full-screen="false"
          />

          <!-- 图文混合水印（这里用文字模拟，实际可以结合图片） -->
          <wd-watermark
            v-if="mixedVisible"
            image="https://wot-design-uni.cn/logo.png"
            :width="100"
            :height="100"
            :image-width="30"
            :image-height="30"
            :opacity="0.2"
            :rotate="0"
            :full-screen="false"
          />

          <!-- 版权保护水印 -->
          <wd-watermark
            v-if="copyrightVisible"
            content="© 2024 Copyright"
            :width="140"
            :height="60"
            :opacity="0.25"
            :rotate="-45"
            color="#666666"
            :size="20"
            :full-screen="false"
          />
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 多行文字水印" :code="codes.advanced.multiLineTemplate" />
        <DemoCode title="模板 - 图文混合水印" :code="codes.advanced.mixedTemplate" />
        <DemoCode title="模板 - 版权保护水印" :code="codes.advanced.copyrightTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基本水印状态
const basicWatermarkType = ref<'text' | 'image' | ''>('')

// 局部水印状态
const localWatermarkVisible = ref<boolean>(false)

// 自定义样式状态
const customType = ref<'default' | 'large' | 'colorful' | 'dense'>('default')
const customOpacity = ref<number>(0.3)
const customRotate = ref<number>(-25)

// 高级配置状态
const multiLineVisible = ref<boolean>(false)
const mixedVisible = ref<boolean>(false)
const copyrightVisible = ref<boolean>(false)

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    textTemplate: `<!-- 文字水印 -->
<wd-watermark
  content="wot-design-uni"
  :width="130"
  :height="140"
  :opacity="0.3"
  :full-screen="true"
/>`,

    imageTemplate: `<!-- 图片水印 -->
<wd-watermark
  image="https://wot-design-uni.cn/logo.png"
  :width="130"
  :height="140"
  :image-width="38"
  :image-height="38"
  :opacity="0.3"
  :full-screen="true"
/>`,

    script: `import { ref } from 'vue'

const basicWatermarkType = ref('')

// 显示文字水印
const showTextWatermark = () => {
  basicWatermarkType.value = 'text'
}

// 显示图片水印
const showImageWatermark = () => {
  basicWatermarkType.value = 'image'
}

// 清除水印
const clearWatermark = () => {
  basicWatermarkType.value = ''
}`,
  },

  // 局部水印代码
  local: {
    template: `<!-- 局部水印容器 -->
<view class="relative mx-4 h-64 rounded-lg bg-gray-50 p-4">
  <view class="mb-4 text-center text-lg font-medium">局部水印演示区域</view>
  <view class="text-gray-600">
    这是一个演示局部水印的容器，水印只会在这个区域内显示。
  </view>

  <!-- 局部水印 -->
  <wd-watermark
    v-if="localWatermarkVisible"
    content="Local Watermark"
    :width="120"
    :height="80"
    :opacity="0.2"
    :full-screen="false"
    :rotate="-15"
    color="#1890ff"
  />
</view>`,

    script: `const localWatermarkVisible = ref(false)

// 切换局部水印显示状态
const toggleLocalWatermark = () => {
  localWatermarkVisible.value = !localWatermarkVisible.value
}`,
  },

  // 自定义样式代码
  custom: {
    defaultTemplate: `<!-- 默认样式水印 -->
<wd-watermark
  content="Default Style"
  :width="100"
  :height="60"
  :opacity="customOpacity"
  :rotate="customRotate"
  :full-screen="false"
/>`,

    largeTemplate: `<!-- 大尺寸水印 -->
<wd-watermark
  content="Large Size"
  :width="160"
  :height="100"
  :size="36"
  :opacity="customOpacity"
  :rotate="customRotate"
  :full-screen="false"
/>`,

    colorfulTemplate: `<!-- 彩色水印 -->
<wd-watermark
  content="Colorful"
  :width="120"
  :height="80"
  :opacity="customOpacity"
  :rotate="customRotate"
  color="#ff4757"
  :full-screen="false"
/>`,

    denseTemplate: `<!-- 密集排列水印 -->
<wd-watermark
  content="Dense"
  :width="80"
  :height="50"
  :gutter-x="10"
  :gutter-y="10"
  :opacity="customOpacity"
  :rotate="customRotate"
  :full-screen="false"
/>`,

    script: `const customType = ref('default')
const customOpacity = ref(0.3)
const customRotate = ref(-25)

// 设置自定义类型
const setCustomType = (type) => {
  customType.value = type
}

// 调节透明度
const decreaseOpacity = () => {
  if (customOpacity.value > 0.1) {
    customOpacity.value = Math.max(0.1, customOpacity.value - 0.1)
  }
}

const increaseOpacity = () => {
  if (customOpacity.value < 0.9) {
    customOpacity.value = Math.min(0.9, customOpacity.value + 0.1)
  }
}

// 调节旋转角度
const decreaseRotate = () => {
  customRotate.value = Math.max(-90, customRotate.value - 15)
}

const increaseRotate = () => {
  customRotate.value = Math.min(90, customRotate.value + 15)
}`,
  },

  // 高级配置代码
  advanced: {
    multiLineTemplate: `<!-- 多行文字水印 -->
<wd-watermark
  content="Multi Line Watermark"
  :width="150"
  :height="80"
  :opacity="0.15"
  :rotate="-30"
  :size="24"
  :full-screen="false"
/>`,

    mixedTemplate: `<!-- 图文混合水印 -->
<wd-watermark
  image="https://wot-design-uni.cn/logo.png"
  :width="100"
  :height="100"
  :image-width="30"
  :image-height="30"
  :opacity="0.2"
  :rotate="0"
  :full-screen="false"
/>`,

    copyrightTemplate: `<!-- 版权保护水印 -->
<wd-watermark
  content="© 2024 Copyright"
  :width="140"
  :height="60"
  :opacity="0.25"
  :rotate="-45"
  color="#666666"
  :size="20"
  :full-screen="false"
/>`,

    script: `const multiLineVisible = ref(false)
const mixedVisible = ref(false)
const copyrightVisible = ref(false)

// 切换多行文字水印
const toggleMultiLineWatermark = () => {
  multiLineVisible.value = !multiLineVisible.value
}

// 切换图文混合水印
const toggleMixedWatermark = () => {
  mixedVisible.value = !mixedVisible.value
}

// 切换版权保护水印
const toggleCopyrightWatermark = () => {
  copyrightVisible.value = !copyrightVisible.value
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'content',
    type: 'String',
    default: '""',
    desc: '显示内容',
  },
  {
    name: 'image',
    type: 'String',
    default: '""',
    desc: '显示图片的地址，支持网络图片和base64（钉钉小程序仅支持网络图片）',
  },
  {
    name: 'image-height',
    type: 'Number',
    default: '200',
    desc: '图片高度，单位rpx',
  },
  {
    name: 'image-width',
    type: 'Number',
    default: '200',
    desc: '图片宽度，单位rpx',
  },
  {
    name: 'gutter-x',
    type: 'Number',
    default: '0',
    desc: 'X轴间距，单位rpx',
  },
  {
    name: 'gutter-y',
    type: 'Number',
    default: '0',
    desc: 'Y轴间距，单位rpx',
  },
  {
    name: 'width',
    type: 'Number',
    default: '200',
    desc: 'canvas画布宽度，单位rpx',
  },
  {
    name: 'height',
    type: 'Number',
    default: '200',
    desc: 'canvas画布高度，单位rpx',
  },
  {
    name: 'full-screen',
    type: 'Boolean',
    default: 'true',
    desc: '是否为全屏水印',
  },
  {
    name: 'color',
    type: 'String',
    default: '"#8c8c8c"',
    desc: '水印字体颜色',
  },
  {
    name: 'size',
    type: 'Number',
    default: '28',
    desc: '水印字体大小，单位rpx',
  },
  {
    name: 'font-style',
    type: 'String',
    default: '"normal"',
    desc: '水印字体样式（仅微信和h5支持），可能的值：normal、italic、oblique',
  },
  {
    name: 'font-weight',
    type: 'Number | String',
    default: '"normal"',
    desc: '水印字体的粗细（仅微信和h5支持）',
  },
  {
    name: 'font-family',
    type: 'String',
    default: '"PingFang SC"',
    desc: '水印字体系列（仅微信和h5支持）',
  },
  {
    name: 'rotate',
    type: 'Number',
    default: '-25',
    desc: '水印旋转角度',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '1100',
    desc: '自定义层级',
  },
  {
    name: 'opacity',
    type: 'Number',
    default: '0.5',
    desc: '自定义透明度，取值 0~1',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
]

// ===== 基本用法事件处理 =====

/**
 * 显示文字水印
 */
const showTextWatermark = () => {
  basicWatermarkType.value = 'text'
  console.log('显示文字水印')
}

/**
 * 显示图片水印
 */
const showImageWatermark = () => {
  basicWatermarkType.value = 'image'
  console.log('显示图片水印')
}

/**
 * 清除水印
 */
const clearWatermark = () => {
  basicWatermarkType.value = ''
  console.log('清除水印')
}

// ===== 局部水印事件处理 =====

/**
 * 切换局部水印显示状态
 */
const toggleLocalWatermark = () => {
  localWatermarkVisible.value = !localWatermarkVisible.value
  console.log('切换局部水印:', localWatermarkVisible.value)
}

// ===== 自定义样式事件处理 =====

/**
 * 设置自定义类型
 */
const setCustomType = (type: 'default' | 'large' | 'colorful' | 'dense') => {
  customType.value = type
  console.log('设置自定义类型:', type)
}

/**
 * 降低透明度
 */
const decreaseOpacity = () => {
  if (customOpacity.value > 0.1) {
    customOpacity.value = Math.max(0.1, Number((customOpacity.value - 0.1).toFixed(1)))
    console.log('降低透明度:', customOpacity.value)
  }
}

/**
 * 提高透明度
 */
const increaseOpacity = () => {
  if (customOpacity.value < 0.9) {
    customOpacity.value = Math.min(0.9, Number((customOpacity.value + 0.1).toFixed(1)))
    console.log('提高透明度:', customOpacity.value)
  }
}

/**
 * 减少旋转角度
 */
const decreaseRotate = () => {
  customRotate.value = Math.max(-90, customRotate.value - 15)
  console.log('减少旋转角度:', customRotate.value)
}

/**
 * 增加旋转角度
 */
const increaseRotate = () => {
  customRotate.value = Math.min(90, customRotate.value + 15)
  console.log('增加旋转角度:', customRotate.value)
}

// ===== 高级配置事件处理 =====

/**
 * 切换多行文字水印
 */
const toggleMultiLineWatermark = () => {
  multiLineVisible.value = !multiLineVisible.value
  console.log('切换多行文字水印:', multiLineVisible.value)
}

/**
 * 切换图文混合水印
 */
const toggleMixedWatermark = () => {
  mixedVisible.value = !mixedVisible.value
  console.log('切换图文混合水印:', mixedVisible.value)
}

/**
 * 切换版权保护水印
 */
const toggleCopyrightWatermark = () => {
  copyrightVisible.value = !copyrightVisible.value
  console.log('切换版权保护水印:', copyrightVisible.value)
}

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop()
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 相对定位容器
.relative {
  position: relative;
}

// 渐变背景样式
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #eff6ff, #f3e8ff);
}

.from-blue-50 {
  --tw-gradient-from: #eff6ff;
}

.to-purple-50 {
  --tw-gradient-to: #f3e8ff;
}
</style>
