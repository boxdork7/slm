<!-- 认证页粒子背景层：6 种效果可切换，颜色跟随主题色 -->
<template>
  <canvas v-if="mounted" ref="canvasRef" class="a-particle-canvas" />
</template>

<script setup lang="ts">
import { LoginParticle } from '@/systemConfig'

/**
 * 粒子背景组件
 *
 * 与背景图的分工：背景图【只负责底色渐变】，点/线/几何图形一律由本层绘制。
 * 两边都画会叠成一团（静止的假图形混进会动的真粒子），这是刻意的分层。
 *
 * 无障碍：系统开启「减少动态效果」时自动冻结运动（仍绘制，只是不动）。
 * 性能：窄屏不挂载 canvas；effect 为 none 时不占用 requestAnimationFrame。
 */
interface Props {
  /** 粒子效果 */
  effect?: LoginParticle
  /** 明暗档：浅色背景需压深颜色并降低透明度，否则粒子发飘看不清 */
  tone?: 'dark' | 'light'
  /**
   * UI 避让区选择器。命中的元素周围粒子会淡出，避免盖住 logo、工具栏等。
   * 只有体积大的效果（立方浮游）才明显需要；小圆点粒子影响甚微。
   */
  avoidSelectors?: string[]
  /**
   * 焦点区选择器：粒子会围着它留白，让「光打在表单周围而不是表单上」。
   *
   * 🔴 必须实测元素位置，不能假定它在画布正中 —— 表单支持居左/居中/居右，
   * 一旦硬编码画布中心，居左时空区仍留在正中，就会看到「卡片那侧被粒子压着、
   * 正中却空一大块」。留空则退回画布中心（等价于旧行为）。
   */
  focusSelector?: string
  /** 低于此宽度不挂载（小屏 GPU 弱，且粒子与正文抢注意力） */
  minWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  effect: LoginParticle.Code,
  tone: 'light',
  avoidSelectors: () => [],
  focusSelector: '',
  minWidth: 500
})

const canvasRef = ref<HTMLCanvasElement>()
const { width: winWidth } = useWindowSize()

/** 窄屏直接不渲染 canvas 元素 */
const mounted = computed(() => winWidth.value > props.minWidth)

/**
 * 代码矩阵的符号池
 * 🔴 不要放 null / undefined / NaN 这类字面量 —— 它们飘在登录页上
 * 会被当成渲染错误或接口异常，用户第一反应是「页面出 bug 了」。
 */
const SNIPPETS = ['{ }', '</>', '=>', '&&', '[ ]', '( )', '::', '/**', '#!', '||', '...', '?.', '<T>', '@Service', 'async', 'await', '0x1F', 'i++']

/** 单个粒子 */
interface Particle {
  x: number
  y: number
  r: number
  a: number
  vx: number
  vy: number
  /** 相位：让闪烁/摆动各自错开 */
  ph: number
  /** 个体速度系数 */
  sp: number
  /** 数据流：光柱长度 */
  len?: number
  /** 代码矩阵：符号与字号 */
  txt?: string
  size?: number
  /** 立方浮游：半高与是否填充顶面 */
  s?: number
  face?: boolean
}

/** 避让矩形（canvas 局部坐标） */
interface Zone {
  x: number
  y: number
  w: number
  h: number
}

let ctx: CanvasRenderingContext2D | null = null
let raf: number | null = null
let W = 0
let H = 0
let t = 0
let particles: Particle[] = []
let rgb: [number, number, number] = [93, 135, 255]
let alphaScale = 1
let zones: Zone[] = []
/** 焦点区（表单卡片）实测中心与半径，单位 px；测不到时退回画布中心 */
let focus = { cx: 0, cy: 0, halfW: 0, halfH: 0 }
const mouse = { x: -9999, y: -9999 }

const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')

/** 系统是否要求减少动态效果（每帧实时读取，改系统设置无需刷新页面） */
const isReduced = () => mqReduce.matches

/**
 * 读取当前主题色
 * 用 element-plus 的 --el-color-primary，切换预设主题色时粒子跟着变。
 * 该变量可能是 #RGB / #RRGGBB / rgb(r,g,b) 三种写法，都要能解析。
 */
const pickAccent = (): [number, number, number] => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary').trim()
  const rgbMatch = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])]
  }
  let hex = raw.replace('#', '')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length >= 6) {
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  }
  return [93, 135, 255]
}

