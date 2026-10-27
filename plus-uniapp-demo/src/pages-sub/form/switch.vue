<!-- Switch 开关 http://127.0.0.1:100/#/pages-sub/demo/wd/switch -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Switch 开关" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的开关形式，支持开启和关闭两种状态">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="普通开关" center>
          <wd-switch v-model="basicSwitch1" @change="handleBasicChange" />
        </wd-cell>

        <wd-cell title="默认开启" center>
          <wd-switch v-model="basicSwitch2" @change="handleBasicChange" />
        </wd-cell>

        <wd-cell title="禁用状态（关闭）" center>
          <wd-switch v-model="basicSwitch3" disabled />
        </wd-cell>

        <wd-cell title="禁用状态（开启）" center>
          <wd-switch v-model="basicSwitch4" disabled />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="自定义激活和非激活状态的颜色">
      <wd-cell-group>
        <wd-cell title="红色主题" center>
          <wd-switch
            v-model="colorSwitch1"
            active-color="#ff4757"
            inactive-color="#ffa502"
            @change="handleColorChange"
          />
        </wd-cell>

        <wd-cell title="绿色主题" center>
          <wd-switch
            v-model="colorSwitch2"
            active-color="#2ed573"
            inactive-color="#7bed9f"
            @change="handleColorChange"
          />
        </wd-cell>

        <wd-cell title="紫色主题" center>
          <wd-switch
            v-model="colorSwitch3"
            active-color="#5352ed"
            inactive-color="#a4b0be"
            @change="handleColorChange"
          />
        </wd-cell>

        <wd-cell title="渐变主题" center>
          <wd-switch
            v-model="colorSwitch4"
            active-color="linear-gradient(45deg, #ff6b6b, #ff8e8e)"
            inactive-color="#ddd"
            @change="handleColorChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 自定义尺寸示例 -->
    <DemoSection title="自定义尺寸" desc="通过 size 属性控制开关的大小">
      <wd-cell-group>
        <wd-cell title="迷你尺寸" center>
          <wd-switch v-model="sizeSwitch1" size="16" @change="handleSizeChange" />
        </wd-cell>

        <wd-cell title="小尺寸" center>
          <wd-switch v-model="sizeSwitch2" size="20" @change="handleSizeChange" />
        </wd-cell>

        <wd-cell title="默认尺寸" center>
          <wd-switch v-model="sizeSwitch3" @change="handleSizeChange" />
        </wd-cell>

        <wd-cell title="大尺寸" center>
          <wd-switch v-model="sizeSwitch4" size="28" @change="handleSizeChange" />
        </wd-cell>

        <wd-cell title="超大尺寸" center>
          <wd-switch v-model="sizeSwitch5" size="32" @change="handleSizeChange" />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义尺寸" :code="codes.size.template" />
        <DemoCode title="脚本 - 自定义尺寸" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 自定义激活值示例 -->
    <DemoSection title="自定义激活值" desc="自定义 true/false 以外的值">
      <view class="space-y-4">
        <wd-cell-group>
          <wd-cell title="数字值 (1/0)" :value="`当前值: ${numberSwitch}`" vertical>
            <wd-switch
              v-model="numberSwitch"
              :active-value="1"
              :inactive-value="0"
              @change="handleCustomValueChange"
            />
          </wd-cell>

          <wd-cell title="字符串值 (on/off)" :value="`当前值: ${stringSwitch}`" vertical>
            <wd-switch
              v-model="stringSwitch"
              active-value="on"
              inactive-value="off"
              @change="handleCustomValueChange"
            />
          </wd-cell>

          <wd-cell
            title="自定义字符串 (enabled/disabled)"
            :value="`当前值: ${customSwitch}`"
            vertical
          >
            <wd-switch
              v-model="customSwitch"
              active-value="enabled"
              inactive-value="disabled"
              active-color="#52c41a"
              @change="handleCustomValueChange"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 当前值展示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">当前状态</view>
          <view class="text-xs text-gray-600 space-y-1">
            <view>数字开关：{{ numberSwitch }}</view>
            <view>字符串开关：{{ stringSwitch }}</view>
            <view>自定义开关：{{ customSwitch }}</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义激活值" :code="codes.customValue.template" />
        <DemoCode title="脚本 - 自定义激活值" :code="codes.customValue.script" />
      </template>
    </DemoSection>

    <!-- 异步控制示例 -->
    <DemoSection title="异步控制" desc="通过 before-change 实现异步验证和控制">
      <wd-cell-group>
        <wd-cell title="需要确认" center>
          <wd-switch
            v-model="asyncSwitch1"
            :before-change="beforeChangeConfirm"
            @change="handleAsyncChange"
          />
        </wd-cell>

        <wd-cell title="模拟网络请求" center>
          <wd-switch
            v-model="asyncSwitch2"
            :before-change="beforeChangeAsync"
            @change="handleAsyncChange"
          />
        </wd-cell>

        <wd-cell title="随机验证" center>
          <wd-switch
            v-model="asyncSwitch3"
            :before-change="beforeChangeRandom"
            @change="handleAsyncChange"
          />
        </wd-cell>

        <wd-cell title="权限验证" center>
          <wd-switch
            v-model="asyncSwitch4"
            :before-change="beforeChangePermission"
            active-color="#f5222d"
            @change="handleAsyncChange"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 异步控制" :code="codes.async.template" />
        <DemoCode title="脚本 - 异步控制" :code="codes.async.script" />
      </template>
    </DemoSection>

    <!-- 表单应用示例 -->
    <DemoSection title="表单应用" desc="在表单中使用开关组件">
      <view class="space-y-4">
        <!-- 用户设置表单 -->
        <view class="rounded-lg bg-white p-4">
          <view class="mb-4 text-base font-medium">用户设置</view>

          <view class="space-y-4">
            <view class="flex items-center justify-between">
              <view>
                <view class="text-sm font-medium">接收推送通知</view>
                <view class="text-xs text-gray-500">允许应用发送推送消息</view>
              </view>
              <wd-switch
                v-model="formData.notifications"
                size="20"
                active-color="#52c41a"
                @change="handleFormChange"
              />
            </view>

            <view class="flex items-center justify-between">
              <view>
                <view class="text-sm font-medium">自动播放视频</view>
                <view class="text-xs text-gray-500">在Wi-Fi环境下自动播放</view>
              </view>
              <wd-switch v-model="formData.autoplay" size="20" @change="handleFormChange" />
            </view>

            <view class="flex items-center justify-between">
              <view>
                <view class="text-sm font-medium">夜间模式</view>
                <view class="text-xs text-gray-500">自动调整为深色主题</view>
              </view>
              <wd-switch
                v-model="formData.darkMode"
                size="20"
                active-color="#722ed1"
                @change="handleFormChange"
              />
            </view>

            <view class="flex items-center justify-between">
              <view>
                <view class="text-sm font-medium">数据同步</view>
                <view class="text-xs text-gray-500">与云端同步用户数据</view>
              </view>
              <wd-switch
                v-model="formData.sync"
                size="20"
                active-color="#1890ff"
                @change="handleFormChange"
              />
            </view>
          </view>
        </view>

        <!-- 协议同意 -->
        <view class="rounded-lg bg-white p-4">
          <view class="mb-4 text-base font-medium">服务协议</view>

          <view class="mb-4 flex items-start">
            <wd-switch v-model="agreementData.terms" size="20" @change="handleAgreementChange" />
            <view class="ml-3 flex-1">
              <view class="text-sm">我已阅读并同意《用户服务协议》</view>
              <view class="mt-1 text-xs text-gray-500">包含用户权益、服务条款等重要信息</view>
            </view>
          </view>

          <view class="mb-4 flex items-start">
            <wd-switch
              v-model="agreementData.privacy"
              size="20"
              active-color="#52c41a"
              @change="handleAgreementChange"
            />
            <view class="ml-3 flex-1">
              <view class="text-sm">我已阅读并同意《隐私政策》</view>
              <view class="mt-1 text-xs text-gray-500">了解我们如何收集、使用和保护您的信息</view>
            </view>
          </view>

          <wd-button
            type="primary"
            :disabled="!agreementData.terms || !agreementData.privacy"
            block
            @click="handleFormSubmit"
          >
            {{ agreementData.terms && agreementData.privacy ? '立即注册' : '请先同意所有协议' }}
          </wd-button>
        </view>

        <!-- 表单数据展示 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">表单数据</view>
          <view class="text-xs space-y-2">
            <view>
              <text class="font-medium">用户设置:</text>
              {{ JSON.stringify(formData, null, 2) }}
            </view>
            <view>
              <text class="font-medium">协议状态:</text>
              {{ JSON.stringify(agreementData, null, 2) }}
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 用户设置表单" :code="codes.form.settingsTemplate" />
        <DemoCode title="模板 - 协议同意表单" :code="codes.form.agreementTemplate" />
        <DemoCode title="脚本 - 表单应用" :code="codes.form.script" />
      </template>
    </DemoSection>

    <!-- 事件监听示例 -->
    <DemoSection title="事件监听" desc="监听开关的状态变化事件">
      <view class="space-y-4">
        <!-- 事件监听开关 -->
        <wd-cell-group>
          <wd-cell title="事件监听开关" center>
            <wd-switch v-model="eventSwitch" @change="handleEventChange" />
          </wd-cell>

          <wd-cell title="带颜色的事件开关" center>
            <wd-switch
              v-model="colorEventSwitch"
              active-color="#ff6b6b"
              inactive-color="#a0a0a0"
              @change="handleColorEventChange"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 事件日志 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm font-medium">事件日志</view>
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
        <DemoCode title="脚本 - 事件监听" :code="codes.events.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <view class="space-y-4">
        <!-- 系统设置场景 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">系统设置面板</view>
          <wd-cell-group>
            <wd-cell title="Wi-Fi" center>
              <wd-switch
                v-model="systemSettings.wifi"
                active-color="#1890ff"
                @change="handleSystemChange"
              />
            </wd-cell>

            <wd-cell title="蓝牙" center>
              <wd-switch
                v-model="systemSettings.bluetooth"
                active-color="#1890ff"
                @change="handleSystemChange"
              />
            </wd-cell>

            <wd-cell title="定位服务" center>
              <wd-switch
                v-model="systemSettings.location"
                active-color="#52c41a"
                @change="handleSystemChange"
              />
            </wd-cell>

            <wd-cell title="飞行模式" center>
              <wd-switch
                v-model="systemSettings.airplane"
                active-color="#f5222d"
                @change="handleSystemChange"
              />
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 商品上架场景 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">商品管理</view>
          <view class="space-y-3">
            <view
              v-for="product in productList"
              :key="product.id"
              class="flex items-center justify-between rounded-lg bg-white p-4"
            >
              <view class="flex-1">
                <view class="text-sm font-medium">{{ product.name }}</view>
                <view class="text-xs text-gray-500">价格: {{ product.price }}</view>
                <view class="text-xs" :class="product.status ? 'text-green-600' : 'text-gray-400'">
                  状态: {{ product.status ? '已上架' : '已下架' }}
                </view>
              </view>
              <wd-switch
                v-model="product.status"
                size="20"
                active-color="#52c41a"
                inactive-color="#d9d9d9"
                @change="(e) => handleProductStatusChange(product, e)"
              />
            </view>
          </view>
        </view>

        <!-- 权限控制场景 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">用户权限管理</view>
          <view class="rounded-lg bg-white p-4">
            <view
              v-for="permission in permissions"
              :key="permission.key"
              class="mb-4 flex items-start justify-between last:mb-0"
            >
              <view class="flex-1">
                <view class="text-sm font-medium">{{ permission.name }}</view>
                <view class="text-xs text-gray-500">{{ permission.description }}</view>
              </view>
              <wd-switch
                v-model="permission.enabled"
                size="20"
                :active-color="permission.level === 'danger' ? '#f5222d' : '#52c41a'"
                @change="(e) => handlePermissionChange(permission, e)"
              />
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 系统设置" :code="codes.scenarios.systemTemplate" />
        <DemoCode title="脚本 - 系统设置" :code="codes.scenarios.systemScript" />
        <DemoCode title="模板 - 商品管理" :code="codes.scenarios.productTemplate" />
        <DemoCode title="脚本 - 商品管理" :code="codes.scenarios.productScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { useToast } from '@/wd'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 初始化 toast
