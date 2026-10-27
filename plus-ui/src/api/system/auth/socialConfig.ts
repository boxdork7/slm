/**
 * 社交登录配置
 * 定义所有支持的社交登录类型及其图标、名称
 */

export interface SocialConfig {
  /** 社交登录类型标识 */
  type: string
  /** 显示名称 */
  name: string
  /**
   * 图标代码（Icon 组件使用）
   *
   * 🔴 带冒号的值（如 simple-icons:qq）走的是 Icon 组件的 `i-${code}` 兜底路径，
   * 不在 ICONIFY_ICONS 注册表里，**必须同步进 uno.config.ts 的 safelist**，
   * 否则 unocss 静态扫描提取不到类名 → 不生成 CSS → 图标位置一片空白。
   * uno.config.ts 已从本文件导入 SOCIAL_CONFIGS 自动生成，改这里即可，无需再手动维护。
   */
  icon: string
  /** 图标颜色（可选） */
  color?: string
}

/**
 * 所有支持的社交登录类型配置
 * 与后端配置文件中的类型一一对应
 *
 * 图标一律选用真品牌 logo（simple-icons 集为主，单色，由 color 字段染成品牌色）：
 * 登录页平台数 ≥3 时按钮只留图标不带文字，图标是唯一识别标志，
 * 用「字母 D 方框」代表钉钉这类占位图会导致用户认不出来。
 * 例外两处：dingtalk 用项目自带的本地 SVG（src/assets/icons/svg/dingtalk.svg），
 * coding（Coding.net）在 simple-icons 里没有收录，只能退回通用代码图标。
 */
export const SOCIAL_CONFIGS: SocialConfig[] = [
  {
    type: 'wechat_open',
    name: '微信开放平台',
    icon: 'wechat-fill',
    color: '#07C160'
  },
  {
    type: 'wechat_mp',
    name: '微信公众号',
    icon: 'wechat-fill',
    color: '#07C160'
  },
  {
    type: 'wechat_enterprise',
    name: '企业微信',
    icon: 'wechat-fill',
    color: '#0099FF'
  },
  {
    // 项目自带真钉钉 logo（src/assets/icons/svg/dingtalk.svg），比 iconify 的字母占位准确
    type: 'dingtalk',
    name: '钉钉',
    icon: 'dingtalk',
    color: '#0089FF'
  },
  {
    type: 'maxkey',
    name: 'MaxKey',
    icon: 'maxkey'
  },
  {
    type: 'topiam',
    name: 'TopIAM',
    icon: 'topiam'
  },
  {
    type: 'qq',
    name: 'QQ',
    icon: 'simple-icons:qq',
    color: '#12B7F5'
  },
  {
    type: 'weibo',
    name: '微博',
    icon: 'simple-icons:sinaweibo',
    color: '#E6162D'
  },
  {
    type: 'gitee',
    name: 'Gitee',
    icon: 'gitee',
    color: '#C71D23'
  },
  {
    type: 'github',
    name: 'GitHub',
    icon: 'github',
    color: '#181717'
  },
  {
    type: 'gitlab',
    name: 'GitLab',
    icon: 'simple-icons:gitlab',
    color: '#FC6D26'
  },
  {
    type: 'baidu',
    name: '百度',
    icon: 'simple-icons:baidu',
    color: '#2319DC'
  },
  {
    type: 'csdn',
    name: 'CSDN',
    icon: 'simple-icons:csdn',
    color: '#FC5531'
  },
  {
    // Coding.net 未被 simple-icons 收录，只能用通用代码图标兜底
    type: 'coding',
    name: 'Coding',
    icon: 'mdi:code-braces-box',
    color: '#0066FF'
  },
  {
    // 开源中国无官方 logo 图标，用开源通用标识代替字母占位
    type: 'oschina',
    name: '开源中国',
    icon: 'simple-icons:opensourceinitiative',
    color: '#3DAD48'
  },
  {
    type: 'alipay_wallet',
    name: '支付宝',
    icon: 'simple-icons:alipay',
    color: '#1678FF'
  },
  {
    type: 'taobao',
    name: '淘宝',
    icon: 'simple-icons:taobao',
    color: '#FF6A00'
  },
  {
    type: 'douyin',
    name: '抖音',
    icon: 'simple-icons:tiktok',
    color: '#000000'
  },
  {
    type: 'linkedin',
    name: 'LinkedIn',
    icon: 'simple-icons:linkedin',
    color: '#0A66C2'
  },
  {
    type: 'microsoft',
    name: 'Microsoft',
    icon: 'simple-icons:microsoft',
    color: '#00A4EF'
  },
  {
    type: 'renren',
    name: '人人网',
    icon: 'simple-icons:renren',
    color: '#005AAA'
  },
  {
    type: 'stack_overflow',
    name: 'Stack Overflow',
    icon: 'simple-icons:stackoverflow',
    color: '#F58025'
  },
  {
    type: 'huawei',
    name: '华为',
    icon: 'simple-icons:huawei',
    color: '#FF0000'
  },
  {
    type: 'aliyun',
    name: '阿里云',
    icon: 'simple-icons:alibabacloud',
    color: '#FF6A00'
  },
  {
    type: 'gitea',
    name: 'Gitea',
    icon: 'simple-icons:gitea',
    color: '#609926'
  }
]

/**
 * 根据类型获取社交登录配置
 * @param type 社交登录类型
 * @returns 配置对象或undefined
 */
export function getSocialConfig(type: string): SocialConfig | undefined {
  return SOCIAL_CONFIGS.find((config) => config.type === type)
}

/**
 * 根据类型列表获取配置列表
 * @param types 逗号分隔的类型字符串或类型数组
 * @returns 配置对象数组
 */
export function getSocialConfigs(types: string | string[]): SocialConfig[] {
  const typeArray = Array.isArray(types) ? types : types.split(',').filter((t) => t.trim())
  return typeArray.map((type) => getSocialConfig(type.trim())).filter((config) => config !== undefined) as SocialConfig[]
}
