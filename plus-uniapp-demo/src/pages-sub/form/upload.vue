<!-- Upload 上传组件 http://127.0.0.1:100/#/pages-sub/demo/wd/upload -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Upload 上传组件" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的上传组件使用方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="图片上传" vertical>
          <wd-upload
            v-model:file-list="fileList"
            accept="image"
            image-mode="aspectFill"
            :action="action"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 限制上传数量示例 -->
    <DemoSection title="限制上传数量" desc="设置最大上传文件数量限制">
      <wd-cell-group>
        <wd-cell title="最多上传3张" vertical>
          <wd-upload
            :file-list="fileList3"
            :limit="3"
            :action="action"
            @change="handleChange3"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 限制数量" :code="codes.limit.template" />
        <DemoCode title="脚本 - 限制数量" :code="codes.limit.script" />
      </template>
    </DemoSection>

    <!-- 覆盖上传示例 -->
    <DemoSection title="覆盖上传" desc="点击已上传的文件可以重新选择文件进行替换">
      <wd-cell-group>
        <wd-cell title="覆盖上传" vertical>
          <!-- #ifdef MP-WEIXIN || H5  -->
          <wd-upload
            v-model:file-list="fileList17"
            accept="all"
            reupload
            image-mode="aspectFill"
            :action="action"
          />
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <!-- #ifndef H5 -->
          <wd-upload
            v-model:file-list="fileList17"
            accept="image"
            reupload
            image-mode="aspectFill"
            :action="action"
          />
          <!-- #endif -->
          <!-- #endif -->
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 覆盖上传" :code="codes.reupload.template" />
        <DemoCode title="脚本 - 覆盖上传" :code="codes.reupload.script" />
      </template>
    </DemoSection>

    <!-- 上传前置处理示例 -->
    <DemoSection title="上传前置处理" desc="上传前的确认操作和文件处理">
      <wd-cell-group>
        <wd-cell title="上传前确认" vertical>
          <wd-upload
            :file-list="fileList5"
            :action="action"
            :before-upload="beforeUpload"
            @change="handleChange5"
          />
        </wd-cell>

        <wd-cell title="选择前确认" vertical>
          <wd-upload
            :file-list="fileList10"
            :action="action"
            :before-choose="beforeChoose"
            @change="handleChange10"
          />
        </wd-cell>

        <wd-cell title="预览前确认" vertical>
          <wd-upload
            :file-list="fileList4"
            :action="action"
            :before-preview="beforePreview"
            @change="handleChange4"
          />
        </wd-cell>

        <wd-cell title="删除前确认" vertical>
          <wd-upload
            :file-list="fileList6"
            :action="action"
            :before-remove="beforeRemove"
            @change="handleChange6"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 上传前确认" :code="codes.hooks.uploadTemplate" />
        <DemoCode title="模板 - 各种钩子" :code="codes.hooks.allHooksTemplate" />
        <DemoCode title="脚本 - 钩子处理" :code="codes.hooks.script" />
      </template>
    </DemoSection>

    <!-- 不同文件类型示例 -->
    <DemoSection title="不同文件类型" desc="支持上传图片、视频和各种文件类型">
      <wd-cell-group>
        <wd-cell title="上传视频" vertical>
          <wd-upload
            accept="video"
            multiple
            :file-list="fileList1"
            :action="action"
            @change="handleChange1"
          />
        </wd-cell>

        <!-- #ifdef MP-WEIXIN -->
        <wd-cell title="上传媒体文件" vertical>
          <wd-upload
            accept="media"
            multiple
            :file-list="fileList11"
            :action="action"
            @change="handleChange11"
          />
        </wd-cell>

        <wd-cell title="上传文件" vertical>
          <wd-upload
            accept="file"
            multiple
            :file-list="fileList12"
            :action="action"
            @change="handleChange12"
          />
        </wd-cell>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN || H5 -->
        <wd-cell title="上传所有类型" vertical>
          <wd-upload
            accept="all"
            multiple
            :file-list="fileList13"
            :action="action"
            @change="handleChange13"
          />
        </wd-cell>
        <!-- #endif -->
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 视频上传" :code="codes.fileTypes.videoTemplate" />
        <DemoCode title="模板 - 媒体文件" :code="codes.fileTypes.mediaTemplate" />
        <DemoCode title="脚本 - 文件类型" :code="codes.fileTypes.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多配置选项和自定义功能">
      <wd-cell-group>
        <wd-cell title="多选上传" vertical>
          <wd-upload
            :file-list="fileList2"
            multiple
            :action="action"
            @change="handleChange2"
          />
        </wd-cell>

        <wd-cell title="禁用状态" vertical>
          <wd-upload
            :file-list="fileList8"
            disabled
            :action="action"
            @change="handleChange8"
          />
        </wd-cell>

        <wd-cell title="自定义触发器" vertical>
          <wd-upload
            :file-list="fileList9"
            :action="action"
            :limit="5"
            @change="handleChange9"
          >
            <wd-button>自定义触发器样式</wd-button>
          </wd-upload>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 多选上传" :code="codes.advanced.multipleTemplate" />
        <DemoCode title="模板 - 禁用状态" :code="codes.advanced.disabledTemplate" />
        <DemoCode title="模板 - 自定义触发器" :code="codes.advanced.customTriggerTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 上传状态钩子示例 -->
    <DemoSection title="上传状态钩子" desc="监听上传过程中的各种状态变化">
      <wd-cell-group>
        <wd-cell title="状态监听" vertical>
          <wd-upload
            :file-list="fileList7"
            :action="action"
            @change="handleChange7"
            @success="handleSuccess"
            @fail="handleFail"
            @progress="handleProgess"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 状态日志显示 -->
      <view class="mx-4 mt-4 rounded-lg bg-gray-50 p-4">
        <view class="mb-2 text-sm font-medium">上传状态日志</view>
        <view class="h-32 overflow-y-auto border rounded bg-white p-2">
          <view
            v-for="(log, index) in statusLogs"
            :key="index"
            class="mb-1 text-xs"
            :class="getLogColor(log.type)"
          >
            <text class="text-gray-400">[{{ log.time }}]</text>
            {{ log.message }}
          </view>
          <view v-if="statusLogs.length === 0" class="py-4 text-center text-gray-400">
            暂无状态日志
          </view>
        </view>
        <view class="mt-2">
          <wd-button size="small" @click="clearStatusLogs">清空日志</wd-button>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 状态监听" :code="codes.status.template" />
        <DemoCode title="脚本 - 状态处理" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 手动控制上传示例 -->
    <DemoSection title="手动控制上传" desc="手动触发上传，而不是选择文件后自动上传">
      <wd-cell-group>
        <wd-cell title="手动上传" vertical>
          <wd-upload
            ref="upload14"
            :auto-upload="false"
            :file-list="fileList14"
            :action="action"
            @change="handleChange14"
          />
          <view class="mt-3">
            <wd-button @click="startUpload">开始上传</wd-button>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 手动上传" :code="codes.manual.template" />
        <DemoCode title="脚本 - 手动上传" :code="codes.manual.script" />
      </template>
    </DemoSection>

    <!-- 自定义上传方法示例 -->
    <DemoSection title="自定义上传方法" desc="使用自定义的上传实现替代默认上传">
      <wd-cell-group>
        <wd-cell title="自定义上传" vertical>
          <wd-upload
            v-model:file-list="fileList15"
            :upload-method="customUpload"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义上传" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义上传" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 自定义预览样式示例 -->
    <DemoSection title="自定义预览样式" desc="自定义文件预览的显示样式">
      <wd-cell-group>
        <wd-cell title="自定义预览" vertical>
          <wd-upload
            v-model:file-list="fileList16"
            accept="image"
            image-mode="aspectFill"
            :action="action"
          >
            <template #preview-cover="{ file, index }">
              <view class="custom-preview-cover">
                {{ file.name || `文件${index}` }}
              </view>
            </template>
          </wd-upload>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义预览" :code="codes.preview.template" />
        <DemoCode title="样式 - 自定义预览" :code="codes.preview.style" />
      </template>
    </DemoSection>

    <!-- 文件扩展名过滤示例 -->
    <!-- #ifdef H5 || MP-WEIXIN -->
    <DemoSection title="文件扩展名过滤" desc="根据文件扩展名限制可选择的文件类型">
      <wd-cell-group>
        <!-- #ifdef H5 -->
        <wd-cell title="图片过滤(.jpg, .png)" vertical>
          <wd-upload
            v-model:file-list="fileList18"
            :extension="['.jpg', '.png']"
            :action="action"
          />
        </wd-cell>

        <wd-cell title="视频过滤(.mp4)" vertical>
          <wd-upload
            v-model:file-list="fileList19"
            accept="video"
            :extension="['.mp4']"
            :action="action"
          />
        </wd-cell>

        <wd-cell title="文档过滤(.pdf, .docx)" vertical>
          <wd-upload
            v-model:file-list="fileList21"
            accept="all"
            :extension="['.pdf', '.docx']"
            :action="action"
          />
        </wd-cell>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <wd-cell title="文本过滤(.txt)" vertical>
          <wd-upload
            v-model:file-list="fileList19"
            accept="file"
            :extension="['.txt']"
            :action="action"
          />
        </wd-cell>

        <wd-cell title="混合过滤(.jpg, .mp4)" vertical>
          <wd-upload
            v-model:file-list="fileList20"
            accept="all"
            :extension="['.jpg', '.mp4']"
            :action="action"
          />
        </wd-cell>
        <!-- #endif -->
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - H5扩展名过滤" :code="codes.extension.h5Template" />
        <DemoCode title="模板 - 小程序扩展名过滤" :code="codes.extension.mpTemplate" />
        <DemoCode title="脚本 - 扩展名过滤" :code="codes.extension.script" />
      </template>
    </DemoSection>
    <!-- #endif -->

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast, useMessage } from '@/wd'
import { useScroll } from '@/composables/useScroll'
import type { UploadFile, UploadInstance, UploadMethod } from '@/wd/components/wd-upload/wd-upload.vue'