const toast = useToast()

// 基本用法状态
const basicSwitch1 = ref<boolean>(false)
const basicSwitch2 = ref<boolean>(true)
const basicSwitch3 = ref<boolean>(false)
const basicSwitch4 = ref<boolean>(true)

// 自定义颜色状态
const colorSwitch1 = ref<boolean>(false)
const colorSwitch2 = ref<boolean>(true)
const colorSwitch3 = ref<boolean>(false)
const colorSwitch4 = ref<boolean>(true)

// 自定义尺寸状态
const sizeSwitch1 = ref<boolean>(false)
const sizeSwitch2 = ref<boolean>(true)
const sizeSwitch3 = ref<boolean>(false)
const sizeSwitch4 = ref<boolean>(true)
const sizeSwitch5 = ref<boolean>(false)

// 自定义激活值状态
const numberSwitch = ref<number>(0)
const stringSwitch = ref<string>('off')
const customSwitch = ref<string>('disabled')

// 异步控制状态
const asyncSwitch1 = ref<boolean>(false)
const asyncSwitch2 = ref<boolean>(false)
const asyncSwitch3 = ref<boolean>(false)
const asyncSwitch4 = ref<boolean>(false)

// 表单应用状态
const formData = ref({
  notifications: true,
  autoplay: false,
  darkMode: false,
  sync: true,
})