/** 取色 + 按明暗档校正：浅底上压深 38%、整体透明度降到 0.72 */
const applyTone = () => {
  rgb = pickAccent()
  if (props.tone === 'light') {
    rgb = rgb.map((v) => Math.round(v * 0.62)) as [number, number, number]
    alphaScale = 0.72
  } else {
    alphaScale = 1
  }
}

const rgba = (a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a * alphaScale})`

/**
 * 实测焦点区（表单卡片）位置
 *
 * 兜底值 0.26W / 0.36H 是旧版硬编码的衰减半径，测不到元素时保持原样，
 * 保证组件脱离认证页单独使用（不传 focusSelector）时行为不变。
 */
const measureFocus = () => {
  focus = { cx: W / 2, cy: H / 2, halfW: W * 0.26, halfH: H * 0.36 }
  const cv = canvasRef.value
  if (!cv || !props.focusSelector) return
  const el = document.querySelector(props.focusSelector)
  if (!el) return
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const base = cv.getBoundingClientRect()
  /*
    衰减半径要比卡片本身大一圈，否则粒子会紧贴卡片边缘、像被裁了一刀。
    系数取自旧版视觉：横向 0.26W ÷ 卡片半宽(255@1920) ≈ 1.9，纵向 0.36H ÷ 卡片半高(350@1080) ≈ 1.1。

    🔴 必须再按画布比例夹一次上限。卡片容器有 max-width: 540px，视口再窄卡片也不会等比缩小，
    于是「卡片半宽 × 1.9」在中小视口会大到接近整个画布：实测 520px 视口下数据流粒子被挤进
    两侧各 13px 的窄条，代码矩阵与立方浮游更是直接撑满画布触发兜底、完全不避让卡片。
    上限取旧版硬编码的 0.26W / 0.36H —— 1920 宽下两者相等，宽屏表现与不夹时完全一致。
  */
  focus = {
    cx: r.left - base.left + r.width / 2,
    cy: r.top - base.top + r.height / 2,
    halfW: Math.min((r.width / 2) * 1.9, W * 0.26),
    halfH: Math.min((r.height / 2) * 1.1, H * 0.36)
  }
}

/**
 * 焦点衰减：越靠近表单区粒子越暗越稀
 * 这是「光打在表单周围而不是表单上」的实现。下限 0.14 而非 0，
 * 完全清零会让中心显得像一块死区。
 */
const centerFade = (x: number, y: number) => {
  const dx = (x - focus.cx) / focus.halfW
  const dy = (y - focus.cy) / focus.halfH
  return Math.min(1, Math.max(0.14, Math.sqrt(dx * dx + dy * dy)))
}

/**
 * 各效果的避让带宽系数（× 焦点半宽）
 * 体积越大的图形越需要离表单远一点，否则边缘会啃到卡片。
 */
const BAND: Partial<Record<LoginParticle, number>> = {
  [LoginParticle.Flow]: 0.55,
  [LoginParticle.Code]: 0.72,
  [LoginParticle.Cube]: 0.79
}

/**
 * 把落在焦点带内的粒子挪到两侧，给表单让位
 *
 * 以焦点实际中心为轴，而不是画布中心 —— 表单居左/居右时空白区跟着走，
 * 中间不会再出现「没人管」的空档。
 *
 * 🔴 用「按两侧剩余宽度等比重映射」而不是「平移一段固定距离」：
 * 表单居左/居右时两侧空间悬殊（居左约 127px : 853px），固定平移会把窄的一侧
 * 挤成一条高密度带、还会把粒子推出画布外白白浪费掉。按剩余宽度分配份额后，
 * 带内粒子铺满两侧可用区且密度处处一致，也永远不会出界。
 *
 * @param x 粒子横坐标
 * @returns 挪开后的横坐标；不在带内则原样返回
 */
const pushAside = (x: number) => {
  const k = BAND[props.effect]
  if (!k) return x
  const half = focus.halfW * k
  const left = focus.cx - half
  const right = focus.cx + half
  if (x <= left || x >= right) return x

  const lw = Math.max(0, left)
  const rw = Math.max(0, W - right)
  // 避让带把整个画布吃满了（超窄视口），无处可挪，维持原位
  if (lw + rw <= 0) return x

  const t = (x - left) / (right - left)
  const share = lw / (lw + rw)
  return t < share ? (t / share) * lw : right + ((t - share) / (1 - share)) * rw
}

/** 实测避让区位置（换算成 canvas 局部坐标） */
const measureZones = () => {
  zones = []
  const cv = canvasRef.value
  if (!cv || !props.avoidSelectors.length) return
  const base = cv.getBoundingClientRect()
  props.avoidSelectors.forEach((sel) => {
    const el = document.querySelector(sel)
    if (!el) return
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return
    zones.push({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height })
  })
}

/**
 * UI 避让淡出系数：0（已进入避让区）~ 1（离得够远）
 *
 * 用「接近时淡出」而不是「该区间不生成粒子」—— 粒子是持续飘动的，
 * 靠不生成来避开就得把整条区间清空，画面会出现明显空白。
 */
const uiFade = (x: number, y: number, half: number) => {
  if (!zones.length) return 1
  const margin = 72
  let f = 1
  for (const z of zones) {
    const dx = Math.max(z.x - (x + half), x - half - (z.x + z.w))
    const dy = Math.max(z.y - (y + half), y - half - (z.y + z.h))
    const d = Math.max(dx, dy)
    if (d < margin) f = Math.min(f, Math.max(0, d / margin))
  }
  return f
}

/** 按效果生成粒子 */
const seed = () => {
  particles = []
  if (props.effect === LoginParticle.None || !W) return
  const area = W * H
  const counts: Record<string, number> = {
    [LoginParticle.Link]: Math.min(96, Math.round(area / 15000)),
    // 立方体体积大，密度必须低，否则糊成一片
    [LoginParticle.Cube]: Math.min(15, Math.round(area / 128000)),
    [LoginParticle.Flow]: Math.min(42, Math.round(area / 30000)),
    [LoginParticle.Code]: Math.min(24, Math.round(area / 52000)),
    [LoginParticle.Star]: Math.min(130, Math.round(area / 11000))
  }
  const n = counts[props.effect] || 0

  /*
    速度基准（60fps）：装饰性背景应「几乎察觉不到在动」，
    快了会抢走表单的注意力。当前上浮档约 3~11 px/s，
    肉眼看是缓慢漂移而非流动 —— 调整时不要超过这个量级。
  */
  for (let i = 0; i < n; i++) {
    const p: Particle = {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 1.8,
      // 深色背景上 0.2 起步几乎不可见，故从 0.42 起
      a: 0.42 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.11,
      vy: (Math.random() - 0.5) * 0.11,
      ph: Math.random() * 6.283,
      sp: 0.4 + Math.random() * 0.9
    }
    if (props.effect === LoginParticle.Flow) {
      p.x = pushAside(p.x)
      p.len = 60 + Math.random() * 160
      p.vy = 0.26 + Math.random() * 0.8
      p.a = 0.4 + Math.random() * 0.4
    }
    if (props.effect === LoginParticle.Code) {
      p.x = pushAside(p.x)
      p.txt = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
      p.size = 12 + Math.random() * 18
      p.vy = -(0.05 + Math.random() * 0.14)
      p.a = 0.34 + Math.random() * 0.32
    }
    if (props.effect === LoginParticle.Cube) {
      p.x = pushAside(p.x)
      p.s = 16 + Math.random() * 52
      p.vy = -(0.045 + Math.random() * 0.11)
      p.vx = (Math.random() - 0.5) * 0.06
      p.a = 0.3 + Math.random() * 0.34
      // 约 1/3 带顶面填充，其余纯线框，避免整片同质
      p.face = Math.random() < 0.35
    }
    if (props.effect === LoginParticle.Star) {
      p.r = 0.6 + Math.random() * 1.5
      p.vx *= 0.25
      p.vy *= 0.25
    }
    particles.push(p)
  }
}

/**
 * 画一个等距立方体线框（与项目 logo 同一套 30° 透视）
 * 顶点顺序：上、右上、右下、下、左下、左上；中心点是三条内棱的交汇处。
 */
const drawCube = (cx: number, cy: number, s: number, alpha: number, withFace: boolean) => {
  if (!ctx) return
  const k = s * 0.866 // cos30°，等距投影的水平半宽
  const top = [cx, cy - s]
  const rUp = [cx + k, cy - s * 0.5]
  const rDn = [cx + k, cy + s * 0.5]
  const bot = [cx, cy + s]
  const lDn = [cx - k, cy + s * 0.5]
  const lUp = [cx - k, cy - s * 0.5]

  if (withFace) {
    ctx.beginPath()
    ctx.moveTo(top[0], top[1])
    ctx.lineTo(rUp[0], rUp[1])
    ctx.lineTo(cx, cy)
    ctx.lineTo(lUp[0], lUp[1])
    ctx.closePath()
    ctx.fillStyle = rgba(alpha * 0.22)
    ctx.fill()
  }

  ctx.beginPath()
  ctx.moveTo(top[0], top[1])
  ctx.lineTo(rUp[0], rUp[1])
  ctx.lineTo(rDn[0], rDn[1])
  ctx.lineTo(bot[0], bot[1])
  ctx.lineTo(lDn[0], lDn[1])
  ctx.lineTo(lUp[0], lUp[1])
  ctx.closePath()
  ctx.strokeStyle = rgba(alpha)
  ctx.lineWidth = 1.3
  ctx.stroke()

  // 内部三条棱：比外轮廓淡，强化立体感又不喧宾夺主
  ctx.beginPath()
  ctx.moveTo(top[0], top[1])
  ctx.lineTo(cx, cy)
  ctx.lineTo(rDn[0], rDn[1])
  ctx.moveTo(cx, cy)
  ctx.lineTo(lDn[0], lDn[1])
  ctx.strokeStyle = rgba(alpha * 0.66)
  ctx.lineWidth = 1
  ctx.stroke()
}

/** 逐帧绘制 */
const frame = () => {
  if (!ctx) return
  t += 0.016
  ctx.clearRect(0, 0, W, H)
  const reduced = isReduced()

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    // ---- 位移 ----
    if (props.effect === LoginParticle.Flow) {
      if (!reduced) p.y += p.vy
      if (p.y - (p.len as number) > H) {
        p.y = -Math.random() * 120
        // 重进场同样要避开焦点区，否则跑完一轮后粒子会重新糊到表单上
        p.x = pushAside(Math.random() * W)
      }
    } else if (props.effect === LoginParticle.Code) {
      if (!reduced) {
        p.y += p.vy
        p.x += Math.sin(t * 0.3 * p.sp + p.ph) * 0.07
      }
      if (p.y < -30) {
        p.y = H + 30
        p.x = pushAside(Math.random() * W)
      }
    } else if (props.effect === LoginParticle.Cube) {
      // 上浮 + 横向轻微摆动，出顶后从底部重新进场
      if (!reduced) {
        p.y += p.vy
        p.x += p.vx + Math.sin(t * 0.35 * p.sp + p.ph) * 0.06
      }
      if (p.y + (p.s as number) < -20) {
        p.y = H + (p.s as number) + Math.random() * 100
        p.x = pushAside(Math.random() * W)
      }
    } else {
      if (!reduced) {
        p.x += p.vx * p.sp
        p.y += p.vy * p.sp
      }
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
    }

    const fade = centerFade(p.x, p.y)
    let alpha: number

    // ---- 绘制 ----
    if (props.effect === LoginParticle.Flow) {
      alpha = p.a * fade
      const g = ctx.createLinearGradient(p.x, p.y - (p.len as number), p.x, p.y)
      g.addColorStop(0, rgba(0))
      g.addColorStop(0.7, rgba(alpha * 0.5))
      g.addColorStop(1, rgba(alpha))
      ctx.strokeStyle = g
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - (p.len as number))
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      // 头部亮点
      ctx.beginPath()
      ctx.arc(p.x, p.y, 1.5, 0, 6.2832)
      ctx.fillStyle = rgba(alpha * 1.2)
      ctx.fill()
      continue
    }

    if (props.effect === LoginParticle.Code) {
      alpha = p.a * fade * uiFade(p.x, p.y, (p.size as number) * 0.5)
      ctx.font = `500 ${(p.size as number).toFixed(0)}px Consolas, Monaco, "Courier New", monospace`
      ctx.fillStyle = rgba(alpha)
      ctx.fillText(p.txt as string, p.x, p.y)
      continue
    }

    if (props.effect === LoginParticle.Cube) {
      // 缓慢呼吸：幅度很小（±12%），只求不呆板，不要闪
      alpha = reduced ? p.a * fade * 0.8 : p.a * fade * (0.88 + 0.12 * Math.sin(t * 0.5 * p.sp + p.ph))
      alpha *= uiFade(p.x, p.y, p.s as number)
      if (alpha > 0.004) drawCube(p.x, p.y, p.s as number, alpha, p.face as boolean)
      continue
    }

    // star 有呼吸闪烁，link 恒定
    alpha = props.effect === LoginParticle.Star ? p.a * (0.45 + 0.55 * Math.sin(t * 1.1 * p.sp + p.ph)) * fade : p.a * fade
    if (reduced) alpha = p.a * fade * 0.7

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, 6.2832)
    ctx.fillStyle = rgba(Math.max(0, alpha))
    ctx.fill()

    // 星链：鼠标引力 + 近邻连线
    if (props.effect === LoginParticle.Link) {
      const mdx = mouse.x - p.x
      const mdy = mouse.y - p.y
      const md = Math.sqrt(mdx * mdx + mdy * mdy)
      if (md < 160 && md > 1) {
        if (!reduced) {
          p.x += (mdx / md) * 0.3
          p.y += (mdy / md) * 0.3
        }
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = rgba(0.42 * (1 - md / 160) * fade)
        ctx.lineWidth = 1
        ctx.stroke()
      }
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 118) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = rgba(0.3 * (1 - d / 118) * Math.min(fade, centerFade(q.x, q.y)))
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    // 星野：近邻星座连线（比星链更稀疏更淡）
    if (props.effect === LoginParticle.Star) {
      for (let k = i + 1; k < particles.length; k++) {
        const s = particles[k]
        const sdx = p.x - s.x
        const sdy = p.y - s.y
        const sd = Math.sqrt(sdx * sdx + sdy * sdy)
        if (sd < 86) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = rgba(0.16 * (1 - sd / 86) * Math.min(fade, centerFade(s.x, s.y)))
          ctx.lineWidth = 0.9
          ctx.stroke()
        }
      }
    }
  }
  raf = requestAnimationFrame(frame)
}

/**
 * 重新实测布局并播种
 *
 * 三步不能拆开调：焦点区一变，已生成粒子的避让分布就过时了
 * （比如表单从居中改到居左，老粒子还围着画布正中留空），必须整批重来。
 */
const remeasure = () => {
  measureZones()
  measureFocus()
  seed()
}

/** 重算画布尺寸并重新播种 */
const resize = () => {
  const cv = canvasRef.value
  if (!cv || !ctx) return
  const r = cv.getBoundingClientRect()
  W = r.width
  H = r.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = W * dpr
  cv.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  remeasure()
}

const stop = () => {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = null
  }
}

/** 启动（或按 effect 重启）动画 */
const start = async () => {
  stop()
  await nextTick()
  const cv = canvasRef.value
  if (!cv) return
  ctx = cv.getContext('2d')
  if (!ctx) return
  applyTone()

  if (props.effect === LoginParticle.None) {
    if (W) ctx.clearRect(0, 0, W, H)
    return
  }

  /**
   * 🔴 必须等布局稳定后再取尺寸。
   * 直接调用时 canvas 的 getBoundingClientRect() 可能还是 0，
   * 算出的 W/H 不对，粒子坐标会全部落在可视区外 —— 表现就是「一个像素都没画」。
   */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resize()
      frame()
    })
  })
}

const onMove = (e: MouseEvent) => {
  const cv = canvasRef.value
  if (!cv) return
  const r = cv.getBoundingClientRect()
  mouse.x = e.clientX - r.left
  mouse.y = e.clientY - r.top
}

const onLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
}

/**
 * 主题变化监听
 *
 * 🔴 必须监听，不能只在挂载时取一次色：
 * 主题色写在 documentElement 的 inline style 上（`--el-color-primary`），
 * 暗黑模式则改 class。两者变化后若不重新取色，粒子会一直停在旧主题色上
 * —— 表现为「切了主题色，背景粒子纹丝不动」。
 * applyTone 只改内部颜色变量，下一帧自然生效，无需重挂动画。
 */
let themeObserver: MutationObserver | null = null

// effect / tone 变化时重启；窄屏 canvas 卸载后再回到宽屏也要重新挂载
watch(() => [props.effect, props.tone, mounted.value], start)

onMounted(() => {
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', onLeave)

  themeObserver = new MutationObserver(applyTone)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class']
  })

  start()
})

onUnmounted(() => {
  // 路由离开必须清理，否则动画与监听常驻
  stop()
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseleave', onLeave)
  themeObserver?.disconnect()
  themeObserver = null
  particles = []
  ctx = null
})

defineExpose({ resize, remeasure, refreshColor: applyTone })
</script>

<style lang="scss" scoped>
.a-particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