// ===== 组件状态管理 =====

// 上传接口地址
const action = 'https://mockapi.eolink.com/zhTuw2P8c29bc981a741931bdd86eb04dc1e8fd64865cb5/upload'

// 各种上传文件列表状态
const fileList = ref<UploadFile[]>([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
  }
])

const fileList1 = ref<UploadFile[]>([])
const fileList2 = ref<UploadFile[]>([
  {
    url: 'https://img12.360buyimg.com//n0/jfs/t1/29118/6/4823/55969/5c35c16bE7c262192/c9fdecec4b419355.jpg'
  }
])
const fileList3 = ref<UploadFile[]>([])
const fileList4 = ref<UploadFile[]>([])
const fileList5 = ref<UploadFile[]>([])
const fileList6 = ref<UploadFile[]>([])
const fileList7 = ref<UploadFile[]>([])
const fileList8 = ref<UploadFile[]>([])
const fileList9 = ref<UploadFile[]>([])
const fileList10 = ref<UploadFile[]>([])
const fileList11 = ref<UploadFile[]>([])
const fileList12 = ref<UploadFile[]>([])
const fileList13 = ref<UploadFile[]>([])
const fileList14 = ref<UploadFile[]>([])
const fileList15 = ref<UploadFile[]>([])
const fileList16 = ref<UploadFile[]>([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: 'panda'
  }
])
const fileList17 = ref<UploadFile[]>([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
  }
])
const fileList18 = ref<UploadFile[]>([])
const fileList19 = ref<UploadFile[]>([])
const fileList20 = ref<UploadFile[]>([])
const fileList21 = ref<UploadFile[]>([])

