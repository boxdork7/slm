/**
 * 系统全局配置
 * @description 集中管理所有应用配置，提供类型安全访问
 * @module @/systemConfig
 */
/**
 * 系统支持的语言枚举
 * @description 定义应用程序支持的所有语言选项
 */
export enum LanguageCode {
  /**
   * 中文(简体)
   */
  zh_CN = 'zh_CN',

  /**
   * 英文(美国)
   */
  en_US = 'en_US'
}

/** 侧边栏主题枚举 */
export enum SideTheme {
  /** 深色主题 */
  Dark = 'theme-dark',
  /** 浅色主题 */
  Light = 'theme-light'
}

/** 菜单布局模式枚举 */
export enum MenuLayoutMode {
  /** 垂直布局（左侧边栏） */
  Vertical = 'vertical',
  /** 混合布局（顶部+左侧） */
  Mixed = 'mixed',
  /** 水平布局（纯顶部） */
  Horizontal = 'horizontal',
  /** 双列布局（左图标列 + 右子菜单列） */
  DualColumn = 'dual-column'
}

/**
 * 登录页粒子效果枚举
 * @description 认证页背景的动态叠加层，与背景图分层：背景图只负责底色渐变，
 *              点/线/几何图形一律由粒子层绘制，避免两套图形叠在一起互相干扰
 */
export enum LoginParticle {
  /** 不启用（canvas 不挂载，零运行时开销） */
  None = 'none',
  /** 粒子星链：近距连线成网，鼠标附近产生引力 */
  Link = 'link',
  /** 立方浮游：等距立方体线框缓慢上浮，图形取自项目 logo */
  Cube = 'cube',
  /** 数据流：竖向流动的数据列 */
  Flow = 'flow',
  /** 代码矩阵：浮动的代码符号缓慢升起 */
  Code = 'code',
  /** 星野：星点闪烁 + 近邻星座连线，最安静的一种 */
  Star = 'star'
}

/**
 * 登录表单水平位置枚举
 * @description 仅在宽屏生效；窄屏（≤1180px）无偏置空间，一律强制居中
 */
export enum LoginAlign {
  /** 靠左 */
  Left = 'left',
  /** 居中 */
  Center = 'center',
  /** 靠右 */
  Right = 'right'
}

/**
 * 预定义主题色配置
 * @description 系统提供的预设主题色列表，用于主题色选择器
 */
export const PREDEFINED_THEME_COLORS = [
  '#5D87FF', // 默认蓝色
  '#B48DF3', // 紫色
  '#1D84FF', // 深蓝
  '#60C041', // 绿色
  '#38C0FC', // 青色
  '#F9901F', // 橙色
  '#FF80C8' // 粉色
] as const

/**
 * 系统全局配置
 */
