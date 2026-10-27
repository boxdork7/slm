<!-- Upload 上传 图片、视频和文件上传组件

使用示例：
// 基础用法 - URL模式（默认）
<wd-upload v-model="form.images" :limit="3" />

// ossId模式 - 返回OSS文件ID
<wd-upload v-model="form.attachments" :limit="5" return-mode="ossId" />

// 兼容性说明：
// - URL模式：返回文件的URL地址
// - ossId模式：返回OSS文件ID，兼容旧的URL数据
// - 组件会自动识别数据格式并正确回显
// - ossId模式支持完整的文件信息回显（文件名、URL等）

-->
<template>
  <view :class="rootClass" :style="customStyle">
    <!-- 表单模式：有 label 时显示标签区域 -->
    <view
      v-if="isFormMode"
      :class="`wd-upload__label ${customLabelClass} ${isRequired ? 'is-required' : ''}`"
      :style="
        computedLabelWidth ? `min-width: ${addUnit(computedLabelWidth)}; max-width: ${addUnit(computedLabelWidth)};` : ''
      "
    >
      <!-- 前置图标 -->
      <view v-if="prefixIcon || $slots.prefix" class="wd-upload__prefix">
        <wd-icon
          v-if="prefixIcon && !$slots.prefix"
          custom-class="wd-upload__icon"
          :name="prefixIcon"
          size="64"
        />
        <slot v-else name="prefix" />
      </view>
      <!-- 标签内容 -->
      <view class="wd-upload__label-inner">
        <template v-if="label && !$slots.label">
          {{ label }}
        </template>
        <slot v-else name="label" />
      </view>
    </view>

    <!-- 上传内容区域 -->
    <view class="wd-upload__body">
      <view :class="`wd-upload__content ${formLayoutClass} ${previewSizeClass}`">
        <!-- 预览列表 -->
        <view
          v-for="(file, index) in uploadFiles"
          :key="index"
          :class="`wd-upload__preview ${customPreviewClass}`"
        >
          <!-- 成功时展示图片 -->
          <view class="wd-upload__status-content">
            <image
              v-if="isImage(file)"
              :src="file.url"
              :mode="imageMode"
              class="wd-upload__picture"
              @click="onPreviewImage(file)"
            />
            <template v-else-if="isVideo(file)">
              <view v-if="file.thumb" class="wd-upload__video" @click="onPreviewVideo(file)">
                <image :src="file.thumb" :mode="imageMode" class="wd-upload__picture" />
                <wd-icon name="play-fill" custom-class="wd-upload__video-play" size="64" />
              </view>
              <view v-else class="wd-upload__video" @click="onPreviewVideo(file)">
                <!-- #ifdef APP-PLUS || MP-DINGTALK -->
                <wd-icon custom-class="wd-upload__video-icon" name="video" size="64" />
                <!-- #endif -->
                <!-- #ifndef APP-PLUS -->
                <!-- #ifndef MP-DINGTALK -->
                <video
                  :src="file.url"
                  :title="file.name || `视频${index}`"
                  object-fit="contain"
                  :controls="false"
                  :poster="file.thumb"
                  :autoplay="false"
                  :show-center-play-btn="false"
                  :show-fullscreen-btn="false"
                  :show-play-btn="false"
                  :show-loading="false"
                  :show-progress="false"
                  :show-mute-btn="false"
                  :enable-progress-gesture="false"
                  :enableNative="true"
                  class="wd-upload__video"
                />
                <wd-icon name="play-fill" custom-class="wd-upload__video-play" size="64" />
                <!-- #endif -->
                <!-- #endif -->
              </view>
            </template>

            <view v-else class="wd-upload__file" @click="onPreviewFile(file)">
              <wd-icon :name="getFileIcon(file)" custom-class="wd-upload__file-icon" size="64" />
              <view class="wd-upload__file-name">
                {{ file.name || file.url }}
              </view>
            </view>
          </view>

          <view
            v-if="file[statusKey] !== 'success'"
            class="wd-upload__status-content wd-upload__mask"
          >
            <!-- loading时展示loading图标和进度 -->
            <view v-if="file[statusKey] === 'loading'" class="wd-upload__status-content">
              <wd-loading :type="loadingType" :size="loadingSize" :color="loadingColor" />
              <text class="wd-upload__progress-txt">{{ file.percent }}%</text>
            </view>
            <!-- 失败时展示失败图标以及失败信息 -->
            <view v-if="file[statusKey] === 'fail'" class="wd-upload__status-content">
              <wd-icon name="close-outline" custom-class="wd-upload__icon" size="32" />
              <text class="wd-upload__progress-txt">
                {{ file.error || translate('error') }}
              </text>
            </view>
          </view>
          <!-- 上传状态为上传中时不展示移除按钮 -->
          <wd-icon
            v-if="file[statusKey] !== 'loading' && !disabled"
            name="close-outline-fill"
            size="32"
            custom-class="wd-upload__close"
            @click="removeFile(index)"
          />
          <!-- 自定义预览样式 -->
          <slot v-if="$slots['preview-cover']" name="preview-cover" :file="file" :index="index" />
        </view>

        <block v-if="showUpload">
          <view
            v-if="$slots.default"
            :class="`wd-upload__evoke-slot ${customEvokeClass}`"
            @click="handleChoose"
          >
            <slot />
          </view>
          <!-- 唤起项 - 使用动态图标 -->
          <view
            v-else
            :class="`wd-upload__evoke ${disabled ? 'is-disabled' : ''} ${customEvokeClass}`"
            @click="handleChoose"
          >
            <!-- 唤起项图标 - 根据accept类型显示不同图标 -->
            <wd-icon class="wd-upload__evoke-icon" :name="evokeIconName" size="64" />
            <!-- 有限制个数时确认是否展示限制个数 -->
            <view v-if="limit && showLimitNum" class="wd-upload__evoke-num">
              （{{ uploadFiles.length }}/{{ limit }}）
            </view>
          </view>
        </block>

        <!-- 清空按钮 -->
        <view
          v-if="clearable && uploadFiles.length > 0"
          class="wd-upload__clear-btn"
          @click="handleClear"
        >
          <wd-icon name="delete" custom-class="wd-upload__clear-icon" size="64" />
          <text class="wd-upload__clear-text">清空</text>
        </view>
      </view>

      <!-- 表单验证错误信息 -->
      <view v-if="errorMessage" class="wd-upload__error-message">
        {{ errorMessage }}
      </view>
    </view>
  </view>
  <wd-video-preview ref="videoPreview" />
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { UploadResult } from '../composables/useUpload'
import type { FormItemRule } from '../wd-form/wd-form.vue'
import type { ImageMode } from '../wd-img/wd-img.vue'
import type { LoadingType } from '../wd-loading/wd-loading.vue'
import type { VideoPreviewInstance } from '../wd-video-preview/wd-video-preview.vue'
import { computed, ref, useSlots, watch } from 'vue'
import { useToken } from '@/composables/useToken'
import { SystemConfig } from '@/systemConfig'
import {
  addUnit,
  context,
  deepClone,
  isDef,
  isEmptyObj,
  isEqual,
  isFunction,
  isImageUrl,
  isVideoUrl,
} from '../common/util'
import { useParent } from '../composables/useParent'
import { useTranslate } from '../composables/useTranslate'
import { useUpload } from '../composables/useUpload'
import { FORM_KEY } from '../wd-form/wd-form-key'
import wdIcon from '../wd-icon/wd-icon.vue'
import wdLoading from '../wd-loading/wd-loading.vue'
import { useToast } from '../wd-toast/useToast'
import wdVideoPreview from '../wd-video-preview/wd-video-preview.vue'
import { listOssByIds } from '@/api/system/oss/oss/ossApi'

