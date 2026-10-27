<!-- 富文本编辑器 -->
<template>
  <!--
    富文本编辑器根容器
    - customClass: 自定义样式类
    - computedStyle: 计算后的内联样式
    - data-toolbar-position: 工具栏位置标识，用于CSS选择器
    - handleOutsideClick: 点击外部区域时关闭fab工具
  -->
  <view
    :class="`wd-rich-text ${customClass}`"
    :style="computedStyle"
    :data-toolbar-position="toolbarPosition"
    @tap="handleOutsideClick"
  >
    <!--
      工具栏区域
      只有在非只读模式下才显示
      @tap="format" 处理格式化操作
    -->
    <view v-if="!readOnly" class="wd-rich-text-toolbar" @tap="format">
      <!-- ========== 标题工具 ========== -->
      <!-- 使用fab-tool组件实现标题级别选择的浮动工具 -->
      <fab-tool v-if="toolbarList.includes('header')" :visible="curFab === 'header'">
        <!-- 标题工具触发器 -->
        <view
          :class="formats.header ? 'ql-active' : ''"
          class="iconfont iconfont-header"
          title="标题"
          data-name="header"
          @click.stop="fabTap('header')"
        />
        <!-- 标题级别选择面板 -->
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'header')">
            <view v-for="item in fabTools.header" :key="item.value">
              <view
                v-if="toolbarList.includes(item.name)"
                class="fab-sub"
                :class="[
                  formats.header === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="header"
                :data-value="item.value"
              />
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- ========== 基础文本格式工具 ========== -->
      <!-- 粗体 -->
      <view
        v-if="toolbarList.includes('bold')"
        :class="formats.bold ? 'ql-active' : ''"
        class="iconfont iconfont-bold"
        title="加粗"
        data-name="bold"
      />

      <!-- 斜体 -->
      <view
        v-if="toolbarList.includes('italic')"
        :class="formats.italic ? 'ql-active' : ''"
        class="iconfont iconfont-italic"
        title="斜体"
        data-name="italic"
      />

      <!-- 下划线 -->
      <view
        v-if="toolbarList.includes('underline')"
        :class="formats.underline ? 'ql-active' : ''"
        class="iconfont iconfont-underline"
        title="下划线"
        data-name="underline"
      />

      <!-- 删除线 -->
      <view
        v-if="toolbarList.includes('strike')"
        :class="formats.strike ? 'ql-active' : ''"
        class="iconfont iconfont-strikethrough"
        title="删除线"
        data-name="strike"
      />

      <!-- ========== 对齐方式工具 ========== -->
      <fab-tool v-if="toolbarList.includes('align')" :visible="curFab === 'align'">
        <!-- 对齐工具触发器 -->
        <view
          :class="formats.align ? 'ql-active' : ''"
          class="iconfont iconfont-alignment"
          title="对齐方式"
          data-name="align"
          @click.stop="fabTap('align')"
        />
        <!-- 对齐选项面板 -->
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'align')">
            <view v-for="item in fabTools.align" :key="item.value">
              <view
                v-if="toolbarList.includes(item.name)"
                class="fab-sub"
                :class="[
                  formats.align === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="align"
                :data-value="item.value"
              />
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- ========== 间距控制工具 ========== -->
      <!-- 行间距工具 -->
      <fab-tool v-if="toolbarList.includes('lineHeight')" :visible="curFab === 'lineHeight'">
        <view
          :class="formats.lineHeight ? 'ql-active' : ''"
          class="iconfont iconfont-line-spacing"
          title="行间距"
          data-name="lineHeight"
          @click.stop="fabTap('lineHeight')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'lineHeight')">
            <view v-for="item in fabTools.lineHeight" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.lineHeight === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="lineHeight"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- 字间距工具 -->
      <fab-tool v-if="toolbarList.includes('letterSpacing')" :visible="curFab === 'letterSpacing'">
        <view
          :class="formats.letterSpacing ? 'ql-active' : ''"
          class="iconfont iconfont-letter-spacing"
          title="字间距"
          data-name="letterSpacing"
          @click.stop="fabTap('letterSpacing')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'letterSpacing')">
            <view v-for="item in fabTools.space" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.letterSpacing === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="letterSpacing"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- 段前距工具 -->
      <fab-tool v-if="toolbarList.includes('marginTop')" :visible="curFab === 'marginTop'">
        <view
          :class="formats.marginTop ? 'ql-active' : ''"
          class="iconfont iconfont-before-spacing"
          title="段前距"
          data-name="marginTop"
          @click.stop="fabTap('marginTop')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'marginTop')">
            <view v-for="item in fabTools.space" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.marginTop === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="marginTop"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- 段后距工具 -->
      <fab-tool v-if="toolbarList.includes('marginBottom')" :visible="curFab === 'marginBottom'">
        <view
          :class="formats.marginBottom ? 'ql-active' : ''"
          class="iconfont iconfont-before-spacing"
          title="段后距"
          data-name="marginBottom"
          @click.stop="fabTap('marginBottom')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'marginBottom')">
            <view v-for="item in fabTools.space" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.marginBottom === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="marginBottom"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- ========== 字体相关工具 ========== -->
      <!-- 字体选择工具 -->
      <fab-tool v-if="toolbarList.includes('fontFamily')" :visible="curFab === 'fontFamily'">
        <view
          :class="formats.fontFamily ? 'ql-active' : ''"
          class="iconfont iconfont-font"
          title="字体"
          data-name="fontFamily"
          @click.stop="fabTap('fontFamily')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'fontFamily')">
            <view v-for="item in fabTools.fontFamily" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.fontFamily === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="fontFamily"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- 字体大小工具 -->
      <fab-tool v-if="toolbarList.includes('fontSize')" :visible="curFab === 'fontSize'">
        <view
          :class="formats.fontSize ? 'ql-active' : ''"
          class="iconfont iconfont-font-size"
          title="字号"
          data-name="fontSize"
          @click.stop="fabTap('fontSize')"
        />
        <template #content>
          <view class="fab-tools" @click.stop="fabTapSub($event, 'fontSize')">
            <view v-for="item in fabTools.fontSize" :key="item.value">
              <view
                class="fab-sub"
                :class="[
                  formats.fontSize === item.value ? 'ql-active' : '',
                  item.icon ? 'iconfont ' : '',
                  item.icon,
                ]"
                :title="item.title"
                data-name="fontSize"
                :data-value="item.value"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </template>
      </fab-tool>

      <!-- ========== 颜色工具 ========== -->
      <!-- 文字颜色工具 -->
      <view
        v-if="toolbarList.includes('color')"
        :style="{ color: formats.color ? textColor : 'initial' }"
        class="iconfont iconfont-text-color"
        title="文字颜色"
        data-name="color"
        :data-value="textColor"
      />

      <!-- 背景颜色工具 -->
      <view
        v-if="toolbarList.includes('backgroundColor')"
        :style="{ color: formats.backgroundColor ? backgroundColor : 'initial' }"
        class="iconfont iconfont-text-background-color"
        title="背景颜色"
        data-name="backgroundColor"
        :data-value="backgroundColor"
      />

      <!-- ========== 内容插入工具 ========== -->
      <!-- 日期插入工具 -->
      <view
        v-if="toolbarList.includes('date')"
        class="iconfont iconfont-date"
        title="日期"
        @tap="insertDate"
      />

      <!-- 待办列表工具 -->
      <view
        v-if="toolbarList.includes('listCheck')"
        class="iconfont iconfont-todo"
        title="待办"
        data-name="list"
        data-value="check"
      />

      <!-- 有序列表工具 -->
      <view
        v-if="toolbarList.includes('listOrdered')"
        :class="formats.list === 'ordered' ? 'ql-active' : ''"
        class="iconfont iconfont-ordered-list"
        title="有序列表"
        data-name="list"
        data-value="ordered"
      />

      <!-- 无序列表工具 -->
      <view
        v-if="toolbarList.includes('listBullet')"
        :class="formats.list === 'bullet' ? 'ql-active' : ''"
        class="iconfont iconfont-unordered-list"
        title="无序列表"
        data-name="list"
        data-value="bullet"
      />

      <!-- 分割线工具 -->
      <view
        v-if="toolbarList.includes('divider')"
        class="iconfont iconfont-divider-line"
        title="分割线"
        @click="insertDivider"
      />

      <!-- ========== 缩进控制工具 ========== -->
      <!-- 减少缩进 -->
      <view
        v-if="toolbarList.includes('indentDec')"
        class="iconfont iconfont-outdent"
        title="减少缩进"
        data-name="indent"
        data-value="-1"
      />

      <!-- 增加缩进 -->
      <view
        v-if="toolbarList.includes('indentInc')"
        class="iconfont iconfont-indent"
        title="增加缩进"
        data-name="indent"
        data-value="+1"
      />

      <!-- ========== 上下标工具 ========== -->
      <!-- 下标 -->
      <view
        v-if="toolbarList.includes('scriptSub')"
        :class="formats.script === 'sub' ? 'ql-active' : ''"
        class="iconfont iconfont-subscript"
        title="下标"
        data-name="script"
        data-value="sub"
      />

      <!-- 上标 -->
      <view
        v-if="toolbarList.includes('scriptSuper')"
        :class="formats.script === 'super' ? 'ql-active' : ''"
        class="iconfont iconfont-superscript"
        title="上标"
        data-name="script"
        data-value="super"
      />

      <!-- ========== 其他格式工具 ========== -->
      <!-- 文本方向 -->
      <view
        v-if="toolbarList.includes('direction')"
        :class="formats.direction === 'rtl' ? 'ql-active' : ''"
        class="iconfont iconfont-text-direction"
        title="文本方向"
        data-name="direction"
        data-value="rtl"
      />

      <!-- ========== 媒体插入工具 ========== -->
      <!-- 图片插入 -->
      <view
        v-if="toolbarList.includes('image')"
        class="iconfont iconfont-image"
        title="图片"
        @tap="insertImage"
      />

      <!-- 视频插入 -->
      <view
        v-if="toolbarList.includes('video')"
        class="iconfont iconfont-video"
        title="视频"
        @tap="insertVideo"
      />

      <!-- 超链接插入 -->
      <view
        v-if="toolbarList.includes('link')"
        class="iconfont iconfont-link"
        title="超链接"
        @tap="insertLink"
      />

      <!-- ========== 编辑操作工具 ========== -->
      <!-- 撤销 -->
      <view
        v-if="toolbarList.includes('undo')"
        class="iconfont iconfont-undo"
        title="撤销"
        @tap="undo"
      />

      <!-- 重做 -->
      <view
        v-if="toolbarList.includes('redo')"
        class="iconfont iconfont-redo"
        title="重做"
        @tap="redo"
      />

      <!-- 清除格式 -->
      <view
        v-if="toolbarList.includes('removeFormat')"
        class="iconfont iconfont-clear-fomat"
        title="清除格式"
        @tap="removeFormat"
      />

      <!-- 清空内容 -->
      <view
        v-if="toolbarList.includes('clear')"
        class="iconfont iconfont-delete"
        title="清空"
        @tap="clear"
      />

      <!-- 导出HTML -->
      <view
        v-if="toolbarList.includes('export')"
        class="iconfont iconfont-export"
        title="导出"
        @tap="exportHtml"
      />
    </view>

    <!-- ========== 自定义功能组件 ========== -->
    <!-- 颜色选择器：支持文字颜色和背景颜色选择 -->
    <color-picker
      v-if="toolbarList.includes('color') || toolbarList.includes('backgroundColor')"
      ref="colorPickerRef"
      :color="defaultColor"
      @confirm="confirmColor"
    />

    <!-- 链接编辑弹窗：用于添加超链接 -->
    <link-edit
      v-if="toolbarList.includes('link') && !readOnly"
      ref="linkEditRef"
      @confirm="confirmLink"
    />

    <!-- ========== 编辑器容器 ========== -->
    <view class="wd-rich-text-wrapper" @longpress="eLongpress">
      <!--
        uni-app editor组件：核心富文本编辑器
        - id: 编辑器唯一标识
        - class: 基础样式类，只读模式下禁用图片覆盖层
        - show-img-*: 图片相关功能开关
        - placeholder: 占位符文本
        - read-only: 只读模式开关
        - 事件处理: 状态变化、就绪、输入等
      -->
      <editor
        :id="editorId"
        class="ql-editor editor-container"
        :class="{ 'ql-image-overlay-none': readOnly }"
        show-img-size
        show-img-toolbar
        show-img-resize
        :placeholder="placeholder"
        :read-only="readOnly"
        @statuschange="onStatusChange"
        @ready="onEditorReady"
        @input="onEditorInput"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance, Ref } from 'vue'