// 手动上传组件引用
const upload14 = ref<UploadInstance>()

// 状态日志
interface StatusLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const statusLogs = ref<StatusLog[]>([])

// 工具函数
const messageBox = useMessage()
const toast = useToast()

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-upload
  v-model:file-list="fileList"
  accept="image"
  image-mode="aspectFill"
  :action="action"
/>`,

    script: `import { ref } from 'vue'
import type { UploadFile } from '@/wd/components/wd-upload/wd-upload.vue'

const action = 'https://mockapi.eolink.com/zhTuw2P8c29bc981a741931bdd86eb04dc1e8fd64865cb5/upload'

const fileList = ref<UploadFile[]>([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
  }
])`,
  },

  // 限制数量代码
  limit: {
    template: `<wd-upload
  :file-list="fileList3"
  :limit="3"
  :action="action"
  @change="handleChange3"
/>`,

    script: `const fileList3 = ref<UploadFile[]>([])

const handleChange3 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList3.value = fileList
}`,
  },

  // 覆盖上传代码
  reupload: {
    template: `<!-- 微信小程序和H5支持所有类型 -->
<!-- #ifdef MP-WEIXIN || H5  -->
<wd-upload
  v-model:file-list="fileList17"
  accept="all"
  reupload
  image-mode="aspectFill"
  :action="action"
