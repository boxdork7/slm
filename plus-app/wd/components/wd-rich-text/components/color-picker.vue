<!-- 颜色选择器 -->
<template>
  <!-- 颜色选择器主容器，当show为true时显示，阻止触摸移动事件 -->
  <view v-if="show" class="t-wrapper" @touchmove.stop.prevent="moveHandle">
    <!-- 背景遮罩层，点击可关闭颜色选择器 -->
    <view class="t-mask" :class="{ active }" @click.stop="close" />

    <!-- 颜色选择器主体容器 -->
    <view class="t-box" :class="{ active }">
      <!-- 顶部操作栏：取消和确认按钮 -->
      <view class="t-header">
        <view class="t-header-button" @click="close">取消</view>
        <view class="t-header-button" @click="confirm">确认</view>
      </view>

      <!-- 主颜色选择区域，背景色由当前色调决定 -->
      <view
        class="t-color__box"
        :style="{ background: `rgb(${bgcolor.r},${bgcolor.g},${bgcolor.b})` }"
      >
        <!-- 颜色选择画布：支持触摸选择饱和度和亮度 -->
        <view
          class="t-background boxs"
          @touchstart="touchstart($event, 0)"
          @touchmove="touchmove($event, 0)"
          @touchend="touchend($event, 0)"
        >
          <!-- 颜色渐变遮罩：从白到透明（水平），从透明到黑（垂直） -->
          <view class="t-color-mask" />
          <!-- 颜色选择指针，位置根据当前饱和度和亮度计算 -->
          <view
            class="t-pointer"
            :style="{ top: `${site[0].top - 8}px`, left: `${site[0].left - 8}px` }"
          />
        </view>
      </view>

      <!-- 颜色控制区域 -->
      <view class="t-control__box">
        <!-- 当前选中颜色预览 -->
        <view class="t-control__color">
          <view
            class="t-control__color-content"
            :style="{ background: `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})` }"
          />
        </view>

        <!-- 色调和透明度控制滑块容器 -->
        <view class="t-control-box__item">
          <!-- 色调滑块：控制颜色的色相值（H） -->
          <view
            class="t-controller boxs"
            @touchstart="touchstart($event, 1)"
            @touchmove="touchmove($event, 1)"
            @touchend="touchend($event, 1)"
          >
            <view class="t-hue">
              <view class="t-circle" :style="{ left: `${site[1].left - 12}px` }" />
            </view>
          </view>

          <!-- 透明度滑块：控制颜色的透明度（A） -->
          <view
            class="t-controller boxs"
            @touchstart="touchstart($event, 2)"
            @touchmove="touchmove($event, 2)"
            @touchend="touchend($event, 2)"
          >
            <view class="t-transparency">
              <view class="t-circle" :style="{ left: `${site[2].left - 12}px` }" />
            </view>
          </view>
        </view>
      </view>

      <!-- 颜色值显示区域 -->
      <view class="t-result__box">
        <!-- HEX模式：显示十六进制颜色值 -->
        <view v-if="mode" class="t-result__item">
          <view class="t-result__box-input">{{ hex }}</view>
          <view class="t-result__box-text">HEX</view>
        </view>

        <!-- RGBA模式：分别显示红、绿、蓝、透明度值 -->
        <template v-else>
          <view class="t-result__item">
            <view class="t-result__box-input">{{ rgba.r }}</view>
            <view class="t-result__box-text">R</view>
          </view>
          <view class="t-result__item">
            <view class="t-result__box-input">{{ rgba.g }}</view>
            <view class="t-result__box-text">G</view>
          </view>
          <view class="t-result__item">
            <view class="t-result__box-input">{{ rgba.b }}</view>
            <view class="t-result__box-text">B</view>
          </view>
          <view class="t-result__item">
            <view class="t-result__box-input">{{ rgba.a }}</view>
            <view class="t-result__box-text">A</view>
          </view>
        </template>

        <!-- 切换显示模式按钮：HEX和RGBA之间切换 -->
        <view class="t-result__item t-select" @click="select">
          <view class="t-result__box-input">
            <view>切换</view>
            <view>模式</view>
          </view>
        </view>
      </view>

      <!-- 预设颜色选择区域 -->
      <view class="t-alternative">
        <view v-for="(item, index) in colorList" :key="index" class="t-alternative__item">
          <view
            class="t-alternative__item-content"
            :style="{ background: `rgba(${item.r},${item.g},${item.b},${item.a})` }"
            @click="selectColor(item)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, getCurrentInstance } from 'vue'

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// ========== 类型定义 ==========
/** RGBA颜色值接口 */
interface ColorValue {
  r: number // 红色分量 (0-255)
  g: number // 绿色分量 (0-255)
  b: number // 蓝色分量 (0-255)
  a: number // 透明度 (0-1)
}