defineOptions({
  name: 'WdUpload',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

// ======================== 类型定义 ========================

/**
 * 文件类型定义
 */
type UploadSourceType = 'album' | 'camera'
type UploadSizeType = 'original' | 'compressed'
type UploadFileType = 'image' | 'video' | 'media' | 'audio' | 'all' | 'file'
type UploadCameraType = 'front' | 'back'
export type UploadStatusType = 'pending' | 'loading' | 'success' | 'fail'

/**
 * 上传文件项接口
 */
export interface UploadFileItem {
  [key: string]: any

  /** 当前上传文件在列表中的唯一标识 */
  uid: number
  /** 缩略图地址 */
  thumb?: string
  /** 当前文件名称，仅h5支持 */
  name?: string
  /** 上传状态。若自定义了status-key，应取对应字段 */
  status?: UploadStatusType
  /** 文件大小 */
  size?: number
  /** 上传图片/视频的本地地址（用于预览显示，可能是预签名URL） */
  url: string
  /** 原始URL（用于存储，不含预签名参数） */
  originalUrl?: string
  /** 上传进度 */
  percent?: number
  /** 后端返回的内容，可能是对象，也可能是字符串 */
  response?: string | Record<string, any>
  /** OSS文件ID（用于ossId模式） */
  ossId?: string | number
}

/**
 * 选择文件接口
 */
export interface ChooseFile {
  /** 上传临时地址 */
  path: string
  /** 上传大小 */
  size?: number
  /** 当前文件名称，仅h5支持 */
  name?: string
  /** 上传类型 */
  type: 'image' | 'video' | 'file'
  /** 上传时间 */
  duration?: number
  /** 缩略图地址 */
  thumb?: string
}

/**
 * 选择文件配置接口
 */
export interface ChooseFileOption {
  /** 是否支持多选文件 */
  multiple?: boolean
  /** 所选的图片的尺寸 */
  sizeType?: UploadSizeType[]
  /** 选择文件的来源 */
  sourceType?: UploadSourceType[]
  /** 最大允许上传个数 */
  maxCount?: number
  /** 接受文件类型 */
  accept?: UploadFileType
  /** 是否压缩视频，当 accept 为 video 时生效 */
  compressed?: boolean
  /** 拍摄视频最长拍摄时间，当 accept 为 video | media 时生效，单位秒 */
  maxDuration?: number
  /** 使用前置或者后置相机，当 accept 为 video | media 时生效，可选值为：back｜front */
  camera?: UploadCameraType
  /** 根据文件拓展名过滤,H5、微信小程序支持 */
  extension?: string[]
}

/**
 * 表单数据类型
 */
type UploadFormData = Record<string, any>

/**
 * 上传文件类型
 */
export type UploadFile = Partial<UploadFileItem> & { url: string }

// ======================== 钩子函数类型定义 ========================

/**
 * 预览前钩子配置
 */
interface UploadBeforePreviewOption {
  file: UploadFileItem
  index: number
  imgList: string[]
  fileList: UploadFileItem[]
  resolve: (isPass: boolean) => void
}

type UploadBeforePreview = (option: UploadBeforePreviewOption) => void

/**
 * 预览失败配置
 */
interface UploadOnPreviewFailOption {
  index: number
  imgList: string[]
}

type UploadOnPreviewFail = (option: UploadOnPreviewFailOption) => void

/**
 * 删除前钩子配置
 */
interface UploadBeforeRemoveOption {
  file: UploadFileItem
  index: number
  fileList: UploadFileItem[]
  resolve: (isPass: boolean) => void
}

type UploadBeforeRemove = (option: UploadBeforeRemoveOption) => void

/**
 * 选择前钩子配置
 */
interface UploadBeforeChooseOption {
  fileList: UploadFileItem[]
  resolve: (isPass: boolean) => void
}

type UploadBeforeChoose = (option: UploadBeforeChooseOption) => void

/**
 * 上传前钩子配置
 */
interface UploadBeforeUploadOption {
  files: Record<string, any>[]
  fileList: UploadFileItem[]
  resolve: (isPass: boolean) => void
}

type UploadBeforeUpload = (options: UploadBeforeUploadOption) => void

/**
 * 构建表单数据钩子配置
 */
interface UploadBuildFormDataOption {
  file: UploadFileItem
  formData: UploadFormData
  resolve: (formData: Record<string, any>) => void
}

type UploadBuildFormData = (options: UploadBuildFormDataOption) => void

/**
 * 自定义上传方法类型
 */
export type UploadMethod = (
  uploadFile: UploadFileItem,
  formData: UploadFormData,
  options: {
    action: string
    header: Record<string, any>
    name: string
    fileName: string
    fileType: 'image' | 'video' | 'audio'
    statusCode: number
    abortPrevious?: boolean
    enableDirectUpload?: boolean
    onSuccess: (res: UploadResult, file: UploadFileItem, formData: UploadFormData) => void
    onError: (
      error: UniApp.GeneralCallbackResult,
      file: UploadFileItem,
      formData: UploadFormData,
    ) => void
    onProgress: (res: UniApp.OnProgressUpdateResult, file: UploadFileItem) => void
  },
) => UniApp.UploadTask | void | Promise<void>

// ======================== 事件类型定义 ========================

/**
 * 事件类型定义
 */
interface UploadErrorEvent {
  error: UniApp.GeneralCallbackResult
  file: UploadFileItem
  formData: UploadFormData
}

interface UploadChangeEvent {
  fileList: UploadFileItem[]
}

interface UploadSuccessEvent {
  file: UploadFileItem
  fileList: UploadFileItem[]
  formData: UploadFormData
}

interface UploadProgressEvent {
  response: UniApp.OnProgressUpdateResult
  file: UploadFileItem
}

interface UploadOversizeEvent {
  file: ChooseFile
}

interface UploadRemoveEvent {
  file: UploadFileItem
}

// ======================== Props 接口定义 ========================

/**
 * 上传组件属性接口
 */
interface WdUploadProps {
  // 双向绑定相关
  /** v-model 绑定值，可以是文件列表数组或字符串 */
  modelValue?: UploadFile[] | string
  /** 当 modelValue 为字符串时的分隔符 */
  separator?: string
  /** 当 modelValue 为字符串时，取文件对象的哪个字段作为值 */
  valueKey?: string
  /** 返回值模式 - 'url': 返回文件URL（默认），'ossId': 返回OSS文件ID */
  returnMode?: 'url' | 'ossId'

  // 样式相关
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string
  /** 自定义上传按钮样式 */
  customEvokeClass?: string
  /** 自定义预览图片列表样式 */
  customPreviewClass?: string

  // 基础配置
  /** 上传的文件列表 */
  fileList?: UploadFile[]
  /** 上传的地址 */
  action?: string
  /** 设置上传的请求头部 */
  header?: Record<string, any>
  /** 是否禁用 */
  disabled?: boolean
  /** 文件对应的key */
  name?: string
  /** HTTP请求中其他额外的formdata */
  formData?: UploadFormData

  // 选择配置
  /** 是否支持多选文件 */
  multiple?: boolean
  /** 最大允许上传个数 */
  limit?: number
  /** 限制上传个数的情况下，是否展示当前上传的个数 */
  showLimitNum?: boolean
  /** 文件大小限制，单位为byte */
  maxSize?: number
  /** 选择图片的来源 */
  sourceType?: UploadSourceType[]
  /** 所选的图片的尺寸 */
  sizeType?: UploadSizeType[]
  /** 文件类型 */
  accept?: UploadFileType
  /** 根据文件拓展名过滤 */
  extension?: string[]

  // 视频配置
  /** 是否压缩视频 */
  compressed?: boolean
  /** 拍摄视频最长拍摄时间 */
  maxDuration?: number
  /** 使用前置或者后置相机 */
  camera?: UploadCameraType

  // 显示配置
  /** 预览图片的mode属性 */
  imageMode?: ImageMode
  /** 加载中图标类型 */
  loadingType?: LoadingType
  /** 加载中图标颜色 */
  loadingColor?: string
  /** 加载中图标尺寸 */
  loadingSize?: string

  // 状态配置
  /** file 数据结构中，status 对应的 key */
  statusKey?: string
  /** 接口响应的成功状态值 */
  successStatus?: number
  /** 是否选择文件后自动上传 */
  autoUpload?: boolean
  /** 点击已上传时是否可以重新上传 */
  reupload?: boolean

  // 表单相关属性
  /** 设置左侧标题 */
  label?: string
  /** 设置左侧标题宽度 */
  labelWidth?: string | number
  /** 前置图标 */
  prefixIcon?: string
  /** 当有label属性时，设置标题和上传区域垂直居中 */
  center?: boolean
  /** 表单属性，上下结构 */
  vertical?: boolean
  /** 是否必填 */
  required?: boolean
  /** 表单域 model 字段名 */
  prop?: string
  /** 表单验证规则 */
  rules?: FormItemRule[]
  /** 非 cell 类型下是否隐藏下划线 */
  noBorder?: boolean
  /** label 使用 slot 时的自定义样式 */
  customLabelClass?: string
  /** 前置图标使用 slot 时的自定义样式 */
  customIconClass?: string

  // Upload 特有的表单配置
  /** 是否显示清空按钮 */
  clearable?: boolean
  /** 表单模式下的内部布局 */
  formLayout?: 'horizontal' | 'vertical'
  /** 水平布局时最大预览数量 */
  maxPreviewInHorizontal?: number
  /** 表单模式下预览尺寸 */
  previewSize?: 'small' | 'medium' | 'large'

  // 直传相关配置
  /** 是否启用直传模式 */
  enableDirectUpload?: boolean

  /** 模块名称 */
  moduleName?: string
  /** 目录id */
  directoryId?: string | number
  /** 文件路径 */
  directoryPath?: string

  // 钩子函数
  /** 预览失败执行操作 */
  onPreviewFail?: UploadOnPreviewFail
  /** 上传文件之前的钩子 */
  beforeUpload?: UploadBeforeUpload
  /** 选择图片之前的钩子 */
  beforeChoose?: UploadBeforeChoose
  /** 删除文件之前的钩子 */
  beforeRemove?: UploadBeforeRemove
  /** 图片预览前的钩子 */
  beforePreview?: UploadBeforePreview
  /** 构建上传formData的钩子 */
  buildFormData?: UploadBuildFormData
  /** 自定义上传文件的请求方法 */
  uploadMethod?: UploadMethod
}

// ======================== Events 接口定义 ========================

/**
 * 上传组件事件接口
 */
interface WdUploadEmits {
  /** 上传失败时触发 */
  fail: [value: UploadErrorEvent]
  /** 文件列表变化时触发 */
  change: [value: UploadChangeEvent]
  /** 上传成功时触发 */
  success: [value: UploadSuccessEvent]
  /** 上传进度变化时触发 */
  progress: [value: UploadProgressEvent]
  /** 文件超出大小限制时触发 */
  oversize: [value: UploadOversizeEvent]
  /** 选择文件错误时触发 */
  chooseerror: [value: any]
  /** 删除文件时触发 */
  remove: [value: UploadRemoveEvent]
  /** 文件列表更新时触发 */
  'update:fileList': [value: UploadFileItem[]]
  /** modelValue 更新时触发 */
  'update:modelValue': [value: UploadFile[] | string]
  /** 清空文件时触发 */
  clear: []
  /** 字段值变化时触发（用于表单验证） */
  'field-change': [value: UploadFileItem[]]
}

// ======================== Expose 接口定义 ========================

/**
 * 上传组件暴露方法接口
 */
interface WdUploadExpose {
  /** 手动触发上传 */
  submit: () => void
  /** 取消上传 */
  abort: (task?: UniApp.UploadTask) => void
  /** 清空所有文件 */
  clear: () => void
  /** 获取当前文件列表 */
  getValue: () => UploadFileItem[]
  /** 设置文件列表 */
  setValue: (files: UploadFileItem[]) => void
  /** 获取当前值（根据 modelValue 类型返回相应格式） */
  getModelValue: () => UploadFile[] | string
  /** 设置当前值（支持数组和字符串） */
  setModelValue: (value: UploadFile[] | string) => void
  /** 手动触发验证 */
  validate: () => Promise<boolean>
  /** 清除验证状态 */
  clearValidate: () => void
}

// ======================== Props & Emits 定义 ========================

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdUploadProps>(), {
  // 双向绑定相关默认值
  separator: ',',
  valueKey: 'url',
  returnMode: 'url',

  // 样式相关默认值
  customStyle: '',
  customClass: '',
  customEvokeClass: '',
  customPreviewClass: '',

  // 基础配置默认值
  fileList: () => [],
  action: '',
  header: () => ({}),
  disabled: false,
  name: 'file',
  formData: () => ({}),

  // 选择配置默认值
  multiple: false,
  showLimitNum: true,
  maxSize: Number.MAX_VALUE,
  sourceType: () => ['album', 'camera'],
  sizeType: () => ['original', 'compressed'],
  accept: 'image',
  extension: () => [], // 改为空数组，让系统自动推断

  // 视频配置默认值
  compressed: true,
  maxDuration: 60,
  camera: 'back',

  // 显示配置默认值
  imageMode: 'aspectFit',
  loadingType: 'ring',
  loadingColor: '#ffffff',
  loadingSize: '48rpx',

  // 状态配置默认值
  statusKey: 'status',
  successStatus: 200,
  autoUpload: true,
  reupload: false,

  // 表单相关默认值
  labelWidth: undefined,
  center: false,
  vertical: false,
  required: false,
  rules: () => [],
  noBorder: false,
  customLabelClass: '',
  customIconClass: '',

  // Upload 特有配置默认值
  clearable: false,
  formLayout: 'vertical',
  maxPreviewInHorizontal: 3,
  previewSize: 'medium',

  // 直传相关默认值
  enableDirectUpload: false,
})

// 定义组件事件
const emit = defineEmits<WdUploadEmits>()

// ======================== Composables ========================

// 国际化翻译
const { translate } = useTranslate('upload')

// 上传相关钩子
const { startUpload, abort, chooseFile, UPLOAD_STATUS } = useUpload()

// 获取插槽
const slots = useSlots()

// 使用表单组合函数
const { parent: form } = useParent(FORM_KEY)

/**
 * 计算最终的标签宽度
 * 优先级：组件自身 labelWidth > form labelWidth > 默认值 '240rpx'
 */
const computedLabelWidth = computed(() => {
  // 1. 组件自身明确指定
  if (props.labelWidth !== undefined && props.labelWidth !== '') {
    return props.labelWidth
  }

  // 2. 继承 form 配置
  if (form && form.props.labelWidth !== undefined && form.props.labelWidth !== '') {
    return form.props.labelWidth
  }

  // 3. 默认值 '240rpx'
  return '240rpx'
})

// ======================== 响应式数据 ========================

const uploadFiles = ref<UploadFileItem[]>([])
const videoPreview = ref<VideoPreviewInstance>()

// ======================== 计算属性 ========================

/**
 * 计算唤起按钮图标名称 - 根据accept类型显示不同图标
 */
const evokeIconName = computed(() => {
  const { accept } = props

  switch (accept) {
    case 'image':
      return 'camera-fill'
    case 'video':
      return 'video-fill'
    case 'audio':
      return 'audio-fill'
    case 'file':
      return 'file-add-fill'
    case 'all':
      return 'upload-fill'
    case 'media':
      return 'image-fill' // 图片视频通用
    default:
      return 'upload-fill'
  }
})

/**
 * 计算实际使用的文件扩展名 - 智能默认处理
 */
const computedExtension = computed(() => {
  // 如果用户手动指定了extension，优先使用
  if (props.extension && props.extension.length > 0) {
    return props.extension
  }

  // 否则根据accept自动提供默认值
  const { accept } = props

  switch (accept) {
    case 'image':
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    case 'video':
      return ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
    case 'audio':
      return ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma']
    case 'file':
      return ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.zip', '.rar']
    case 'all':
      return [] // 不限制
    case 'media':
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.avi', '.mov', '.webm']
    default:
      return []
  }
})

/**
 * 获取文件类型对应的图标
 */
const getFileIcon = (file: UploadFileItem) => {
  const fileName = file.name || file.url
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (!extension) return 'file'

  // 根据文件扩展名返回对应图标
  const iconMap: Record<string, string> = {
    // Office文档
    doc: 'file-word-fill',
    docx: 'file-word-fill',
    xls: 'file-excel-fill',
    xlsx: 'file-excel-fill',
    ppt: 'file-ppt-fill',
    pptx: 'file-ppt-fill',
    pdf: 'file-pdf-fill',

    // 压缩文件
    zip: 'folder-fill',
    rar: 'folder-fill',
    '7z': 'folder-fill',

    // 文本文件
    txt: 'file-fill',
    md: 'file-fill',
    json: 'file-fill',
    xml: 'file-fill',

    // 音频文件
    mp3: 'audio-fill',
    wav: 'audio-fill',
    flac: 'audio-fill',
    aac: 'audio-fill',
    ogg: 'audio-fill',

    // 其他
    unknown: 'file-unknown-fill',
  }

  return iconMap[extension] || 'file-fill'
}

/**
 * 判断是否为表单模式
 */
const isFormMode = computed(() => {
  return !!(props.label || slots.label)
})

/**
 * 计算预览尺寸类名 - 在所有模式下都生效
 */
const previewSizeClass = computed(() => {
  if (props.previewSize) {
    return `is-preview-${props.previewSize}`
  }
  return ''
})

/**
 * 计算是否必填
 */
const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (
        Object.prototype.hasOwnProperty.call(rules, key) &&
        key === props.prop &&
        Array.isArray(rules[key])
      ) {
        formRequired = rules[key].some((rule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

/**
 * 计算表单错误信息
 */
const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  }
  return ''
})

/**
 * 计算根元素类名
 */
const rootClass = computed(() => {
  const classes = ['wd-upload']

  if (isFormMode.value) classes.push('is-form')
  if (props.center) classes.push('is-center')
  if (props.vertical) classes.push('is-vertical')
  if (props.disabled) classes.push('is-disabled')
  if (uploadFiles.value.length > 0) classes.push('is-not-empty')
  if (props.noBorder) classes.push('is-no-border')
  if (props.customClass) classes.push(props.customClass)

  return classes.join(' ')
})

/**
 * 计算表单布局类名
 */
const formLayoutClass = computed(() => {
  if (!isFormMode.value) return ''

  const classes = []
  if (props.formLayout === 'horizontal') {
    classes.push('is-horizontal')
  } else {
    classes.push('is-vertical')
  }

  return classes.join(' ')
})

/**
 * 计算是否显示上传按钮
 */
const showUpload = computed(() => !props.limit || uploadFiles.value.length < props.limit)

// ======================== 工具函数 ========================

/**
 * 从完整URL中提取不带签名的干净URL
 * 支持多种云服务商的预签名URL格式
 * @param fullUrl 完整URL(可能带签名参数)
 * @returns 不带签名的干净URL
 */
const extractCleanUrl = (fullUrl: string): string => {
  if (!fullUrl) return ''

  try {
    // 简单判断是否包含查询参数
    if (!fullUrl.includes('?')) return fullUrl

    // 检查是否包含预签名相关参数
    const presignedParams = [
      // AWS S3 / MinIO
      'X-Amz-Algorithm',
      'X-Amz-Signature',
      'X-Amz-Credential',
      'X-Amz-Date',
      'X-Amz-Expires',
      'X-Amz-SignedHeaders',
      // 阿里云 OSS
      'OSSAccessKeyId',
      'Signature',
      'Expires',
      // 腾讯云 COS
      'q-sign-algorithm',
      'q-signature',
      'q-ak',
      'q-sign-time',
      'q-key-time',
      'q-header-list',
      'q-url-param-list',
      // 七牛云
      'token',
      // 华为云 OBS
      'AWSAccessKeyId',
      // 通用时间戳参数
      't',
    ]

    // 检查URL是否包含预签名参数
    const hasPresignedParams = presignedParams.some((param) => fullUrl.includes(`${param}=`) || fullUrl.includes(`&${param}=`))

    if (!hasPresignedParams) return fullUrl

    // 移除预签名参数，保留路径
    const [basePath] = fullUrl.split('?')
    return basePath
  } catch (error) {
    // 如果处理失败，尝试简单的字符串处理
    return fullUrl.split('?')[0]
  }
}

/**
 * 将文件列表转换为字符串
 * @param files 文件列表
 * @returns 字符串形式的文件值
 */
const filesToString = (files: UploadFileItem[]): string => {
  if (props.returnMode === 'ossId') {
    // ossId模式：优先返回ossId，如果没有ossId则回退到URL（兼容旧数据）
    const filesWithOssId = files.filter((file) => file.ossId)
    const filesWithoutOssId = files.filter((file) => !file.ossId && (file.originalUrl || file.url))

    if (filesWithOssId.length > 0 && filesWithoutOssId.length === 0) {
      // 所有文件都有ossId，返回ossId
      return filesWithOssId.map((file) => file.ossId).join(props.separator)
    } else if (filesWithOssId.length === 0 && filesWithoutOssId.length > 0) {
      // 所有文件都没有ossId（旧数据），返回URL（优先使用originalUrl）
      return filesWithoutOssId.map((file) => file.originalUrl || file[props.valueKey] || file.url).join(props.separator)
    } else if (filesWithOssId.length > 0 && filesWithoutOssId.length > 0) {
      // 混合情况：优先返回ossId，但如果存在没有ossId的文件，则全部返回URL以保持一致性
      console.warn('检测到混合格式的文件（部分有ossId，部分没有），将返回URL格式以保持一致性')
      return files.map((file) => file.originalUrl || file[props.valueKey] || file.url).join(props.separator)
    } else {
      return ''
    }
  } else {
    // 默认URL模式：优先使用originalUrl（原始URL，不含预签名参数）
    return files.map((file) => file.originalUrl || file[props.valueKey] || file.url).join(props.separator)
  }
}

/**
 * 将字符串转换为文件列表
 * @param value 字符串值
 * @returns 文件列表
 */
const stringToFiles = async (value: string): Promise<UploadFileItem[]> => {
  if (!value) return []

  const values = value
    .split(props.separator)
    .filter(Boolean)
    .map((v) => v.trim())

  // 如果是ossId模式，需要检查数据格式
  if (props.returnMode === 'ossId') {
    // 判断是否为ossId格式（纯数字）
    const isOssIdFormat = values.length > 0 && values.every((v) => /^\d+$/.test(v))

    if (isOssIdFormat) {
      // ossId格式：调用接口获取文件信息
      const [err, data] = await listOssByIds(values)
      if (!err && data) {
        // 按原始顺序生成文件列表
        return values.map((ossId) => {
          const ossItem = data.find((item) => String(item.ossId) === ossId)
          if (ossItem) {
            return {
              uid: context.id++,
              url: ossItem.url,
              // 保存原始URL用于存储：优先使用后端返回的 originalUrl，否则通过 extractCleanUrl 提取
              originalUrl: ossItem.originalUrl || extractCleanUrl(ossItem.url),
              ossId: ossItem.ossId,
              [props.statusKey]: 'success',
              name: ossItem.originalName || ossItem.fileName || `文件${ossId}`,
              percent: 0,
              response: '',
            } as UploadFileItem
          } else {
            // 如果找不到对应的OSS文件，创建一个基础项
            return {
              uid: context.id++,
              url: '',
              ossId,
              [props.statusKey]: 'success',
              name: `文件${ossId}`,
              percent: 0,
              response: '',
            } as UploadFileItem
          }
        })
      } else {
        console.error('获取OSS文件信息失败:', err)
        // 失败时创建基础的文件项
        return values.map(
          (ossId, index) =>
            ({
              uid: context.id++,
              url: '',
              ossId,
              [props.statusKey]: 'success',
              name: `文件${index + 1}`,
              percent: 0,
              response: '',
            }) as UploadFileItem,
        )
      }
    } else {
      // URL格式（兼容旧数据）：从URL中提取干净URL作为originalUrl
      return values.map(
        (url, index) =>
          ({
            uid: context.id++,
            url,
            originalUrl: extractCleanUrl(url), // 提取干净URL用于存储
            [props.statusKey]: 'success',
            name: `文件${index + 1}`,
            percent: 0,
            response: '',
          }) as UploadFileItem,
      )
    }
  } else {
    // 默认URL模式：从URL中提取干净URL作为originalUrl
    return values.map(
      (url, index) =>
        ({
          uid: context.id++,
          url,
          originalUrl: extractCleanUrl(url), // 提取干净URL用于存储
          [props.statusKey]: 'success',
          name: `文件${index + 1}`,
          percent: 0,
          response: '',
        }) as UploadFileItem,
    )
  }
}

/**
 * 获取当前 modelValue 的类型
 * @returns 'array' | 'string'
 */
const getModelValueType = (): 'array' | 'string' | 'undefined' => {
  if (props.modelValue === undefined) return 'string'
  return Array.isArray(props.modelValue) ? 'array' : 'string'
}

/**
 * 判断是否为视频文件
 * @param file 文件对象
 * @returns boolean 是否为视频文件
 */
const isVideo = (file: UploadFileItem) => {
  return (file.name && isVideoUrl(file.name)) || isVideoUrl(file.url)
}

/**
 * 判断是否为图片文件
 * @param file 文件对象
 * @returns boolean 是否为图片文件
 */
const isImage = (file: UploadFileItem) => {
  return (file.name && isImageUrl(file.name)) || isImageUrl(file.url)
}

/**
 * 获取图片信息
 * @param img 图片地址
 * @returns Promise<UniApp.GetImageInfoSuccessData> 图片信息Promise对象
 */
const getImageInfo = (img: string) => {
  return new Promise<UniApp.GetImageInfoSuccessData>((resolve, reject) => {
    uni.getImageInfo({
      src: img,
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}

/**
 * 触发文件列表更新事件
 */
const emitFileList = () => {
  // 触发 fileList 更新
  emit('update:fileList', uploadFiles.value)

  // 触发 modelValue 更新 - 只包含上传成功的文件
  const modelValueType = getModelValueType()
  if (modelValueType === 'array') {
    // 只返回上传成功的文件
    const successFiles = uploadFiles.value.filter((file) => file[props.statusKey] === 'success')
    emit('update:modelValue', successFiles)
  } else if (modelValueType === 'string') {
    // 只返回上传成功的文件地址
    const successFiles = uploadFiles.value.filter((file) => file[props.statusKey] === 'success')
    emit('update:modelValue', filesToString(successFiles))
  }

  // 触发表单字段变化
  emit('field-change', uploadFiles.value)
}

// ======================== 文件处理函数 ========================

/**
 * 上传失败处理
 * @param error 错误信息对象
 * @param file 上传失败的文件对象
 * @param formData 表单数据对象
 */
const handleError = (
  error: UniApp.GeneralCallbackResult,
  file: UploadFileItem,
  formData: Record<string, any>,
) => {
  const { statusKey } = props
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index][statusKey] = 'fail'
    uploadFiles.value[index].error = error.errMsg
    uploadFiles.value[index].response = error
    emit('fail', { error, file, formData })

    // 根据是否为直传显示不同的错误提示
    const errorPrefix = props.enableDirectUpload ? '直传失败' : '上传失败'
    useToast().error(`${errorPrefix}: ${error.errMsg}`)

    emitFileList()
  }
}

/**
 * 上传成功处理
 * @param res 服务器响应结果对象
 * @param file 上传成功的文件对象
 * @param formData 表单数据对象
 */
const handleSuccess = (
  res: Record<string, any>,
  file: UploadFileItem,
  formData: Record<string, any>,
) => {
  const { statusKey } = props
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index][statusKey] = 'success'
    uploadFiles.value[index].response = res

    // 更新文件的 URL 为服务器返回的地址（用于预览显示）
    uploadFiles.value[index].url = res.url

    // 保存原始URL（用于存储，不含预签名参数）
    // 优先使用后端返回的 originalUrl，如果没有则通过 extractCleanUrl 从 url 中提取
    uploadFiles.value[index].originalUrl = res.originalUrl || extractCleanUrl(res.url)

    // 如果响应中包含ossId，也要保存
    if (res.ossId) {
      uploadFiles.value[index].ossId = res.ossId
    }

    emit('change', { fileList: uploadFiles.value })
    emit('success', { file, fileList: uploadFiles.value, formData })

    // 根据是否为直传显示不同的成功提示
    const successPrefix = props.enableDirectUpload ? '直传成功' : '上传成功'
    useToast().success(successPrefix)

    emitFileList()
  }
}

/**
 * 上传进度处理
 * @param res 上传进度响应对象
 * @param file 正在上传的文件对象
 */
const handleProgress = (res: UniApp.OnProgressUpdateResult, file: UploadFileItem) => {
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index].percent = res.progress
    emit('progress', { response: res, file })
  }
}