/>
<!-- #endif -->

<!-- 其他平台只支持图片 -->
<!-- #ifndef MP-WEIXIN -->
<!-- #ifndef H5 -->
<wd-upload
  v-model:file-list="fileList17"
  accept="image"
  reupload
  image-mode="aspectFill"
  :action="action"
/>
<!-- #endif -->
<!-- #endif -->`,

    script: `const fileList17 = ref<UploadFile[]>([
  {
    url: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
  }
])`,
  },

  // 钩子函数代码
  hooks: {
    uploadTemplate: `<wd-upload
  :file-list="fileList5"
  :action="action"
  :before-upload="beforeUpload"
  @change="handleChange5"
/>`,

    allHooksTemplate: `<!-- 选择前确认 -->
<wd-upload
  :file-list="fileList10"
  :action="action"
  :before-choose="beforeChoose"
  @change="handleChange10"
/>

<!-- 预览前确认 -->
<wd-upload
  :file-list="fileList4"
  :action="action"
  :before-preview="beforePreview"
  @change="handleChange4"
/>

<!-- 删除前确认 -->
<wd-upload
  :file-list="fileList6"
  :action="action"
  :before-remove="beforeRemove"
  @change="handleChange6"
/>`,

    script: `import { useToast, useMessage } from '@/wd'

const messageBox = useMessage()
const toast = useToast()

// 选择文件前的确认操作
const beforeChoose = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否选择',
      title: '提示'
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      toast.show('取消选择操作')
    })
}

// 预览图片前的确认操作
const beforePreview = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否预览图片',
      title: '提示'
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      toast.show('取消预览操作')
    })
}

// 上传前的确认操作
const beforeUpload = ({ files, resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否上传',
      title: '提示'
    })
    .then(() => {
      console.log(files, 'files')
      resolve(true)
    })
    .catch(() => {
      toast.show('取消上传操作')
    })
}

// 删除文件前的确认操作
const beforeRemove = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否删除',
      title: '提示'
    })
    .then(() => {
      toast.success('删除成功')
      resolve(true)
    })
    .catch(() => {
      toast.show('取消删除操作')
    })
}`,
  },

  // 文件类型代码
  fileTypes: {
    videoTemplate: `<wd-upload
  accept="video"
  multiple
  :file-list="fileList1"
  :action="action"
  @change="handleChange1"
/>`,

    mediaTemplate: `<!-- 微信小程序特有功能 -->
<!-- #ifdef MP-WEIXIN -->
<wd-upload
  accept="media"
  multiple
  :file-list="fileList11"
  :action="action"
  @change="handleChange11"
/>

<wd-upload
  accept="file"
  multiple
  :file-list="fileList12"
  :action="action"
  @change="handleChange12"
/>
<!-- #endif -->

<!-- H5 和微信小程序支持 -->
<!-- #ifdef MP-WEIXIN || H5 -->
<wd-upload
  accept="all"
  multiple
  :file-list="fileList13"
  :action="action"
  @change="handleChange13"
/>
<!-- #endif -->`,

    script: `const fileList1 = ref<UploadFile[]>([])
const fileList11 = ref<UploadFile[]>([])
const fileList12 = ref<UploadFile[]>([])
const fileList13 = ref<UploadFile[]>([])

const handleChange1 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList1.value = fileList
}

const handleChange11 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList11.value = fileList
}

const handleChange12 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList12.value = fileList
}

const handleChange13 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList13.value = fileList
}`,
  },

  // 高级配置代码
  advanced: {
    multipleTemplate: `<wd-upload
  :file-list="fileList2"
  multiple
  :action="action"
  @change="handleChange2"
/>`,

    disabledTemplate: `<wd-upload
  :file-list="fileList8"
  disabled
  :action="action"
  @change="handleChange8"
/>`,

    customTriggerTemplate: `<wd-upload
  :file-list="fileList9"
  :action="action"
  :limit="5"
  @change="handleChange9"
>
  <wd-button>自定义触发器样式</wd-button>
</wd-upload>`,

    script: `const fileList2 = ref<UploadFile[]>([
  {
    url: 'https://img12.360buyimg.com//n0/jfs/t1/29118/6/4823/55969/5c35c16bE7c262192/c9fdecec4b419355.jpg'
  }
])
const fileList8 = ref<UploadFile[]>([])
const fileList9 = ref<UploadFile[]>([])

const handleChange2 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList2.value = fileList
}

const handleChange8 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList8.value = fileList
}

const handleChange9 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList9.value = fileList
}`,
  },

  // 状态监听代码
  status: {
    template: `<wd-upload
  :file-list="fileList7"
  :action="action"
  @change="handleChange7"
  @success="handleSuccess"
  @fail="handleFail"
  @progress="handleProgess"
/>`,

    script: `const fileList7 = ref<UploadFile[]>([])
const statusLogs = ref<StatusLog[]>([])

interface StatusLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const addStatusLog = (message: string, type: StatusLog['type'] = 'info') => {
  statusLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (statusLogs.value.length > 20) {
    statusLogs.value = statusLogs.value.slice(0, 20)
  }
}

const handleChange7 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList7.value = fileList
  addStatusLog('文件列表发生变化', 'info')
}

const handleSuccess = (event: any) => {
  console.log('上传成功', event)
  addStatusLog(\`上传成功：\${event.file.name || '文件'}\`, 'success')
}

const handleFail = (event: any) => {
  console.log('上传失败', event)
  addStatusLog(\`上传失败：\${event.error.errMsg}\`, 'error')
}

const handleProgess = (event: any) => {
  console.log('上传进度', event)
  addStatusLog(\`上传进度：\${event.response.progress}%\`, 'info')
}

const clearStatusLogs = () => {
  statusLogs.value = []
  addStatusLog('状态日志已清空', 'info')
}`,
  },

  // 手动上传代码
  manual: {
    template: `<wd-upload
  ref="upload14"
  :auto-upload="false"
  :file-list="fileList14"
  :action="action"
  @change="handleChange14"
/>
<view class="mt-3">
  <wd-button @click="startUpload">开始上传</wd-button>
</view>`,

    script: `import type { UploadInstance } from '@/wd/components/wd-upload/wd-upload.vue'

const upload14 = ref<UploadInstance>()
const fileList14 = ref<UploadFile[]>([])

const handleChange14 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList14.value = fileList
}

// 手动触发上传
const startUpload = () => {
  upload14.value?.submit()
}`,
  },

  // 自定义上传代码
  custom: {
    template: `<wd-upload
  v-model:file-list="fileList15"
  :upload-method="customUpload"
/>`,

    script: `import type { UploadMethod } from '@/wd/components/wd-upload/wd-upload.vue'

const fileList15 = ref<UploadFile[]>([])

// 自定义上传方法
const customUpload: UploadMethod = (file, formData, options) => {
  const uploadTask = uni.uploadFile({
    url: action,
    header: options.header,
    name: options.name,
    fileName: options.name,
    fileType: options.fileType,
    formData,
    filePath: file.url,
    success(res) {
      if (res.statusCode === options.statusCode) {
        try {
          // 解析响应数据
          const responseData = JSON.parse(res.data)
          if (responseData.code === 200) {
            // 修复：正确传递响应数据结构
            const uploadResult = {
              fileName: responseData.data.fileName,
              url: responseData.data.url,
              ossId: responseData.data.ossId,
              updateTime: responseData.data.updateTime,
            }
            options.onSuccess(uploadResult, file, formData)
          } else {
            const businessError = {
              errMsg: responseData.msg || '业务处理失败',
            }
            options.onError(businessError, file, formData)
          }
        } catch (parseError) {
          const jsonError = {
            errMsg: '响应数据解析失败',
          }
          options.onError(jsonError, file, formData)
        }
      } else {
        const httpError = {
          errMsg: \`HTTP状态码错误: \${res.statusCode}\`,
        }
        options.onError(httpError, file, formData)
      }
    },
    fail(err) {
      options.onError(err, file, formData)
    }
  })

  // 监听上传进度
  uploadTask.onProgressUpdate((res) => {
    options.onProgress(res, file)
  })

  return uploadTask
}`,
  },

  // 自定义预览代码
  preview: {
    template: `<wd-upload
  v-model:file-list="fileList16"
  accept="image"
  image-mode="aspectFill"
  :action="action"
>
  <template #preview-cover="{ file, index }">
    <view class="custom-preview-cover">
      {{ file.name || \`文件\${index}\` }}
    </view>
  </template>
</wd-upload>`,

    style: `.custom-preview-cover {
  margin-top: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #666;
}`,
  },

  // 扩展名过滤代码
  extension: {
    h5Template: `<!-- H5平台扩展名过滤 -->
<!-- #ifdef H5 -->
<wd-upload
  v-model:file-list="fileList18"
  :extension="['.jpg', '.png']"
  :action="action"
/>

<wd-upload
  v-model:file-list="fileList19"
  accept="video"
  :extension="['.mp4']"
  :action="action"
/>

<wd-upload
  v-model:file-list="fileList21"
  accept="all"
  :extension="['.pdf', '.docx']"
  :action="action"
/>
<!-- #endif -->`,

    mpTemplate: `<!-- 微信小程序扩展名过滤 -->
<!-- #ifdef MP-WEIXIN -->
<wd-upload
  v-model:file-list="fileList19"
  accept="file"
  :extension="['.txt']"
  :action="action"
/>

<wd-upload
  v-model:file-list="fileList20"
  accept="all"
  :extension="['.jpg', '.mp4']"
  :action="action"
/>
<!-- #endif -->`,

    script: `const fileList18 = ref<UploadFile[]>([])
const fileList19 = ref<UploadFile[]>([])
const fileList20 = ref<UploadFile[]>([])
const fileList21 = ref<UploadFile[]>([])`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'UploadFile[] | string',
    default: '[]',
    desc: 'v-model 绑定值，可以是文件列表数组或字符串',
  },
  {
    name: 'file-list',
    type: 'UploadFile[]',
    default: '[]',
    desc: '上传的文件列表',
  },
  {
    name: 'action',
    type: 'string',
    default: '\'\'',
    desc: '上传的地址',
  },
  {
    name: 'accept',
    type: 'string',
    default: '\'image\'',
    desc: '文件类型，可选值：image / video / media / file / all',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    desc: '是否支持多选文件',
  },
  {
    name: 'limit',
    type: 'number',
    default: 'undefined',
    desc: '最大允许上传个数',
  },
  {
    name: 'max-size',
    type: 'number',
    default: 'Number.MAX_VALUE',
    desc: '文件大小限制，单位为byte',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'auto-upload',
    type: 'boolean',
    default: 'true',
    desc: '是否选择文件后自动上传',
  },
  {
    name: 'reupload',
    type: 'boolean',
    default: 'false',
    desc: '点击已上传时是否可以重新上传',
  },
  {
    name: 'header',
    type: 'object',
    default: '{}',
    desc: '设置上传的请求头部',
  },
  {
    name: 'name',
    type: 'string',
    default: '\'file\'',
    desc: '文件对应的key',
  },
  {
    name: 'form-data',
    type: 'object',
    default: '{}',
    desc: 'HTTP请求中其他额外的formdata',
  },
  {
    name: 'image-mode',
    type: 'string',
    default: '\'aspectFit\'',
    desc: '预览图片的mode属性',
  },
  {
    name: 'loading-type',
    type: 'string',
    default: '\'ring\'',
    desc: '加载中图标类型',
  },
  {
    name: 'loading-color',
    type: 'string',
    default: '\'#ffffff\'',
    desc: '加载中图标颜色',
  },
  {
    name: 'loading-size',
    type: 'string',
    default: '\'48rpx\'',
    desc: '加载中图标尺寸',
  },
  {
    name: 'status-key',
    type: 'string',
    default: '\'status\'',
    desc: 'file 数据结构中，status 对应的 key',
  },
  {
    name: 'success-status',
    type: 'number',
    default: '200',
    desc: '接口响应的成功状态值',
  },
  {
    name: 'extension',
    type: 'string[]',
    default: '[]',
    desc: '根据文件拓展名过滤，H5、微信小程序支持',
  },
  {
    name: 'before-upload',
    type: 'function',
    default: 'undefined',
    desc: '上传文件之前的钩子',
  },
  {
    name: 'before-choose',
    type: 'function',
    default: 'undefined',
    desc: '选择图片之前的钩子',
  },
  {
    name: 'before-remove',
    type: 'function',
    default: 'undefined',
    desc: '删除文件之前的钩子',
  },
  {
    name: 'before-preview',
    type: 'function',
    default: 'undefined',
    desc: '图片预览前的钩子',
  },
  {
    name: 'upload-method',
    type: 'function',
    default: 'undefined',
    desc: '自定义上传文件的请求方法',
  },
  {
    name: 'custom-style',
    type: 'string',
    default: '\'\'',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'string',
    default: '\'\'',
    desc: '自定义根节点样式类',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'submit()',
    desc: '手动触发上传',
  },
  {
    name: 'abort(task?)',
    desc: '取消上传，参数为上传任务实例',
  },
  {
    name: 'clear()',
    desc: '清空所有文件',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '文件列表变化时触发，参数为 { fileList }',
  },
  {
    name: 'success',
    desc: '上传成功时触发，参数为 { file, fileList, formData }',
  },
  {
    name: 'fail',
    desc: '上传失败时触发，参数为 { error, file, formData }',
  },
  {
    name: 'progress',
    desc: '上传进度变化时触发，参数为 { response, file }',
  },
  {
    name: 'oversize',
    desc: '文件超出大小限制时触发，参数为 { file }',
  },
  {
    name: 'remove',
    desc: '删除文件时触发，参数为 { file }',
  },
  {
    name: 'chooseerror',
    desc: '选择文件错误时触发，参数为 { error }',
  },
]