export const SystemConfig: SystemConfigType = {
  /**
   * 应用基础信息
   */
  app: {
    /** 应用唯一ID */
    id: import.meta.env.VITE_APP_ID || 'ryplus_uni',
    /** 应用名称/标题 */
    title: import.meta.env.VITE_APP_TITLE || 'ryplus-uni后台管理',
    /** 应用运行环境 */
    env: import.meta.env.VITE_APP_ENV || 'development',
    /** 应用访问路径前缀 */
    contextPath: import.meta.env.VITE_APP_CONTEXT_PATH || '/',
    /** 是否启用前台首页 */
    enableFrontend: import.meta.env.VITE_ENABLE_FRONTEND === 'true'
  },

  /**
   * API配置
   */
  api: {
    /** API基础路径 */
    baseUrl: import.meta.env.VITE_APP_BASE_API || '/dev-api',
    /** 后端服务端口 */
    port: Number(import.meta.env.VITE_APP_BASE_API_PORT || 5500),
    /** 请求超时时间(毫秒) */
    timeout: 10000
  },

  /**
   * 安全配置
   */
  security: {
    /** 接口加密功能开关 */
    apiEncrypt: import.meta.env.VITE_APP_API_ENCRYPT === 'true',
    /** 接口加密算法 - 未配置时按 RSA 处理，兼容老的 .env */
    apiEncryptAlgorithm: import.meta.env.VITE_APP_API_ENCRYPT_ALGORITHM === 'SM2' ? 'SM2' : 'RSA',
    /** RSA公钥 - 用于加密传输 */
    rsaPublicKey: import.meta.env.VITE_APP_RSA_PUBLIC_KEY || '',
    /** RSA私钥 - 用于解密响应 */
    rsaPrivateKey: import.meta.env.VITE_APP_RSA_PRIVATE_KEY || '',
    /** SM2公钥 - 用于加密传输 */
    sm2PublicKey: import.meta.env.VITE_APP_SM2_PUBLIC_KEY || '',
    /** SM2私钥 - 用于解密响应 */
    sm2PrivateKey: import.meta.env.VITE_APP_SM2_PRIVATE_KEY || ''
  },

  /**
   * 外部服务地址
   */
  services: {
    /** 监控系统地址 */
    monitor: import.meta.env.VITE_APP_MONITOR_ADMIN || '',
    /** SnailJob控制台地址 */
    snailJob: import.meta.env.VITE_APP_SNAILJOB_ADMIN || '',
    /** 仓库地址 */
    gitUrl: import.meta.env.VITE_APP_GIT_URL || '',
    /** 文档地址 */
    docUrl: import.meta.env.VITE_APP_DOC_URL || ''
  },

  /**
   * UI及布局设置
   */
  ui: {
    /** 网页标题 */
    title: import.meta.env.VITE_APP_TITLE || 'ryplus-uni后台管理',
    /** 主题色 */
    theme: '#5d87ff',
    /** 侧边栏主题 */
    sideTheme: SideTheme.Dark,
    /** 是否显示设置面板 */
    showSettings: true,
    /** 是否显示顶部导航 */
    topNav: false,
    /** 菜单布局模式 */
    menuLayout: MenuLayoutMode.Vertical,
    /** 是否显示多标签导航 */
    tagsView: true,
    /** 是否固定头部 */
    fixedHeader: true,
    /** 是否显示侧边栏Logo */
    sidebarLogo: true,
    /** 是否显示动态标题 */
    dynamicTitle: true,
    /** 是否启用动画效果 */
    animationEnable: false,
    /** 是否启用暗黑模式 */
    dark: false,
    /** 导航栏布局 */
    layout: '',
    /** 侧边栏状态 */
    sidebarStatus: '1',
    /** 布局大小 */
    size: 'default' as ElSize,
    /** 语言设置 */
    language: LanguageCode.zh_CN,
    /** 是否在选择器中显示选项值 (undefined 表示根据角色自动判断) */
    showSelectValue: undefined,
    /** 是否显示水印 */
    watermark: false,
    /** 水印内容 (空字符串表示使用当前登录用户名) */
    watermarkContent: ''
  },

  /**
   * 认证页（登录/注册/找回密码）外观配置
   */
  login: {
    /**
     * 浅色模式背景图地址
     *
     * 留空 = 纯白底 + 主题色渐变（见 gradient）。
     * 填 '/login-bg.png' 即启用随包附带的示例图（文件在 plus-ui/public/ 下）。
     *
     * 🔴 图片放 public 而不是 src/assets：public 下的文件原样输出到产物根目录，
     * 换背景直接覆盖 public/login-bg.png 就行，不用改代码；而 src/assets 里
     * 没被 import 的图根本不会被打包，替换了也不生效。
     * 路径以 / 开头时会自动补上部署子路径（vite base = VITE_APP_CONTEXT_PATH）。
     */
    background: '',
    /**
     * 暗黑模式背景图地址
     *
     * 留空 = 用内置深色底图 '/login-bg-dark.png'（同样在 public 下，可直接覆盖）。
     * 单独一项是为了明暗各配各的 —— 只有一个字段时，填了浅色图会把暗黑模式一起盖掉。
     */
    backgroundDark: '',
    /**
     * 是否在浅色模式下叠加主题色渐变
     *
     * 渐变色不暴露配置 —— 它由当前主题色实时推导（--el-color-primary 的浅色化），
     * 所以切换主题色时渐变跟着变，无需也不应该单独配色。
     * 关掉则是纯白背景。暗黑模式走内置底图，本开关不影响它。
     */
    gradient: true,
    /** 背景粒子效果 */
    particle: LoginParticle.Cube,
    /** 表单水平位置（窄屏自动强制居中） */
    align: LoginAlign.Center,
    /**
     * 手机验证码登录页签的【兜底】开关
     *
     * 🔴 正常情况下本项不起作用 —— 页签显隐以接口 CaptchaVo.smsEnabled 为准，
     * 只有对接未升级、不返回该字段的旧后端时才回落到这里。
     * 能不能用取决于后端配置，前端写死会出现「页签显示了但一发码就报错」。
     *
     * 后端开启方式（application-{env}.yml）：
     *   sms.blends.config1      —— 服务商凭据（accessKey / secret / 签名）
     *   sms.captcha.enabled     —— 置为 true
     *   sms.captcha.template-id —— 验证码模板ID，必填（阿里云形如 SMS_123456789）
     * 后端判据是 enabled 与 template-id 同时成立，少一个都不会下发该页签。
     */
    smsEnabled: false,
    /**
     * 邮箱验证码登录页签的【兜底】开关
     *
     * 同上：以接口 CaptchaVo.emailEnabled 为准，本项仅用于旧后端回落。
     * 后端开启方式：application-{env}.yml 把 mail.enabled 置为 true 并填好 SMTP 账号。
     */
    emailEnabled: false
  }
}