const agreementData = ref({
  terms: false,
  privacy: false,
})

// 事件监听状态
const eventSwitch = ref<boolean>(false)
const colorEventSwitch = ref<boolean>(true)

// 事件日志状态
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 应用场景状态
const systemSettings = ref({
  wifi: true,
  bluetooth: false,
  location: true,
  airplane: false,
})

const productList = ref([
  { id: 1, name: '精美手办模型', price: '￥299.00', status: true },
  { id: 2, name: '卡通玩偶', price: '￥199.00', status: false },
  { id: 3, name: '限量周边', price: '￥399.00', status: true },
])

const permissions = ref([
  {
    key: 'read',
    name: '读取权限',
    description: '允许读取用户基本信息',
    enabled: true,
    level: 'normal',
  },
  {
    key: 'write',
    name: '写入权限',
    description: '允许修改用户信息',
    enabled: false,
    level: 'normal',
  },
  {
    key: 'admin',
    name: '管理员权限',
    description: '允许执行管理员操作',
    enabled: false,
    level: 'danger',
  },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-cell-group>
  <wd-cell title="普通开关" center>
    <wd-switch v-model="basicSwitch1" @change="handleBasicChange" />
  </wd-cell>

  <wd-cell title="默认开启" center>
    <wd-switch v-model="basicSwitch2" @change="handleBasicChange" />
  </wd-cell>

  <wd-cell title="禁用状态（关闭）" center>
    <wd-switch v-model="basicSwitch3" disabled />
  </wd-cell>

  <wd-cell title="禁用状态（开启）" center>
    <wd-switch v-model="basicSwitch4" disabled />
  </wd-cell>
</wd-cell-group>`,

    script: `import { useToast } from '@/wd'
import { ref } from 'vue'

const toast = useToast()

const basicSwitch1 = ref(false)
const basicSwitch2 = ref(true)
const basicSwitch3 = ref(false)
const basicSwitch4 = ref(true)

const handleBasicChange = ({ value }) => {
  console.log('开关状态变化:', value)
  toast.show(\`开关状态: \${value ? '开启' : '关闭'}\`)
}`,
  },

  // 自定义颜色代码
  color: {
    template: `<wd-cell-group>
  <!-- 红色主题 -->
  <wd-cell title="红色主题" center>
    <wd-switch
      v-model="colorSwitch1"
      active-color="#ff4757"
      inactive-color="#ffa502"
      @change="handleColorChange"
    />
  </wd-cell>

  <!-- 绿色主题 -->
  <wd-cell title="绿色主题" center>
    <wd-switch
      v-model="colorSwitch2"
      active-color="#2ed573"
      inactive-color="#7bed9f"
      @change="handleColorChange"
    />
  </wd-cell>

  <!-- 渐变主题 -->
  <wd-cell title="渐变主题" center>
    <wd-switch
      v-model="colorSwitch4"
      active-color="linear-gradient(45deg, #ff6b6b, #ff8e8e)"
      inactive-color="#ddd"
      @change="handleColorChange"
    />
  </wd-cell>
</wd-cell-group>`,

    script: `const colorSwitch1 = ref(false)
const colorSwitch2 = ref(true)
const colorSwitch3 = ref(false)
const colorSwitch4 = ref(true)

const handleColorChange = ({ value }) => {
  console.log('彩色开关变化:', value)
  toast.show(\`彩色开关: \${value ? '开启' : '关闭'}\`)
}`,
  },

  // 自定义尺寸代码
  size: {
    template: `<wd-cell-group>
  <wd-cell title="迷你尺寸" center>
    <wd-switch v-model="sizeSwitch1" size="16" />
  </wd-cell>

  <wd-cell title="小尺寸" center>
    <wd-switch v-model="sizeSwitch2" size="20" />
  </wd-cell>

  <wd-cell title="默认尺寸" center>
    <wd-switch v-model="sizeSwitch3" />
  </wd-cell>

  <wd-cell title="大尺寸" center>
    <wd-switch v-model="sizeSwitch4" size="28" />
  </wd-cell>

  <wd-cell title="超大尺寸" center>
    <wd-switch v-model="sizeSwitch5" size="32" />
  </wd-cell>
</wd-cell-group>`,

    script: `const sizeSwitch1 = ref(false)
const sizeSwitch2 = ref(true)
const sizeSwitch3 = ref(false)
const sizeSwitch4 = ref(true)
const sizeSwitch5 = ref(false)

const handleSizeChange = ({ value }) => {
  console.log('尺寸开关变化:', value)
  toast.show(\`开关尺寸: \${value ? '开启' : '关闭'}\`)
}`,
  },

  // 自定义激活值代码
  customValue: {
    template: `<wd-cell-group>
  <!-- 数字值 -->
  <wd-cell title="数字值 (1/0)" :value="\`当前值: \${numberSwitch}\`" vertical>
    <wd-switch
      v-model="numberSwitch"
      :active-value="1"
      :inactive-value="0"
      @change="handleCustomValueChange"
    />
  </wd-cell>

  <!-- 字符串值 -->
  <wd-cell title="字符串值 (on/off)" :value="\`当前值: \${stringSwitch}\`" vertical>
    <wd-switch
      v-model="stringSwitch"
      active-value="on"
      inactive-value="off"
      @change="handleCustomValueChange"
    />
  </wd-cell>

  <!-- 自定义字符串 -->
  <wd-cell title="自定义字符串" :value="\`当前值: \${customSwitch}\`" vertical>
    <wd-switch
      v-model="customSwitch"
      active-value="enabled"
      inactive-value="disabled"
      active-color="#52c41a"
      @change="handleCustomValueChange"
    />
  </wd-cell>
</wd-cell-group>`,

    script: `const numberSwitch = ref(0)
const stringSwitch = ref('off')
const customSwitch = ref('disabled')

const handleCustomValueChange = ({ value }) => {
  console.log('自定义值变化:', value)
  toast.show(\`当前值: \${value}\`)
}`,
  },

  // 异步控制代码
  async: {
    template: `<wd-cell-group>
  <wd-cell title="需要确认" center>
    <wd-switch
      v-model="asyncSwitch1"
      :before-change="beforeChangeConfirm"
      @change="handleAsyncChange"
    />
  </wd-cell>

  <wd-cell title="模拟网络请求" center>
    <wd-switch
      v-model="asyncSwitch2"
      :before-change="beforeChangeAsync"
      @change="handleAsyncChange"
    />
  </wd-cell>

  <wd-cell title="权限验证" center>
    <wd-switch
      v-model="asyncSwitch4"
      :before-change="beforeChangePermission"
      active-color="#f5222d"
      @change="handleAsyncChange"
    />
  </wd-cell>
</wd-cell-group>`,

    script: `const asyncSwitch1 = ref(false)
const asyncSwitch2 = ref(false)
const asyncSwitch4 = ref(false)

// 确认对话框前置验证
const beforeChangeConfirm = ({ value, resolve }) => {
  uni.showModal({
    title: '确认操作',
    content: \`确定要\${value ? '开启' : '关闭'}这个开关吗？\`,
    success: (res) => {
      resolve(res.confirm)
      if (!res.confirm) {
        toast.show('操作已取消')
      }
    }
  })
}

// 模拟异步请求前置验证
const beforeChangeAsync = ({ value, resolve }) => {
  toast.show('正在处理请求...')

  setTimeout(() => {
    const success = Math.random() > 0.3 // 70% 成功率
    resolve(success)

    if (success) {
      toast.show('操作成功')
    } else {
      toast.show('网络请求失败，请重试')
    }
  }, 2000)
}

// 权限验证
const beforeChangePermission = ({ value, resolve }) => {
  if (value) {
    // 开启时需要权限验证
    const hasPermission = Math.random() > 0.5
    if (hasPermission) {
      resolve(true)
      toast.show('权限验证通过')
    } else {
      resolve(false)
      toast.show('权限不足，无法开启')
    }
  } else {
    // 关闭时直接通过
    resolve(true)
  }
}

const handleAsyncChange = ({ value }) => {
  console.log('异步开关变化:', value)
  toast.show(\`异步操作完成: \${value}\`)
}`,
  },

  // 表单应用代码
  form: {
    settingsTemplate: `<!-- 用户设置表单 -->
<view class="space-y-4">
  <view class="flex items-center justify-between">
    <view>
      <view class="text-sm font-medium">接收推送通知</view>
      <view class="text-xs text-gray-500">允许应用发送推送消息</view>
    </view>
    <wd-switch
      v-model="formData.notifications"
      size="20"
      active-color="#52c41a"
      @change="handleFormChange"
    />
  </view>

  <view class="flex items-center justify-between">
    <view>
      <view class="text-sm font-medium">自动播放视频</view>
      <view class="text-xs text-gray-500">在Wi-Fi环境下自动播放</view>
    </view>
    <wd-switch
      v-model="formData.autoplay"
      size="20"
      @change="handleFormChange"
    />
  </view>

  <view class="flex items-center justify-between">
    <view>
      <view class="text-sm font-medium">夜间模式</view>
      <view class="text-xs text-gray-500">自动调整为深色主题</view>
    </view>
    <wd-switch
      v-model="formData.darkMode"
      size="20"
      active-color="#722ed1"
      @change="handleFormChange"
    />
  </view>
</view>`,

    agreementTemplate: `<!-- 协议同意表单 -->
<view class="mb-4 flex items-start">
  <wd-switch
    v-model="agreementData.terms"
    size="20"
    @change="handleAgreementChange"
  />
  <view class="ml-3 flex-1">
    <view class="text-sm">我已阅读并同意《用户服务协议》</view>
    <view class="mt-1 text-xs text-gray-500">
      包含用户权益、服务条款等重要信息
    </view>
  </view>
</view>

<view class="mb-4 flex items-start">
  <wd-switch
    v-model="agreementData.privacy"
    size="20"
    active-color="#52c41a"
    @change="handleAgreementChange"
  />
  <view class="ml-3 flex-1">
    <view class="text-sm">我已阅读并同意《隐私政策》</view>
    <view class="mt-1 text-xs text-gray-500">
      了解我们如何收集、使用和保护您的信息
    </view>
  </view>
</view>

<wd-button
  type="primary"
  :disabled="!agreementData.terms || !agreementData.privacy"
  block
  @click="handleFormSubmit"
>
  {{ (agreementData.terms && agreementData.privacy) ? '立即注册' : '请先同意所有协议' }}
</wd-button>`,

    script: `const formData = ref({
  notifications: true,
  autoplay: false,
  darkMode: false,
  sync: true
})

const agreementData = ref({
  terms: false,
  privacy: false
})

const handleFormChange = ({ value }) => {
  console.log('表单设置变化:', formData.value)
  toast.show('设置已更新')
}

const handleAgreementChange = ({ value }) => {
  console.log('协议状态变化:', agreementData.value)
}

const handleFormSubmit = () => {
  if (!agreementData.value.terms || !agreementData.value.privacy) {
    toast.show('请先同意所有协议')
    return
  }

  const submitData = {
    ...formData.value,
    ...agreementData.value
  }

  console.log('提交表单数据:', submitData)
  toast.show('注册成功')
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-cell-group>
  <wd-cell title="事件监听开关" center>
    <wd-switch
      v-model="eventSwitch"
      @change="handleEventChange"
    />
  </wd-cell>

  <wd-cell title="带颜色的事件开关" center>
    <wd-switch
      v-model="colorEventSwitch"
      active-color="#ff6b6b"
      inactive-color="#a0a0a0"
      @change="handleColorEventChange"
    />
  </wd-cell>
</wd-cell-group>`,

    script: `interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

const addEventLog = (message: string, type: EventLog['type'] = 'info') => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleEventChange = ({ value }) => {
  addEventLog(\`普通开关变化为: \${value}\`, 'success')
}

const handleColorEventChange = ({ value }) => {
  addEventLog(\`彩色开关变化为: \${value}\`, 'warning')
}

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空', 'info')
}`,
  },

  // 应用场景代码
  scenarios: {
    systemTemplate: `<!-- 系统设置面板 -->
<wd-cell-group>
  <wd-cell title="Wi-Fi" center>
    <wd-switch
      v-model="systemSettings.wifi"
      active-color="#1890ff"
      @change="handleSystemChange"
    />
  </wd-cell>

  <wd-cell title="蓝牙" center>
    <wd-switch
      v-model="systemSettings.bluetooth"
      active-color="#1890ff"
      @change="handleSystemChange"
    />
  </wd-cell>

  <wd-cell title="定位服务" center>
    <wd-switch
      v-model="systemSettings.location"
      active-color="#52c41a"
      @change="handleSystemChange"
    />
  </wd-cell>

  <wd-cell title="飞行模式" center>
    <wd-switch
      v-model="systemSettings.airplane"
      active-color="#f5222d"
      @change="handleSystemChange"
    />
  </wd-cell>
</wd-cell-group>`,

    systemScript: `const systemSettings = ref({
  wifi: true,
  bluetooth: false,
  location: true,
  airplane: false
})

const handleSystemChange = ({ value }) => {
  console.log('系统设置变化:', systemSettings.value)
  toast.show('系统设置已更新')
}`,

    productTemplate: `<!-- 商品管理 -->
<view
  v-for="product in productList"
  :key="product.id"
  class="flex items-center justify-between rounded-lg bg-white p-4"
>
  <view class="flex-1">
    <view class="text-sm font-medium">{{ product.name }}</view>
    <view class="text-xs text-gray-500">价格: {{ product.price }}</view>
    <view class="text-xs" :class="product.status ? 'text-green-600' : 'text-gray-400'">
      状态: {{ product.status ? '已上架' : '已下架' }}
    </view>
  </view>
  <wd-switch
    v-model="product.status"
    size="20"
    active-color="#52c41a"
    inactive-color="#d9d9d9"
    @change="(e) => handleProductStatusChange(product, e)"
  />
</view>`,

    productScript: `const productList = ref([
  { id: 1, name: '精美手办模型', price: '￥299.00', status: true },
  { id: 2, name: '卡通玩偶', price: '￥199.00', status: false },
  { id: 3, name: '限量周边', price: '￥399.00', status: true }
])

const handleProductStatusChange = (product, { value }) => {
  console.log(\`商品 \${product.name} 状态变更为:\`, value ? '上架' : '下架')
  toast.show(\`\${product.name} 已\${value ? '上架' : '下架'}\`)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'Boolean | String | Number',
    default: 'false',
    desc: '绑定值',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
  },
  {
    name: 'active-value',
    type: 'Boolean | String | Number',
    default: 'true',
    desc: '激活时的值',
  },
  {
    name: 'inactive-value',
    type: 'Boolean | String | Number',
    default: 'false',
    desc: '非激活时的值',
  },
  {
    name: 'active-color',
    type: 'String',
    default: '""',
    desc: '激活时的背景色',
  },
  {
    name: 'inactive-color',
    type: 'String',
    default: '""',
    desc: '非激活时的背景色',
  },
  {
    name: 'size',
    type: 'String | Number',
    default: '""',
    desc: '开关大小',
  },
  {
    name: 'before-change',
    type: 'Function',
    default: 'undefined',
    desc: '在改变前执行的函数，返回 false 可阻止改变',
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

// Methods 方法文档（Switch 组件没有对外暴露的方法）
const apiMethods: any[] = []

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '开关状态改变时触发，参数为 { value: boolean | string | number }',
  },
  {
    name: 'update:modelValue',
    desc: '绑定值更新时触发，参数为新的值',
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
 * 基本用法变化处理
 */
const handleBasicChange = ({ value }: { value: boolean | string | number }) => {
  console.log('基本开关变化:', value)
  toast.show(`开关状态: ${value ? '开启' : '关闭'}`)
}

/**
 * 颜色主题变化处理
 */
const handleColorChange = ({ value }: { value: boolean | string | number }) => {
  console.log('彩色开关变化:', value)
  toast.show(`彩色开关: ${value ? '开启' : '关闭'}`)
}

/**
 * 尺寸变化处理
 */
const handleSizeChange = ({ value }: { value: boolean | string | number }) => {
  console.log('尺寸开关变化:', value)
  toast.show(`开关尺寸: ${value ? '开启' : '关闭'}`)
}

/**
 * 自定义值变化处理
 */
const handleCustomValueChange = ({ value }: { value: boolean | string | number }) => {
  console.log('自定义值变化:', value)
  toast.show(`当前值: ${value}`)
}

/**
 * 异步变化处理
 */
const handleAsyncChange = ({ value }: { value: boolean | string | number }) => {
  console.log('异步开关变化:', value)
  toast.show(`异步操作完成: ${value}`)
}

/**
 * 确认对话框前置验证
 */
const beforeChangeConfirm = ({
  value,
  resolve,
}: {
  value: boolean | string | number
  resolve: (pass: boolean) => void
}) => {
  uni.showModal({
    title: '确认操作',
    content: `确定要${value ? '开启' : '关闭'}这个开关吗？`,
    success: (res) => {
      resolve(res.confirm)
      if (!res.confirm) {
        toast.show('操作已取消')
      }
    },
  })
}

/**
 * 模拟异步请求前置验证
 */
const beforeChangeAsync = ({
  value,
  resolve,
}: {
  value: boolean | string | number
  resolve: (pass: boolean) => void
}) => {
  toast.show('正在处理请求...')

  // 模拟网络请求
  setTimeout(() => {
    const success = Math.random() > 0.3 // 70% 成功率
    resolve(success)

    if (success) {
      toast.show('操作成功')
    } else {
      toast.show('网络请求失败，请重试')
    }
  }, 2000)
}

/**
 * 随机拒绝前置验证
 */
const beforeChangeRandom = ({
  value,
  resolve,
}: {
  value: boolean | string | number
  resolve: (pass: boolean) => void
}) => {
  const shouldPass = Math.random() > 0.5
  resolve(shouldPass)

  if (!shouldPass) {
    toast.show('操作被随机拒绝')
  }
}

/**
 * 权限验证前置处理
 */
const beforeChangePermission = ({
  value,
  resolve,
}: {
  value: boolean | string | number
  resolve: (pass: boolean) => void
}) => {
  if (value) {
    // 开启时需要权限验证
    const hasPermission = Math.random() > 0.5
    if (hasPermission) {
      resolve(true)
      toast.show('权限验证通过')
    } else {
      resolve(false)
      toast.show('权限不足，无法开启')
    }
  } else {
    // 关闭时直接通过
    resolve(true)
  }
}

/**
 * 表单设置变化处理
 */
const handleFormChange = ({ value }: { value: boolean | string | number }) => {
  console.log('表单设置变化:', formData.value)
  toast.show('设置已更新')
}

/**
 * 协议状态变化处理
 */
const handleAgreementChange = ({ value }: { value: boolean | string | number }) => {
  console.log('协议状态变化:', agreementData.value)
}

/**
 * 表单提交处理
 */
const handleFormSubmit = () => {
  if (!agreementData.value.terms || !agreementData.value.privacy) {
    toast.show('请先同意所有协议')
    return
  }

  const submitData = {
    ...formData.value,
    ...agreementData.value,
  }

  console.log('提交表单数据:', submitData)
  toast.show('注册成功')
}

/**
 * 事件监听变化处理
 */
const handleEventChange = ({ value }: { value: boolean | string | number }) => {
  addEventLog(`普通开关变化为: ${value}`, 'success')
}

/**
 * 彩色事件开关变化处理
 */
const handleColorEventChange = ({ value }: { value: boolean | string | number }) => {
  addEventLog(`彩色开关变化为: ${value}`, 'warning')
}

/**
 * 系统设置变化处理
 */
const handleSystemChange = ({ value }: { value: boolean | string | number }) => {
  console.log('系统设置变化:', systemSettings.value)
  toast.show('系统设置已更新')
}

/**
 * 商品状态变化处理
 */
const handleProductStatusChange = (
  product: any,
  { value }: { value: boolean | string | number },
) => {
  console.log(`商品 ${product.name} 状态变更为:`, value ? '上架' : '下架')
  toast.show(`${product.name} 已${value ? '上架' : '下架'}`)
}

/**
 * 权限变化处理
 */
const handlePermissionChange = (
  permission: any,
  { value }: { value: boolean | string | number },
) => {
  console.log(`权限 ${permission.name} 状态变更为:`, value ? '开启' : '关闭')

  if (permission.level === 'danger' && value) {
    toast.show(`⚠️ ${permission.name}已开启，请谨慎操作`)
  } else {
    toast.show(`${permission.name} 已${value ? '开启' : '关闭'}`)
  }
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