/**
 * 开始上传文件
 */
const startUploadFiles = () => {
  const { buildFormData, formData = {}, statusKey } = props
  let {
    action,
    name,
    header = {},
    accept,
    successStatus,
    uploadMethod,
    enableDirectUpload,
    moduleName,
    directoryId,
    directoryPath,
  } = props

  const statusCode = isDef(successStatus) ? successStatus : 200

  // 如果没传 则给默认值
  action = action || `${SystemConfig.api.baseUrl}/resource/oss/upload`
  header = isEmptyObj(header) ? useToken().getAuthHeaders() : header

  // 准备表单数据，包含目录ID
  const uploadFormData = {
    ...formData,
    ...(moduleName && { moduleName }),
    ...(directoryId && { directoryId }),
    ...(directoryPath && { directoryPath }),
  }

  for (const uploadFile of uploadFiles.value) {
    if (uploadFile[statusKey] === UPLOAD_STATUS.PENDING) {
      if (buildFormData) {
        buildFormData({
          file: uploadFile,
          formData: uploadFormData,
          resolve: (formData: Record<string, any>) => {
            formData &&
              startUpload(uploadFile, {
                action,
                header,
                name,
                formData,
                fileType: accept as 'image' | 'video' | 'audio',
                statusCode,
                statusKey,
                uploadMethod,
                enableDirectUpload, // 传递直传标志
                moduleName, // 模块名称
                directoryId, // 传递目录ID
                directoryPath, // 目录路径
                onSuccess: handleSuccess,
                onError: handleError,
                onProgress: handleProgress,
              })
          },
        })
      } else {
        startUpload(uploadFile, {
          action,
          header,
          name,
          formData: uploadFormData,
          fileType: accept as 'image' | 'video' | 'audio',
          statusCode,
          statusKey,
          uploadMethod,
          enableDirectUpload, // 传递直传标志
          moduleName, // 模块名称
          directoryId, // 传递目录ID
          directoryPath, // 目录路径
          onSuccess: handleSuccess,
          onError: handleError,
          onProgress: handleProgress,
        })
      }
    }
  }
}

