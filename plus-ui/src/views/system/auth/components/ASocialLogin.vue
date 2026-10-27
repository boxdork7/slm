<!-- 第三方登录入口：按平台数量自适应「主次分层 / 等宽图标」两种形态 -->
<template>
  <div v-if="list.length > 0" class="social">
    <div class="social-divider">{{ t('login.otherLoginType') }}</div>

    <div class="social-list" :class="`social-list--${layout}`">
      <!--
        布局由 layout 决定，不是所有按钮一视同仁：
        · split 档：主按钮占满剩余宽度显示「图标 + 文字」，次按钮收成 56px 方块只留图标
        · grid  档：全员等宽方块，只留图标，靠 title 提示平台名
        判定规则见 layout。
      -->
      <!--
        用 el-tooltip 而不是原生 title 属性：后者是浏览器自绘的黑框提示，
        样式不受主题控制、还有 1~2 秒的固有延迟，与页面观感割裂。
        主按钮自带文字，disabled 掉它的提示，避免重复信息。
        el-tooltip 通过 ref 转发给子元素、不额外包 DOM，button 仍是 grid 的直接子项。
      -->
      <el-tooltip
        v-for="(social, index) in list"
        :key="social.type"
        :content="actionLabel(social.type)"
        :disabled="isPrimary(index)"
        :show-after="150"
        placement="top"
      >
        <button
          type="button"
          class="social-btn"
          :class="{ 'is-primary': isPrimary(index) }"
          :style="{ '--brand': social.color || 'var(--el-color-primary)' }"
          :aria-label="actionLabel(social.type)"
          @click="emit('select', social.type)"
        >
          <!--
            🔴 品牌色与尺寸必须走 Icon 的 props，不能靠 CSS 选择器。
            Icon 渲染的是 div（iconfont/iconify），不是 .icon-font，
            写 :deep(.icon-font) 这类选择器会全部落空 —— 图标会小而发灰。
          -->
          <Icon :code="social.icon as IconCode" size="20px" :color="iconColor(social)" />
          <span v-if="isPrimary(index)" class="social-text">{{ actionLabel(social.type) }}</span>
        </button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SocialConfig } from '@/api/system/auth/socialConfig'
import { hexToRgb, blendColor } from '@/utils/colors'

interface Props {
  /** 后端下发并解析后的可用平台列表（顺序即展示顺序，第一个可能被提升为主按钮） */
  list: SocialConfig[]
  /** 使用场景，决定主按钮文案是「微信登录」还是「微信注册」 */
  mode?: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), { mode: 'login' })

const emit = defineEmits<{
  /** 点击某个平台，抛出平台标识（wechat_open / gitee / ...），由页面决定登录还是注册 */
  (e: 'select', type: string): void
}>()

const { t } = useI18n()
const layoutState = useLayout()

/** 暗色主题开关，与项目其它组件取法一致（见 AChart/AMapChart.vue） */
const isDark = computed(() => layoutState.dark.value)

/**
 * 图标颜色：暗色模式下只把「在深底上根本看不见」的品牌色提亮
 *
 * GitHub 的品牌色 #181717 近乎纯黑，暗色按钮底又是深灰，两者对比度不到 1:1，
 * 图标等于消失；抖音 #000000、百度 #2319DC 同理。
 *
 * 阈值取 60/255 而不是更宽松的值：混白在提亮的同时会掉饱和度，
 * 阈值放松到 90 会把 Gitee 红(#C71D23, luma≈80)一起冲成粉红 —— 它本来在深底上看得清，
 * 属于误伤。混白比例 0.45 是「够亮 + 还看得出原色相」的折中。
 */
const iconColor = (social: SocialConfig) => {
  if (!social.color || !isDark.value) return social.color
  const [r, g, b] = hexToRgb(social.color)
  // ITU-R BT.601 感知亮度：人眼对绿最敏感、蓝最迟钝，按此加权才符合观感
  const luma = 0.299 * r + 0.587 * g + 0.114 * b
  return luma < 60 ? blendColor(social.color, '#ffffff', 0.45) : social.color
}

/**
 * 布局档位：split（主次分层）/ grid（全员等宽图标）
 *
 * 平台数由后端 sys_config 下发，1~25 个都可能，固定比例必然在某个数量上挤爆，
 * 所以按数量分档：
 * · 1~2 个：首个平台提升为主按钮带文字，剩下那个收成方块 —— 有明确主次，视觉不平淡
 * · ≥3 个：全部收成等宽方块，只留图标，否则一行塞不下多份文字
 * 谁当主推由 socialTypes 的配置顺序决定，管理员调顺序即可换。
 *
 * 用容器 class 而非 :has() 选择器：browserslist 下限是 Chrome 87 / Safari 14，
 * 而 :has() 要 Chrome 105 / Safari 15.4，在目标浏览器上会整条规则失效。
 */