import { getCurrentInstance, ref, watch, nextTick, computed } from 'vue'
import ColorPicker from './components/color-picker.vue'
import LinkEdit from './components/link-edit.vue'
import FabTool from './components/fab-tool.vue'
import { addLink, linkFlag, handleHtmlWithVideo, convertImgStylesToAttributes } from './utils'
import { useUpload } from '../composables/useUpload'
import { useToast } from '../wd-toast/useToast'
import { useMessage } from '../wd-message-box/useMessage'

// 获取当前组件实例，用于DOM查询
const { proxy } = getCurrentInstance() as any

// ========== 类型定义 ==========

/** 工具栏配置接口 */
export interface ToolbarConfig {
  keys?: string[] // 指定显示的工具（优先级高）
  excludeKeys?: string[] // 排除的工具列表
  iconSize?: string // 图标大小
  iconColumns?: number // 图标列数（网格布局）
}

/** 文件上传配置接口 */
export interface UploadConfig {
  enableDirectUpload?: boolean // 是否启用直接上传
  moduleName?: string // 模块名称
  directoryId?: string | number // 目录id
  directoryPath?: string // 文件路径
  action?: string // 上传接口地址
  header?: Record<string, any> // 请求头
  formData?: Record<string, any> // 额外表单数据
  onUploadStart?: (file: any) => void // 上传开始回调
  onUploadProgress?: (progress: number, file: any) => void // 上传进度回调
  onUploadSuccess?: (res: any, file: any) => void // 上传成功回调
  onUploadError?: (error: any, file: any) => void // 上传失败回调
}