/**
 * 初始化文件数据
 * @param file 选择的文件对象
 * @param currentIndex 当前文件索引，用于替换指定位置的文件
 */
const initFile = (file: ChooseFile, currentIndex?: number) => {
  const { statusKey } = props
  // 状态初始化
  const initState: UploadFileItem = {
    uid: context.id++,
    // 仅h5支持 name
    name: file.name || '',
    thumb: file.thumb || '',
    [statusKey]: 'pending',
    size: file.size || 0,
    url: file.path,
    percent: 0,
  }

  if (typeof currentIndex === 'number') {
    uploadFiles.value.splice(currentIndex, 1, initState)
  } else {
    uploadFiles.value.push(initState)
  }

  if (props.autoUpload) {
    startUploadFiles()
  }

  // 文件初始化时不触发 modelValue 更新，只有上传成功后才更新
  emit('update:fileList', uploadFiles.value)
  emit('field-change', uploadFiles.value)
}

/**
 * 处理删除文件
 * @param file 要删除的文件对象
 */
const handleRemove = (file: UploadFileItem) => {
  uploadFiles.value.splice(
    uploadFiles.value.findIndex((item) => item.uid === file.uid),
    1,
  )
  emit('change', { fileList: uploadFiles.value })
  emit('remove', { file })
  emitFileList()
}

