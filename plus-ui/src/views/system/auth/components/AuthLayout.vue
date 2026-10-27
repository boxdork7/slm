<!-- 认证页外壳(登录/注册/找回密码通用)：背景图 + 粒子 + logo + 工具栏 + 页脚 -->
<template>
  <div class="auth-layout" :class="[`is-${effectiveAlign}`]">
    <!--
      ① 背景层
      浅色：纯白底 + 主题色渐变（CSS 实时推导，切主题色即变；可由 gradient 关掉）
      暗黑：内置深色底图 —— 否则深色卡片浮在近白背景上会严重割裂
      自定义了 background 则完全听它的
    -->
    <div class="auth-bg" :class="{ 'has-gradient': useThemeGradient }" :style="bgStyle" />

    <!-- ② 粒子层：叠在背景图之上、内容之下。tone 必须跟着底图走，否则粒子在反色底上看不清 -->
    <AParticleCanvas ref="particleRef" :effect="particle" :tone="tone" :avoid-selectors="AVOID_SELECTORS" :focus-selector="FOCUS_SELECTOR" />

    <!-- ③ 左上角品牌区 -->
    <a class="auth-brand" href="https://ruoyi.plus" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/logo/logo.png" class="brand-logo" alt="logo" />
      <span class="brand-name">ruoyi-plus-uniapp</span>
    </a>

    <!-- ④ 右上角工具栏 -->
    <div class="auth-tools">
      <AThemeColorPicker :current-color="currentThemeColor" @change="handleThemeColorChange" />
      <div class="tool-btn">
        <LangSelect :show-tooltip="false" :show-animate="false" :show-background="false" />
      </div>
      <div class="tool-btn" @click="toggleDarkModeWithAnimation">
        <Icon size="20px" :code="isDark ? 'sun' : 'moon'" />
      </div>
    </div>

    <!-- ⑤ 内容区：表单卡片由各页面通过默认插槽传入 -->
    <div class="auth-body">
      <div class="auth-card">
        <slot />
      </div>
    </div>

    <!-- ⑥ 页脚 -->
    <div class="auth-footer">
      <span>Copyright © 2025-{{ currentYear }} 抓蛙师(qq:770492966) All Rights Reserved.</span>
      <a v-if="icpRecord" :href="ICP_QUERY_URL" target="_blank" class="icp-link" rel="noopener noreferrer">
        {{ icpRecord }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import AParticleCanvas from '@/components/ATheme/AParticleCanvas.vue'
import AThemeColorPicker from '@/components/ATheme/AThemeColorPicker.vue'
import LangSelect from '@/layouts/components/Navbar/tools/LangSelect.vue'
import { SystemConfig, LoginAlign, LoginParticle } from '@/systemConfig'
import { toggleThemeWithAnimation } from '@/utils/themeAnimation'

/**
 * 内置深色底图（public 目录，随包原样输出）
 * 放 public 而不是 src/assets：使用者直接覆盖这个文件就能换背景，
 * 不用改代码、也不用重新构建。
 */
const DEFAULT_BG_DARK = '/login-bg-dark.png'

/**
 * 认证页外壳
 *
 * 三页(登录/注册/找回密码)共用，负责除表单以外的一切：
 * 背景图、粒子、品牌区、工具栏、页脚、表单对齐与响应式。
 * 页面本身只需把表单内容塞进默认插槽。
 */
interface Props {
  /** 浅色模式背景图，留空取 SystemConfig.login.background；再空则纯白 + 主题色渐变 */
  background?: string
  /** 暗黑模式背景图，留空取 SystemConfig.login.backgroundDark；再空则用内置深色底图 */
  backgroundDark?: string
  /** 浅色模式是否叠加主题色渐变，留空取 SystemConfig.login.gradient */
  gradient?: boolean
  /** 粒子效果，留空取 SystemConfig.login.particle */
  particleEffect?: LoginParticle
  /** 表单水平位置，留空取 SystemConfig.login.align */
  align?: LoginAlign
}

/*
  🔴 gradient 必须显式给 undefined 默认值。
  Vue 对声明为 boolean 的 prop 有隐式布尔转换：外部不传时会被规整成 false 而不是 undefined，
  于是 `props.gradient ?? SystemConfig.login.gradient` 永远短路在 false，配置回落被架空。
  只有显式声明默认 undefined 才能让「不传 = 用配置」成立。
*/
const props = withDefaults(defineProps<Props>(), { gradient: undefined })

/** ICP 备案号，留空则不显示 */
const icpRecord = ref('粤ICP备2021091549号-1')
const ICP_QUERY_URL = 'https://beian.miit.gov.cn/'

/**
 * 粒子避让区：这些元素周围的粒子会淡出，避免盖住 logo 与工具栏图标。
 * 用选择器而非硬编码坐标 —— 不同字号、i18n 英文标题下位置会变。
 */
const AVOID_SELECTORS = ['.auth-brand', '.auth-tools']

/**
 * 粒子的焦点区：表单卡片本身。
 * 粒子围着它留白，卡片居左/居右时留白跟着走，中间不会空出一块。
 */
const FOCUS_SELECTOR = '.auth-card'

/** 窄屏强制居中的断点，与 SCSS 的 $device-ipad-pro 保持一致 */
const ALIGN_BREAKPOINT = 1180

const layout = useLayout()
const { setTheme } = useTheme()
const { width: winWidth } = useWindowSize()
const particleRef = ref<InstanceType<typeof AParticleCanvas>>()

const isDark = computed(() => layout.dark.value)
const currentThemeColor = computed(() => layout.theme.value)
const currentYear = new Date().getFullYear()

/** 明暗档：决定内置底图与粒子取色 */
const tone = computed(() => (isDark.value ? 'dark' : 'light'))

/** 是否叠加主题色渐变（仅浅色模式；暗黑走内置底图） */
const gradientOn = computed(() => props.gradient ?? SystemConfig.login.gradient)

/**
 * 补全资源地址
 *
 * public 下的图以 / 开头，部署到子路径（VITE_APP_CONTEXT_PATH，即 vite 的 base）
 * 时必须带上前缀，否则请求打到域名根目录直接 404。
 * 外链与 data URI 原样返回。
 * @param src 配置里填的地址
 */
const resolveAsset = (src: string) => {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src
  const base = import.meta.env.BASE_URL || '/'
  if (src.startsWith('/') && base !== '/') return base.replace(/\/$/, '') + src
  return src
}

/** 当前生效的浅色背景图（留空则走纯白 + 渐变） */
const lightBg = computed(() => props.background || SystemConfig.login.background)

/**
 * 背景样式
 *
 * 明暗各取各的图：暗黑用 backgroundDark（留空回落内置深色底图），
 * 浅色用 background（留空则纯白 + 主题色渐变）。
 * 拆成两项是因为合成一个字段时，配了浅色图会把暗黑模式一起盖掉。
 *
 * 浅色默认为什么用 CSS 渐变而不是图片：
 *   渐变色由 --el-color-primary 用 color-mix 实时推导，**切主题色时背景跟着变**；
 *   图片是烘焙好的，做不到这点。同时省掉一次图片请求。
 *   想要图片就把 background 填成 '/login-bg.png'（随包附带的示例图）。
 */
const bgStyle = computed(() => {
  if (isDark.value) {
    const dark = props.backgroundDark || SystemConfig.login.backgroundDark || DEFAULT_BG_DARK
    return { backgroundImage: `url(${resolveAsset(dark)})` }
  }
  if (lightBg.value) return { backgroundImage: `url(${resolveAsset(lightBg.value)})` }
  // 浅色且未配图：纯白底，渐变由 CSS 类控制（见 .auth-bg.has-gradient）
  return {}
})

/** 是否真正启用主题色渐变：仅浅色模式 + 浅色未配图 + 开关打开 */
const useThemeGradient = computed(() => !isDark.value && !lightBg.value && gradientOn.value)

const particle = computed(() => props.particleEffect ?? SystemConfig.login.particle)

/**
 * 实际生效的对齐方式
 * 窄屏没有偏置空间，居左/居右会把卡片挤变形，因此一律回落居中。
 */
const effectiveAlign = computed(() => {
  const want = props.align ?? SystemConfig.login.align
  return winWidth.value <= ALIGN_BREAKPOINT ? LoginAlign.Center : want
})

/** 对齐方式变化会移动卡片位置，避让区需要重新实测 */
// 对齐一变，焦点区就移了位，必须整批重测重播（只重测避让区不够，老粒子仍围着旧位置留空）
watch(effectiveAlign, () => nextTick(() => particleRef.value?.remeasure()))

/** 切换暗黑模式(带圆形扩散动画) */
const toggleDarkModeWithAnimation = (event: MouseEvent) => {
  toggleThemeWithAnimation(event, isDark.value)
}

/** 切换主题色 */
const handleThemeColorChange = (color: string) => {
  setTheme(color)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.auth-layout {
  position: relative;
  display: flex;
  align-items: center;
  width: 100vw;
  min-width: 320px;
  height: 100vh;
  overflow: hidden;
  // 浅色底色：纯白。渐变由 .auth-bg.has-gradient 叠加，关掉渐变就是纯白背景
  background: #fff;

  // 表单对齐：仅宽屏生效，窄屏由 effectiveAlign 回落成 is-center
  &.is-left {
    justify-content: flex-start;
    padding-left: 8vw;
  }

  &.is-center {
    justify-content: center;
  }

  &.is-right {
    justify-content: flex-end;
    padding-right: 8vw;
  }
}

.auth-bg {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  pointer-events: none;

  /**
   * 浅色模式的主题色渐变
   *
   * 四角各一团主题色光晕，中心留白给表单。
   * 色值全部由 --el-color-primary 经 color-mix 稀释而来 —— 切主题色时整片背景
   * 跟着变，这是用图片做不到的（图片是烘焙好的）。
   *
   * 🔴 浓度必须压得很低（8%~14%）：
   * 白底会放大饱和度，直接用主题色原色会显得廉价刺眼；
   * 中心那圈纯白是刻意的，卡片是半透明玻璃，背后有色会透出杂色。
   */
  &.has-gradient {
    background-image:
      radial-gradient(ellipse 62% 55% at 8% 6%, color-mix(in srgb, var(--el-color-primary) 14%, transparent) 0%, transparent 70%),
      radial-gradient(ellipse 52% 48% at 94% 8%, color-mix(in srgb, var(--el-color-primary) 9%, transparent) 0%, transparent 68%),
      radial-gradient(ellipse 56% 52% at 6% 96%, color-mix(in srgb, var(--el-color-primary) 11%, transparent) 0%, transparent 70%),
      radial-gradient(ellipse 48% 46% at 96% 94%, color-mix(in srgb, var(--el-color-primary) 8%, transparent) 0%, transparent 66%);
  }
}

// 左上角品牌区
.auth-brand {
  position: fixed;
  top: 28px;
  left: 30px;
  z-index: 60;
  display: flex;
  gap: 11px;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.82;

    .brand-logo {
      transform: scale(1.05);
    }
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .brand-name {
    font-size: 16.5px;
    letter-spacing: -0.01em;
    color: var(--app-text);
  }
}

// 右上角工具栏
.auth-tools {
  position: fixed;
  top: 26px;
  right: 30px;
  z-index: 60;
  display: flex;
  gap: 10px;
  align-items: center;

  .tool-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 18px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    user-select: none;
    transition: all 0.3s;

    &:hover {
      color: var(--el-color-primary);
    }

    :deep(.el-dropdown) {
      display: flex;
      align-items: center;
    }
  }
}

// 内容区
.auth-body {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  padding: 40px 24px 32px;
}

// 表单卡片：白玻璃，让背景色块隐约透上来又不影响正文对比度
.auth-card {
  padding: 34px 40px 32px;
  background: rgb(255 255 255 / 78%);
  border: 1px solid rgb(255 255 255 / 85%);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 90%),
    0 28px 60px -28px rgb(38 52 96 / 30%);
  backdrop-filter: blur(20px) saturate(1.25);
  animation: authCardIn 0.55s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes authCardIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.99);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

