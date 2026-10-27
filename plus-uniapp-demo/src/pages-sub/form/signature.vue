<!-- Signature 签名板 http://127.0.0.1:100/#/pages-sub/demo/wd/signature -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Signature 签名板" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的签名功能，支持触摸绘制和结果预览">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础签名板" vertical>
          <wd-signature
            :export-scale="2"
            background-color="#ffffff"
            @confirm="handleBasicConfirm"
            @clear="handleBasicClear"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础签名板" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 历史记录示例 -->
    <DemoSection title="历史记录" desc="支持撤销和恢复操作的签名板">
      <wd-cell-group>
        <wd-cell title="带历史记录" vertical>
          <wd-signature enable-history background-color="#f5f5f5" @confirm="handleHistoryConfirm" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 历史记录" :code="codes.history.template" />
        <DemoCode title="脚本 - 历史记录" :code="codes.history.script" />
      </template>
    </DemoSection>

    <!-- 笔锋效果示例 -->
    <DemoSection title="笔锋效果" desc="根据书写速度自动调节线条粗细，模拟真实笔触">
      <view class="space-y-4">
        <!-- 基础笔锋 -->
        <wd-cell-group>
          <wd-cell title="基础笔锋模式" vertical>
            <wd-signature pressure :height="300" background-color="#f5f5f5" @confirm="handlePressureConfirm" />
          </wd-cell>
        </wd-cell-group>

        <!-- 自定义笔锋参数 -->
        <wd-cell-group>
          <wd-cell title="自定义笔锋参数" vertical>
            <wd-signature
              pressure
              :height="300"
              :min-width="1"
              :max-width="6"
              :min-speed="1.5"
              background-color="#f5f5f5"
              @confirm="handleCustomPressureConfirm"
            />
            <view class="mt-2 text-center text-xs text-gray-500">
              快速书写产生细线条，慢速书写产生粗线条
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 笔锋 + 历史记录 -->
        <wd-cell-group>
          <wd-cell title="笔锋 + 历史记录" vertical>
            <wd-signature
              pressure
              enable-history
              :height="300"
              :min-width="1"
              :max-width="6"
              background-color="#f5f5f5"
              @confirm="handlePressureHistoryConfirm"
            />
            <view class="mt-2 text-center text-xs text-gray-500">
              结合历史记录，支持笔锋效果的撤销与恢复
            </view>
          </wd-cell>
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 基础笔锋" :code="codes.pressure.basicTemplate" />
        <DemoCode title="模板 - 自定义笔锋参数" :code="codes.pressure.customTemplate" />
        <DemoCode title="模板 - 笔锋历史记录" :code="codes.pressure.historyTemplate" />
        <DemoCode title="脚本 - 笔锋效果" :code="codes.pressure.script" />
      </template>
    </DemoSection>

    <!-- 自定义配置示例 -->
    <DemoSection title="自定义配置" desc="自定义画笔颜色、线宽和按钮文案">
      <view class="space-y-4">
        <!-- 自定义画笔样式 -->
        <wd-cell-group>
          <wd-cell title="自定义画笔颜色和线宽" vertical>
            <wd-signature
              pen-color="#0083ff"
              :line-width="4"
              background-color="#ffffff"
              @confirm="handleCustomStyleConfirm"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 自定义按钮 -->
        <wd-cell-group>
          <wd-cell title="自定义按钮和交互" vertical>
            <wd-signature
              :disabled="customDisabled"
              enable-history
              :step="3"
              @confirm="handleCustomButtonConfirm"
            >
              <template #footer="{ clear, confirm, currentStep, restore, revoke, historyList }">
                <!-- 开始签名按钮 -->
                <wd-button
                  v-if="customDisabled"
                  block
                  @click="handleStartSign"
                >
                  开始签名
                </wd-button>

                <!-- 操作按钮组 -->
                <view v-if="!customDisabled" class="flex flex-wrap gap-2">
                  <wd-button
                    size="small"
                    plain
                    :disabled="currentStep <= 0"
                    @click="revoke"
                  >
                    撤回
                  </wd-button>
                  <wd-button
                    size="small"
                    plain
                    :disabled="currentStep >= historyList.length"
                    @click="restore"
                  >
                    恢复
                  </wd-button>
                  <wd-button size="small" plain @click="clear">
                    清除
                  </wd-button>
                  <wd-button size="small" @click="confirm">
                    确定
                  </wd-button>
                </view>
              </template>
            </wd-signature>
          </wd-cell>
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义画笔样式" :code="codes.custom.styleTemplate" />
        <DemoCode title="模板 - 自定义按钮" :code="codes.custom.buttonTemplate" />
        <DemoCode title="脚本 - 自定义配置" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 弹窗使用示例 -->
    <DemoSection title="弹窗使用" desc="在弹窗中使用签名板，适合表单填写场景">
      <view class="space-y-4">
        <!-- 普通弹窗签名 -->
        <wd-cell-group>
          <wd-cell title="弹窗签名" center>
            <wd-button type="primary" @click="handleShowPopup">
              打开签名板
            </wd-button>
          </wd-cell>
        </wd-cell-group>

        <!-- 横屏签名 -->
        <wd-cell-group>
          <wd-cell title="横屏签名" center>
            <wd-button type="primary" @click="handleShowLandscape">
              使用横屏签名
            </wd-button>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 签名弹窗 -->
      <wd-popup
        v-model="showPopup"
        closable
        safe-area-inset-bottom
        position="bottom"
        custom-style="padding: 48px 20px 20px 20px; border-radius: 16px 16px 0 0;"
        @after-enter="handlePopupAfterEnter"
      >
        <wd-signature
          ref="popupSignatureRef"
          :height="300"
          enable-history
          pressure
          background-color="#f5f5f5"
          @confirm="handlePopupConfirm"
        />
      </wd-popup>

      <!-- 横屏签名弹窗 -->
      <wd-popup
        v-model="showLandscape"
        position="center"
        custom-style="width: 100vw; height: 100vh; border-radius: 0;"
        @after-enter="handleLandscapeAfterEnter"
      >
        <view class="landscape-container">
          <wd-signature
            v-if="landscapeInited"
            ref="landscapeSignatureRef"
            :height="landscapeHeight"
            :width="landscapeWidth"
            enable-history
            pressure
            background-color="#f5f5f5"
            @confirm="handleLandscapeConfirm"
          >
            <template #footer="{ clear, confirm, restore, revoke, canUndo, canRedo }">
              <view class="landscape-actions">
                <view class="button-group">
                  <wd-button size="small" plain :disabled="!canUndo" @click="revoke">
                    撤回
                  </wd-button>
                  <wd-button size="small" plain :disabled="!canRedo" @click="restore">
                    恢复
                  </wd-button>
                  <wd-button size="small" plain @click="clear">
                    清除
                  </wd-button>
                  <wd-button size="small" type="primary" @click="confirm">
                    完成
                  </wd-button>
                </view>
              </view>
            </template>
          </wd-signature>

          <!-- 关闭按钮 -->
          <view class="close-btn" @click="handleCloseLandscape">
            <wd-icon name="close" size="24px" />
          </view>
        </view>
      </wd-popup>

      <template #codes>
        <DemoCode title="模板 - 弹窗签名" :code="codes.popup.popupTemplate" />
        <DemoCode title="模板 - 横屏签名" :code="codes.popup.landscapeTemplate" />
        <DemoCode title="脚本 - 弹窗使用" :code="codes.popup.script" />
        <DemoCode title="样式 - 横屏布局" :code="codes.popup.style" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听签名过程中的各种事件">
      <!-- 事件监听区域 -->
      <view class="space-y-4">
        <!-- 签名板 -->
        <wd-cell-group>
          <wd-cell title="事件监听签名板" vertical>
            <wd-signature
              :height="300"
              background-color="#f5f5f5"
              enable-history
              @start="handleEventStart"
              @signing="handleEventSigning"
              @end="handleEventEnd"
              @confirm="handleEventConfirm"
              @clear="handleEventClear"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 事件日志显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">事件日志</view>
          <view class="h-32 overflow-y-auto border rounded bg-white p-2">
            <view
              v-for="(log, index) in eventLogs"
              :key="index"
              class="mb-1 text-xs"
              :class="getLogColor(log.type)"
            >
              <text class="text-gray-400">[{{ log.time }}]</text>
              {{ log.message }}
            </view>
            <view v-if="eventLogs.length === 0" class="py-4 text-center text-gray-400">
              暂无事件日志
            </view>
          </view>
          <view class="mt-2">
            <wd-button size="small" @click="clearEventLogs">清空日志</wd-button>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 事件监听" :code="codes.events.template" />
        <DemoCode title="脚本 - 事件处理" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { pause } from '@/wd/components/common/util'