/**
 * 移除文件
 * @param index 要删除的文件在列表中的索引
 */
const removeFile = (index: number) => {
  const { beforeRemove } = props
  const intIndex: number = index
  const file = uploadFiles.value[intIndex]

  if (beforeRemove) {
    beforeRemove({
      file,
      index: intIndex,
      fileList: uploadFiles.value,
      resolve: (isPass: boolean) => {
        isPass && handleRemove(file)
      },
    })
  } else {
    handleRemove(file)
  }
}

/**
 * 清空所有文件
 */
const handleClear = () => {
  uploadFiles.value = []
  emit('change', { fileList: uploadFiles.value })
  emit('clear')
  emitFileList()
}

// ======================== 选择文件处理函数 ========================

/**
 * 选择文件的实际操作
 * @param currentIndex 当前文件索引，用于替换指定位置的文件
 */
const onChooseFile = (currentIndex?: number) => {
  const {
    multiple,
    maxSize,
    accept,
    sizeType,
    limit,
    sourceType,
    compressed,
    maxDuration,
    camera,
    beforeUpload,
  } = props

  chooseFile({
    multiple,
    sizeType,
    sourceType,
    maxCount: limit ? limit - uploadFiles.value.length : 9,
    accept,
    compressed,
    maxDuration,
    camera,
    extension: computedExtension.value, // 使用计算后的扩展名
  })
    .then((res) => {
      // 成功选择初始化file
      let files = res
      // 单选只有一个
      if (!multiple) {
        files = files.slice(0, 1)
      }
      // 遍历列表逐个初始化上传参数
      const mapFiles = async (files: ChooseFile[]) => {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (file.type === 'image' && !file.size) {
            const imageInfo = await getImageInfo(file.path)
            file.size = imageInfo.width * imageInfo.height
          }
          Number(file.size) <= maxSize ? initFile(file, currentIndex) : emit('oversize', { file })
        }
      }

      // 上传前的钩子
      if (beforeUpload) {
        beforeUpload({
          files,
          fileList: uploadFiles.value,
          resolve: (isPass: boolean) => {
            isPass && mapFiles(files)
          },
        })
      } else {
        mapFiles(files)
      }
    })
    .catch((error) => {
      console.log('err', error)
      emit('chooseerror', { error })
    })
}

