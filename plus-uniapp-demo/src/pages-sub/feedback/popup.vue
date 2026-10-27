<!-- Popup 弹出层 http://127.0.0.1:100/#/pages-sub/demo/wd/popup -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Popup 弹出层" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的弹出层使用方式">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="基础弹出层" is-link @click="showBasic" />
      </wd-cell-group>

      <!-- 基础弹出层 -->
      <wd-popup v-model="basicShow" custom-style="border-radius:32rpx;" @close="handleBasicClose">
        <view class="h-64 w-80 flex items-center justify-center rounded-lg text-center">
          <view>
            <wd-icon name="check-outline" size="48" color="#00d68f" />
            <view class="mt-2 text-base font-medium">弹出层内容</view>
            <view class="mt-1 text-sm text-gray-500">这是一个基础的弹出层示例</view>
          </view>
        </view>
      </wd-popup>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础弹出层" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基础弹出层" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 弹出位置示例 -->
    <DemoSection title="弹出位置" desc="支持从上下左右中五个方向弹出">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="居中弹出" is-link @click="showCenter" />
        <wd-cell title="顶部弹出" is-link @click="showTop" />
        <wd-cell title="右侧弹出" is-link @click="showRight" />
        <wd-cell title="底部弹出" is-link @click="showBottom" />
        <wd-cell title="左侧弹出" is-link @click="showLeft" />
      </wd-cell-group>

      <!-- 位置弹出层 -->
      <wd-popup v-model="centerShow" position="center" custom-style="width: 280px; height: 200px; border-radius: 16px;" @close="handleCenterClose">
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="location" size="40" color="#4D80F0" />
            <view class="mt-2 text-base font-medium">居中弹出</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup v-model="topShow" position="top" custom-style="height: 200px;" @close="handleTopClose">
        <view class="h-full flex items-center justify-center bg-blue-50">
          <view class="text-center">
            <wd-icon name="arrow-up" size="40" color="#4D80F0" />
            <view class="mt-2 text-base text-blue-600 font-medium">从顶部弹出</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup v-model="rightShow" position="right" custom-style="width: 200px;" @close="handleRightClose">
        <view class="h-full flex items-center justify-center bg-green-50">
          <view class="text-center">
            <wd-icon name="arrow-right" size="40" color="#00d68f" />
            <view class="mt-2 text-base text-green-600 font-medium">从右侧弹出</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup v-model="bottomShow" position="bottom" custom-style="height: 200px;" @close="handleBottomClose">
        <view class="h-full flex items-center justify-center bg-orange-50">
          <view class="text-center">
            <wd-icon name="arrow-down" size="40" color="#ff7875" />
            <view class="mt-2 text-base text-orange-600 font-medium">从底部弹出</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup v-model="leftShow" position="left" custom-style="width: 200px;" @close="handleLeftClose">
        <view class="h-full flex items-center justify-center bg-purple-50">
          <view class="text-center">
            <wd-icon name="arrow-left" size="40" color="#9c27b0" />
            <view class="mt-2 text-base text-purple-600 font-medium">从左侧弹出</view>
          </view>
        </view>
      </wd-popup>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 居中弹出" :code="codes.position.centerTemplate" />
        <DemoCode title="模板 - 顶部弹出" :code="codes.position.topTemplate" />
        <DemoCode title="模板 - 右侧弹出" :code="codes.position.rightTemplate" />
        <DemoCode title="模板 - 底部弹出" :code="codes.position.bottomTemplate" />
        <DemoCode title="模板 - 左侧弹出" :code="codes.position.leftTemplate" />
        <DemoCode title="脚本 - 弹出位置" :code="codes.position.script" />
      </template>
    </DemoSection>

    <!-- 关闭配置示例 -->
    <DemoSection title="关闭配置" desc="不同的关闭方式和交互配置">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="显示关闭按钮" is-link @click="showClosable" />
        <wd-cell title="禁用遮罩点击" is-link @click="showNoModalClick" />
        <wd-cell title="禁用遮罩层" is-link @click="showNoModal" />
      </wd-cell-group>

      <!-- 关闭配置弹出层 -->
      <wd-popup v-model="closableShow" position="bottom" closable custom-style="height: 200px;" @close="handleClosableClose">
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="close-circle" size="40" color="#ff4757" />
            <view class="mt-2 text-base font-medium">带关闭按钮</view>
            <view class="mt-1 text-sm text-gray-500">点击右上角关闭按钮或遮罩关闭</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup
        v-model="noModalClickShow"
        position="bottom"
        :close-on-click-modal="false"
        closable
        custom-style="height: 200px;"
        @close="handleNoModalClickClose"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="lock" size="40" color="#ffb800" />
            <view class="mt-2 text-base font-medium">禁用遮罩点击</view>
            <view class="mt-1 text-sm text-gray-500">只能通过关闭按钮关闭</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup
        v-model="noModalShow"
        position="bottom"
        :modal="false"
        closable
        custom-style="height: 200px;"
        @close="handleNoModalClose"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="eye-off" size="40" color="#9c27b0" />
            <view class="mt-2 text-base font-medium">无遮罩层</view>
            <view class="mt-1 text-sm text-gray-500">没有遮罩背景</view>
          </view>
        </view>
      </wd-popup>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 显示关闭按钮" :code="codes.close.closableTemplate" />
        <DemoCode title="模板 - 禁用遮罩点击" :code="codes.close.noModalClickTemplate" />
        <DemoCode title="模板 - 禁用遮罩层" :code="codes.close.noModalTemplate" />
        <DemoCode title="脚本 - 关闭配置" :code="codes.close.script" />
      </template>
    </DemoSection>

    <!-- 高级配置示例 -->
    <DemoSection title="高级配置" desc="更多高级功能配置选项">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="底部安全区域" is-link @click="showSafeArea" />
        <wd-cell title="自定义动画时长" is-link @click="showCustomDuration" />
        <wd-cell title="自定义层级" is-link @click="showCustomZIndex" />
      </wd-cell-group>

      <!-- 高级配置弹出层 -->
      <wd-popup
        v-model="safeAreaShow"
        position="bottom"
        :safe-area-inset-bottom="true"
        custom-style="height: 200px;"
        @close="handleSafeAreaClose"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="mobile" size="40" color="#00d68f" />
            <view class="mt-2 text-base font-medium">底部安全区域</view>
            <view class="mt-1 text-sm text-gray-500">适配 iPhone X 等机型</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup
        v-model="customDurationShow"
        position="center"
        :duration="1000"
        custom-style="width: 280px; height: 200px; border-radius: 16px;"
        @close="handleCustomDurationClose"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="time" size="40" color="#ffb800" />
            <view class="mt-2 text-base font-medium">慢速动画</view>
            <view class="mt-1 text-sm text-gray-500">动画时长 1000ms</view>
          </view>
        </view>
      </wd-popup>

      <wd-popup
        v-model="customZIndexShow"
        position="center"
        :z-index="2000"
        custom-style="width: 280px; height: 200px; border-radius: 16px;"
        @close="handleCustomZIndexClose"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="layers" size="40" color="#9c27b0" />
            <view class="mt-2 text-base font-medium">高层级弹出层</view>
            <view class="mt-1 text-sm text-gray-500">z-index: 2000</view>
          </view>
        </view>
      </wd-popup>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 底部安全区域" :code="codes.advanced.safeAreaTemplate" />
        <DemoCode title="模板 - 自定义动画时长" :code="codes.advanced.durationTemplate" />
        <DemoCode title="模板 - 自定义层级" :code="codes.advanced.zIndexTemplate" />
        <DemoCode title="脚本 - 高级配置" :code="codes.advanced.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="在弹出层中展示各种自定义内容">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="表单内容" is-link @click="showForm" />
        <wd-cell title="列表内容" is-link @click="showList" />
        <wd-cell title="图片内容" is-link @click="showImage" />
      </wd-cell-group>

      <!-- 表单内容弹出层 -->
      <wd-popup v-model="formShow" position="bottom" closable custom-style="height: 480px;" @close="handleFormClose">
        <view class="h-full flex flex-col p-4">
          <view class="mb-4 text-lg font-medium">用户信息</view>
          <view class="space-y-4">
            <wd-input v-model="formData.name" label="姓名" placeholder="请输入姓名" />
            <wd-input v-model="formData.email" label="邮箱" placeholder="请输入邮箱" />
            <wd-textarea v-model="formData.remark" label="备注" placeholder="请输入备注信息" />
            <view class="flex justify-between gap-3 pt-4">
              <wd-button block @click="handleFormClose">取消</wd-button>
              <wd-button type="primary" block @click="handleFormSubmit">提交</wd-button>
            </view>
          </view>
        </view>
      </wd-popup>

      <!-- 列表内容弹出层 -->
      <wd-popup v-model="listShow" position="bottom" closable custom-style="height: 400px;" @close="handleListClose">
        <view class="p-4">
          <view class="mb-4 text-lg font-medium">选择城市</view>
          <view class="max-h-80 overflow-y-auto">
            <wd-cell-group>
              <wd-cell
                v-for="city in cityList"
                :key="city.id"
                :title="city.name"
                :value="city.code"
                clickable
                @click="handleCitySelect(city)"
              />
            </wd-cell-group>
          </view>
        </view>
      </wd-popup>

      <!-- 图片内容弹出层 -->
      <wd-popup v-model="imageShow" position="center" closable custom-style="width: 320px; height: 480px; border-radius: 16px;" @close="handleImageClose">
        <view class="h-full overflow-hidden rounded-2xl">
          <image
            src="https://cdn.jsdelivr.net/gh/wot-design-uni/wot-design-uni@main/src/uni_modules/wot-design-uni/static/images/img-map.jpg"
            mode="aspectFill"
            class="h-full w-full"
          />
        </view>
      </wd-popup>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 表单内容" :code="codes.content.formTemplate" />
        <DemoCode title="模板 - 列表内容" :code="codes.content.listTemplate" />
        <DemoCode title="模板 - 图片内容" :code="codes.content.imageTemplate" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.content.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听弹出层的各种生命周期事件">
      <!-- 控制按钮 -->
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="事件监听弹出层" is-link @click="showEvents" />
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

      <!-- 事件监听弹出层 -->
      <wd-popup
        v-model="eventsShow"
        position="bottom"
        closable
        custom-style="height: 200px;"
        @close="handleEventsClose"
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
        @before-leave="handleBeforeLeave"
        @leave="handleLeave"
        @after-leave="handleAfterLeave"
        @click-modal="handleClickModal"
      >
        <view class="h-full flex items-center justify-center">
          <view class="text-center">
            <wd-icon name="notification" size="40" color="#4D80F0" />
            <view class="mt-2 text-base font-medium">事件监听</view>
            <view class="mt-1 text-sm text-gray-500">查看下方事件日志</view>
          </view>
        </view>
      </wd-popup>

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