import type { SignatureInstance, SignatureResult } from '@/wd/components/wd-signature/wd-signature.vue'

// ===== 组件状态管理 =====

// 自定义按钮状态
const customDisabled = ref<boolean>(true)

// 弹窗状态
const showPopup = ref<boolean>(false)
const popupSignatureRef = ref<SignatureInstance>()

// 横屏签名状态
const showLandscape = ref<boolean>(false)
const landscapeSignatureRef = ref<SignatureInstance>()
const landscapeHeight = ref<number>(0)
const landscapeWidth = ref<number>(0)
const landscapeInited = ref<boolean>(false)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-signature
  :export-scale="2"
  background-color="#ffffff"
  @confirm="handleBasicConfirm"
  @clear="handleBasicClear"
/>`,

    script: `import type { SignatureResult } from '@/wd/components/wd-signature/wd-signature.vue'

// 基础签名确认处理
const handleBasicConfirm = (result: SignatureResult) => {
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

// 基础签名清除处理
const handleBasicClear = () => {
  console.log('签名已清除')
}`,
  },

  // 历史记录代码
  history: {
    template: `<wd-signature
  enable-history
  background-color="#f5f5f5"
  @confirm="handleHistoryConfirm"
/>`,

    script: `// 历史记录签名确认处理
const handleHistoryConfirm = (result: SignatureResult) => {
  if (result.success) {
    console.log('历史记录签名完成：', result.tempFilePath)
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}`,
  },

  // 笔锋效果代码
  pressure: {
    basicTemplate: `<wd-signature
  pressure
  :height="300"
  @confirm="handlePressureConfirm"
/>`,

    customTemplate: `<wd-signature
  pressure
  :height="300"
  :min-width="1"
  :max-width="6"
  :min-speed="1.5"
  background-color="#f5f5f5"
  @confirm="handleCustomPressureConfirm"
/>`,

    historyTemplate: `<wd-signature
  pressure
  enable-history
  :height="300"
  :min-width="1"
  :max-width="6"
  background-color="#f5f5f5"
  @confirm="handlePressureHistoryConfirm"
/>`,

    script: `// 笔锋效果配置
const pressureConfig = {
  minWidth: 1,      // 最小线宽
  maxWidth: 6,      // 最大线宽
  minSpeed: 1.5     // 最小速度阈值
}

// 基础笔锋确认处理
const handlePressureConfirm = (result: SignatureResult) => {
  console.log('笔锋签名完成')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 自定义笔锋确认处理
const handleCustomPressureConfirm = (result: SignatureResult) => {
  console.log('自定义笔锋签名完成')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 笔锋历史记录确认处理
const handlePressureHistoryConfirm = (result: SignatureResult) => {
  console.log('笔锋历史记录签名完成')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}`,
  },

  // 自定义配置代码
  custom: {
    styleTemplate: `<wd-signature
  pen-color="#0083ff"
  :line-width="4"
  background-color="#ffffff"
  @confirm="handleCustomStyleConfirm"
/>`,

    buttonTemplate: `<wd-signature
  :disabled="customDisabled"
  enable-history
  :step="3"
  @confirm="handleCustomButtonConfirm"
>
  <template #footer="{ clear, confirm, currentStep, restore, revoke, historyList }">
    <!-- 开始签名按钮 -->
    <wd-button
      v-if="customDisabled"
      block
      @click="handleStartSign"
    >
      开始签名
    </wd-button>

    <!-- 操作按钮组 -->
    <view v-if="!customDisabled" class="flex flex-wrap gap-2">
      <wd-button
        size="small"
        plain
        :disabled="currentStep <= 0"
        @click="revoke"
      >
        撤回
      </wd-button>
      <wd-button
        size="small"
        plain
        :disabled="currentStep >= historyList.length"
        @click="restore"
      >
        恢复
      </wd-button>
      <wd-button size="small" plain @click="clear">
        清除
      </wd-button>
      <wd-button size="small" @click="confirm">
        确定
      </wd-button>
    </view>
  </template>
</wd-signature>`,

    script: `import { ref } from 'vue'

// 自定义按钮状态
const customDisabled = ref(true)

// 自定义样式确认处理
const handleCustomStyleConfirm = (result: SignatureResult) => {
  console.log('自定义样式签名完成')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 自定义按钮确认处理
const handleCustomButtonConfirm = (result: SignatureResult) => {
  console.log('自定义按钮签名完成')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 开始自定义签名
const handleStartSign = () => {
  customDisabled.value = false
  console.log('开始签名')
}`,
  },

  // 弹窗使用代码
  popup: {
    popupTemplate: `<template>
  <!-- 弹窗触发按钮 -->
  <wd-button type="primary" @click="handleShowPopup">
    打开签名板
  </wd-button>

  <!-- 签名弹窗 -->
  <wd-popup
    v-model="showPopup"
    closable
    safe-area-inset-bottom
    position="bottom"
    custom-style="padding: 48px 20px 20px 20px; border-radius: 16px 16px 0 0;"
    @after-enter="handlePopupAfterEnter"
  >
    <wd-signature
      ref="popupSignatureRef"
      :height="300"
      enable-history
      pressure
      background-color="#f5f5f5"
      @confirm="handlePopupConfirm"
    />
  </wd-popup>
</template>`,

    landscapeTemplate: `<template>
  <!-- 横屏签名弹窗 -->
  <wd-popup
    v-model="showLandscape"
    position="center"
    custom-style="width: 100vw; height: 100vh; border-radius: 0;"
    @after-enter="handleLandscapeAfterEnter"
  >
    <view class="landscape-container">
      <wd-signature
        v-if="landscapeInited"
        ref="landscapeSignatureRef"
        :height="landscapeHeight"
        :width="landscapeWidth"
        enable-history
        pressure
        background-color="#f5f5f5"
        @confirm="handleLandscapeConfirm"
      >
        <template #footer="{ clear, confirm, restore, revoke, canUndo, canRedo }">
          <view class="landscape-actions">
            <view class="button-group">
              <wd-button size="small" plain :disabled="!canUndo" @click="revoke">
                撤回
              </wd-button>
              <wd-button size="small" plain :disabled="!canRedo" @click="restore">
                恢复
              </wd-button>
              <wd-button size="small" plain @click="clear">
                清除
              </wd-button>
              <wd-button size="small" type="primary" @click="confirm">
                完成
              </wd-button>
            </view>
          </view>
        </template>
      </wd-signature>

      <!-- 关闭按钮 -->
      <view class="close-btn" @click="handleCloseLandscape">
        <wd-icon name="close" size="24px" />
      </view>
    </view>
  </wd-popup>
</template>`,

    script: `import { ref } from 'vue'
import { pause } from '@/wd/components/common/util'
import type { SignatureInstance, SignatureResult } from '@/wd/components/wd-signature/wd-signature.vue'

// 弹窗状态
const showPopup = ref(false)
const popupSignatureRef = ref<SignatureInstance>()

// 横屏签名状态
const showLandscape = ref(false)
const landscapeSignatureRef = ref<SignatureInstance>()
const landscapeHeight = ref(0)
const landscapeWidth = ref(0)
const landscapeInited = ref(false)

// 显示弹窗签名
const handleShowPopup = () => {
  showPopup.value = true
}

// 弹窗打开后初始化签名板
const handlePopupAfterEnter = () => {
  popupSignatureRef.value?.init()
}

// 弹窗签名确认处理
const handlePopupConfirm = (result: SignatureResult) => {
  showPopup.value = false
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 显示横屏签名
const handleShowLandscape = () => {
  showLandscape.value = true
}

// 横屏签名打开后初始化
const handleLandscapeAfterEnter = async () => {
  const { windowWidth, windowHeight } = uni.getSystemInfoSync()

  // 设置横屏尺寸，预留按钮空间
  landscapeWidth.value = windowWidth - 48
  landscapeHeight.value = windowHeight - 48

  // 延迟初始化确保DOM渲染完成
  await pause(100)
  landscapeInited.value = true
}

// 横屏签名确认处理
const handleLandscapeConfirm = (result: SignatureResult) => {
  showLandscape.value = false
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

// 关闭横屏签名
const handleCloseLandscape = () => {
  showLandscape.value = false
  landscapeInited.value = false
}`,

    style: `<style lang="scss" scoped>
// 横屏签名容器
.landscape-container {
  height: 100vh;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  padding: 24px 0;
  padding-left: 48px;

  // 操作按钮区域
  .landscape-actions {
    position: fixed;
    left: 0;
    top: 50%;
    width: 48px;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    z-index: 10;

    .button-group {
      display: flex;
      flex-direction: row;
      gap: 12px;
      white-space: nowrap;
      width: max-content;
      transform: translateX(-50%);
    }
  }

  // 关闭按钮
  .close-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 20;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

// H5 端适配
// #ifdef H5
.landscape-container {
  height: calc(100vh - 44px);
}
// #endif
</style>`,
  },

  // 事件监听代码
  events: {
    template: `<wd-signature
  :height="300"
  background-color="#f5f5f5"
  enable-history
  @start="handleEventStart"
  @signing="handleEventSigning"
  @end="handleEventEnd"
  @confirm="handleEventConfirm"
  @clear="handleEventClear"
/>`,

    script: `// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 添加事件日志
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

// 清空事件日志
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}

// 获取日志颜色类名
const getLogColor = (type: EventLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// 事件处理方法
const handleEventStart = (event: any) => {
  addEventLog('开始绘制签名', 'info')
}

const handleEventSigning = (event: any) => {
  addEventLog('正在绘制签名', 'info')
}

const handleEventEnd = (event: TouchEvent) => {
  addEventLog('结束绘制签名', 'success')
}

const handleEventConfirm = (result: SignatureResult) => {
  addEventLog(\`签名确认完成，成功：\${result.success}\`, 'success')
  if (result.success) {
    uni.previewImage({ urls: [result.tempFilePath] })
  }
}

const handleEventClear = () => {
  addEventLog('签名已清除', 'warning')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'pen-color',
    type: 'String',
    default: '"#000"',
    desc: '签名笔颜色',
  },
  {
    name: 'line-width',
    type: 'Number',
    default: '3',
    desc: '签名笔宽度',
  },
  {
    name: 'height',
    type: 'String | Number',
    default: '200',
    desc: '画布的高度',
  },
  {
    name: 'width',
    type: 'String | Number',
    default: '100%',
    desc: '画布的宽度',
  },
  {
    name: 'background-color',
    type: 'String',
    default: '""',
    desc: '画板的背景色',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用签名板',
  },
  {
    name: 'disable-scroll',
    type: 'Boolean',
    default: 'true',
    desc: '是否禁用画布滚动',
  },
  {
    name: 'enable-history',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启历史记录功能',
  },
  {
    name: 'step',
    type: 'Number',
    default: '1',
    desc: '撤回和恢复的步长',
  },
  {
    name: 'pressure',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用压感模式(笔锋效果)',
  },
  {
    name: 'min-width',
    type: 'Number',
    default: '2',
    desc: '压感模式下笔画最小宽度',
  },
  {
    name: 'max-width',
    type: 'Number',
    default: '6',
    desc: '压感模式下笔画最大宽度',
  },
  {
    name: 'min-speed',
    type: 'Number',
    default: '1.5',
    desc: '最小速度阈值，影响压感模式下的笔画宽度变化',
  },
  {
    name: 'file-type',
    type: 'String',
    default: '"png"',
    desc: '导出图片的文件类型，可选值：png / jpg',
  },
  {
    name: 'quality',
    type: 'Number',
    default: '1',
    desc: '导出图片的质量，范围 0-1',
  },
  {
    name: 'export-scale',
    type: 'Number',
    default: '1',
    desc: '导出图片的缩放比例',
  },
  {
    name: 'clear-text',
    type: 'String',
    default: '"清空"',
    desc: '清空按钮的文本',
  },
  {
    name: 'revoke-text',
    type: 'String',
    default: '"撤回"',
    desc: '撤回按钮的文本',
  },
  {
    name: 'restore-text',
    type: 'String',
    default: '"恢复"',
    desc: '恢复按钮的文本',
  },
  {
    name: 'confirm-text',
    type: 'String',
    default: '"确认"',
    desc: '确认按钮的文本',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'init(forceUpdate?)',
    desc: '初始化签名板，forceUpdate 为是否强制更新',
  },
  {
    name: 'clear()',
    desc: '清空签名内容',
  },
  {
    name: 'confirm()',
    desc: '确认签名，触发 confirm 事件',
  },
  {
    name: 'revoke()',
    desc: '撤回上一步操作（需要开启历史记录）',
  },
  {
    name: 'restore()',
    desc: '恢复下一步操作（需要开启历史记录）',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'start',
    desc: '开始绘制时触发，参数为触摸事件对象',
  },
  {
    name: 'signing',
    desc: '绘制过程中触发，参数为触摸事件对象',
  },
  {
    name: 'end',
    desc: '结束绘制时触发，参数为触摸事件对象',
  },
  {
    name: 'confirm',
    desc: '确认签名时触发，参数为 SignatureResult 对象',
  },
  {
    name: 'clear',
    desc: '清空签名时触发',
  },
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

/**
 * 清空事件日志
 */
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}

/**
 * 获取日志颜色类名
 */
const getLogColor = (type: EventLog['type']) => {
  const colors = {
    info: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }
  return colors[type]
}

// ===== 事件处理方法 =====

/**
 * 基础签名确认处理
 */
const handleBasicConfirm = (result: SignatureResult) => {
  console.log('基础签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 基础签名清除处理
 */
const handleBasicClear = () => {
  console.log('基础签名已清除')
}

/**
 * 历史记录签名确认处理
 */
const handleHistoryConfirm = (result: SignatureResult) => {
  console.log('历史记录签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 基础笔锋确认处理
 */
const handlePressureConfirm = (result: SignatureResult) => {
  console.log('基础笔锋签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 自定义笔锋确认处理
 */
const handleCustomPressureConfirm = (result: SignatureResult) => {
  console.log('自定义笔锋签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 笔锋历史记录确认处理
 */
const handlePressureHistoryConfirm = (result: SignatureResult) => {
  console.log('笔锋历史记录签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 自定义样式确认处理
 */
const handleCustomStyleConfirm = (result: SignatureResult) => {
  console.log('自定义样式签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 自定义按钮确认处理
 */
const handleCustomButtonConfirm = (result: SignatureResult) => {
  console.log('自定义按钮签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 开始自定义签名
 */
const handleStartSign = () => {
  customDisabled.value = false
  console.log('开始自定义签名')
}

/**
 * 显示弹窗签名
 */
const handleShowPopup = () => {
  showPopup.value = true
  console.log('显示弹窗签名')
}

/**
 * 弹窗打开后初始化签名板
 */
const handlePopupAfterEnter = () => {
  popupSignatureRef.value?.init()
  console.log('弹窗签名板初始化完成')
}

/**
 * 弹窗签名确认处理
 */
const handlePopupConfirm = (result: SignatureResult) => {
  showPopup.value = false
  console.log('弹窗签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 显示横屏签名
 */
const handleShowLandscape = () => {
  showLandscape.value = true
  console.log('显示横屏签名')
}

/**
 * 横屏签名打开后初始化
 */
const handleLandscapeAfterEnter = async () => {
  const { windowWidth, windowHeight } = uni.getSystemInfoSync()

  // 设置横屏尺寸，预留按钮空间
  landscapeWidth.value = windowWidth - 48
  landscapeHeight.value = windowHeight - 48

  console.log(`横屏签名尺寸：${landscapeWidth.value} x ${landscapeHeight.value}`)

  // 延迟初始化确保DOM渲染完成
  await pause(100)
  landscapeInited.value = true
}

/**
 * 横屏签名确认处理
 */
const handleLandscapeConfirm = (result: SignatureResult) => {
  showLandscape.value = false
  console.log('横屏签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 关闭横屏签名
 */
const handleCloseLandscape = () => {
  showLandscape.value = false
  landscapeInited.value = false
  console.log('关闭横屏签名')
}

// === 事件监听处理方法 ===

/**
 * 开始绘制事件
 */
const handleEventStart = (event: any) => {
  addEventLog('开始绘制签名', 'info')
  console.log('开始绘制签名：', event)
}

/**
 * 绘制中事件
 */
const handleEventSigning = (event: any) => {
  addEventLog('正在绘制签名', 'info')
}

/**
 * 结束绘制事件
 */
const handleEventEnd = (event: TouchEvent) => {
  addEventLog('结束绘制签名', 'success')
  console.log('结束绘制签名：', event)
}

/**
 * 事件确认处理
 */
const handleEventConfirm = (result: SignatureResult) => {
  addEventLog(`签名确认完成，成功：${result.success}`, 'success')
  console.log('事件签名确认：', result)
  if (result.success) {
    uni.previewImage({
      urls: [result.tempFilePath]
    })
  }
}

/**
 * 事件清除处理
 */
const handleEventClear = () => {
  addEventLog('签名已清除', 'warning')
  console.log('事件签名已清除')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 横屏签名容器
.landscape-container {
  height: 100vh;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  padding: 24px 0;
  padding-left: 48px;

  // 操作按钮区域
  .landscape-actions {
    position: fixed;
    left: 0;
    top: 50%;
    width: 48px;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    z-index: 10;

    .button-group {
      display: flex;
      flex-direction: row;
      gap: 12px;
      white-space: nowrap;
      width: max-content;
      transform: translateX(-50%);
    }
  }

  // 关闭按钮
  .close-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 20;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

// H5 端适配
// #ifdef H5
.landscape-container {
  height: calc(100vh - 44px);
}
// #endif

// 微信小程序横屏适配
// #ifdef MP-WEIXIN
.landscape-container {
  padding: 0;
  display: flex;
  flex-direction: column;

  .landscape-actions {
    position: static;
    transform: none;
    width: 100%;
    padding: 12px;

    .button-group {
      transform: none;
      justify-content: center;
    }
  }
}
// #endif
</style>