/** HSB颜色值接口（色相、饱和度、亮度） */
interface HSBValue {
  h: number // 色相 (0-360)
  s: number // 饱和度 (0-100)
  b: number // 亮度 (0-100)
}

/** 选择器位置信息 */
interface SitePosition {
  top?: number // 垂直位置
  left: number // 水平位置
}

/** 元素位置和尺寸信息 */
interface Position {
  top: number
  left: number
  width: number
  height: number
}

// ========== 组件属性定义 ==========
interface ColorPickerProps {
  color?: ColorValue // 初始颜色值
  spareColor?: ColorValue[] // 预设颜色列表
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  color: () => ({ r: 0, g: 0, b: 0, a: 0 }),
  spareColor: () => [],
})

// ========== 事件定义 ==========
const emit = defineEmits<{
  confirm: [data: { rgba: ColorValue; hex: string }] // 确认选择颜色事件
}>()

// ========== 响应式数据 ==========
const show = ref<boolean>(false) // 控制选择器显示/隐藏
const active = ref<boolean>(false) // 控制选择器激活动画
const rgba = ref<ColorValue>({ r: 0, g: 0, b: 0, a: 1 }) // 当前选中的RGBA值
const hsb = ref<HSBValue>({ h: 0, s: 0, b: 0 }) // 当前选中的HSB值
const site = ref<SitePosition[]>([
  // 各个控制器的位置信息
  { top: 0, left: 0 }, // 主色选择器位置
  { left: 0 }, // 色调滑块位置
  { left: 0 }, // 透明度滑块位置
])
const index = ref<number>(0) // 当前操作的控制器索引
const bgcolor = ref<ColorValue>({ r: 255, g: 0, b: 0, a: 1 }) // 主色选择区域背景色
const hex = ref<string>('#000000') // 十六进制颜色值
const mode = ref<boolean>(true) // 显示模式：true为HEX，false为RGBA
const position = ref<Position[]>([]) // 各个控制器的位置和尺寸信息

// 触摸事件相关变量
let moveX = 0 // 当前触摸X坐标
let moveY = 0 // 当前触摸Y坐标

// 默认预设颜色列表（Material Design颜色）
const colorList = ref<ColorValue[]>([
  { r: 244, g: 67, b: 54, a: 1 }, // 红色
  { r: 233, g: 30, b: 99, a: 1 }, // 粉红色
  { r: 156, g: 39, b: 176, a: 1 }, // 紫色
  { r: 103, g: 58, b: 183, a: 1 }, // 深紫色
  { r: 63, g: 81, b: 181, a: 1 }, // 靛蓝色
  { r: 33, g: 150, b: 243, a: 1 }, // 蓝色
  { r: 3, g: 169, b: 244, a: 1 }, // 浅蓝色
  { r: 0, g: 188, b: 212, a: 1 }, // 青色
  { r: 0, g: 150, b: 136, a: 1 }, // 蓝绿色
  { r: 76, g: 175, b: 80, a: 1 }, // 绿色
  { r: 139, g: 195, b: 74, a: 1 }, // 浅绿色
  { r: 205, g: 220, b: 57, a: 1 }, // 柠檬色
  { r: 255, g: 235, b: 59, a: 1 }, // 黄色
  { r: 255, g: 193, b: 7, a: 1 }, // 琥珀色
  { r: 255, g: 152, b: 0, a: 1 }, // 橙色
  { r: 255, g: 87, b: 34, a: 1 }, // 深橙色
  { r: 121, g: 85, b: 72, a: 1 }, // 棕色
  { r: 158, g: 158, b: 158, a: 1 }, // 灰色
  { r: 0, g: 0, b: 0, a: 0.5 }, // 半透明黑色
  { r: 0, g: 0, b: 0, a: 0 }, // 透明
])