/** 颜色值接口（RGBA格式） */
interface ColorValue {
  r: number // 红色分量 (0-255)
  g: number // 绿色分量 (0-255)
  b: number // 蓝色分量 (0-255)
  a: number // 透明度 (0-1)
}

/** 浮动工具项配置 */
interface FabToolItem {
  title: string // 工具提示文本
  name: string // 工具名称
  value: string | number // 工具值
  icon?: string // 图标CSS类名
}

/** 浮动工具集合 */
interface FabTools {
  header: FabToolItem[] // 标题工具集
  fontFamily: FabToolItem[] // 字体工具集
  fontSize: FabToolItem[] // 字号工具集
  align: FabToolItem[] // 对齐工具集
  lineHeight: FabToolItem[] // 行高工具集
  space: FabToolItem[] // 间距工具集
}

/** 链接数据接口 */
interface LinkData {
  text: string // 链接文本
  href: string // 链接地址
}

/** 颜色选择器返回结果 */
interface ColorResult {
  rgba: ColorValue // RGBA颜色值
  hex: string // 十六进制颜色值
}

/** 编辑器上下文接口 */
interface EditorContext {
  undo: () => void // 撤销操作
  redo: () => void // 重做操作
  format: (name: string, value?: string) => void // 格式化文本
  insertDivider: () => void // 插入分割线
  clear: () => void // 清空内容
  removeFormat: () => void // 移除格式
  insertText: (options: { text: string }) => void // 插入文本
  getContents: (options: { success: (res: any) => void }) => void // 获取内容
  setContents: (options: { html?: string; delta?: any }) => void // 设置内容
  insertImage: (options: { src: string; width: string; alt?: string; success?: () => void }) => void // 插入图片
  blur: () => void // 失去焦点
}

// ========== 组件属性接口 ==========
interface WdRichTextProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 工具栏位置：顶部或底部 */
  toolbarPosition?: 'top' | 'bottom'
  /** 编辑器最小高度 */
  minHeight?: string
  /** 编辑器最大高度 */
  maxHeight?: string
  /** 双向绑定的HTML内容 */
  modelValue?: string
  /** 编辑器唯一ID */
  editorId?: string
  /** 占位符文本 */
  placeholder?: string
  /** 是否只读模式 */
  readOnly?: boolean
  /** 最大字符数限制，-1表示无限制 */
  maxlength?: number
  /** 工具栏配置 */
  toolbarConfig?: ToolbarConfig
  /** 文件上传配置 */
  uploadConfig?: UploadConfig
}