// 页脚
.auth-footer {
  position: absolute;
  bottom: 24px;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.5px;
  text-align: center;
  transform: translateX(-50%);

  // 视口过矮时隐藏，避免与卡片重叠
  @media (height <= 700px) {
    display: none;
  }

  .icp-link {
    font-size: 11px;
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 暗黑模式：卡片换深色玻璃，否则白卡片在暗色主题下过于刺眼
.dark {
  .auth-layout {
    // 取深色底图 login-bg-dark.png 的中心取样色，图未加载完不会闪一下异色
    background: #151820;
  }

  .auth-card {
    background: rgb(22 22 30 / 76%);
    border-color: rgb(255 255 255 / 10%);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 8%),
      0 32px 74px -26px rgb(0 0 0 / 85%);
  }

  .auth-brand .brand-name {
    color: rgb(255 255 255 / 85%);
  }
}

// 平板及以下：对齐已由 effectiveAlign 强制居中，这里只需去掉偏置内边距
@media (max-width: $device-ipad-pro) {
  .auth-layout {
    padding-right: 0;
    padding-left: 0;
  }
}

// 手机：卡片贴边铺满，品牌区与工具栏缩小
@media (max-width: $device-phone) {
  /*
    手机改成纵向排列，并让舞台自己做滚动容器：
    宽屏那套「横向 flex + 页脚绝对定位 + overflow:hidden」在手机上撑不住 ——
    表单项一多，页脚就压在卡片上，超出一屏的部分还会被裁掉。

    🔴 高度必须保持 100vh，不能改成 auto + min-height。
    全局 reset 里 html / body / #app 都是 height:100%，文档高被锁死在视口高：
    舞台用 auto 撑开后内容确实溢出了，但 html 滚不动、舞台自己也不滚
    （height:auto 时 scrollHeight == clientHeight），页脚会永远停在屏幕外。
    锁定 100vh + overflow-y:auto 才能让舞台成为真正的滚动容器。

    is-center 要一并覆盖：column 下 justify-content 管的是纵轴，
    保持 center 会在内容超高时把顶部裁掉（flex 居中溢出的经典坑）。
  */
  .auth-layout,
  .auth-layout.is-center {
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 72px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .auth-footer {
    position: static;
    display: flex;
    margin-top: auto;
    padding: 20px 16px 24px;
    transform: none;
  }

  .auth-body {
    padding: 0 16px;
  }

  .auth-card {
    padding: 26px 20px 24px;
    border-radius: 16px;
  }

  .auth-brand {
    top: 18px;
    left: 18px;

    .brand-logo {
      width: 32px;
      height: 32px;
    }

    .brand-name {
      font-size: 14px;
    }
  }

  .auth-tools {
    top: 18px;
    right: 16px;
    gap: 6px;
  }
}
</style>