// ========== 核心方法定义 ==========

/**
 * 初始化颜色选择器
 * 设置初始颜色值和预设颜色列表
 */
const ready = () => {
  rgba.value = props.color
  if (props.spareColor.length !== 0) {
    colorList.value = props.spareColor
  }
}

/**
 * RGB颜色值转换为十六进制字符串
 * @param rgb RGB颜色对象
 * @returns 十六进制颜色字符串（不含#前缀）
 */
const rgbToHex = (rgb: ColorValue): string => {
  const hexArr = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)]
  hexArr.forEach((str, i) => {
    if (str.length === 1) {
      hexArr[i] = `0${str}` // 补零确保两位数
    }
  })
  return hexArr.join('')
}

/**
 * RGB颜色值转换为HSB颜色值
 * @param rgb RGB颜色对象
 * @returns HSB颜色对象
 */
const rgbToHsb = (rgb: ColorValue): HSBValue => {
  const hsb = {
    h: 0,
    s: 0,
    b: 0,
  }
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const delta = max - min

  // 计算亮度（Brightness）
  hsb.b = max

  // 计算饱和度（Saturation）
  hsb.s = max !== 0 ? (255 * delta) / max : 0

  // 计算色相（Hue）
  if (hsb.s !== 0) {
    if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta
    else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta
    else hsb.h = 4 + (rgb.r - rgb.g) / delta
  } else {
    hsb.h = -1
  }

  hsb.h *= 60
  if (hsb.h < 0) hsb.h = 0

  // 转换为百分比
  hsb.s *= 100 / 255
  hsb.b *= 100 / 255

  return hsb
}

/**
 * HSB颜色值转换为RGB颜色值
 * @param hsb HSB颜色对象
 * @returns RGB颜色对象
 */
const HSBToRGB = (hsb: HSBValue): ColorValue => {
  const rgb: any = {}
  let h = Math.round(hsb.h)
  const s = Math.round((hsb.s * 255) / 100)
  const v = Math.round((hsb.b * 255) / 100)

  if (s === 0) {
    // 灰色
    rgb.r = rgb.g = rgb.b = v
  } else {
    const t1 = v
    const t2 = ((255 - s) * v) / 255
    const t3 = ((t1 - t2) * (h % 60)) / 60

    if (h === 360) h = 0

    // 根据色相区间计算RGB值
    if (h < 60) {
      rgb.r = t1
      rgb.b = t2
      rgb.g = t2 + t3
    } else if (h < 120) {
      rgb.g = t1
      rgb.b = t2
      rgb.r = t1 - t3
    } else if (h < 180) {
      rgb.g = t1
      rgb.r = t2
      rgb.b = t2 + t3
    } else if (h < 240) {
      rgb.b = t1
      rgb.r = t2
      rgb.g = t1 - t3
    } else if (h < 300) {
      rgb.b = t1
      rgb.g = t2
      rgb.r = t2 + t3
    } else if (h < 360) {
      rgb.r = t1
      rgb.g = t2
      rgb.b = t1 - t3
    } else {
      rgb.r = 0
      rgb.g = 0
      rgb.b = 0
    }
  }

  return {
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b),
    a: 1,
  }
}