// ========== 组件属性定义（带默认值） ==========
const props = withDefaults(defineProps<WdRichTextProps>(), {
  customStyle: '',
  customClass: '',
  toolbarPosition: 'bottom',
  minHeight: '30vh',
  maxHeight: '',
  modelValue: '',
  editorId: 'editor',
  placeholder: '写点什么吧 ~',
  readOnly: false,
  maxlength: -1,
  toolbarConfig: () => ({
    keys: [],
    excludeKeys: [],
    iconSize: '40rpx',
    iconColumns: 10,
  }),
  uploadConfig: () => ({
    enableDirectUpload: false,
  }),
})

// ========== 事件定义 ==========
const emit = defineEmits<{
  'update:modelValue': [value: string] // v-model更新事件
  init: [editorCtx: EditorContext, editorId: string] // 编辑器初始化完成
  input: [data: { html: string; text: string }, editorId: string] // 内容输入事件
  overMax: [data: { html: string; text: string }, editorId: string] // 超出字数限制
  addLink: [data: LinkData, editorId: string] // 添加链接事件
  exportHtml: [html: string, editorId: string] // 导出HTML事件
}>()

// ========== 响应式数据 ==========
const formats = ref<Record<string, any>>({}) // 当前文本格式状态
const curFab = ref<string>('') // 当前打开的浮动工具类型
const textColor = ref<string>('') // 当前文字颜色
const backgroundColor = ref<string>('') // 当前背景颜色
const curColor = ref<string>('') // 当前选择的颜色类型（color/backgroundColor）
const defaultColor = ref<ColorValue>({ r: 0, g: 0, b: 0, a: 1 }) // 颜色选择器默认颜色
const iconSize = ref<string>('36rpx') // 工具栏图标大小
const iconColumns = ref<number>(10) // 工具栏图标列数
const toolbarList = ref<string[]>([]) // 当前显示的工具列表
const editorCtx = ref<EditorContext | null>(null) // 编辑器上下文引用

// ========== 组件引用 ==========
const colorPickerRef = ref() // 颜色选择器组件引用
const linkEditRef = ref() // 链接编辑组件引用

// ========== 外部功能引用 ==========
const { fastUpload } = useUpload() // 文件上传功能
const toast = useToast() // 消息提示功能
const message = useMessage() // 消息确认功能

// ========== 常量数据 ==========
/** 所有可用的工具列表 */
const toolbarAllList: string[] = [
  'header', // 标题
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6', // 各级标题
  'bold', // 粗体
  'italic', // 斜体
  'underline', // 下划线
  'strike', // 删除线
  'align', // 对齐
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify', // 具体对齐方式
  'lineHeight', // 行高
  'letterSpacing', // 字间距
  'marginTop', // 段前距
  'marginBottom', // 段后距
  'fontFamily', // 字体
  'fontSize', // 字号
  'color', // 文字颜色
  'backgroundColor', // 背景颜色
  'date', // 日期
  'listCheck', // 待办列表
  'listOrdered', // 有序列表
  'listBullet', // 无序列表
  'indentInc', // 增加缩进
  'indentDec', // 减少缩进
  'divider', // 分割线
  'scriptSub', // 下标
  'scriptSuper', // 上标
  'direction', // 文本方向
  'image', // 图片
  'video', // 视频
  'link', // 链接
  'undo', // 撤销
  'redo', // 重做
  'removeFormat', // 清除格式
  'clear', // 清空
  'export', // 导出
]

/** 浮动工具配置数据 */
const fabTools: FabTools = {
  // 标题工具：支持6级标题
  header: [
    { title: '一级标题', name: 'H1', value: 1, icon: 'iconfont-header-1' },
    { title: '二级标题', name: 'H2', value: 2, icon: 'iconfont-header-2' },
    { title: '三级标题', name: 'H3', value: 3, icon: 'iconfont-header-3' },
    { title: '四级标题', name: 'H4', value: 4, icon: 'iconfont-header-4' },
    { title: '五级标题', name: 'H5', value: 5, icon: 'iconfont-header-5' },
    { title: '六级标题', name: 'H6', value: 6, icon: 'iconfont-header-6' },
  ],
  // 字体工具：常用中文字体
  fontFamily: [
    { title: '宋体', name: '宋', value: '宋体', icon: '' },
    { title: '黑体', name: '黑', value: '黑体', icon: '' },
    { title: '楷体', name: '楷', value: '楷体', icon: '' },
    { title: '仿宋', name: '仿', value: '仿宋', icon: '' },
    { title: '华文隶书', name: '隶', value: 'STLiti', icon: '' },
    { title: '华文行楷', name: '行', value: 'STXingkai', icon: '' },
    { title: '幼圆', name: '圆', value: 'YouYuan', icon: '' },
  ],
  // 字号工具：常用字体大小
  fontSize: [
    { title: '12', name: '12', value: '12px', icon: '' },
    { title: '14', name: '14', value: '14px', icon: '' },
    { title: '16', name: '16', value: '16px', icon: '' },
    { title: '18', name: '18', value: '18px', icon: '' },
    { title: '20', name: '20', value: '20px', icon: '' },
    { title: '22', name: '22', value: '22px', icon: '' },
    { title: '24', name: '24', value: '24px', icon: '' },
  ],
  // 对齐工具：四种对齐方式
  align: [
    { title: '左对齐', name: 'alignLeft', value: 'left', icon: 'iconfont-align-left' },
    { title: '居中对齐', name: 'alignCenter', value: 'center', icon: 'iconfont-align-center' },
    { title: '右对齐', name: 'alignRight', value: 'right', icon: 'iconfont-align-right' },
    { title: '两端对齐', name: 'alignJustify', value: 'justify', icon: 'iconfont-alignment' },
  ],
  // 行高工具：常用行高倍数
  lineHeight: [
    { title: '1倍', name: '1', value: '1', icon: '' },
    { title: '1.5倍', name: '1.5', value: '1.5', icon: '' },
    { title: '2倍', name: '2', value: '2', icon: '' },
    { title: '2.5倍', name: '2.5', value: '2.5', icon: '' },
    { title: '3倍', name: '3', value: '3', icon: '' },
  ],
  // 间距工具：字间距、段前距、段后距通用
  space: [
    { title: '0.5倍', name: '0.5', value: '0.5em', icon: '' },
    { title: '1倍', name: '1', value: '1em', icon: '' },
    { title: '1.5倍', name: '1.5', value: '1.5em', icon: '' },
    { title: '2倍', name: '2', value: '2em', icon: '' },
    { title: '2.5倍', name: '2.5', value: '2.5em', icon: '' },
    { title: '3倍', name: '3', value: '3em', icon: '' },
  ],
}

