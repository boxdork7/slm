<!-- ConfigProvider 全局配置 用于全局配置 Wot 组件，提供深色模式、主题定制等能力 -->
<template>
  <view :class="`wot-theme-${theme} ${customClass}`" :style="themeStyle">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { CONFIG_PROVIDER_KEY, mapThemeVarsToCSSVars } from '../composables/useConfigProvider'

defineOptions({
  name: 'WdConfigProvider',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 主题风格类型
 */
type ConfigProviderTheme = 'light' | 'dark'

/**
 * 基础主题变量接口
 */
interface BaseThemeVars {
  /** 主题色 */
  colorTheme?: string
  /** 用于mix的白色 */
  colorWhite?: string
  /** 用于mix的黑色 */
  colorBlack?: string
  /** 成功色 */
  colorSuccess?: string
  /** 警告色 */
  colorWarning?: string
  /** 危险出错色 */
  colorDanger?: string
  /** 紫色 */
  colorPurple?: string
  /** 黄色 */
  colorYellow?: string
  /** 蓝色 */
  colorBlue?: string
  /** 信息色 */
  colorInfo?: string
  /** 灰色1 */
  colorGray1?: string
  /** 灰色2 */
  colorGray2?: string
  /** 灰色3 */
  colorGray3?: string
  /** 灰色4 */
  colorGray4?: string
  /** 灰色5 */
  colorGray5?: string
  /** 灰色6 */
  colorGray6?: string
  /** 灰色7 */
  colorGray7?: string
  /** 灰色8 */
  colorGray8?: string
  /** 字体灰色1 */
  fontGray1?: string
  /** 字体灰色2 */
  fontGray2?: string
  /** 字体灰色3 */
  fontGray3?: string
  /** 字体灰色4 */
  fontGray4?: string
  /** 字体白色1 */
  fontWhite1?: string
  /** 字体白色2 */
  fontWhite2?: string
  /** 字体白色3 */
  fontWhite3?: string
  /** 字体白色4 */
  fontWhite4?: string
  /** 模块标题/重要正文 */
  colorTitle?: string
  /** 普通正文 */
  colorContent?: string
  /** 次要信息，注释/补充/正文 */
  colorSecondary?: string
  /** 辅助文字字号，弱化信息，引导性/不可点文字 */
  colorAid?: string
  /** 失效、默认提示文字 */
  colorTip?: string
  /** 控件边框线 */
  colorBorder?: string
  /** 分割线颜色 */
  colorBorderLight?: string
  /** 背景色、禁用填充色 */
  colorBg?: string
  /** 深色背景1 */
  darkBackground?: string
  /** 深色背景2 */
  darkBackground2?: string
  /** 深色背景3 */
  darkBackground3?: string
  /** 深色背景4 */
  darkBackground4?: string
  /** 深色背景5 */
  darkBackground5?: string
  /** 深色背景6 */
  darkBackground6?: string
  /** 深色背景7 */
  darkBackground7?: string
  /** 深色字体1 */
  darkColor?: string
  /** 深色字体2 */
  darkColor2?: string
  /** 深色字体3 */
  darkColor3?: string
  /** 深色灰色 */
  darkColorGray?: string
  /** 深色边框颜色 */
  darkBorderColor?: string
  /** icon颜色 */
  colorIcon?: string
  /** icon颜色hover */
  colorIconActive?: string
  /** icon颜色disabled */
  colorIconDisabled?: string
  /** 大型标题字号 */
  fsBig?: string
  /** 重要数据字号 */
  fsImportant?: string
  /** 标题字号/重要正文字号 */
  fsTitle?: string
  /** 普通正文字号 */
  fsContent?: string
  /** 次要信息字号 */
  fsSecondary?: string
  /** 辅助文字字号 */
  fsAid?: string
  /** 字重500 */
  fwMedium?: string
  /** 字重600 */
  fwSemibold?: string
  /** 屏幕两边留白padding */
  sizeSidePadding?: string
}

/**
 * 操作表组件主题变量接口
 */
interface ActionSheetThemeVars {
  /** 操作表字重 */
  actionSheetWeight?: string
  /** 操作表圆角 */
  actionSheetRadius?: string
  /** 操作表加载图标大小 */
  actionSheetLoadingSize?: string
  /** 操作表选项高度 */
  actionSheetActionHeight?: string
  /** 操作表文字颜色 */
  actionSheetColor?: string
  /** 操作表字体大小 */
  actionSheetFs?: string
  /** 操作表激活颜色 */
  actionSheetActiveColor?: string
  /** 操作表副标题字体大小 */
  actionSheetSubnameFs?: string
  /** 操作表副标题颜色 */
  actionSheetSubnameColor?: string
  /** 操作表禁用颜色 */
  actionSheetDisabledColor?: string
  /** 操作表背景色 */
  actionSheetBg?: string
  /** 操作表标题高度 */
  actionSheetTitleHeight?: string
  /** 操作表标题字体大小 */
  actionSheetTitleFs?: string
  /** 操作表关闭按钮字体大小 */
  actionSheetCloseFs?: string
  /** 操作表关闭按钮颜色 */
  actionSheetCloseColor?: string
  /** 操作表关闭按钮顶部位置 */
  actionSheetCloseTop?: string
  /** 操作表关闭按钮右侧位置 */
  actionSheetCloseRight?: string
  /** 操作表取消按钮颜色 */
  actionSheetCancelColor?: string
  /** 操作表取消按钮高度 */
  actionSheetCancelHeight?: string
  /** 操作表取消按钮背景色 */
  actionSheetCancelBg?: string
  /** 操作表取消按钮圆角 */
  actionSheetCancelRadius?: string
  /** 操作表面板内边距 */
  actionSheetPanelPadding?: string
  /** 操作表面板图片字体大小 */
  actionSheetPanelImgFs?: string
  /** 操作表面板图片圆角 */
  actionSheetPanelImgRadius?: string
}

/**
 * 徽标组件主题变量接口
 */
interface BadgeThemeVars {
  /** 徽标背景色 */
  badgeBg?: string
  /** 徽标文字颜色 */
  badgeColor?: string
  /** 徽标字体大小 */
  badgeFs?: string
  /** 徽标内边距 */
  badgePadding?: string
  /** 徽标高度 */
  badgeHeight?: string
  /** 徽标主要颜色 */
  badgePrimary?: string
  /** 徽标成功颜色 */
  badgeSuccess?: string
  /** 徽标警告颜色 */
  badgeWarning?: string
  /** 徽标危险颜色 */
  badgeDanger?: string
  /** 徽标信息颜色 */
  badgeInfo?: string
  /** 徽标圆点大小 */
  badgeDotSize?: string
  /** 徽标边框 */
  badgeBorder?: string
}

/**
 * 按钮组件主题变量接口
 */
interface ButtonThemeVars {
  /** 按钮禁用透明度 */
  buttonDisabledOpacity?: string
  /** 小按钮高度 */
  buttonSmallHeight?: string
  /** 小按钮内边距 */
  buttonSmallPadding?: string
  /** 小按钮字体大小 */
  buttonSmallFs?: string
  /** 小按钮圆角 */
  buttonSmallRadius?: string
  /** 小按钮加载图标大小 */
  buttonSmallLoading?: string
  /** 中等按钮高度 */
  buttonMediumHeight?: string
  /** 中等按钮内边距 */
  buttonMediumPadding?: string
  /** 中等按钮字体大小 */
  buttonMediumFs?: string
  /** 中等按钮圆角 */
  buttonMediumRadius?: string
  /** 中等按钮加载图标大小 */
  buttonMediumLoading?: string
  /** 中等按钮阴影大小 */
  buttonMediumBoxShadowSize?: string
  /** 大按钮高度 */
  buttonLargeHeight?: string
  /** 大按钮内边距 */
  buttonLargePadding?: string
  /** 大按钮字体大小 */
  buttonLargeFs?: string
  /** 大按钮圆角 */
  buttonLargeRadius?: string
  /** 大按钮加载图标大小 */
  buttonLargeLoading?: string
  /** 大按钮阴影大小 */
  buttonLargeBoxShadowSize?: string
  /** 按钮图标字体大小 */
  buttonIconFs?: string
  /** 按钮图标大小 */
  buttonIconSize?: string
  /** 按钮图标颜色 */
  buttonIconColor?: string
  /** 按钮图标禁用颜色 */
  buttonIconDisabledColor?: string
  /** 普通按钮颜色 */
  buttonNormalColor?: string
  /** 普通按钮禁用颜色 */
  buttonNormalDisabledColor?: string
  /** 朴素按钮背景色 */
  buttonPlainBgColor?: string
  /** 主要按钮颜色 */
  buttonPrimaryColor?: string
  /** 主要按钮背景色 */
  buttonPrimaryBgColor?: string
  /** 成功按钮颜色 */
  buttonSuccessColor?: string
  /** 成功按钮背景色 */
  buttonSuccessBgColor?: string
  /** 信息按钮颜色 */
  buttonInfoColor?: string
  /** 信息按钮背景色 */
  buttonInfoBgColor?: string
  /** 信息朴素按钮边框颜色 */
  buttonInfoPlainBorderColor?: string
  /** 信息朴素按钮普通颜色 */
  buttonInfoPlainNormalColor?: string
  /** 警告按钮颜色 */
  buttonWarningColor?: string
  /** 警告按钮背景色 */
  buttonWarningBgColor?: string
  /** 错误按钮颜色 */
  buttonErrorColor?: string
  /** 错误按钮背景色 */
  buttonErrorBgColor?: string
  /** 文字按钮悬停透明度 */
  buttonTextHoverOpacity?: string
}

/**
 * 单元格组件主题变量接口
 */
interface CellThemeVars {
  /** 单元格内边距 */
  cellPadding?: string
  /** 单元格行高 */
  cellLineHeight?: string
  /** 单元格分组标题字体大小 */
  cellGroupTitleFs?: string
  /** 单元格分组内边距 */
  cellGroupPadding?: string
  /** 单元格分组标题颜色 */
  cellGroupTitleColor?: string
  /** 单元格分组值字体大小 */
  cellGroupValueFs?: string
  /** 单元格分组值颜色 */
  cellGroupValueColor?: string
  /** 单元格包装器内边距 */
  cellWrapperPadding?: string
  /** 单元格包装器大内边距 */
  cellWrapperPaddingLarge?: string
  /** 单元格包装器带标签内边距 */
  cellWrapperPaddingWithLabel?: string
  /** 单元格图标右边距 */
  cellIconRight?: string
  /** 单元格图标大小 */
  cellIconSize?: string
  /** 单元格标题字体大小 */
  cellTitleFs?: string
  /** 单元格标题颜色 */
  cellTitleColor?: string
  /** 单元格标签字体大小 */
  cellLabelFs?: string
  /** 单元格标签颜色 */
  cellLabelColor?: string
  /** 单元格值字体大小 */
  cellValueFs?: string
  /** 单元格值颜色 */
  cellValueColor?: string
  /** 单元格箭头大小 */
  cellArrowSize?: string
  /** 单元格箭头颜色 */
  cellArrowColor?: string
  /** 单元格清除颜色 */
  cellClearColor?: string
  /** 单元格点击背景 */
  cellTapBg?: string
  /** 单元格大标题字体大小 */
  cellTitleFsLarge?: string
  /** 单元格大标签字体大小 */
  cellLabelFsLarge?: string
  /** 单元格大图标大小 */
  cellIconSizeLarge?: string
  /** 单元格必填颜色 */
  cellRequiredColor?: string
  /** 单元格必填大小 */
  cellRequiredSize?: string
  /** 单元格垂直顶部 */
  cellVerticalTop?: string
}

/**
 * 日历组件主题变量接口
 */
interface CalendarThemeVars {
  /** 日历字体大小 */
  calendarFs?: string
  /** 日历面板内边距 */
  calendarPanelPadding?: string
  /** 日历面板标题字体大小 */
  calendarPanelTitleFs?: string
  /** 日历面板标题颜色 */
  calendarPanelTitleColor?: string
  /** 日历星期颜色 */
  calendarWeekColor?: string
  /** 日历星期高度 */
  calendarWeekHeight?: string
  /** 日历星期字体大小 */
  calendarWeekFs?: string
  /** 日历日期字体大小 */
  calendarDayFs?: string
  /** 日历日期颜色 */
  calendarDayColor?: string
  /** 日历日期字重 */
  calendarDayFw?: string
  /** 日历日期高度 */
  calendarDayHeight?: string
  /** 日历月份宽度 */
  calendarMonthWidth?: string
  /** 日历激活颜色 */
  calendarActiveColor?: string
  /** 日历选中颜色 */
  calendarSelectedColor?: string
  /** 日历禁用颜色 */
  calendarDisabledColor?: string
  /** 日历范围颜色 */
  calendarRangeColor?: string
  /** 日历激活边框 */
  calendarActiveBorder?: string
  /** 日历信息字体大小 */
  calendarInfoFs?: string
  /** 日历项目下边距 */
  calendarItemMarginBottom?: string
}

/**
 * 复选框组件主题变量接口
 */
interface CheckboxThemeVars {
  /** 复选框外边距 */
  checkboxMargin?: string
  /** 复选框背景色 */
  checkboxBg?: string
  /** 复选框标签外边距 */
  checkboxLabelMargin?: string
  /** 复选框大小 */
  checkboxSize?: string
  /** 复选框图标大小 */
  checkboxIconSize?: string
  /** 复选框边框颜色 */
  checkboxBorderColor?: string
  /** 复选框选中颜色 */
  checkboxCheckColor?: string
  /** 复选框标签字体大小 */
  checkboxLabelFs?: string
  /** 复选框标签颜色 */
  checkboxLabelColor?: string
  /** 复选框选中颜色 */
  checkboxCheckedColor?: string
  /** 复选框禁用颜色 */
  checkboxDisabledColor?: string
  /** 复选框禁用标签颜色 */
  checkboxDisabledLabelColor?: string
  /** 复选框禁用选中颜色 */
  checkboxDisabledCheckColor?: string
  /** 复选框禁用选中背景 */
  checkboxDisabledCheckBg?: string
  /** 复选框方形圆角 */
  checkboxSquareRadius?: string
  /** 复选框大尺寸 */
  checkboxLargeSize?: string
  /** 复选框大标签字体大小 */
  checkboxLargeLabelFs?: string
  /** 复选框按钮高度 */
  checkboxButtonHeight?: string
  /** 复选框按钮最小宽度 */
  checkboxButtonMinWidth?: string
  /** 复选框按钮圆角 */
  checkboxButtonRadius?: string
  /** 复选框按钮背景 */
  checkboxButtonBg?: string
  /** 复选框按钮字体大小 */
  checkboxButtonFontSize?: string
  /** 复选框按钮边框 */
  checkboxButtonBorder?: string
  /** 复选框按钮禁用边框 */
  checkboxButtonDisabledBorder?: string
}

/**
 * 折叠面板组件主题变量接口
 */
interface CollapseThemeVars {
  /** 折叠面板侧边内边距 */
  collapseSidePadding?: string
  /** 折叠面板内容内边距 */
  collapseBodyPadding?: string
  /** 折叠面板头部内边距 */
  collapseHeaderPadding?: string
  /** 折叠面板标题颜色 */
  collapseTitleColor?: string
  /** 折叠面板标题字体大小 */
  collapseTitleFs?: string
  /** 折叠面板箭头大小 */
  collapseArrowSize?: string
  /** 折叠面板箭头颜色 */
  collapseArrowColor?: string
  /** 折叠面板内容字体大小 */
  collapseBodyFs?: string
  /** 折叠面板内容颜色 */
  collapseBodyColor?: string
  /** 折叠面板禁用颜色 */
  collapseDisabledColor?: string
  /** 折叠面板收回字体大小 */
  collapseRetractFs?: string
  /** 折叠面板更多颜色 */
  collapseMoreColor?: string
}

/**
 * 分割线组件主题变量接口
 */
interface DividerThemeVars {
  /** 分割线内边距 */
  dividerPadding?: string
  /** 分割线外边距 */
  dividerMargin?: string
  /** 分割线颜色 */
  dividerColor?: string
  /** 分割线线条颜色 */
  dividerLineColor?: string
  /** 分割线线条高度 */
  dividerLineHeight?: string
  /** 分割线字体大小 */
  dividerFs?: string
  /** 分割线内容左宽度 */
  dividerContentLeftWidth?: string
  /** 分割线内容左外边距 */
  dividerContentLeftMargin?: string
  /** 分割线内容右外边距 */
  dividerContentRightMargin?: string
  /** 分割线内容右宽度 */
  dividerContentRightWidth?: string
  /** 分割线垂直高度 */
  dividerVerticalHeight?: string
  /** 分割线垂直内容外边距 */
  dividerVerticalContentMargin?: string
  /** 分割线垂直线条宽度 */
  dividerVerticalLineWidth?: string
}

/**
 * 下拉菜单组件主题变量接口
 */
interface DropMenuThemeVars {
  /** 下拉菜单高度 */
  dropMenuHeight?: string
  /** 下拉菜单颜色 */
  dropMenuColor?: string
  /** 下拉菜单字体大小 */
  dropMenuFs?: string
  /** 下拉菜单箭头字体大小 */
  dropMenuArrowFs?: string
  /** 下拉菜单侧边内边距 */
  dropMenuSidePadding?: string
  /** 下拉菜单禁用颜色 */
  dropMenuDisabledColor?: string
  /** 下拉菜单项目高度 */
  dropMenuItemHeight?: string
  /** 下拉菜单项目颜色 */
  dropMenuItemColor?: string
  /** 下拉菜单项目字体大小 */
  dropMenuItemFs?: string
  /** 下拉菜单项目激活颜色 */
  dropMenuItemColorActive?: string
  /** 下拉菜单项目提示颜色 */
  dropMenuItemColorTip?: string
  /** 下拉菜单项目提示字体大小 */
  dropMenuItemFsTip?: string
  /** 下拉菜单选项勾选大小 */
  dropMenuOptionCheckSize?: string
  /** 下拉菜单线条颜色 */
  dropMenuLineColor?: string
  /** 下拉菜单线条高度 */
  dropMenuLineHeight?: string
}

/**
 * 数字输入框组件主题变量接口
 */
interface InputNumberThemeVars {
  /** 数字输入框颜色 */
  inputNumberColor?: string
  /** 数字输入框边框颜色 */
  inputNumberBorderColor?: string
  /** 数字输入框禁用颜色 */
  inputNumberDisabledColor?: string
  /** 数字输入框高度 */
  inputNumberHeight?: string
  /** 数字输入框按钮宽度 */
  inputNumberBtnWidth?: string
  /** 数字输入框输入宽度 */
  inputNumberInputWidth?: string
  /** 数字输入框圆角 */
  inputNumberRadius?: string
  /** 数字输入框字体大小 */
  inputNumberFs?: string
  /** 数字输入框图标大小 */
  inputNumberIconSize?: string
  /** 数字输入框图标颜色 */
  inputNumberIconColor?: string
}

/**
 * 输入框组件主题变量接口
 */
interface InputThemeVars {
  /** 输入框内边距 */
  inputPadding?: string
  /** 输入框边框颜色 */
  inputBorderColor?: string
  /** 输入框非空边框颜色 */
  inputNotEmptyBorderColor?: string
  /** 输入框字体大小 */
  inputFs?: string
  /** 输入框大字体大小 */
  inputFsLarge?: string
  /** 输入框图标外边距 */
  inputIconMargin?: string
  /** 输入框颜色 */
  inputColor?: string
  /** 输入框占位符颜色 */
  inputPlaceholderColor?: string
  /** 输入框禁用颜色 */
  inputDisabledColor?: string
  /** 输入框错误颜色 */
  inputErrorColor?: string
  /** 输入框图标颜色 */
  inputIconColor?: string
  /** 输入框清除颜色 */
  inputClearColor?: string
  /** 输入框计数颜色 */
  inputCountColor?: string
  /** 输入框计数当前颜色 */
  inputCountCurrentColor?: string
  /** 输入框背景 */
  inputBg?: string
  /** 输入框单元格背景 */
  inputCellBg?: string
  /** 输入框单元格边框颜色 */
  inputCellBorderColor?: string
  /** 输入框单元格内边距 */
  inputCellPadding?: string
  /** 输入框单元格大内边距 */
  inputCellPaddingLarge?: string
  /** 输入框单元格高度 */
  inputCellHeight?: string
  /** 输入框单元格标签宽度 */
  inputCellLabelWidth?: string
  /** 输入框内部高度 */
  inputInnerHeight?: string
  /** 输入框内部无边框高度 */
  inputInnerHeightNoBorder?: string
  /** 输入框计数字体大小 */
  inputCountFs?: string
  /** 输入框计数大字体大小 */
  inputCountFsLarge?: string
  /** 输入框图标大小 */
  inputIconSize?: string
  /** 输入框图标大尺寸 */
  inputIconSizeLarge?: string
}

/**
 * 文本域组件主题变量接口
 */
interface TextareaThemeVars {
  /** 文本域内边距 */
  textareaPadding?: string
  /** 文本域边框颜色 */
  textareaBorderColor?: string
  /** 文本域非空边框颜色 */
  textareaNotEmptyBorderColor?: string
  /** 文本域字体大小 */
  textareaFs?: string
  /** 文本域大字体大小 */
  textareaFsLarge?: string
  /** 文本域图标外边距 */
  textareaIconMargin?: string
  /** 文本域颜色 */
  textareaColor?: string
  /** 文本域图标颜色 */
  textareaIconColor?: string
  /** 文本域清除颜色 */
  textareaClearColor?: string
  /** 文本域计数颜色 */
  textareaCountColor?: string
  /** 文本域计数当前颜色 */
  textareaCountCurrentColor?: string
  /** 文本域背景 */
  textareaBg?: string
  /** 文本域单元格边框颜色 */
  textareaCellBorderColor?: string
  /** 文本域单元格内边距 */
  textareaCellPadding?: string
  /** 文本域单元格大内边距 */
  textareaCellPaddingLarge?: string
  /** 文本域单元格高度 */
  textareaCellHeight?: string
  /** 文本域计数字体大小 */
  textareaCountFs?: string
  /** 文本域计数大字体大小 */
  textareaCountFsLarge?: string
  /** 文本域图标大小 */
  textareaIconSize?: string
  /** 文本域图标大尺寸 */
  textareaIconSizeLarge?: string
}

/**
 * 加载更多组件主题变量接口
 */
interface LoadmoreThemeVars {
  /** 加载更多高度 */
  loadmoreHeight?: string
  /** 加载更多颜色 */
  loadmoreColor?: string
  /** 加载更多字体大小 */
  loadmoreFs?: string
  /** 加载更多错误颜色 */
  loadmoreErrorColor?: string
  /** 加载更多刷新字体大小 */
  loadmoreRefreshFs?: string
  /** 加载更多加载大小 */
  loadmoreLoadingSize?: string
}

/**
 * 消息框组件主题变量接口
 */
interface MessageBoxThemeVars {
  /** 消息框宽度 */
  messageBoxWidth?: string
  /** 消息框背景 */
  messageBoxBg?: string
  /** 消息框圆角 */
  messageBoxRadius?: string
  /** 消息框内边距 */
  messageBoxPadding?: string
  /** 消息框标题字体大小 */
  messageBoxTitleFs?: string
  /** 消息框标题颜色 */
  messageBoxTitleColor?: string
  /** 消息框内容字体大小 */
  messageBoxContentFs?: string
  /** 消息框内容颜色 */
  messageBoxContentColor?: string
  /** 消息框内容最大高度 */
  messageBoxContentMaxHeight?: string
  /** 消息框内容滚动条宽度 */
  messageBoxContentScrollbarWidth?: string
  /** 消息框内容滚动条颜色 */
  messageBoxContentScrollbarColor?: string
  /** 消息框输入错误颜色 */
  messageBoxInputErrorColor?: string
}

/**
 * 通知栏组件主题变量接口
 */
interface NoticeBarThemeVars {
  /** 通知栏字体大小 */
  noticeBarFs?: string
  /** 通知栏行高 */
  noticeBarLineHeight?: string
  /** 通知栏边框圆角 */
  noticeBarBorderRadius?: string
  /** 通知栏内边距 */
  noticeBarPadding?: string
  /** 通知栏警告背景 */
  noticeBarWarningBg?: string
  /** 通知栏信息背景 */
  noticeBarInfoBg?: string
  /** 通知栏危险背景 */
  noticeBarDangerBg?: string
  /** 通知栏警告颜色 */
  noticeBarWarningColor?: string
  /** 通知栏信息颜色 */
  noticeBarInfoColor?: string
  /** 通知栏危险颜色 */
  noticeBarDangerColor?: string
  /** 通知栏前缀大小 */
  noticeBarPrefixSize?: string
  /** 通知栏关闭背景 */
  noticeBarCloseBg?: string
  /** 通知栏关闭大小 */
  noticeBarCloseSize?: string
  /** 通知栏关闭颜色 */
  noticeBarCloseColor?: string
  /** 通知栏包装内边距 */
  noticeBarWrapPadding?: string
}

/**
 * 分页组件主题变量接口
 */
interface PaginationThemeVars {
  /** 分页内容内边距 */
  paginationContentPadding?: string
  /** 分页消息内边距 */
  paginationMessagePadding?: string
  /** 分页消息字体大小 */
  paginationMessageFs?: string
  /** 分页消息颜色 */
  paginationMessageColor?: string
  /** 分页导航边框 */
  paginationNavBorder?: string
  /** 分页导航边框圆角 */
  paginationNavBorderRadius?: string
  /** 分页导航字体大小 */
  paginationNavFs?: string
  /** 分页导航宽度 */
  paginationNavWidth?: string
  /** 分页导航颜色 */
  paginationNavColor?: string
  /** 分页导航内容字体大小 */
  paginationNavContentFs?: string
  /** 分页导航分隔符内边距 */
  paginationNavSepatatorPadding?: string
  /** 分页导航当前颜色 */
  paginationNavCurrentColor?: string
  /** 分页图标大小 */
  paginationIconSize?: string
}

/**
 * 选择器组件主题变量接口
 */
interface PickerThemeVars {
  /** 选择器工具栏高度 */
  pickerToolbarHeight?: string
  /** 选择器操作高度 */
  pickerActionHeight?: string
  /** 选择器工具栏完成颜色 */
  pickerToolbarFinishColor?: string
  /** 选择器工具栏取消颜色 */
  pickerToolbarCancelColor?: string
  /** 选择器工具栏字体大小 */
  pickerToolbarFs?: string
  /** 选择器工具栏标题颜色 */
  pickerToolbarTitleColor?: string
  /** 选择器列字体大小 */
  pickerColumnFs?: string
  /** 选择器背景 */
  pickerBg?: string
  /** 选择器列激活字体大小 */
  pickerColumnActiveFs?: string
  /** 选择器列颜色 */
  pickerColumnColor?: string
  /** 选择器列高度 */
  pickerColumnHeight?: string
  /** 选择器列项目高度 */
  pickerColumnItemHeight?: string
  /** 选择器列选中背景 */
  pickerColumnSelectBg?: string
  /** 选择器加载按钮颜色 */
  pickerLoadingButtonColor?: string
  /** 选择器列内边距 */
  pickerColumnPadding?: string
  /** 选择器列禁用颜色 */
  pickerColumnDisabledColor?: string
  /** 选择器遮罩 */
  pickerMask?: string
  /** 选择器加载背景 */
  pickerLoadingBg?: string
  /** 选择器区域分隔符颜色 */
  pickerRegionSeparatorColor?: string
  /** 选择器单元格箭头大尺寸 */
  pickerCellArrowSizeLarge?: string
  /** 选择器区域颜色 */
  pickerRegionColor?: string
  /** 选择器区域激活背景颜色 */
  pickerRegionBgActiveColor?: string
  /** 选择器区域字体大小 */
  pickerRegionFs?: string
}

/**
 * 列选择器组件主题变量接口
 */
interface ColPickerThemeVars {
  /** 列选择器选中高度 */
  colPickerSelectedHeight?: string
  /** 列选择器选中内边距 */
  colPickerSelectedPadding?: string
  /** 列选择器选中字体大小 */
  colPickerSelectedFs?: string
  /** 列选择器选中颜色 */
  colPickerSelectedColor?: string
  /** 列选择器选中字重 */
  colPickerSelectedFw?: string
  /** 列选择器线宽度 */
  colPickerLineWidth?: string
  /** 列选择器线高度 */
  colPickerLineHeight?: string
  /** 列选择器线颜色 */
  colPickerLineColor?: string
  /** 列选择器线阴影 */
  colPickerLineBoxShadow?: string
  /** 列选择器列表高度 */
  colPickerListHeight?: string
  /** 列选择器列表底部内边距 */
  colPickerListPaddingBottom?: string
  /** 列选择器列表颜色 */
  colPickerListColor?: string
  /** 列选择器列表禁用颜色 */
  colPickerListColorDisabled?: string
  /** 列选择器列表提示颜色 */
  colPickerListColorTip?: string
  /** 列选择器列表字体大小 */
  colPickerListFs?: string
  /** 列选择器列表提示字体大小 */
  colPickerListFsTip?: string
  /** 列选择器列表项目内边距 */
  colPickerListItemPadding?: string
  /** 列选择器列表选中图标大小 */
  colPickerListCheckedIconSize?: string
  /** 列选择器列表选中颜色 */
  colPickerListColorChecked?: string
}

/**
 * 遮罩层组件主题变量接口
 */
interface OverlayThemeVars {
  /** 遮罩层背景 */
  overlayBg?: string
  /** 遮罩层深色背景 */
  overlayBgDark?: string
}

/**
 * 弹出层组件主题变量接口
 */
interface PopupThemeVars {
  /** 弹出层关闭大小 */
  popupCloseSize?: string
  /** 弹出层关闭颜色 */
  popupCloseColor?: string
}

/**
 * 进度条组件主题变量接口
 */
interface ProgressThemeVars {
  /** 进度条内边距 */
  progressPadding?: string
  /** 进度条背景 */
  progressBg?: string
  /** 进度条危险颜色 */
  progressDangerColor?: string
  /** 进度条成功颜色 */
  progressSuccessColor?: string
  /** 进度条警告颜色 */
  progressWarningColor?: string
  /** 进度条颜色 */
  progressColor?: string
  /** 进度条高度 */
  progressHeight?: string
  /** 进度条标签颜色 */
  progressLabelColor?: string
  /** 进度条标签字体大小 */
  progressLabelFs?: string
  /** 进度条图标字体大小 */
  progressIconFs?: string
}

/**
 * 单选框组件主题变量接口
 */
interface RadioThemeVars {
  /** 单选框外边距 */
  radioMargin?: string
  /** 单选框标签外边距 */
  radioLabelMargin?: string
  /** 单选框大小 */
  radioSize?: string
  /** 单选框背景 */
  radioBg?: string
  /** 单选框标签字体大小 */
  radioLabelFs?: string
  /** 单选框标签颜色 */
  radioLabelColor?: string
  /** 单选框选中颜色 */
  radioCheckedColor?: string
  /** 单选框禁用颜色 */
  radioDisabledColor?: string
  /** 单选框禁用标签颜色 */
  radioDisabledLabelColor?: string
  /** 单选框大尺寸 */
  radioLargeSize?: string
  /** 单选框大标签字体大小 */
  radioLargeLabelFs?: string
  /** 单选框按钮高度 */
  radioButtonHeight?: string
  /** 单选框按钮最小宽度 */
  radioButtonMinWidth?: string
  /** 单选框按钮最大宽度 */
  radioButtonMaxWidth?: string
  /** 单选框按钮圆角 */
  radioButtonRadius?: string
  /** 单选框按钮背景 */
  radioButtonBg?: string
  /** 单选框按钮字体大小 */
  radioButtonFs?: string
  /** 单选框按钮边框 */
  radioButtonBorder?: string
  /** 单选框按钮禁用边框 */
  radioButtonDisabledBorder?: string
  /** 单选框圆点大小 */
  radioDotSize?: string
  /** 单选框大圆点大小 */
  radioDotLargeSize?: string
  /** 单选框圆点选中背景 */
  radioDotCheckedBg?: string
  /** 单选框圆点选中边框颜色 */
  radioDotCheckedBorderColor?: string
  /** 单选框圆点边框颜色 */
  radioDotBorderColor?: string
  /** 单选框圆点禁用边框 */
  radioDotDisabledBorder?: string
  /** 单选框圆点禁用背景 */
  radioDotDisabledBg?: string
}

/**
 * 搜索组件主题变量接口
 */
interface SearchThemeVars {
  /** 搜索侧边内边距 */
  searchSidePadding?: string
  /** 搜索内边距 */
  searchPadding?: string
  /** 搜索输入圆角 */
  searchInputRadius?: string
  /** 搜索输入背景 */
  searchInputBg?: string
  /** 搜索输入高度 */
  searchInputHeight?: string
  /** 搜索输入内边距 */
  searchInputPadding?: string
  /** 搜索输入字体大小 */
  searchInputFs?: string
  /** 搜索输入颜色 */
  searchInputColor?: string
  /** 搜索图标颜色 */
  searchIconColor?: string
  /** 搜索图标大小 */
  searchIconSize?: string
  /** 搜索清除图标大小 */
  searchClearIconSize?: string
  /** 搜索占位符颜色 */
  searchPlaceholderColor?: string
  /** 搜索取消内边距 */
  searchCancelPadding?: string
  /** 搜索取消字体大小 */
  searchCancelFs?: string
  /** 搜索取消颜色 */
  searchCancelColor?: string
  /** 搜索浅色背景 */
  searchLightBg?: string
}

/**
 * 滑块组件主题变量接口
 */
interface SliderThemeVars {
  /** 滑块字体大小 */
  sliderFs?: string
  /** 滑块手柄圆角 */
  sliderHandleRadius?: string
  /** 滑块手柄背景 */
  sliderHandleBg?: string
  /** 滑块轴高度 */
  sliderAxieHeight?: string
  /** 滑块颜色 */
  sliderColor?: string
  /** 滑块轴背景 */
  sliderAxieBg?: string
  /** 滑块线条颜色 */
  sliderLineColor?: string
  /** 滑块禁用颜色 */
  sliderDisabledColor?: string
}

/**
 * 排序按钮组件主题变量接口
 */
interface SortButtonThemeVars {
  /** 排序按钮字体大小 */
  sortButtonFs?: string
  /** 排序按钮颜色 */
  sortButtonColor?: string
  /** 排序按钮高度 */
  sortButtonHeight?: string
  /** 排序按钮行高 */
  sortButtonLineHeight?: string
  /** 排序按钮线条颜色 */
  sortButtonLineColor?: string
}

/**
 * 步骤条组件主题变量接口
 */
interface StepsThemeVars {
  /** 步骤条图标大小 */
  stepsIconSize?: string
  /** 步骤条未激活颜色 */
  stepsInactiveColor?: string
  /** 步骤条完成颜色 */
  stepsFinishedColor?: string
  /** 步骤条图标文字字体大小 */
  stepsIconTextFs?: string
  /** 步骤条错误颜色 */
  stepsErrorColor?: string
  /** 步骤条标题字体大小 */
  stepsTitleFs?: string
  /** 步骤条标题字重 */
  stepsTitleFw?: string
  /** 步骤条标签字体大小 */
  stepsLabelFs?: string
  /** 步骤条描述颜色 */
  stepsDescriptionColor?: string
  /** 步骤条图标宽度 */
  stepsIsIconWidth?: string
  /** 步骤条线条颜色 */
  stepsLineColor?: string
  /** 步骤条圆点大小 */
  stepsDotSize?: string
  /** 步骤条圆点激活大小 */
  stepsDotActiveSize?: string
}

/**
 * 开关组件主题变量接口
 */
interface SwitchThemeVars {
  /** 开关大小 */
  switchSize?: string
  /** 开关宽度 */
  switchWidth?: string
  /** 开关高度 */
  switchHeight?: string
  /** 开关圆形大小 */
  switchCircleSize?: string
  /** 开关边框颜色 */
  switchBorderColor?: string
  /** 开关激活颜色 */
  switchActiveColor?: string
  /** 开关激活阴影颜色 */
  switchActiveShadowColor?: string
  /** 开关未激活颜色 */
  switchInactiveColor?: string
  /** 开关未激活阴影颜色 */
  switchInactiveShadowColor?: string
}

/**
 * 选项卡组件主题变量接口
 */
interface TabsThemeVars {
  /** 选项卡导航箭头字体大小 */
  tabsNavArrowFs?: string
  /** 选项卡导航箭头打开字体大小 */
  tabsNavArrowOpenFs?: string
  /** 选项卡导航宽度 */
  tabsNavWidth?: string
  /** 选项卡导航高度 */
  tabsNavHeight?: string
  /** 选项卡导航字体大小 */
  tabsNavFs?: string
  /** 选项卡导航颜色 */
  tabsNavColor?: string
  /** 选项卡导航背景 */
  tabsNavBg?: string
  /** 选项卡导航激活颜色 */
  tabsNavActiveColor?: string
  /** 选项卡导航禁用颜色 */
  tabsNavDisabledColor?: string
  /** 选项卡导航线条高度 */
  tabsNavLineHeight?: string
  /** 选项卡导航线条宽度 */
  tabsNavLineWidth?: string
  /** 选项卡导航线条背景颜色 */
  tabsNavLineBgColor?: string
  /** 选项卡导航地图字体大小 */
  tabsNavMapFs?: string
  /** 选项卡导航地图颜色 */
  tabsNavMapColor?: string
  /** 选项卡导航地图箭头颜色 */
  tabsNavMapArrowColor?: string
  /** 选项卡导航地图按钮前背景 */
  tabsNavMapBtnBeforeBg?: string
  /** 选项卡导航地图按钮返回颜色 */
  tabsNavMapButtonBackColor?: string
  /** 选项卡导航地图按钮圆角 */
  tabsNavMapButtonRadius?: string
  /** 选项卡导航地图模态背景 */
  tabsNavMapModalBg?: string
}

/**
 * 标签组件主题变量接口
 */
interface TagThemeVars {
  /** 标签字体大小 */
  tagFs?: string
  /** 标签颜色 */
  tagColor?: string
  /** 标签小字体大小 */
  tagSmallFs?: string
  /** 标签信息颜色 */
  tagInfoColor?: string
  /** 标签主要颜色 */
  tagPrimaryColor?: string
  /** 标签危险颜色 */
  tagDangerColor?: string
  /** 标签警告颜色 */
  tagWarningColor?: string
  /** 标签成功颜色 */
  tagSuccessColor?: string
  /** 标签信息背景 */
  tagInfoBg?: string
  /** 标签主要背景 */
  tagPrimaryBg?: string
  /** 标签危险背景 */
  tagDangerBg?: string
  /** 标签警告背景 */
  tagWarningBg?: string
  /** 标签成功背景 */
  tagSuccessBg?: string
  /** 标签圆形颜色 */
  tagRoundColor?: string
  /** 标签圆形边框颜色 */
  tagRoundBorderColor?: string
  /** 标签圆形圆角 */
  tagRoundRadius?: string
  /** 标签标记圆角 */
  tagMarkRadius?: string
  /** 标签关闭大小 */
  tagCloseSize?: string
  /** 标签关闭颜色 */
  tagCloseColor?: string
  /** 标签关闭激活颜色 */
  tagCloseActiveColor?: string
}

/**
 * 提示组件主题变量接口
 */
interface ToastThemeVars {
  /** 提示颜色 */
  toastColor?: string
  /** 提示内边距 */
  toastPadding?: string
  /** 提示最大宽度 */
  toastMaxWidth?: string
  /** 提示圆角 */
  toastRadius?: string
  /** 提示背景 */
  toastBg?: string
  /** 提示字体大小 */
  toastFs?: string
  /** 提示行高 */
  toastLineHeight?: string
  /** 提示带图标最小宽度 */
  toastWithIconMinWidth?: string
  /** 提示图标大小 */
  toastIconSize?: string
  /** 提示图标右外边距 */
  toastIconMarginRight?: string
  /** 提示图标底外边距 */
  toastIconMarginBottom?: string
  /** 提示加载内边距 */
  toastLoadingPadding?: string
  /** 提示加载底外边距 */
  toastLoadingMarginBottom?: string
  /** 提示阴影 */
  toastBoxShadow?: string
}

/**
 * 加载组件主题变量接口
 */
interface LoadingThemeVars {
  /** 加载大小 */
  loadingSize?: string
}

/**
 * 工具提示组件主题变量接口
 */
interface TooltipThemeVars {
  /** 工具提示背景 */
  tooltipBg?: string
  /** 工具提示颜色 */
  tooltipColor?: string
  /** 工具提示圆角 */
  tooltipRadius?: string
  /** 工具提示箭头大小 */
  tooltipArrowSize?: string
  /** 工具提示字体大小 */
  tooltipFs?: string
  /** 工具提示模糊 */
  tooltipBlur?: string
  /** 工具提示内边距 */
  tooltipPadding?: string
  /** 工具提示关闭大小 */
  tooltipCloseSize?: string
  /** 工具提示层级 */
  tooltipZIndex?: string
  /** 工具提示行高 */
  tooltipLineHeight?: string
}

/**
 * 气泡框组件主题变量接口
 */
interface PopoverThemeVars {
  /** 气泡框背景 */
  popoverBg?: string
  /** 气泡框颜色 */
  popoverColor?: string
  /** 气泡框阴影 */
  popoverBoxShadow?: string
  /** 气泡框箭头阴影 */
  popoverArrowBoxShadow?: string
  /** 气泡框边框颜色 */
  popoverBorderColor?: string
  /** 气泡框圆角 */
  popoverRadius?: string
  /** 气泡框箭头大小 */
  popoverArrowSize?: string
  /** 气泡框字体大小 */
  popoverFs?: string
  /** 气泡框内边距 */
  popoverPadding?: string
  /** 气泡框行高 */
  popoverLineHeight?: string
  /** 气泡框层级 */
  popoverZIndex?: string
}

/**
 * 网格项组件主题变量接口
 */
interface GridItemThemeVars {
  /** 网格项字体大小 */
  gridItemFs?: string
  /** 网格项背景 */
  gridItemBg?: string
  /** 网格项内边距 */
  gridItemPadding?: string
  /** 网格项边框颜色 */
  gridItemBorderColor?: string
  /** 网格项悬停背景 */
  gridItemHoverBg?: string
  /** 网格项悬停深色背景 */
  gridItemHoverBgDark?: string
}

/**
 * 状态提示组件主题变量接口
 */
interface StatustipThemeVars {
  /** 状态提示字体大小 */
  statustipFs?: string
  /** 状态提示颜色 */
  statustipColor?: string
  /** 状态提示行高 */
  statustipLineHeight?: string
  /** 状态提示内边距 */
  statustipPadding?: string
}

/**
 * 卡片组件主题变量接口
 */
interface CardThemeVars {
  /** 卡片背景 */
  cardBg?: string
  /** 卡片字体大小 */
  cardFs?: string
  /** 卡片内边距 */
  cardPadding?: string
  /** 卡片底部内边距 */
  cardFooterPadding?: string
  /** 卡片阴影颜色 */
  cardShadowColor?: string
  /** 卡片圆角 */
  cardRadius?: string
  /** 卡片行高 */
  cardLineHeight?: string
  /** 卡片外边距 */
  cardMargin?: string
  /** 卡片标题颜色 */
  cardTitleColor?: string
  /** 卡片标题字体大小 */
  cardTitleFs?: string
  /** 卡片内容边框颜色 */
  cardContentBorderColor?: string
  /** 卡片矩形标题内边距 */
  cardRectangleTitlePadding?: string
  /** 卡片矩形内容内边距 */
  cardRectangleContentPadding?: string
  /** 卡片矩形底部内边距 */
  cardRectangleFooterPadding?: string
  /** 卡片内容颜色 */
  cardContentColor?: string
  /** 卡片内容行高 */
  cardContentLineHeight?: string
  /** 卡片内容外边距 */
  cardContentMargin?: string
  /** 卡片内容矩形外边距 */
  cardContentRectangleMargin?: string
}

/**
 * 上传组件主题变量接口
 */
interface UploadThemeVars {
  /** 上传大小 */
  uploadSize?: string
  /** 上传唤起图标大小 */
  uploadEvokeIconSize?: string
  /** 上传唤起背景 */
  uploadEvokeBg?: string
  /** 上传唤起颜色 */
  uploadEvokeColor?: string
  /** 上传唤起禁用颜色 */
  uploadEvokeDisabledColor?: string
  /** 上传关闭图标大小 */
  uploadCloseIconSize?: string
  /** 上传关闭图标颜色 */
  uploadCloseIconColor?: string
  /** 上传进度字体大小 */
  uploadProgressFs?: string
  /** 上传文件字体大小 */
  uploadFileFs?: string
  /** 上传文件颜色 */
  uploadFileColor?: string
  /** 上传预览名称字体大小 */
  uploadPreviewNameFs?: string
  /** 上传预览图标大小 */
  uploadPreviewIconSize?: string
  /** 上传预览名称背景 */
  uploadPreviewNameBg?: string
  /** 上传预览名称高度 */
  uploadPreviewNameHeight?: string
  /** 上传封面图标大小 */
  uploadCoverIconSize?: string
}

/**
 * 幕帘组件主题变量接口
 */
interface CurtainThemeVars {
  /** 幕帘内容圆角 */
  curtainContentRadius?: string
  /** 幕帘内容关闭颜色 */
  curtainContentCloseColor?: string
  /** 幕帘内容关闭字体大小 */
  curtainContentCloseFs?: string
}

/**
 * 通知组件主题变量接口
 */
interface NotifyThemeVars {
  /** 通知文字颜色 */
  notifyTextColor?: string
  /** 通知内边距 */
  notifyPadding?: string
  /** 通知字体大小 */
  notifyFontSize?: string
  /** 通知行高 */
  notifyLineHeight?: string
  /** 通知主要背景 */
  notifyPrimaryBackground?: string
  /** 通知成功背景 */
  notifySuccessBackground?: string
  /** 通知危险背景 */
  notifyDangerBackground?: string
  /** 通知警告背景 */
  notifyWarningBackground?: string
}

/**
 * 骨架屏组件主题变量接口
 */
interface SkeletonThemeVars {
  /** 骨架屏背景颜色 */
  skeletonBackgroundColor?: string
  /** 骨架屏动画渐变 */
  skeletonAnimationGradient?: string
  /** 骨架屏动画闪烁 */
  skeletonAnimationFlashed?: string
  /** 骨架屏文本默认高度 */
  skeletonTextHeightDefault?: string
  /** 骨架屏矩形默认高度 */
  skeletonRectHeightDefault?: string
  /** 骨架屏圆形默认高度 */
  skeletonCircleHeightDefault?: string
  /** 骨架屏行底外边距 */
  skeletonRowMarginBottom?: string
  /** 骨架屏文本边框圆角 */
  skeletonBorderRadiusText?: string
  /** 骨架屏矩形边框圆角 */
  skeletonBorderRadiusRect?: string
  /** 骨架屏圆形边框圆角 */
  skeletonBorderRadiusCircle?: string
}

/**
 * 圆形组件主题变量接口
 */
interface CircleThemeVars {
  /** 圆形文字颜色 */
  circleTextColor?: string
}

/**
 * 轮播图组件主题变量接口
 */
interface SwiperThemeVars {
  /** 轮播图圆角 */
  swiperRadius?: string
  /** 轮播图项目内边距 */
  swiperItemPadding?: string
  /** 轮播图项目文字颜色 */
  swiperItemTextColor?: string
  /** 轮播图项目文字字体大小 */
  swiperItemTextFs?: string
}

/**
 * 轮播图导航组件主题变量接口
 */
interface SwiperNavThemeVars {
  /** 轮播图导航圆点颜色 */
  swiperNavDotColor?: string
  /** 轮播图导航圆点激活颜色 */
  swiperNavDotActiveColor?: string
  /** 轮播图导航圆点大小 */
  swiperNavDotSize?: string
  /** 轮播图导航圆点条激活宽度 */
  swiperNavDotsBarActiveWidth?: string
  /** 轮播图导航分数颜色 */
  swiperNavFractionColor?: string
  /** 轮播图导航分数背景颜色 */
  swiperNavFractionBgColor?: string
  /** 轮播图导航分数高度 */
  swiperNavFractionHeight?: string
  /** 轮播图导航分数字体大小 */
  swiperNavFractionFontSize?: string
  /** 轮播图导航按钮颜色 */
  swiperNavBtnColor?: string
  /** 轮播图导航按钮背景颜色 */
  swiperNavBtnBgColor?: string
  /** 轮播图导航按钮大小 */
  swiperNavBtnSize?: string
}

/**
 * 分段控制器组件主题变量接口
 */
interface SegmentedThemeVars {
  /** 分段控制器内边距 */
  segmentedPadding?: string
  /** 分段控制器项目背景颜色 */
  segmentedItemBgColor?: string
  /** 分段控制器项目颜色 */
  segmentedItemColor?: string
  /** 分段控制器项目激活背景 */
  segmentedItemAcitveBg?: string
  /** 分段控制器项目禁用颜色 */
  segmentedItemDisabledColor?: string
}

/**
 * 标签栏组件主题变量接口
 */
interface TabbarThemeVars {
  /** 标签栏高度 */
  tabbarHeight?: string
  /** 标签栏阴影 */
  tabbarBoxShadow?: string
}

/**
 * 标签栏项组件主题变量接口
 */
interface TabbarItemThemeVars {
  /** 标签栏项标题字体大小 */
  tabbarItemTitleFontSize?: string
  /** 标签栏项标题行高 */
  tabbarItemTitleLineHeight?: string
  /** 标签栏未激活颜色 */
  tabbarInactiveColor?: string
  /** 标签栏激活颜色 */
  tabbarActiveColor?: string
  /** 标签栏项图标大小 */
  tabbarItemIconSize?: string
}

/**
 * 导航栏组件主题变量接口
 */
interface NavbarThemeVars {
  /** 导航栏高度 */
  navbarHeight?: string
  /** 导航栏文字颜色 */
  navbarColor?: string
  /** 导航栏背景色 */
  navbarBackground?: string
  /** 导航栏箭头大小 */
  navbarArrowSize?: string
  /** 导航栏描述字体大小 */
  navbarDescFontSize?: string
  /** 导航栏描述字体颜色 */
  navbarDescFontColor?: string
  /** 导航栏标题字体大小 */
  navbarTitleFontSize?: string
  /** 导航栏标题字体粗细 */
  navbarTitleFontWeight?: string
  /** 导航栏禁用透明度 */
  navbarDisabledOpacity?: string
  /** 导航栏悬停颜色 */
  navbarHoverColor?: string
}

/**
 * 导航栏胶囊组件主题变量接口
 */
interface NavbarCapsuleThemeVars {
  /** 导航栏胶囊边框颜色 */
  navbarCapsuleBorderColor?: string
  /** 导航栏胶囊边框圆角 */
  navbarCapsuleBorderRadius?: string
  /** 导航栏胶囊宽度 */
  navbarCapsuleWidth?: string
  /** 导航栏胶囊高度 */
  navbarCapsuleHeight?: string
  /** 导航栏胶囊图标大小 */
  navbarCapsuleIconSize?: string
}

/**
 * 表格组件主题变量接口
 */
interface TableThemeVars {
  /** 表格颜色 */
  tableColor?: string
  /** 表格背景 */
  tableBg?: string
  /** 表格条纹背景 */
  tableStripeBg?: string
  /** 表格边框颜色 */
  tableBorderColor?: string
  /** 表格字体大小 */
  tableFontSize?: string
}

/**
 * 侧边栏组件主题变量接口
 */
interface SidebarThemeVars {
  /** 侧边栏背景 */
  sidebarBg?: string
  /** 侧边栏宽度 */
  sidebarWidth?: string
  /** 侧边栏高度 */
  sidebarHeight?: string
}

/**
 * 侧边栏项组件主题变量接口
 */
interface SidebarItemThemeVars {
  /** 侧边栏颜色 */
  sidebarColor?: string
  /** 侧边栏项高度 */
  sidebarItemHeight?: string
  /** 侧边栏项行高 */
  sidebarItemLineHeight?: string
  /** 侧边栏禁用颜色 */
  sidebarDisabledColor?: string
  /** 侧边栏激活颜色 */
  sidebarActiveColor?: string
  /** 侧边栏激活背景 */
  sidebarActiveBg?: string
  /** 侧边栏悬停背景 */
  sidebarHoverBg?: string
  /** 侧边栏边框圆角 */
  sidebarBorderRadius?: string
  /** 侧边栏字体大小 */
  sidebarFontSize?: string
  /** 侧边栏图标大小 */
  sidebarIconSize?: string
  /** 侧边栏激活边框宽度 */
  sidebarActiveBorderWidth?: string
  /** 侧边栏激活边框高度 */
  sidebarActiveBorderHeight?: string
}

/**
 * 浮动按钮组件主题变量接口
 */
interface FabThemeVars {
  /** 浮动按钮触发器高度 */
  fabTriggerHeight?: string
  /** 浮动按钮触发器宽度 */
  fabTriggerWidth?: string
  /** 浮动按钮操作内边距 */
  fabActionsPadding?: string
  /** 浮动按钮图标字体大小 */
  fabIconFs?: string
}

/**
 * 倒计时组件主题变量接口
 */
interface CountDownThemeVars {
  /** 倒计时文字颜色 */
  countDownTextColor?: string
  /** 倒计时字体大小 */
  countDownFontSize?: string
  /** 倒计时行高 */
  countDownLineHeight?: string
}

/**
 * 键盘组件主题变量接口
 */
interface KeyboardThemeVars {
  /** 键盘按键高度 */
  keyboardKeyHeight?: string
  /** 键盘按键字体大小 */
  keyboardKeyFontSize?: string
  /** 键盘按键背景 */
  keyboardKeyBackground?: string
  /** 键盘按键边框圆角 */
  keyboardKeyBorderRadius?: string
  /** 键盘删除字体大小 */
  keyboardDeleteFontSize?: string
  /** 键盘按键激活颜色 */
  keyboardKeyActiveColor?: string
  /** 键盘按钮文字颜色 */
  keyboardButtonTextColor?: string
  /** 键盘按钮背景 */
  keyboardButtonBackground?: string
  /** 键盘按钮激活透明度 */
  keyboardButtonActiveOpacity?: string
  /** 键盘背景 */
  keyboardBackground?: string
  /** 键盘标题高度 */
  keyboardTitleHeight?: string
  /** 键盘标题颜色 */
  keyboardTitleColor?: string
  /** 键盘标题字体大小 */
  keyboardTitleFontSize?: string
  /** 键盘关闭内边距 */
  keyboardClosePadding?: string
  /** 键盘关闭颜色 */
  keyboardCloseColor?: string
  /** 键盘关闭字体大小 */
  keyboardCloseFontSize?: string
  /** 键盘图标大小 */
  keyboardIconSize?: string
}

/**
 * 数字键盘组件主题变量接口
 */
interface NumberKeyboardThemeVars {
  /** 数字键盘按键高度 */
  numberKeyboardKeyHeight?: string
  /** 数字键盘按键字体大小 */
  numberKeyboardKeyFontSize?: string
  /** 数字键盘按键背景 */
  numberKeyboardKeyBackground?: string
  /** 数字键盘按键边框圆角 */
  numberKeyboardKeyBorderRadius?: string
  /** 数字键盘删除字体大小 */
  numberKeyboardDeleteFontSize?: string
  /** 数字键盘按键激活颜色 */
  numberKeyboardKeyActiveColor?: string
  /** 数字键盘按钮文字颜色 */
  numberKeyboardButtonTextColor?: string
  /** 数字键盘按钮背景 */
  numberKeyboardButtonBackground?: string
  /** 数字键盘按钮激活透明度 */
  numberKeyboardButtonActiveOpacity?: string
  /** 数字键盘背景 */
  numberKeyboardBackground?: string
  /** 数字键盘标题高度 */
  numberKeyboardTitleHeight?: string
  /** 数字键盘标题颜色 */
  numberKeyboardTitleColor?: string
  /** 数字键盘标题字体大小 */
  numberKeyboardTitleFontSize?: string
  /** 数字键盘关闭内边距 */
  numberKeyboardClosePadding?: string
  /** 数字键盘关闭颜色 */
  numberKeyboardCloseColor?: string
  /** 数字键盘关闭字体大小 */
  numberKeyboardCloseFontSize?: string
  /** 数字键盘图标大小 */
  numberKeyboardIconSize?: string
}

/**
 * 密码输入组件主题变量接口
 */
interface PasswordInputThemeVars {
  /** 密码输入高度 */
  passwordInputHeight?: string
  /** 密码输入外边距 */
  passwordInputMargin?: string
  /** 密码输入字体大小 */
  passwordInputFontSize?: string
  /** 密码输入圆角 */
  passwordInputRadius?: string
  /** 密码输入背景 */
  passwordInputBackground?: string
  /** 密码输入信息颜色 */
  passwordInputInfoColor?: string
  /** 密码输入信息字体大小 */
  passwordInputInfoFontSize?: string
  /** 密码输入边框颜色 */
  passwordInputBorderColor?: string
  /** 密码输入错误信息颜色 */
  passwordInputErrorInfoColor?: string
  /** 密码输入圆点大小 */
  passwordInputDotSize?: string
  /** 密码输入圆点颜色 */
  passwordInputDotColor?: string
  /** 密码输入文字颜色 */
  passwordInputTextColor?: string
  /** 密码输入光标颜色 */
  passwordInputCursorColor?: string
  /** 密码输入光标宽度 */
  passwordInputCursorWidth?: string
  /** 密码输入光标高度 */
  passwordInputCursorHeight?: string
  /** 密码输入光标持续时间 */
  passwordInputCursorDuration?: string
}

/**
 * 表单项组件主题变量接口
 */
interface FormItemThemeVars {
  /** 表单项错误消息颜色 */
  formItemErrorMessageColor?: string
  /** 表单项错误消息字体大小 */
  formItemErrorMessageFontSize?: string
  /** 表单项错误消息行高 */
  formItemErrorMessageLineHeight?: string
}

/**
 * 回到顶部组件主题变量接口
 */
interface BacktopThemeVars {
  /** 回到顶部背景 */
  backtopBg?: string
  /** 回到顶部图标大小 */
  backtopIconSize?: string
}

/**
 * 索引栏组件主题变量接口
 */
interface IndexBarThemeVars {
  /** 索引栏索引字体大小 */
  indexBarIndexFontSize?: string
}

/**
 * 文本组件主题变量接口
 */
interface TextThemeVars {
  /** 文本信息颜色 */
  textInfoColor?: string
  /** 文本主要颜色 */
  textPrimaryColor?: string
  /** 文本错误颜色 */
  textErrorColor?: string
  /** 文本警告颜色 */
  textWarningColor?: string
  /** 文本成功颜色 */
  textSuccessColor?: string
}

/**
 * 视频预览组件主题变量接口
 */
interface VideoPreviewThemeVars {
  /** 视频预览背景 */
  videoPreviewBg?: string
  /** 视频预览关闭颜色 */
  videoPreviewCloseColor?: string
  /** 视频预览关闭字体大小 */
  videoPreviewCloseFontSize?: string
}

/**
 * 图片裁剪组件主题变量接口
 */
interface ImgCropperThemeVars {
  /** 图片裁剪图标大小 */
  imgCropperIconSize?: string
  /** 图片裁剪图标颜色 */
  imgCropperIconColor?: string
}

/**
 * 浮动面板组件主题变量接口
 */
interface FloatingPanelThemeVars {
  /** 浮动面板背景 */
  floatingPanelBg?: string
  /** 浮动面板圆角 */
  floatingPanelRadius?: string
  /** 浮动面板层级 */
  floatingPanelZIndex?: string
  /** 浮动面板头部高度 */
  floatingPanelHeaderHeight?: string
  /** 浮动面板条宽度 */
  floatingPanelBarWidth?: string
  /** 浮动面板条高度 */
  floatingPanelBarHeight?: string
  /** 浮动面板条背景 */
  floatingPanelBarBg?: string
  /** 浮动面板条圆角 */
  floatingPanelBarRadius?: string
  /** 浮动面板内容背景 */
  floatingPanelContentBg?: string
}

/**
 * 签名组件主题变量接口
 */
interface SignatureThemeVars {
  /** 签名背景 */
  signatureBg?: string
  /** 签名圆角 */
  signatureRadius?: string
  /** 签名边框 */
  signatureBorder?: string
  /** 签名底部外边距顶部 */
  signatureFooterMarginTop?: string
  /** 签名按钮左外边距 */
  signatureButtonMarginLeft?: string
}

/**
 * 配置提供者主题变量接口
 * 包含所有组件的主题变量
 */
export type ConfigProviderThemeVars = BaseThemeVars &
  ActionSheetThemeVars &
  BadgeThemeVars &
  ButtonThemeVars &
  CellThemeVars &
  CalendarThemeVars &
  CheckboxThemeVars &
  CollapseThemeVars &
  DividerThemeVars &
  DropMenuThemeVars &
  InputNumberThemeVars &
  InputThemeVars &
  TextareaThemeVars &
  LoadmoreThemeVars &
  MessageBoxThemeVars &
  NoticeBarThemeVars &
  PaginationThemeVars &
  PickerThemeVars &
  ColPickerThemeVars &
  OverlayThemeVars &
  PopupThemeVars &
  ProgressThemeVars &
  RadioThemeVars &
  SearchThemeVars &
  SliderThemeVars &
  SortButtonThemeVars &
  StepsThemeVars &
  SwitchThemeVars &
  TabsThemeVars &
  TagThemeVars &
  ToastThemeVars &
  LoadingThemeVars &
  TooltipThemeVars &
  PopoverThemeVars &
  GridItemThemeVars &
  StatustipThemeVars &
  CardThemeVars &
  UploadThemeVars &
  CurtainThemeVars &
  NotifyThemeVars &
  SkeletonThemeVars &
  CircleThemeVars &
  SwiperThemeVars &
  SwiperNavThemeVars &
  SegmentedThemeVars &
  TabbarThemeVars &
  TabbarItemThemeVars &
  NavbarThemeVars &
  NavbarCapsuleThemeVars &
  TableThemeVars &
  SidebarThemeVars &
  SidebarItemThemeVars &
  FabThemeVars &
  CountDownThemeVars &
  KeyboardThemeVars &
  NumberKeyboardThemeVars &
  PasswordInputThemeVars &
  FormItemThemeVars &
  BacktopThemeVars &
  IndexBarThemeVars &
  TextThemeVars &
  VideoPreviewThemeVars &
  ImgCropperThemeVars &
  FloatingPanelThemeVars &
  SignatureThemeVars

/**
 * 配置提供者组件属性接口
 */
interface WdConfigProviderProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 主题风格，设置为 dark 来开启深色模式，全局生效 */
  theme?: ConfigProviderTheme
  /** 自定义主题变量 */
  themeVars?: ConfigProviderThemeVars
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdConfigProviderProps>(), {
  customStyle: '',
  customClass: '',
  theme: 'light',
  themeVars: () => ({}),
})

/**
 * 计算 CSS 变量样式字符串
 * 使用 composable 中的 mapThemeVarsToCSSVars 将主题变量转换为 CSS 变量
 */
const cssVarsStyle = computed(() => {
  if (!props.themeVars || Object.keys(props.themeVars).length === 0) return ''
  return mapThemeVarsToCSSVars(props.themeVars)
})

/**
 * 通过 provide 向子组件注入主题样式
 */
provide(CONFIG_PROVIDER_KEY, {
  style: cssVarsStyle,
})

/**
 * 计算主题样式
 * 将主题变量转换为CSS变量并合并自定义样式
 */
const themeStyle = computed(() => {
  const vars = cssVarsStyle.value
  return vars ? `${vars}; ${props.customStyle}` : props.customStyle
})
</script>

<style lang="scss" scoped></style>