/**
 * 选择文件，内置拦截选择操作
 * @param index 文件索引，用于重新上传时指定位置
 */
const handleChoose = (index?: number) => {
  if (props.disabled) return
  const { beforeChoose } = props

  if (beforeChoose) {
    beforeChoose({
      fileList: uploadFiles.value,
      resolve: (isPass: boolean) => {
        isPass && onChooseFile(index)
      },
    })
  } else {
    onChooseFile(index)
  }
}

// ======================== 预览处理函数 ========================

/**
 * 预览文件
 * @param file 要预览的文件对象
 */
const handlePreviewFile = (file: UploadFileItem) => {
  uni.openDocument({
    filePath: file.url,
    showMenu: true,
  })
}

/**
 * 预览图片
 * @param index 图片在列表中的索引
 * @param lists 图片地址列表
 */
const handlePreviewImage = (index: number, lists: string[]) => {
  const { onPreviewFail } = props
  uni.previewImage({
    urls: lists,
    current: lists[index],
    fail() {
      if (onPreviewFail) {
        onPreviewFail({
          index,
          imgList: lists,
        })
      } else {
        uni.showToast({ title: '预览图片失败', icon: 'none' })
      }
    },
  })
}

/**
 * 预览视频
 * @param index 视频在列表中的索引
 * @param lists 视频文件对象列表
 */