// ========== 内部状态管理 ==========
/** 内部HTML值，用于避免循环更新 */
const internalHtml = ref<string>('')

// ========== 计算属性 ==========
/**
 * 组合后的样式字符串
 * 包含CSS变量、最小高度、最大高度和自定义样式
 */
const computedStyle = computed(() => {
  let style = `--icon-size: ${iconSize.value}; --icon-columns: ${iconColumns.value};`

  // 添加最小高度
  if (!props.readOnly && props.minHeight) {
    style += ` min-height: ${props.minHeight};`
  }

  // 添加最大高度
  if (props.maxHeight) {
    style += ` max-height: ${props.maxHeight};`
  }

  // 添加自定义样式
  if (props.customStyle) {
    style += ` ${props.customStyle}`
  }

  return style
})

/**
 * 当前HTML值的计算属性
 * 优先使用props.modelValue，其次使用内部值
 */
const currentHtml = computed(() => {
  return props.modelValue || internalHtml.value
})

// ========== 监听器 ==========
/**
 * 监听工具栏配置变化，动态更新可用工具列表
 */
watch(
  () => props.toolbarConfig,
  (newToolbar: ToolbarConfig) => {
    if (newToolbar.keys?.length && newToolbar.keys.length > 0) {
      // 如果指定了keys，只显示指定的工具
      toolbarList.value = newToolbar.keys
    } else {
      // 否则显示所有工具，排除excludeKeys中的工具
      toolbarList.value =
        newToolbar.excludeKeys?.length && newToolbar.excludeKeys.length > 0
          ? toolbarAllList.filter((item) => !newToolbar.excludeKeys!.includes(item))
          : toolbarAllList
    }
    // 更新图标样式配置
    iconSize.value = newToolbar.iconSize || '40px'
    iconColumns.value = newToolbar.iconColumns || 10
  },
  { deep: true, immediate: true },
)

/**
 * 监听v-model值变化，同步到编辑器
 * 避免内部更新导致的循环触发
 */
watch(
  () => props.modelValue,
  (newValue: string) => {
    if (newValue !== internalHtml.value && editorCtx.value) {
      internalHtml.value = newValue
      // 处理HTML中的特殊格式（如图片样式转属性）
      const processedHtml = convertImgStylesToAttributes(newValue)
      editorCtx.value.setContents({ html: processedHtml })
    }
  },
  { immediate: true },
)

// ========== 事件处理方法 ==========
/**
 * 处理点击外部区域事件
 * 关闭所有打开的浮动工具面板
 */
const handleOutsideClick = () => {
  // 关闭所有打开的fab弹窗
  curFab.value = ''
}

/**
 * 编辑器准备就绪事件处理
 * 获取编辑器上下文并设置初始内容
 */
const onEditorReady = async () => {
  const initEditor = () => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#${props.editorId}`)
      .context((res: any) => {
        if (res && res.context) {
          editorCtx.value = res.context
          // 初始化成功的逻辑
          if (props.modelValue) {
            const processedHtml = convertImgStylesToAttributes(props.modelValue)
            nextTick(() => {
              editorCtx.value?.setContents({ html: processedHtml })
            })
          }
          emit('init', res.context, props.editorId)
        } else {
          // 如果获取不到context，延迟重试
          setTimeout(initEditor, 100)
        }
      })
      .exec()
  }

  // 延迟执行以确保DOM完全渲染
  await nextTick()
  setTimeout(initEditor, 50)
}

/**
 * 撤销操作
 */
const undo = () => {
  editorCtx.value?.undo()
}

/**
 * 重做操作
 */
const redo = () => {
  editorCtx.value?.redo()
}

/**
 * 显示颜色选择器
 * 根据当前选择的颜色类型设置默认值
 */
const showPicker = () => {
  switch (curColor.value) {
    case 'color':
      // 文字颜色：默认黑色
      defaultColor.value = textColor.value
        ? colorPickerRef.value.hex2Rgb(textColor.value)
        : { r: 0, g: 0, b: 0, a: 1 }
      break
    case 'backgroundColor':
      // 背景颜色：默认透明
      defaultColor.value = backgroundColor.value
        ? colorPickerRef.value.hex2Rgb(backgroundColor.value)
        : { r: 0, g: 0, b: 0, a: 0 }
      break
  }
  colorPickerRef.value.open()
}