const layout = computed(() => (props.list.length <= 2 ? 'split' : 'grid'))

/** 是否渲染成「主按钮」（宽按钮 + 文字）：只有 split 档的第一个 */
const isPrimary = (index: number) => layout.value === 'split' && index === 0

/**
 * 带动作的平台名：「微信登录」而非光秃秃的「微信」，也不是官方全称「微信开放平台」
 *
 * 主按钮文字、次按钮的悬浮提示、无障碍标签统一用这一份，三处口径一致。
 * 取名优先短名（socialShort），没配的类型回落完整名（social）——
 * 判定方式：t() 找不到键时原样返回键名，据此识别未配置短名的类型。
 * 短名足以区分同族平台：微信/公众号/企业微信 → 微信登录 / 公众号登录 / 企业微信登录。
 * 动词随 mode 走：注册页上写「微信登录」会让人以为点了是去登录而非注册。
 */
const actionLabel = (type: string) => {
  const shortKey = `login.socialShort.${type}`
  const short = t(shortKey)
  const name = short === shortKey ? t(`login.social.${type}`) : short
  return t(props.mode === 'register' ? 'login.socialRegisterWith' : 'login.socialLoginWith', { name })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.social {
  margin-top: 24px;
}

.social-divider {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    content: '';
    background: var(--el-border-color-lighter);
  }
}

/* split 档用 flex：主按钮吃掉剩余宽度，次按钮固定方块 */
.social-list {
  display: flex;
  gap: 8px;
}

/*
  grid 档改用网格而非 flex-wrap。
  flex-wrap 下最后一行若只剩 1 个按钮，flex-grow 会把它拉成通栏长条
  （实测 6 个平台的手机视图：前 5 个各 58px，第 6 个独占 320px）。

  🔴 必须是 auto-fit 不是 auto-fill：两者只在「元素数 < 容器可容纳列数」时才有差别 ——
  auto-fill 保留空轨道，3 个平台会挤在左侧、右边空出 3 个轨道；
  auto-fit 折叠空轨道，让现有按钮拉伸铺满整行。
  （元素数 ≥ 列数时两者等价，所以拿 6 个平台 / 411px 容器去测是测不出来的。）

  列宽下限 56px 让列数随容器自动收敛：桌面 411px 最多 6 列、手机 320px 最多 5 列，
  超出部分换行且各行列宽一致 —— 一套规则同时管住两端，不需要断点。
*/
.social-list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
}

.social-btn {
  display: inline-flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 48px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  cursor: pointer;

  /*
    半透明白而非纯白：外层 .auth-card 本身是 78% 白 + backdrop-filter 毛玻璃，
    按钮若用纯白实底会比卡片更「实」，层次反过来显得按钮浮在卡片之上。
  */
  background: rgb(255 255 255 / 55%);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 2px rgb(16 24 40 / 5%);
  transition: all 0.22s ease;

  // 尺寸与品牌色由 Icon 的 size/color props 提供，这里只管动效
  :deep(> div),
  :deep(> svg) {
    flex-shrink: 0;
    transition: transform 0.22s ease;
  }

  &:hover {
    color: var(--app-text);
    background: rgb(255 255 255 / 88%);
    border-color: var(--brand);
    box-shadow: 0 4px 10px -2px rgb(16 24 40 / 10%);
    transform: translateY(-1px);

    :deep(> div),
    :deep(> svg) {
      transform: scale(1.12);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgb(16 24 40 / 5%);
  }
}

/*
  split 档的次按钮（纯图标）固定 56px 方块，不参与 flex 伸缩，
  把剩余宽度全让给主按钮；grid 档不套这条，全员维持上面的 flex: 1 等宽。
*/
.social-list--split .social-btn:not(.is-primary) {
  flex: 0 0 56px;
}

.social-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 暗色：半透明白会变成灰雾，改用主题底色，描边也要提一档否则看不见边界 */
html.dark .social-btn {
  background: var(--el-fill-color-dark);
  border-color: var(--el-border-color);
  box-shadow: none;

  &:hover {
    background: var(--el-fill-color-darker);
    border-color: var(--brand);
  }
}

/*
  手机上 grid 档由 auto-fill 自行收敛列数，无需断点。
  这里只管 split 档：主按钮文字在窄屏可能放不下，让它可以压缩。
*/
@media (max-width: $device-phone) {
  .social-list--split .is-primary {
    min-width: 0;
  }
}
</style>