const handlePreviewVideo = (index: number, lists: UploadFileItem[]) => {
  const { onPreviewFail } = props
  // #ifdef MP-WEIXIN
  uni.previewMedia({
    current: index,
    sources: lists.map((file) => {
      return {
        url: file.url,
        type: 'video',
        poster: file.thumb,
      }
    }),
    fail() {
      if (onPreviewFail) {
        onPreviewFail({
          index,
          imgList: [],
        })
      } else {
        uni.showToast({ title: '预览视频失败', icon: 'none' })
      }
    },
  })
  // #endif

  // #ifndef MP-WEIXIN
  videoPreview.value?.open({
    url: lists[index].url,
    poster: lists[index].thumb,
    title: lists[index].name,
  })
  // #endif
}

/**
 * 预览图片事件处理
 * @param file 要预览的图片文件对象
 */
const onPreviewImage = (file: UploadFileItem) => {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)
  const imgList = fileList.filter((file) => isImage(file)).map((file) => file.url)
  const imgIndex: number = imgList.findIndex((item) => item === file.url)

  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        fileList,
        imgList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewImage(imgIndex, imgList)
        },
      })
    } else {
      handlePreviewImage(imgIndex, imgList)
    }
  }
}

/**
 * 预览视频事件处理
 * @param file 要预览的视频文件对象
 */
const onPreviewVideo = (file: UploadFileItem) => {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)
  const videoList = fileList.filter((file) => isVideo(file))
  const videoIndex: number = videoList.findIndex((item) => item.url === file.url)

  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        imgList: [],
        fileList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewVideo(videoIndex, videoList)
        },
      })
    } else {
      handlePreviewVideo(videoIndex, videoList)
    }
  }
}

/**
 * 预览文件事件处理
 * @param file 要预览的文件对象
 */
const onPreviewFile = (file: UploadFileItem) => {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)

  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        imgList: [],
        fileList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewFile(file)
        },
      })
    } else {
      handlePreviewFile(file)
    }
  }
}

// ======================== 表单验证方法 ========================

/**
 * 手动触发验证
 */
const validate = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 这里应该实现具体的验证逻辑
    // 暂时返回 true，实际项目中需要根据 rules 进行验证
    resolve(true)
  })
}

/**
 * 清除验证状态
 */
const clearValidate = () => {
  // 清除验证状态的逻辑
}

// ======================== 监听器 ========================