/**
 * 格式化操作处理
 * 根据data属性分发到不同的处理方法
 */
const format = (e: any) => {
  const { name, value } = e.target.dataset
  if (!name) return

  switch (name) {
    case 'color':
    case 'backgroundColor':
      // 颜色选择：打开颜色选择器
      curColor.value = name
      showPicker()
      break
    default:
      // 其他格式：直接应用到编辑器
      editorCtx.value?.format(name, value)
      break
  }
}

/**
 * 浮动工具点击处理
 * 切换浮动工具面板的显示/隐藏状态
 */
const fabTap = (fabType: string) => {
  if (curFab.value !== fabType) {
    curFab.value = fabType
  } else {
    curFab.value = ''
  }
}

/**
 * 浮动工具子项点击处理
 * 应用选中的格式并关闭浮动面板
 */
const fabTapSub = (e: any, fabType: string) => {
  format(e)
  fabTap(fabType)
}

/**
 * 颜色选择确认处理
 * 应用选中的颜色到编辑器
 */
const confirmColor = (e: ColorResult) => {
  switch (curColor.value) {
    case 'color':
      textColor.value = e.hex
      editorCtx.value?.format('color', textColor.value)
      break
    case 'backgroundColor':
      backgroundColor.value = e.hex
      editorCtx.value?.format('backgroundColor', backgroundColor.value)
      break
  }
}

/**
 * 编辑器状态变化处理
 * 更新工具栏的激活状态和颜色显示
 */
const onStatusChange = (e: any) => {
  if (e.detail.color) {
    textColor.value = e.detail.color
  }
  if (e.detail.backgroundColor) {
    backgroundColor.value = e.detail.backgroundColor
  }
  formats.value = e.detail
}

/**
 * 插入分割线
 */
const insertDivider = () => {
  editorCtx.value?.insertDivider()
}

/**
 * 清空编辑器内容
 * 需要用户确认操作
 */
const clear = async () => {
  const { action } = await message.confirm({
    title: '清空编辑器',
    msg: '确定清空编辑器吗？',
  })

  if (action === 'confirm') {
    editorCtx.value?.clear()
    internalHtml.value = ''
    emit('update:modelValue', '')
  }
}

/**
 * 清除文本格式
 * 需要用户确认操作
 */
const removeFormat = async () => {
  const { action } = await message.confirm({
    title: '文本格式化',
    msg: '确定要清除所选择部分文本字格式吗？',
  })

  if (action === 'confirm') {
    editorCtx.value?.removeFormat()
  }
}

/**
 * 插入当前日期
 * 格式：YYYY/M/D
 */
const insertDate = () => {
  const date = new Date()
  const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  editorCtx.value?.insertText({ text: formatDate })
}

/**
 * 打开链接编辑弹窗
 */
const insertLink = () => {
  linkEditRef.value.open()
}

/**
 * 确认添加链接处理
 * 使用工具函数添加链接到编辑器
 */
const confirmLink = (e: LinkData) => {
  linkEditRef.value.close()
  addLink(editorCtx.value!, e, () => {
    // 修复添加超链接后，不触发input更新当前最新内容的bug
    // 这里做一下手动更新
    editorCtx.value?.getContents({
      success: (res: any) => {
        internalHtml.value = res.html
        emit('update:modelValue', res.html)
        emit('input', { html: res.html, text: res.text }, props.editorId)
      },
    })
  })
  emit('addLink', e, props.editorId)
}

/**
 * 处理图片上传
 * 支持多文件上传，带进度提示和错误处理
 */
const handleImageUpload = async (tempFiles: any[]) => {
  if (!tempFiles || tempFiles.length === 0) return

  for (const file of tempFiles) {
    try {
      // 显示上传加载提示
      toast.loading('正在上传图片...')

      // 调用上传配置中的回调
      props.uploadConfig?.onUploadStart?.(file)

      // 获取文件路径
      const filePath = file.tempFilePath || file.path

      // 使用 fastUpload 上传文件
      await fastUpload(filePath, {
        enableDirectUpload: props.uploadConfig?.enableDirectUpload || false,
        moduleName: props.uploadConfig?.moduleName,
        directoryId: props.uploadConfig?.directoryId,
        directoryPath: props.uploadConfig?.directoryPath,
        action: props.uploadConfig?.action,
        header: props.uploadConfig?.header,
        formData: props.uploadConfig?.formData,
        onProgress: (res: any, uploadFile: any) => {
          // 更新加载提示显示进度
          toast.loading(`正在上传图片... ${res.progress}%`)
          props.uploadConfig?.onUploadProgress?.(res.progress, uploadFile)
        },
        onSuccess: (res: any, uploadFile: any) => {
          // 关闭加载提示
          toast.close()

          // 显示成功提示
          toast.success('图片上传成功')

          // 插入图片到编辑器
          editorCtx.value?.insertImage({
            src: res.url,
            width: '80%',
            success: () => {
              props.uploadConfig?.onUploadSuccess?.(res, uploadFile)
              // 手动触发内容更新
              editorCtx.value?.getContents({
                success: (editorRes: any) => {
                  internalHtml.value = editorRes.html
                  emit('update:modelValue', editorRes.html)
                  emit('input', { html: editorRes.html, text: editorRes.text }, props.editorId)
                },
              })
            },
          })
        },
        onError: (error: any, uploadFile: any) => {
          // 关闭加载提示
          toast.close()

          // 显示错误提示
          toast.error(error.errMsg || '图片上传失败')
          props.uploadConfig?.onUploadError?.(error, uploadFile)
        },
      })
    } catch (error: any) {
      // 关闭加载提示
      toast.close()

      // 显示错误提示
      toast.error(error.message || '图片上传失败')
      props.uploadConfig?.onUploadError?.(error, file)
    }
  }
}