/**
 * 更新十六进制颜色值显示
 * @param rgb RGB颜色对象
 */
const setValue = (rgb: ColorValue) => {
  hex.value = `#${rgbToHex(rgb)}`
}

/**
 * 根据HSB值设置RGB颜色
 */
const setColor = () => {
  const rgb = HSBToRGB(hsb.value)
  rgba.value.r = rgb.r
  rgba.value.g = rgb.g
  rgba.value.b = rgb.b
}

/**
 * 设置控制器值（色调或透明度）
 * @param idx 控制器索引（1=色调，2=透明度）
 * @param x 水平位置
 */
const setControl = (idx: number, x: number) => {
  const { top, left, width, height } = position.value[idx]

  if (idx === 1) {
    // 设置色调
    hsb.value.h = Number.parseInt(((360 * x) / width).toString())
    bgcolor.value = HSBToRGB({
      h: hsb.value.h,
      s: 100,
      b: 100,
    })
    setColor()
  } else {
    // 设置透明度
    rgba.value.a = Number.parseFloat((x / width).toFixed(1))
  }
  setValue(rgba.value)
}

/**
 * 设置选择器位置并更新颜色值
 * @param x 触摸X坐标
 * @param y 触摸Y坐标
 * @param idx 控制器索引
 */
const setPosition = (x: number, y: number, idx: number) => {
  index.value = idx
  const { top, left, width, height } = position.value[idx]

  // 限制位置在有效范围内
  site.value[idx].left = Math.max(0, Math.min(Number.parseInt((x - left).toString()), width))

  if (idx === 0) {
    // 主色选择器：同时设置垂直和水平位置
    site.value[idx].top = Math.max(0, Math.min(Number.parseInt((y - top).toString()), height))

    // 根据位置计算饱和度和亮度
    hsb.value.s = Number.parseInt(((100 * site.value[idx].left) / width).toString())
    hsb.value.b = Number.parseInt((100 - (100 * site.value[idx].top) / height).toString())

    setColor()
    setValue(rgba.value)
  } else {
    // 色调或透明度滑块：只设置水平位置
    setControl(idx, site.value[idx].left)
  }
}

/**
 * 根据HSB值更新选择器界面位置
 */
const changeViewByHsb = () => {
  const [a, b, c] = position.value

  // 设置主色选择器位置
  site.value[0].left = Number.parseInt(((hsb.value.s * a.width) / 100).toString())
  site.value[0].top = Number.parseInt((((100 - hsb.value.b) * a.height) / 100).toString())

  setColor()
  setValue(rgba.value)

  // 设置背景色
  bgcolor.value = HSBToRGB({
    h: hsb.value.h,
    s: 100,
    b: 100,
  })

  // 设置色调和透明度滑块位置
  site.value[1].left = (hsb.value.h / 360) * b.width
  site.value[2].left = rgba.value.a * c.width
}

/**
 * 通过选择预设颜色设置当前颜色
 * @param getrgb 预设的RGB颜色值
 */
const setColorBySelect = (getrgb: ColorValue) => {
  const { r, g, b, a } = getrgb
  const rgb: ColorValue = {
    r: r ? Number.parseInt(r.toString()) : 0,
    g: g ? Number.parseInt(g.toString()) : 0,
    b: b ? Number.parseInt(b.toString()) : 0,
    a: a || 0,
  }
  rgba.value = rgb
  hsb.value = rgbToHsb(rgb)
  changeViewByHsb()
}

/**
 * 获取DOM元素的位置和尺寸信息
 */
const getSelectorQuery = () => {
  const views = uni.createSelectorQuery().in(proxy)
  views
    .selectAll('.boxs')
    .boundingClientRect((data: any) => {
      if (!data || data.length === 0) {
        // 如果获取失败，延迟重试
        setTimeout(() => getSelectorQuery(), 20)
        return
      }
      position.value = data
      setColorBySelect(rgba.value)
    })
    .exec()
}