// ===== 工具方法 =====

/**
 * 添加状态日志
 */
const addStatusLog = (message: string, type: StatusLog['type'] = 'info') => {
  statusLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (statusLogs.value.length > 20) {
    statusLogs.value = statusLogs.value.slice(0, 20)
  }
}

/**
 * 清空状态日志
 */
const clearStatusLogs = () => {
  statusLogs.value = []
  addStatusLog('状态日志已清空', 'info')
}

/**
 * 获取日志颜色类名
 */
const getLogColor = (type: StatusLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 钩子函数 =====

/**
 * 选择文件前的确认操作
 */
const beforeChoose = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否选择',
      title: '提示'
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      toast.show('取消选择操作')
    })
}

/**
 * 预览图片前的确认操作
 */
const beforePreview = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否预览图片',
      title: '提示'
    })
    .then(() => {
      resolve(true)
    })
    .catch(() => {
      toast.show('取消预览操作')
    })
}

/**
 * 上传前的确认操作
 */
const beforeUpload = ({ files, resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否上传',
      title: '提示'
    })
    .then(() => {
      console.log(files, 'files')
      resolve(true)
    })
    .catch(() => {
      toast.show('取消上传操作')
    })
}

/**
 * 删除文件前的确认操作
 */
const beforeRemove = ({ resolve }: any) => {
  messageBox
    .confirm({
      msg: '是否删除',
      title: '提示'
    })
    .then(() => {
      toast.success('删除成功')
      resolve(true)
    })
    .catch(() => {
      toast.show('取消删除操作')
    })
}