/**
 * 处理视频上传
 * 由于editor组件不支持直接插入video标签，使用图片占位的方式
 */
const handleVideoUpload = async (tempFilePath: string) => {
  try {
    // 显示上传加载提示
    toast.loading('正在上传视频...')

    // 调用上传配置中的回调
    props.uploadConfig?.onUploadStart?.({ path: tempFilePath })

    // 使用 fastUpload 上传视频文件
    await fastUpload(tempFilePath, {
      enableDirectUpload: props.uploadConfig?.enableDirectUpload || false,
      moduleName: props.uploadConfig?.moduleName,
      directoryId: props.uploadConfig?.directoryId,
      directoryPath: props.uploadConfig?.directoryPath,
      action: props.uploadConfig?.action,
      header: props.uploadConfig?.header,
      formData: props.uploadConfig?.formData,
      onProgress: (res: any, uploadFile: any) => {
        // 更新加载提示显示进度
        toast.loading(`正在上传视频... ${res.progress}%`)
        props.uploadConfig?.onUploadProgress?.(res.progress, uploadFile)
      },
      onSuccess: (res: any, uploadFile: any) => {
        // 关闭加载提示
        toast.close()

        // 显示成功提示
        toast.success('视频上传成功')

        // 插入视频占位图片到编辑器（因为editor组件不能直接插入video标签）
        editorCtx.value?.insertImage({
          src: 'https://img.zcool.cn/community/01055859b8e37fa8012075341db67f.gif',
          width: '80%',
          alt: res.url, // 将视频地址存储在alt属性中
          success: () => {
            props.uploadConfig?.onUploadSuccess?.(res, uploadFile)
            // 手动触发内容更新
            editorCtx.value?.getContents({
              success: (editorRes: any) => {
                internalHtml.value = editorRes.html
                emit('update:modelValue', editorRes.html)
                emit('input', { html: editorRes.html, text: editorRes.text }, props.editorId)
              },
            })
          },
        })
      },
      onError: (error: any, uploadFile: any) => {
        // 关闭加载提示
        toast.close()

        // 显示错误提示
        toast.error(error.errMsg || '视频上传失败')
        props.uploadConfig?.onUploadError?.(error, uploadFile)
      },
    })
  } catch (error: any) {
    // 关闭加载提示
    toast.close()

    // 显示错误提示
    toast.error(error.message || '视频上传失败')
    props.uploadConfig?.onUploadError?.(error, { path: tempFilePath })
  }
}

/**
 * 内置图片上传处理
 * 支持不同平台的图片选择API
 */
const insertImage = () => {
  // #ifdef APP-PLUS || H5
  // App和H5平台使用 chooseImage API
  uni.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      handleImageUpload(res.tempFiles || res.tempFilePaths.map((path: string) => ({ path })))
    },
    fail() {
      toast.error('未授权访问相册权限，请授权后使用')
    },
  })
  // #endif

  // #ifdef MP-WEIXIN
  // 微信小程序从基础库 2.21.0 开始，wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
  uni.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      handleImageUpload(res.tempFiles)
    },
    fail() {
      toast.error('未授权访问相册权限，请授权后使用')
    },
  })
  // #endif
}

/**
 * 内置视频上传处理
 */
const insertVideo = () => {
  uni.chooseVideo({
    sourceType: ['camera', 'album'],
    success: (res: any) => {
      const videoPath = res.tempFilePath
      handleVideoUpload(videoPath)
    },
    fail() {
      toast.error('未授权访问媒体权限，请授权后使用')
    },
  })
}

/**
 * 编辑器输入事件处理
 * 处理内容变化、字数限制等
 */
const onEditorInput = async (e: any) => {
  // 注意不要使用getContents获取html和text，会导致重复触发onStatusChange从而失去toolbar工具的高亮状态
  // 复制粘贴的时候detail会为空，此时应当直接return
  if (Object.keys(e.detail).length <= 0) return

  const { html, text } = e.detail

  // 识别到标识立即return（避免链接插入过程中的中间状态）
  if (text.includes(linkFlag)) return

  const maxlength = Number.parseInt(props.maxlength.toString())
  const textStr = text.replace(/[ \t\r\n]/g, '') // 移除空白字符

  // 检查字数限制
  if (textStr.length > maxlength && maxlength !== -1) {
    await message.alert({
      title: '字数超限',
      msg: `超过${maxlength}字数啦~`,
    })
    emit('overMax', { html, text }, props.editorId)
  } else {
    // 更新内部HTML值
    internalHtml.value = html
    // 触发v-model更新
    emit('update:modelValue', html)
    // 触发input事件
    emit('input', { html, text }, props.editorId)
  }
}

/**
 * 导出HTML内容
 * 处理视频占位图片转换为video标签
 */
const exportHtml = () => {
  editorCtx.value?.getContents({
    success: (res: any) => {
      // 处理视频占位图片转换为video标签
      const processedHtml = handleHtmlWithVideo(res.html)
      emit('exportHtml', processedHtml, props.editorId)
    },
  })
}

/**
 * 长按事件处理（用于修复微信小程序编辑器长按bug）
 * 微信小程序官方editor的长按事件有bug，需要重写覆盖，不需做任何逻辑，可见下面小程序社区问题链接
 * @tutorial https://developers.weixin.qq.com/community/develop/doc/000c04b3e1c1006f660065e4f61000
 */