/**
 * 系统配置总接口
 * @description 集成所有配置模块的顶层接口
 */
export interface SystemConfigType {
  /** 应用基础信息 */
  app: BaseConfig

  /** API相关配置 */
  api: ApiConfig

  /** 安全配置 */
  security: SecurityConfig

  /** 外部服务地址 */
  services: ServicesConfig

  /** UI及布局设置 */
  ui: LayoutSetting

  /** 认证页外观设置 */
  login: LoginSetting
}

/**
 * 认证页外观配置接口
 * @description 登录/注册/找回密码三页共用的外壳外观配置
 */
export interface LoginSetting {
  /** 浅色模式背景图，留空则纯白底 + 主题色渐变；示例图见 public/login-bg.png */
  background: string
  /** 暗黑模式背景图，留空用内置的 public/login-bg-dark.png */
  backgroundDark: string
  /** 浅色模式是否叠加主题色渐变（渐变色由主题色实时推导，不单独配置） */
  gradient: boolean
  /** 背景粒子效果 */
  particle: LoginParticle
  /** 表单水平位置（窄屏自动强制居中） */
  align: LoginAlign
  /** 手机验证码登录页签的兜底开关（正常由接口 CaptchaVo.smsEnabled 决定） */
  smsEnabled: boolean
  /** 邮箱验证码登录页签的兜底开关（正常由接口 CaptchaVo.emailEnabled 决定） */
  emailEnabled: boolean
}

/**
 * 应用基础配置接口
 * @description 应用程序基本信息配置
 */
interface BaseConfig {
  /** 应用唯一ID，用于本地存储前缀等 */
  id: string
  /** 应用名称/标题 */
  title: string
  /** 应用运行环境 */
  env: 'development' | 'production'
  /** 应用访问路径前缀 */
  contextPath: string
  /** 是否启用前台首页 */
  enableFrontend: boolean
}

/**
 * API配置接口
 * @description API请求相关配置
 */
export interface ApiConfig {
  /** API基础路径 */
  baseUrl: string
  /** 后端服务端口 */
  port: number
  /** 请求超时时间(毫秒) */
  timeout: number
}

/**
 * 安全配置接口
 * @description 应用安全相关配置
 */
export interface SecurityConfig {
  /** 接口加密功能开关 */
  apiEncrypt: boolean
  /** 接口加密算法 - RSA: RSA+AES，SM2: SM2+SM4 国密 */
  apiEncryptAlgorithm: 'RSA' | 'SM2'
  /** RSA公钥 - 用于加密传输 */
  rsaPublicKey: string
  /** RSA私钥 - 用于解密响应 */
  rsaPrivateKey: string
  /** SM2公钥 - 用于加密传输 */
  sm2PublicKey: string
  /** SM2私钥 - 用于解密响应 */
  sm2PrivateKey: string
}

/**
 * 外部服务配置接口
 * @description 第三方服务和外部资源地址配置
 */
export interface ServicesConfig {
  /** 监控系统地址 */
  monitor: string
  /** SnailJob控制台地址 */
  snailJob: string
  /** 仓库地址 */
  gitUrl: string
  /** 文档地址 */
  docUrl: string
}

/**
 * 布局设置接口
 * @description 定义系统UI布局的所有配置项
 */
export interface LayoutSetting {
  /** 网页标题 */
  title: string
  /** 主题色 */
  theme: string
  /** 侧边栏主题 */
  sideTheme: SideTheme
  /** 是否显示设置面板 */
  showSettings: boolean
  /** 是否显示顶部导航 */
  topNav: boolean
  /** 菜单布局模式 */
  menuLayout: MenuLayoutMode
  /** 是否显示多标签导航 */
  tagsView: boolean
  /** 是否固定头部 */
  fixedHeader: boolean
  /** 是否显示侧边栏Logo */
  sidebarLogo: boolean
  /** 是否显示动态标题 */
  dynamicTitle: boolean
  /** 是否启用动画效果 */
  animationEnable: boolean
  /** 是否启用暗黑模式 */
  dark: boolean
  /** 导航栏布局 */
  layout: string
  /** 侧边栏状态 ('1' 打开, '0' 关闭) */
  sidebarStatus: string
  /** 布局大小 */
  size: ElSize
  /** 语言设置 */
  language: LanguageCode
  /** 是否在选择器中显示选项值 */
  showSelectValue?: boolean
  /** 是否显示水印 */
  watermark?: boolean
  /** 水印内容 */
  watermarkContent?: string
}