/**
 * 自定义上传方法
 */
const customUpload: UploadMethod = (file, formData, options) => {
  const uploadTask = uni.uploadFile({
    url: action,
    header: options.header,
    name: options.name,
    fileName: options.name,
    fileType: options.fileType,
    formData,
    filePath: file.url,
    success(res) {
      if (res.statusCode === options.statusCode) {
        try {
          // 解析响应数据
          const responseData = JSON.parse(res.data)
          if (responseData.code === 200) {
            // 修复：正确传递响应数据结构，确保类型匹配
            const uploadResult = {
              fileName: responseData.data.fileName,
              url: responseData.data.url,
              ossId: responseData.data.ossId,
              updateTime: responseData.data.updateTime,
            }
            options.onSuccess(uploadResult, file, formData)
          } else {
            const businessError = {
              errMsg: responseData.msg || '业务处理失败',
            }
            options.onError(businessError, file, formData)
          }
        } catch (parseError) {
          const jsonError = {
            errMsg: '响应数据解析失败',
          }
          options.onError(jsonError, file, formData)
        }
      } else {
        const httpError = {
          errMsg: `HTTP状态码错误: ${res.statusCode}`,
        }
        options.onError(httpError, file, formData)
      }
    },
    fail(err) {
      options.onError(err, file, formData)
    }
  })

  // 监听上传进度
  uploadTask.onProgressUpdate((res) => {
    options.onProgress(res, file)
  })

  return uploadTask
}