const eLongpress = () => {
  // 空函数，仅用于覆盖默认长按行为
}

/**
 * 编辑器内容接口
 */
interface EditorContent {
  /** HTML 内容 */
  html: string
  /** 纯文本内容 */
  text: string
  /** Delta 格式内容 */
  delta: any
}

/**
 * 设置编辑器内容的参数接口
 */
interface SetContentOptions {
  /** HTML 内容 */
  html?: string
  /** Delta 格式内容 */
  delta?: any
}

/**
 * 插入图片的选项接口
 */
interface InsertImageOptions {
  /** 图片源地址 */
  src: string
  /** 图片宽度 */
  width?: string
  /** 图片替代文本 */
  alt?: string
}

/**
 * 编辑器组件暴露方法接口
 */
interface WdRichTextExpose {
  /** 编辑器上下文引用 */
  editorCtx: Ref<any>

  /**
   * 获取编辑器内容
   * @returns Promise<EditorContent>
   */
  getContents: () => Promise<EditorContent>

  /**
   * 设置编辑器内容
   * @param content 内容对象，可包含html或delta
   */
  setContents: (content: SetContentOptions) => void

  /**
   * 清空编辑器内容
   */
  clear: () => void

  /**
   * 插入文本到当前光标位置
   * @param text 要插入的文本
   */
  insertText: (text: string) => void

  /**
   * 插入图片到编辑器
   * @param options 图片选项
   */
  insertImage: (options: InsertImageOptions) => void

  /**
   * 使编辑器获得焦点
   */
  focus: () => void

  /**
   * 使编辑器失去焦点
   */
  blur: () => void
}

// ========== 暴露方法给父组件 ==========
defineExpose<WdRichTextExpose>({
  /** 编辑器上下文引用 */
  editorCtx,

  /**
   * 获取编辑器内容
   * @returns Promise<EditorContent>
   */
  getContents: () => {
    return new Promise((resolve) => {
      editorCtx.value?.getContents({
        success: (res: any) => {
          resolve(res)
        },
      })
    })
  },

  /**
   * 设置编辑器内容
   * @param content 内容对象，可包含html或delta
   */
  setContents: (content: SetContentOptions) => {
    editorCtx.value?.setContents(content)
    if (content.html) {
      internalHtml.value = content.html
      emit('update:modelValue', content.html)
    }
  },

  /**
   * 清空编辑器内容
   */
  clear: () => {
    editorCtx.value?.clear()
    internalHtml.value = ''
    emit('update:modelValue', '')
  },

  /**
   * 插入文本到当前光标位置
   * @param text 要插入的文本
   */
  insertText: (text: string) => {
    editorCtx.value?.insertText({ text })
  },

  /**
   * 插入图片到编辑器
   * @param options 图片选项
   */
  insertImage: (options: InsertImageOptions) => {
    editorCtx.value?.insertImage({
      src: options.src,
      width: options.width || '80%',
      alt: options.alt,
    })
  },

  /**
   * 使编辑器获得焦点
   */
  focus: () => {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#${props.editorId}`)
      .context((res: any) => {
        res.context?.focus()
      })
      .exec()
  },

  /**
   * 使编辑器失去焦点
   */
  blur: () => {
    editorCtx.value?.blur()
  },
})

/** 编辑器组件实例类型 */
export type EditorInstance = ComponentPublicInstance<WdRichTextProps, WdRichTextExpose>
</script>

<style lang="scss">
/* 导入编辑器图标样式 */
@import './assets/icons/editor-icon.css';

/* 富文本编辑器根容器样式 */
.wd-rich-text {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  /* 当工具栏位置为底部时，使用 column-reverse 翻转布局 */
  &[data-toolbar-position='bottom'] {
    flex-direction: column-reverse;

    .wd-rich-text-toolbar {
      border-top: 1px solid #e4e4e4;
      border-bottom: none;
    }
  }

  /* 如果设置了最大高度，编辑器容器需要支持滚动 */
  &[style*='max-height'] {
    .wd-rich-text-wrapper {
      overflow-y: auto;
    }
  }
}

/* 工具栏容器样式 */
.wd-rich-text-toolbar {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: calc(var(--icon-size) / 4) 0;
  border-bottom: 1px solid #e4e4e4;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  display: grid;
  grid-template-columns: repeat(var(--icon-columns), 1fr);
}

/* 工具栏图标通用样式 */
.iconfont {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(var(--icon-size) * 1.6);
  cursor: pointer;
  font-size: var(--icon-size);
}

/* 编辑器包装器样式 */
.wd-rich-text-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* 编辑器容器样式 */
.editor-container {
  padding: 8rpx 16rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 16px;
  line-height: 1.5;
}

/* 只读模式下隐藏图片覆盖层 */
.ql-image-overlay-none {
  ::v-deep .ql-image-overlay {
    pointer-events: none;
    opacity: 0;
  }
}

/* 编辑器占位符样式 */
::v-deep .ql-editor.ql-blank::before {
  font-style: normal;
  color: #cccccc;
}

/* 编辑器容器最小高度重置 */
::v-deep .ql-container {
  min-height: unset;
}

/* 激活状态的工具样式 */
.ql-active {
  color: #66ccff;
}

/* 浮动工具面板样式 */
.fab-tools {
  display: flex;
  padding: 0 10rpx;
  box-sizing: border-box;

  .fab-sub {
    width: auto;
    height: auto;
    margin: 10rpx;
  }
}
</style>