// ===== 组件状态管理 =====

// 基本用法状态
const basicShow = ref<boolean>(false)

// 弹出位置状态
const centerShow = ref<boolean>(false)
const topShow = ref<boolean>(false)
const rightShow = ref<boolean>(false)
const bottomShow = ref<boolean>(false)
const leftShow = ref<boolean>(false)

// 关闭配置状态
const closableShow = ref<boolean>(false)
const noModalClickShow = ref<boolean>(false)
const noModalShow = ref<boolean>(false)

// 高级配置状态
const safeAreaShow = ref<boolean>(false)
const customDurationShow = ref<boolean>(false)
const customZIndexShow = ref<boolean>(false)

// 自定义内容状态
const formShow = ref<boolean>(false)
const listShow = ref<boolean>(false)
const imageShow = ref<boolean>(false)

// 事件监听状态
const eventsShow = ref<boolean>(false)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 表单数据
const formData = ref({
  name: '',
  email: '',
  remark: '',
})

// 城市列表数据
const cityList = ref([
  { id: 1, name: '北京', code: 'BJ' },
  { id: 2, name: '上海', code: 'SH' },
  { id: 3, name: '广州', code: 'GZ' },
  { id: 4, name: '深圳', code: 'SZ' },
  { id: 5, name: '杭州', code: 'HZ' },
  { id: 6, name: '南京', code: 'NJ' },
  { id: 7, name: '苏州', code: 'SZ' },
  { id: 8, name: '成都', code: 'CD' },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-popup v-model="basicShow" custom-style="border-radius:32rpx;" @close="handleBasicClose">
  <view class="flex h-64 w-80 items-center justify-center rounded-lg text-center">
    <view>
      <wd-icon name="check-outline" size="48" color="#00d68f" />
      <view class="mt-2 text-base font-medium">弹出层内容</view>
      <view class="mt-1 text-sm text-gray-500">这是一个基础的弹出层示例</view>
    </view>
  </view>
</wd-popup>`,

    script: `import { ref } from 'vue'

// 基本用法状态
const basicShow = ref(false)

// 显示基础弹出层
const showBasic = () => {
  basicShow.value = true
}

// 处理基础弹出层关闭
const handleBasicClose = () => {
  basicShow.value = false
  console.log('基础弹出层已关闭')
}`,
  },

  // 弹出位置代码
  position: {
    centerTemplate: `<wd-popup
  v-model="centerShow"
  position="center"
  custom-style="width: 280px; height: 200px; border-radius: 16px;"
  @close="handleCenterClose"
>
  <view class="flex h-full items-center justify-center">
    <view class="text-center">
      <wd-icon name="location" size="40" color="#4D80F0" />
      <view class="mt-2 text-base font-medium">居中弹出</view>
    </view>
  </view>
</wd-popup>`,

    topTemplate: `<wd-popup
  v-model="topShow"
  position="top"
  custom-style="height: 200px;"
  @close="handleTopClose"
>
  <view class="flex h-full items-center justify-center bg-blue-50">
    <view class="text-center">
      <wd-icon name="arrow-up" size="40" color="#4D80F0" />
      <view class="mt-2 text-base font-medium text-blue-600">从顶部弹出</view>
    </view>
  </view>
</wd-popup>`,

    rightTemplate: `<wd-popup
  v-model="rightShow"
  position="right"
  custom-style="width: 200px;"
  @close="handleRightClose"
>
  <!-- 右侧弹出内容 -->
</wd-popup>`,

    bottomTemplate: `<wd-popup
  v-model="bottomShow"
  position="bottom"
  custom-style="height: 200px;"
  @close="handleBottomClose"
>
  <!-- 底部弹出内容 -->
</wd-popup>`,

    leftTemplate: `<wd-popup
  v-model="leftShow"
  position="left"
  custom-style="width: 200px;"
  @close="handleLeftClose"
>
  <!-- 左侧弹出内容 -->
</wd-popup>`,

    script: `// 弹出位置状态
const centerShow = ref(false)
const topShow = ref(false)
const rightShow = ref(false)
const bottomShow = ref(false)
const leftShow = ref(false)

// 显示各个位置的弹出层
const showCenter = () => { centerShow.value = true }
const showTop = () => { topShow.value = true }
const showRight = () => { rightShow.value = true }
const showBottom = () => { bottomShow.value = true }
const showLeft = () => { leftShow.value = true }`,
  },

  // 关闭配置代码
  close: {
    closableTemplate: `<wd-popup
  v-model="closableShow"
  position="bottom"
  closable
  custom-style="height: 200px;"
  @close="handleClosableClose"
>
  <view class="flex h-full items-center justify-center">
    <view class="text-center">
      <wd-icon name="close-circle" size="40" color="#ff4757" />
      <view class="mt-2 text-base font-medium">带关闭按钮</view>
      <view class="mt-1 text-sm text-gray-500">点击右上角关闭按钮或遮罩关闭</view>
    </view>
  </view>
</wd-popup>`,

    noModalClickTemplate: `<wd-popup
  v-model="noModalClickShow"
  position="bottom"
  :close-on-click-modal="false"
  closable
  custom-style="height: 200px;"
  @close="handleNoModalClickClose"
>
  <!-- 禁用遮罩点击关闭的内容 -->
</wd-popup>`,

    noModalTemplate: `<wd-popup
  v-model="noModalShow"
  position="bottom"
  :modal="false"
  closable
  custom-style="height: 200px;"
  @close="handleNoModalClose"
>
  <!-- 无遮罩层的内容 -->
</wd-popup>`,

    script: `// 关闭配置状态
const closableShow = ref(false)
const noModalClickShow = ref(false)
const noModalShow = ref(false)

// 显示关闭配置弹出层
const showClosable = () => { closableShow.value = true }
const showNoModalClick = () => { noModalClickShow.value = true }
const showNoModal = () => { noModalShow.value = true }`,
  },

  // 高级配置代码
  advanced: {
    safeAreaTemplate: `<wd-popup
  v-model="safeAreaShow"
  position="bottom"
  :safe-area-inset-bottom="true"
  custom-style="height: 200px;"
  @close="handleSafeAreaClose"
>
  <!-- 底部安全区域适配内容 -->
</wd-popup>`,

    lockScrollTemplate: `<wd-popup
  v-model="lockScrollShow"
  lock-scroll
  position="bottom"
  custom-style="height: 200px;"
  @close="handleLockScrollClose"
>
  <!-- 锁定页面滚动内容 -->
</wd-popup>`,

    durationTemplate: `<wd-popup
  v-model="customDurationShow"
  position="center"
  :duration="1000"
  custom-style="width: 280px; height: 200px; border-radius: 16px;"
  @close="handleCustomDurationClose"
>
  <!-- 自定义动画时长内容 -->
</wd-popup>`,

    zIndexTemplate: `<wd-popup
  v-model="customZIndexShow"
  position="center"
  :z-index="2000"
  custom-style="width: 280px; height: 200px; border-radius: 16px;"
  @close="handleCustomZIndexClose"
>
  <!-- 高层级弹出层内容 -->
</wd-popup>`,

    script: `// 高级配置状态
const safeAreaShow = ref(false)
const customDurationShow = ref(false)
const customZIndexShow = ref(false)

// 显示高级配置弹出层
const showSafeArea = () => { safeAreaShow.value = true }
const showCustomDuration = () => { customDurationShow.value = true }
const showCustomZIndex = () => { customZIndexShow.value = true }`,
  },

  // 自定义内容代码
  content: {
    formTemplate: `<wd-popup v-model="formShow" position="bottom" closable custom-style="height: 400px;" @close="handleFormClose">
  <view class="p-4">
    <view class="mb-4 text-lg font-medium">用户信息</view>
    <view class="space-y-4">
      <wd-input label="姓名" v-model="formData.name" placeholder="请输入姓名" />
      <wd-input label="邮箱" v-model="formData.email" placeholder="请输入邮箱" />
      <wd-textarea label="备注" v-model="formData.remark" placeholder="请输入备注信息" />
      <view class="flex justify-between gap-3 pt-4">
        <wd-button block @click="handleFormClose">取消</wd-button>
        <wd-button type="primary" block @click="handleFormSubmit">提交</wd-button>
      </view>
    </view>
  </view>
</wd-popup>`,

    listTemplate: `<wd-popup v-model="listShow" position="bottom" closable custom-style="height: 400px;" @close="handleListClose">
  <view class="p-4">
    <view class="mb-4 text-lg font-medium">选择城市</view>
    <view class="max-h-80 overflow-y-auto">
      <wd-cell-group>
        <wd-cell
          v-for="city in cityList"
          :key="city.id"
          :title="city.name"
          :value="city.code"
          clickable
          @click="handleCitySelect(city)"
        />
      </wd-cell-group>
    </view>
  </view>
</wd-popup>`,

    imageTemplate: `<wd-popup v-model="imageShow" position="center" closable custom-style="width: 320px; height: 480px; border-radius: 16px;" @close="handleImageClose">
  <view class="h-full overflow-hidden rounded-2xl">
    <image
      src="https://cdn.jsdelivr.net/gh/wot-design-uni/wot-design-uni@main/src/uni_modules/wot-design-uni/static/images/img-map.jpg"
      mode="aspectFill"
      class="h-full w-full"
    />
  </view>
</wd-popup>`,

    script: `// 自定义内容状态
const formShow = ref(false)
const listShow = ref(false)
const imageShow = ref(false)

// 表单数据
const formData = ref({
  name: '',
  email: '',
  remark: ''
})

// 城市列表数据
const cityList = ref([
  { id: 1, name: '北京', code: 'BJ' },
  { id: 2, name: '上海', code: 'SH' },
  { id: 3, name: '广州', code: 'GZ' },
  { id: 4, name: '深圳', code: 'SZ' },
  // ... 更多城市数据
])

// 显示自定义内容弹出层
const showForm = () => { formShow.value = true }
const showList = () => { listShow.value = true }
const showImage = () => { imageShow.value = true }

// 处理表单提交
const handleFormSubmit = () => {
  console.log('提交表单：', formData.value)
  handleFormClose()
}

// 处理城市选择
const handleCitySelect = (city) => {
  console.log('选择城市：', city)
  handleListClose()
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-popup
  v-model="eventsShow"
  position="bottom"
  closable
  custom-style="height: 200px;"
  @close="handleEventsClose"
  @before-enter="handleBeforeEnter"
  @enter="handleEnter"
  @after-enter="handleAfterEnter"
  @before-leave="handleBeforeLeave"
  @leave="handleLeave"
  @after-leave="handleAfterLeave"
  @click-modal="handleClickModal"
>
  <view class="flex h-full items-center justify-center">
    <view class="text-center">
      <wd-icon name="notification" size="40" color="#4D80F0" />
      <view class="mt-2 text-base font-medium">事件监听</view>
      <view class="mt-1 text-sm text-gray-500">查看下方事件日志</view>
    </view>
  </view>
</wd-popup>`,

    script: `// 事件处理方法
const handleBeforeEnter = () => {
  addEventLog('弹出层准备进入', 'info')
}

const handleEnter = () => {
  addEventLog('弹出层进入中', 'info')
}

const handleAfterEnter = () => {
  addEventLog('弹出层进入完成', 'success')
}

const handleBeforeLeave = () => {
  addEventLog('弹出层准备离开', 'info')
}

const handleLeave = () => {
  addEventLog('弹出层离开中', 'info')
}

const handleAfterLeave = () => {
  addEventLog('弹出层离开完成', 'success')
}

const handleClickModal = () => {
  addEventLog('点击了遮罩层', 'warning')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Boolean',
    default: 'false',
    desc: '弹出层是否显示',
  },
  {
    name: 'position',
    type: 'String',
    default: '"center"',
    desc: '弹出位置，可选值：center / top / right / bottom / left',
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示关闭按钮',
  },
  {
    name: 'close-on-click-modal',
    type: 'Boolean',
    default: 'true',
    desc: '点击遮罩是否关闭',
  },
  {
    name: 'modal',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示遮罩',
  },
  {
    name: 'lock-scroll',
    type: 'Boolean',
    default: 'true',
    desc: '是否锁定页面滚动',
  },
  {
    name: 'duration',
    type: 'Number | Boolean',
    default: '300',
    desc: '动画持续时间，单位毫秒',
  },
  {
    name: 'z-index',
    type: 'Number',
    default: '100',
    desc: '弹出层层级',
  },
  {
    name: 'safe-area-inset-bottom',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启底部安全区适配',
  },
  {
    name: 'hide-when-close',
    type: 'Boolean',
    default: 'true',
    desc: '关闭时是否隐藏弹出层内容',
  },
  {
    name: 'lazy-render',
    type: 'Boolean',
    default: 'true',
    desc: '是否启用懒渲染',
  },
  {
    name: 'transition',
    type: 'String',
    default: '""',
    desc: '自定义过渡动画类型',
  },
  {
    name: 'modal-style',
    type: 'String',
    default: '""',
    desc: '遮罩层自定义样式',
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

// Methods 方法文档（Popup 组件没有暴露方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'close',
    desc: '弹出层关闭时触发',
  },
  {
    name: 'click-modal',
    desc: '点击遮罩时触发',
  },
  {
    name: 'before-enter',
    desc: '进入前触发',
  },
  {
    name: 'enter',
    desc: '进入时触发',
  },
  {
    name: 'after-enter',
    desc: '进入后触发',
  },
  {
    name: 'before-leave',
    desc: '离开前触发',
  },
  {
    name: 'leave',
    desc: '离开时触发',
  },
  {
    name: 'after-leave',
    desc: '离开后触发',
  },
  {
    name: 'update:modelValue',
    desc: '显示状态更新时触发',
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
 * 显示基础弹出层
 */
const showBasic = () => {
  basicShow.value = true
  console.log('显示基础弹出层')
}

/**
 * 处理基础弹出层关闭
 */
const handleBasicClose = () => {
  basicShow.value = false
  console.log('基础弹出层已关闭')
}

// === 弹出位置相关方法 ===

/**
 * 显示居中弹出层
 */
const showCenter = () => {
  centerShow.value = true
  console.log('显示居中弹出层')
}

/**
 * 处理居中弹出层关闭
 */
const handleCenterClose = () => {
  centerShow.value = false
  console.log('居中弹出层已关闭')
}

/**
 * 显示顶部弹出层
 */
const showTop = () => {
  topShow.value = true
  console.log('显示顶部弹出层')
}

/**
 * 处理顶部弹出层关闭
 */
const handleTopClose = () => {
  topShow.value = false
  console.log('顶部弹出层已关闭')
}

/**
 * 显示右侧弹出层
 */
const showRight = () => {
  rightShow.value = true
  console.log('显示右侧弹出层')
}

/**
 * 处理右侧弹出层关闭
 */
const handleRightClose = () => {
  rightShow.value = false
  console.log('右侧弹出层已关闭')
}

/**
 * 显示底部弹出层
 */
const showBottom = () => {
  bottomShow.value = true
  console.log('显示底部弹出层')
}

/**
 * 处理底部弹出层关闭
 */
const handleBottomClose = () => {
  bottomShow.value = false
  console.log('底部弹出层已关闭')
}

/**
 * 显示左侧弹出层
 */
const showLeft = () => {
  leftShow.value = true
  console.log('显示左侧弹出层')
}

/**
 * 处理左侧弹出层关闭
 */
const handleLeftClose = () => {
  leftShow.value = false
  console.log('左侧弹出层已关闭')
}

// === 关闭配置相关方法 ===

/**
 * 显示可关闭弹出层
 */
const showClosable = () => {
  closableShow.value = true
  console.log('显示可关闭弹出层')
}

/**
 * 处理可关闭弹出层关闭
 */
const handleClosableClose = () => {
  closableShow.value = false
  console.log('可关闭弹出层已关闭')
}

/**
 * 显示禁用遮罩点击弹出层
 */
const showNoModalClick = () => {
  noModalClickShow.value = true
  console.log('显示禁用遮罩点击弹出层')
}

/**
 * 处理禁用遮罩点击弹出层关闭
 */
const handleNoModalClickClose = () => {
  noModalClickShow.value = false
  console.log('禁用遮罩点击弹出层已关闭')
}

/**
 * 显示无遮罩弹出层
 */
const showNoModal = () => {
  noModalShow.value = true
  console.log('显示无遮罩弹出层')
}

/**
 * 处理无遮罩弹出层关闭
 */
const handleNoModalClose = () => {
  noModalShow.value = false
  console.log('无遮罩弹出层已关闭')
}

// === 高级配置相关方法 ===

/**
 * 显示底部安全区域弹出层
 */
const showSafeArea = () => {
  safeAreaShow.value = true
  console.log('显示底部安全区域弹出层')
}

/**
 * 处理底部安全区域弹出层关闭
 */
const handleSafeAreaClose = () => {
  safeAreaShow.value = false
  console.log('底部安全区域弹出层已关闭')
}

/**
 * 显示自定义动画时长弹出层
 */
const showCustomDuration = () => {
  customDurationShow.value = true
  console.log('显示自定义动画时长弹出层')
}

/**
 * 处理自定义动画时长弹出层关闭
 */
const handleCustomDurationClose = () => {
  customDurationShow.value = false
  console.log('自定义动画时长弹出层已关闭')
}

/**
 * 显示自定义层级弹出层
 */
const showCustomZIndex = () => {
  customZIndexShow.value = true
  console.log('显示自定义层级弹出层')
}

/**
 * 处理自定义层级弹出层关闭
 */
const handleCustomZIndexClose = () => {
  customZIndexShow.value = false
  console.log('自定义层级弹出层已关闭')
}

// === 自定义内容相关方法 ===

/**
 * 显示表单弹出层
 */
const showForm = () => {
  formShow.value = true
  console.log('显示表单弹出层')
}

/**
 * 处理表单弹出层关闭
 */
const handleFormClose = () => {
  formShow.value = false
  console.log('表单弹出层已关闭')
}

/**
 * 处理表单提交
 */
const handleFormSubmit = () => {
  console.log('提交表单：', formData.value)
  handleFormClose()
}

/**
 * 显示列表弹出层
 */
const showList = () => {
  listShow.value = true
  console.log('显示列表弹出层')
}

/**
 * 处理列表弹出层关闭
 */
const handleListClose = () => {
  listShow.value = false
  console.log('列表弹出层已关闭')
}

/**
 * 处理城市选择
 */
const handleCitySelect = (city: any) => {
  console.log('选择城市：', city)
  handleListClose()
}

/**
 * 显示图片弹出层
 */
const showImage = () => {
  imageShow.value = true
  console.log('显示图片弹出层')
}

/**
 * 处理图片弹出层关闭
 */
const handleImageClose = () => {
  imageShow.value = false
  console.log('图片弹出层已关闭')
}

// === 事件监听相关方法 ===

/**
 * 显示事件监听弹出层
 */
const showEvents = () => {
  eventsShow.value = true
  addEventLog('显示事件监听弹出层', 'info')
}

/**
 * 处理事件监听弹出层关闭
 */
const handleEventsClose = () => {
  eventsShow.value = false
  addEventLog('事件监听弹出层已关闭', 'success')
}

/**
 * 处理进入前事件
 */
const handleBeforeEnter = () => {
  addEventLog('弹出层准备进入', 'info')
}

/**
 * 处理进入事件
 */
const handleEnter = () => {
  addEventLog('弹出层进入中', 'info')
}

/**
 * 处理进入后事件
 */
const handleAfterEnter = () => {
  addEventLog('弹出层进入完成', 'success')
}

/**
 * 处理离开前事件
 */
const handleBeforeLeave = () => {
  addEventLog('弹出层准备离开', 'info')
}

/**
 * 处理离开事件
 */
const handleLeave = () => {
  addEventLog('弹出层离开中', 'info')
}

/**
 * 处理离开后事件
 */
const handleAfterLeave = () => {
  addEventLog('弹出层离开完成', 'success')
}

/**
 * 处理点击遮罩事件
 */
const handleClickModal = () => {
  addEventLog('点击了遮罩层', 'warning')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