// ===== 文件列表变化处理函数 =====

/**
 * 基本用法文件列表变化
 */
const handleChange = ({ fileList: list }: { fileList: UploadFile[] }) => {
  fileList.value = list
}

/**
 * 视频文件列表变化
 */
const handleChange1 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList1.value = fileList
}

/**
 * 多选文件列表变化
 */
const handleChange2 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList2.value = fileList
}

/**
 * 限制数量文件列表变化
 */
const handleChange3 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList3.value = fileList
}

/**
 * 预览前确认文件列表变化
 */
const handleChange4 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList4.value = fileList
}

/**
 * 上传前确认文件列表变化
 */
const handleChange5 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList5.value = fileList
}

/**
 * 删除前确认文件列表变化
 */
const handleChange6 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList6.value = fileList
}

/**
 * 状态钩子文件列表变化
 */
const handleChange7 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList7.value = fileList
  addStatusLog('文件列表发生变化', 'info')
}

/**
 * 禁用状态文件列表变化
 */
const handleChange8 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList8.value = fileList
}

/**
 * 自定义触发器文件列表变化
 */
const handleChange9 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList9.value = fileList
}

/**
 * 选择前确认文件列表变化
 */
const handleChange10 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList10.value = fileList
}

/**
 * 媒体文件列表变化
 */