/**
 * 监听 modelValue 变化
 */
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal === undefined) return

    // 如果有文件正在上传中，跳过 watch 更新，避免覆盖上传状态
    const hasUploadingFiles = uploadFiles.value.some(
      (file) => file[props.statusKey] === 'loading' || file[props.statusKey] === 'pending'
    )
    if (hasUploadingFiles) {
      return
    }

    let newFiles: UploadFileItem[] = []

    if (Array.isArray(newVal)) {
      // 如果是数组，转换为 UploadFileItem 类型
      newFiles = newVal.map(
        (item) =>
          ({
            uid: item.uid || context.id++,
            url: item.url,
            name: item.name || '',
            thumb: item.thumb || '',
            size: item.size || 0,
            percent: item.percent || 0,
            response: item.response || '',
            ossId: item.ossId || '',
            [props.statusKey]: item[props.statusKey] || 'success',
          }) as UploadFileItem,
      )
    } else if (typeof newVal === 'string') {
      // 如果是字符串，转换为文件列表
      newFiles = await stringToFiles(newVal)
    }

    // 检查是否需要更新（避免无限循环）
    // 只比较上传成功的文件，忽略正在上传的文件
    const currentSuccessFiles = uploadFiles.value.filter((file) => file[props.statusKey] === 'success')
    const currentString = filesToString(currentSuccessFiles)
    const newString = Array.isArray(newVal) ? filesToString(newFiles) : newVal

    if (currentString !== newString) {
      uploadFiles.value = newFiles
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听文件列表变化
 */
watch(
  () => props.fileList,
  (val) => {
    // 如果有 modelValue，优先使用 modelValue
    if (props.modelValue !== undefined) return

    const { statusKey } = props
    if (isEqual(val, uploadFiles.value)) return

    uploadFiles.value = val.map((item) => {
      item[statusKey] = item[statusKey] || 'success'
      item.response = item.response || ''
      return { ...item, uid: context.id++ }
    })
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听限制数量变化
 */
watch(
  () => props.limit,
  (val) => {
    if (val && val < uploadFiles.value.length) {
      console.error('[wot-design]Error: props limit must less than fileList.length')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * 监听各种钩子函数的类型验证
 */
watch(
  () => props.beforePreview,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforePreview must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.onPreviewFail,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of onPreviewFail must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.beforeRemove,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeRemove must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.beforeUpload,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeUpload must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.beforeChoose,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of beforeChoose must be Function')
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.buildFormData,
  (fn) => {
    if (fn && !isFunction(fn)) {
      console.error('The type of buildFormData must be Function')
    }
  },
  { deep: true, immediate: true },
)

// ======================== 暴露方法 ========================

// 暴露组件方法
defineExpose<WdUploadExpose>({
  /** 手动触发上传 */
  submit: () => startUploadFiles(),
  /** 取消上传 */
  abort: () => abort(),
  /** 清空所有文件 */
  clear: handleClear,
  /** 获取当前文件列表 */
  getValue: () => uploadFiles.value,
  /** 设置文件列表 */
  setValue: (files: UploadFileItem[]) => {
    uploadFiles.value = files
    emitFileList()
  },
  /** 获取当前值（根据 modelValue 类型返回相应格式） */
  getModelValue: () => {
    const modelValueType = getModelValueType()
    const successFiles = uploadFiles.value.filter((file) => file[props.statusKey] === 'success')
    if (modelValueType === 'string') {
      return filesToString(successFiles)
    }
    return successFiles
  },
  /** 设置当前值（支持数组和字符串） */
  setModelValue: async (value: UploadFile[] | string) => {
    if (Array.isArray(value)) {
      uploadFiles.value = value.map(
        (item) =>
          ({
            uid: item.uid || context.id++,
            url: item.url,
            name: item.name || '',
            thumb: item.thumb || '',
            size: item.size || 0,
            percent: item.percent || 0,
            response: item.response || '',
            ossId: item.ossId || '',
            [props.statusKey]: item[props.statusKey] || 'success',
          }) as UploadFileItem,
      )
    } else if (typeof value === 'string') {
      uploadFiles.value = await stringToFiles(value)
    }
    emitFileList()
  },
  /** 手动触发验证 */
  validate,
  /** 清除验证状态 */
  clearValidate,
})

/** 上传组件实例类型 */
export type UploadInstance = ComponentPublicInstance<WdUploadProps, WdUploadExpose>
</script>

<style lang="scss">
// 引入外部样式文件
@import '../common/abstracts/variable.scss';
@import '../common/abstracts/_mixin.scss';

// 暗色主题样式
.wot-theme-dark {
  @include b(upload) {
    background: $-dark-background2;

    @include e(label) {
      color: $-dark-color;
    }

    @include e(evoke) {
      background-color: $-dark-background4;
      color: $-dark-color3;

      @include when(disabled) {
        color: $-dark-color-gray;
      }
    }

    @include e(file) {
      background-color: $-dark-background4;
    }

    @include e(file-name) {
      color: $-dark-color3;
    }

    @include e(error-message) {
      color: $-form-item-error-message-color;
    }
  }
}

// 上传组件主体样式
@include b(upload) {
  position: relative;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  background: $-input-bg;

  // 表单模式样式
  @include when(form) {
    display: flex;
    align-items: flex-start;
    padding: $-input-cell-padding $-input-padding;
    background-color: $-input-cell-bg;

    @include when(center) {
      align-items: center;
    }

    @include when(vertical) {
      display: block;

      .wd-upload__body {
        margin-top: $-cell-vertical-top;
      }

      .wd-upload__label {
        margin-right: 0;
      }
    }
  }

  @include when(no-border) {
    .wd-upload__body::after {
      display: none;
      background: red !important;
      width: 100rpx !important;
      height: 100rpx !important;
    }
  }
  // 标签区域样式
  @include e(label) {
    position: relative;
    display: flex;
    width: $-input-cell-label-width;
    color: $-cell-title-color;
    margin-right: $-cell-padding;
    box-sizing: border-box;
    font-size: $-input-fs;
    flex-shrink: 0;
    align-items: center;

    @include when(required) {
      padding-left: 24rpx;

      &::after {
        position: absolute;
        left: 0;
        top: 4rpx;
        content: '*';
        font-size: $-cell-required-size;
        line-height: 1.1;
        color: $-cell-required-color;
      }
    }
  }

  @include e(label-inner) {
    display: inline-block;
    font-size: $-input-fs;
    line-height: $-cell-line-height;
  }

  @include e(prefix) {
    margin-right: $-cell-icon-right;
    font-size: $-input-fs;
    line-height: initial;

    :deep(.wd-upload__icon) {
      margin-left: 0;
    }
  }

  // 内容区域样式
  @include e(body) {
    flex: 1;
    position: relative;

    &::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      height: 2rpx;
      background: $-input-border-color;
      transform: scaleY(0.5);
      transition: background-color 0.2s ease-in-out;
    }

    .is-form & {
      &::after {
        display: none;
      }
    }
  }

  @include e(content) {
    position: relative;
    display: flex;
    flex-wrap: wrap;

    // 垂直布局（默认）
    @include when(vertical) {
      flex-direction: row;
    }

    // 水平布局
    @include when(horizontal) {
      flex-direction: row;
      align-items: flex-start;

      .wd-upload__preview {
        margin-right: 16rpx;
        margin-bottom: 16rpx;
      }

      .wd-upload__evoke {
        margin-right: 16rpx;
        margin-bottom: 16rpx;
      }
    }

    // 预览尺寸控制
    @include when(preview-small) {
      .wd-upload__preview,
      .wd-upload__evoke {
        width: 120rpx;
        height: 120rpx;
      }
    }

    @include when(preview-medium) {
      .wd-upload__preview,
      .wd-upload__evoke {
        width: $-upload-size; // 默认 160rpx
        height: $-upload-size;
      }
    }

    @include when(preview-large) {
      .wd-upload__preview,
      .wd-upload__evoke {
        width: 210rpx;
        height: 210rpx;
      }
    }
  }

  // 错误信息样式
  @include e(error-message) {
    color: $-form-item-error-message-color;
    font-size: $-form-item-error-message-font-size;
    line-height: $-form-item-error-message-line-height;
    text-align: left;
    vertical-align: middle;
  }

  // 唤起按钮样式
  @include e(evoke) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: $-upload-size;
    height: $-upload-size;
    font-size: $-upload-evoke-icon-size;
    background-color: $-upload-evoke-bg;
    color: $-upload-evoke-color;
    margin-bottom: 24rpx;
    margin-right: 24rpx;

    @include when(disabled) {
      color: $-upload-evoke-disabled-color;
    }

    .is-form & {
      margin-bottom: 16rpx;
      margin-right: 16rpx;
    }
  }

  // 唤起按钮数量显示
  @include e(evoke-num) {
    font-size: 28rpx;
    line-height: 28rpx;
    margin-top: 16rpx;
  }

  // 唤起按钮图标
  @include edeep(evoke-icon) {
    width: 64rpx;
    height: 64rpx;
  }

  // 预览容器样式
  @include e(preview) {
    position: relative;
    width: $-upload-size;
    height: $-upload-size;
    margin: 0 24rpx 24rpx 0;

    .is-form & {
      margin: 0 16rpx 16rpx 0;
    }
  }

  // 图片、文件、视频样式
  @include e(picture, file, video) {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  // 文件和视频容器样式
  @include e(file, video) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $-upload-evoke-bg;
  }

  // 视频和文件图标样式
  @include e(video-icon, file-icon) {
    font-size: $-upload-cover-icon-size;
  }

  // 文件名和视频名样式
  @include e(file-name, video-name) {
    width: 100%;
    font-size: $-upload-file-fs;
    color: $-upload-file-color;
    box-sizing: border-box;
    padding: 0 8rpx;
    text-align: center;
    margin-top: 16rpx;
    @include lineEllipsis();
  }

  // 视频播放按钮样式
  @include edeep(video-play) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48rpx;
    color: $-color-white;

    &::before {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
  }

  // 关闭按钮样式
  @include edeep(close) {
    position: absolute;
    right: calc($-upload-close-icon-size / 2 * -1);
    top: calc($-upload-close-icon-size / 2 * -1);
    font-size: $-upload-close-icon-size;
    z-index: 1;
    color: $-upload-close-icon-color;
    width: $-upload-close-icon-size;
    height: $-upload-close-icon-size;
    line-height: $-upload-close-icon-size;

    &::after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: $-color-white;
      left: 0;
      z-index: -1;
    }
  }

  // 遮罩层样式
  @include e(mask) {
    position: absolute;
    top: 0;
    left: 0;
    background-color: $-upload-preview-name-bg;
  }

  // 进度文字样式
  @include e(progress-txt) {
    font-size: $-upload-progress-fs;
    line-height: $-upload-progress-fs;
    margin-top: 18rpx;
  }

  // 图标样式
  @include edeep(icon) {
    font-size: $-cell-icon-size;
  }

  // 状态内容容器样式
  @include e(status-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  // 清空按钮样式
  @include e(clear-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $-upload-size;
    height: 64rpx;
    margin-top: 16rpx;
    background-color: $-upload-evoke-bg;
    color: $-upload-evoke-color;
    font-size: 24rpx;
    border-radius: 8rpx;
    cursor: pointer;

    .is-form & {
      margin-top: 8rpx;
    }
  }

  @include e(clear-icon) {
    font-size: 28rpx;
    margin-right: 8rpx;
  }

  @include e(clear-text) {
    font-size: 24rpx;
  }
}
</style>