/**
 * 初始化颜色选择器
 */
const init = () => {
  hsb.value = rgbToHsb(rgba.value)
  setValue(rgba.value)
}

/**
 * 处理触摸移动事件（空函数，用于阻止默认行为）
 */
const moveHandle = () => {}

/**
 * 打开颜色选择器
 */
const open = () => {
  show.value = true
  nextTick(() => {
    init()
    setTimeout(() => {
      active.value = true
      setTimeout(() => {
        getSelectorQuery()
      }, 350)
    }, 50)
  })
}

/**
 * 关闭颜色选择器
 */
const close = () => {
  active.value = false
  nextTick(() => {
    setTimeout(() => {
      show.value = false
    }, 500)
  })
}

/**
 * 确认选择当前颜色
 */
const confirm = () => {
  close()
  emit('confirm', {
    rgba: rgba.value,
    hex: hex.value,
  })
}

/**
 * 切换显示模式（HEX/RGBA）
 */
const select = () => {
  mode.value = !mode.value
}

/**
 * 选择预设颜色
 * @param item 预设颜色对象
 */
const selectColor = (item: ColorValue) => {
  setColorBySelect(item)
}

/**
 * 触摸开始事件处理
 * @param e 触摸事件对象
 * @param index 控制器索引
 */
const touchstart = (e: any, index: number) => {
  const { pageX, pageY, clientX, clientY } = e.touches[0]
  moveX = clientX || pageX
  moveY = clientY || pageY
  setPosition(moveX, moveY, index)
}

/**
 * 触摸移动事件处理
 * @param e 触摸事件对象
 * @param index 控制器索引
 */
const touchmove = (e: any, index: number) => {
  const { pageX, pageY, clientX, clientY } = e.touches[0]
  moveX = clientX || pageX
  moveY = clientY || pageY
  setPosition(moveX, moveY, index)
}

/**
 * 触摸结束事件处理
 * @param e 触摸事件对象
 * @param index 控制器索引
 */
const touchend = (e: any, index: number) => {
  // 触摸结束时无需特殊处理
}

/**
 * 十六进制颜色字符串转换为RGB颜色对象
 * @param hexColor 十六进制颜色字符串（含#前缀）
 * @param alpha 透明度值，默认为1
 * @returns RGB颜色对象
 */
const hex2Rgb = (hexColor: string, alpha: number = 1): ColorValue => {
  const color = hexColor.slice(1) // 移除#前缀
  const r = Number.parseInt(color.slice(0, 2), 16)
  const g = Number.parseInt(color.slice(2, 4), 16)
  const b = Number.parseInt(color.slice(4, 6), 16)
  return {
    r,
    g,
    b,
    a: alpha,
  }
}

// ========== 监听器 ==========

// 监听预设颜色列表变化
watch(
  () => props.spareColor,
  (newVal: ColorValue[]) => {
    colorList.value = newVal
  },
)

// 监听初始颜色变化
watch(
  () => props.color,
  () => {
    ready()
  },
)

// ========== 初始化 ==========
ready()

// ========== 导出方法供父组件调用 ==========
defineExpose({
  open, // 打开颜色选择器
  close, // 关闭颜色选择器
  hex2Rgb, // 十六进制转RGB工具方法
})
</script>

<style scoped>
/* 组件根容器：固定定位，覆盖整个屏幕 */
.t-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 9999;
}

/* 主内容容器：从底部滑入动画 */
.t-box {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 30rpx 0;
  padding-top: 0;
  background: #fff;
  transition: all 0.3s;
  transform: translateY(100%);
}

.t-box.active {
  transform: translateY(0%);
}

/* 顶部操作栏样式 */
.t-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100rpx;
  border-bottom: 1px #eee solid;
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.t-header-button {
  display: flex;
  align-items: center;
  width: 150rpx;
  height: 100rpx;
  font-size: 30rpx;
  color: #666;
  padding-left: 20rpx;
}