const handleChange11 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList11.value = fileList
}

/**
 * 文件类型文件列表变化
 */
const handleChange12 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList12.value = fileList
}

/**
 * 所有类型文件列表变化
 */
const handleChange13 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList13.value = fileList
}

/**
 * 手动上传文件列表变化
 */
const handleChange14 = ({ fileList }: { fileList: UploadFile[] }) => {
  fileList14.value = fileList
}

// ===== 状态钩子处理函数 =====

/**
 * 上传成功处理
 */
const handleSuccess = (event: any) => {
  console.log('上传成功', event)
  addStatusLog(`上传成功：${event.file.name || '文件'}`, 'success')
}

/**
 * 上传失败处理
 */
const handleFail = (event: any) => {
  console.log('上传失败', event)
  addStatusLog(`上传失败：${event.error.errMsg}`, 'error')
}

/**
 * 上传进度处理
 */
const handleProgess = (event: any) => {
  console.log('上传进度', event)
  addStatusLog(`上传进度：${event.response.progress}%`, 'info')
}

/**
 * 手动触发上传
 */
const startUpload = () => {
  upload14.value?.submit()
}

// ===== 页面滚动处理 =====

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop()
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 自定义预览覆盖层样式
.custom-preview-cover {
  margin-top: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #666;
}
</style>