.t-header-button:last-child {
  justify-content: flex-end;
  padding-right: 20rpx;
}

/* 背景遮罩：点击关闭选择器 */
.t-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
  transition: all 0.3s;
  opacity: 0;
}

.t-mask.active {
  opacity: 1;
}

/* 主颜色选择区域容器 */
.t-color__box {
  position: relative;
  height: 400rpx;
  background: rgb(255, 0, 0);
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 20rpx;
  margin-top: 20rpx;
  box-sizing: border-box;
}

/* 颜色选择背景：白色到透明的水平渐变 */
.t-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

/* 颜色遮罩：透明到黑色的垂直渐变 */
.t-color-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 400upx;
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

/* 颜色选择指针 */
.t-pointer {
  position: absolute;
  bottom: -8px;
  left: -8px;
  z-index: 2;
  width: 15px;
  height: 15px;
  border: 1px #fff solid;
  border-radius: 50%;
}

/* 颜色显示样式 */
.t-show-color {
  width: 100upx;
  height: 50upx;
}

/* 控制区域容器 */
.t-control__box  {
  margin-top: 50rpx;
  width: 100%;
  display: flex;
  padding-left: 20rpx;
  box-sizing: border-box;
}

/* 当前颜色预览：带棋盘格背景显示透明度 */
.t-control__color {
  flex-shrink: 0;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
  background-size: 36rpx 36rpx;
  background-position:
    0 0,
    18rpx 18rpx;
  border: 1px #eee solid;
  overflow: hidden;
}

.t-control__color-content {
  width: 100%;
  height: 100%;
}

/* 控制滑块容器 */
.t-control-box__item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 0 30rpx;
}

/* 滑块控制器基础样式：带棋盘格背景 */
.t-controller {
  position: relative;
  width: 100%;
  height: 16px;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
  background-size: 32rpx 32rpx;
  background-position:
    0 0,
    16rpx 16rpx;
}

/* 色调滑块：彩虹渐变 */
.t-hue {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
}

/* 透明度滑块：透明到黑色渐变 */
.t-transparency {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0));
}

/* 滑块圆形控制器 */
.t-circle {
  position: absolute;
  top: -2px;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
}

/* 颜色值显示区域 */
.t-result__box {
  margin-top: 20rpx;
  padding: 10rpx;
  width: 100%;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

.t-result__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  flex: 1;
  box-sizing: border-box;
}

/* 颜色值输入框样式 */
.t-result__box-input {
  padding: 10rpx 0;
  width: 100%;
  font-size: 28rpx;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  color: #999;
  text-align: center;
  background: #fff;
}

.t-result__box-text {
  margin-top: 10rpx;
  font-size: 28rpx;
  line-height: 2;
}

/* 模式切换按钮 */
.t-select {
  flex: none;
  width: 120rpx;
  padding: 0 10rpx;
}

.t-select .t-result__box-input {
  border-radius: 10rpx;
  border: none;
  color: #999;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.t-select .t-result__box-input:active {
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
}

/* 预设颜色选择区域 */
.t-alternative {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-right: 10rpx;
  box-sizing: border-box;
}

/* 预设颜色项容器：带棋盘格背景 */
.t-alternative__item {
  margin-left: 12rpx;
  margin-top: 10rpx;
  width: 50rpx;
  height: 50rpx;
  border-radius: 10rpx;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
  background-size: 36rpx 36rpx;
  background-position:
    0 0,
    18rpx 18rpx;
  border: 1px #eee solid;
  overflow: hidden;
}

/* 预设颜色内容 */
.t-alternative__item-content {
  width: 50rpx;
  height: 50rpx;
  background: rgba(255, 0, 0, 0.5);
}

/* 预设颜色点击效果 */
.t-alternative__item:active {
  transition: all 0.3s;
  transform: scale(1.1);
}
</style>
