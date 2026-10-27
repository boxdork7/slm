<!-- SwipeAction 滑动操作 http://127.0.0.1:100/#/pages-sub/demo/wd/swipe-action -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="SwipeAction 滑动操作" show-back />
    <wd-toast />

    <view @click.stop="closeOutside">
      <!-- 基本用法示例 -->
      <DemoSection title="基本用法" desc="最简单的滑动操作形式，右滑显示操作按钮">
        <!-- 示例效果展示 -->
        <wd-cell-group>
          <wd-swipe-action>
            <wd-cell title="右滑查看操作" value="向左滑动试试" />
            <template #right>
              <view class="action">
                <view class="button bg-blue-500" @click="handleBasicAction('查看')">
                  <wd-text text="查看" />
                </view>
                <view class="button bg-orange-500" @click="handleBasicAction('编辑')">
                  <wd-text text="编辑" />
                </view>
                <view class="button bg-red-500" @click="handleBasicAction('删除')">
                  <wd-text text="删除" />
                </view>
              </view>
            </template>
          </wd-swipe-action>

          <wd-swipe-action>
            <wd-cell title="另一个示例" value="同样支持滑动" />
            <template #right>
              <view class="action">
                <view class="button bg-green-500" @click="handleBasicAction('收藏')">
                  <wd-text text="收藏" />
                </view>
                <view class="button bg-red-500" @click="handleBasicAction('删除')">
                  <wd-text text="删除" />
                </view>
              </view>
            </template>
          </wd-swipe-action>
        </wd-cell-group>

        <!-- 代码展示 -->
        <template #codes>
          <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
          <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
          <DemoCode title="样式 - 操作按钮" :code="codes.basic.style" />
        </template>
      </DemoSection>

      <!-- 左右滑动示例 -->
      <DemoSection title="左右滑动" desc="支持同时设置左侧和右侧的操作按钮">
        <wd-cell-group>
          <wd-swipe-action>
            <!-- 左侧操作按钮 -->
            <template #left>
              <view class="action">
                <view class="button bg-blue-500" @click="handleLeftAction('标记')">
                  <wd-text text="标记" />
                </view>
                <view class="button bg-green-500" @click="handleLeftAction('置顶')">
                  <wd-text text="置顶" />
                </view>
              </view>
            </template>

            <wd-cell title="左右都能滑动" value="试试向左或向右滑动" />

            <!-- 右侧操作按钮 -->
            <template #right>
              <view class="action">
                <view class="button bg-orange-500" @click="handleRightAction('编辑')">
                  <wd-text text="编辑" />
                </view>
                <view class="button bg-red-500" @click="handleRightAction('删除')">
                  <wd-text text="删除" />
                </view>
              </view>
            </template>
          </wd-swipe-action>

          <wd-swipe-action>
            <template #left>
              <view class="action">
                <view class="button bg-purple-500" @click="handleLeftAction('分享')">
                  <wd-text text="分享" />
                </view>
              </view>
            </template>

            <wd-cell title="消息通知" value="新消息提醒" />

            <template #right>
              <view class="action">
                <view class="button bg-gray-500" @click="handleRightAction('忽略')">
                  <wd-text text="忽略" />
                </view>
                <view class="button bg-red-500" @click="handleRightAction('删除')">
                  <wd-text text="删除" />
                </view>
              </view>
            </template>
          </wd-swipe-action>
        </wd-cell-group>

        <template #codes>
          <DemoCode title="模板 - 左右滑动" :code="codes.bidirectional.template" />
          <DemoCode title="脚本 - 左右滑动" :code="codes.bidirectional.script" />
        </template>
      </DemoSection>

      <!-- 状态控制示例 -->
      <DemoSection title="状态控制" desc="通过 v-model 控制滑动状态，支持编程式控制">
        <view class="space-y-4">
          <!-- 可控制的滑动项 -->
          <wd-cell-group>
            <wd-swipe-action v-model="controlledState" :before-close="handleBeforeClose">
              <template #left>
                <view class="action">
                  <view class="button bg-blue-500" @click="handleControlledAction('左操作1')">
                    <wd-text text="左操作1" />
                  </view>
                  <view class="button bg-green-500" @click="handleControlledAction('左操作2')">
                    <wd-text text="左操作2" />
                  </view>
                </view>
              </template>

              <wd-cell title="可编程控制" :value="`当前状态: ${controlledState}`" />

              <template #right>
                <view class="action">
                  <view class="button bg-orange-500" @click="handleControlledAction('右操作1')">
                    <wd-text text="右操作1" />
                  </view>
                  <view class="button bg-red-500" @click="handleControlledAction('右操作2')">
                    <wd-text text="右操作2" />
                  </view>
                </view>
              </template>
            </wd-swipe-action>
          </wd-cell-group>

          <!-- 控制按钮组 -->
          <view class="mx-4 rounded-xl bg-white p-4">
            <view class="mb-3 text-sm text-gray-700 font-medium">编程控制</view>
            <view class="flex items-center justify-around">
              <wd-button size="small" @click="changeControlledState('left')">打开左边</wd-button>
              <wd-button size="small" type="warning" @click="changeControlledState('close')">
                全部关闭
              </wd-button>
              <wd-button size="small" @click="changeControlledState('right')">打开右边</wd-button>
            </view>
          </view>
        </view>

        <template #codes>
          <DemoCode title="模板 - 状态控制" :code="codes.control.template" />
          <DemoCode title="脚本 - 状态控制" :code="codes.control.script" />
        </template>
      </DemoSection>

      <!-- 事件监听示例 -->
      <DemoSection title="事件监听" desc="监听点击事件和状态变化">
        <view class="space-y-4">
          <wd-cell-group>
            <wd-swipe-action @click="handleClickEvent">
              <wd-cell title="点击内容区域" value="试试点击这里" />
              <template #right>
                <view class="action">
                  <view class="button bg-blue-500" @click="handleEventAction('收藏')">
                    <wd-text text="收藏" />
                  </view>
                  <view class="button bg-red-500" @click="handleEventAction('删除')">
                    <wd-text text="删除" />
                  </view>
                </view>
              </template>
            </wd-swipe-action>

            <wd-swipe-action @click="handleClickEvent">
              <wd-cell title="另一个监听示例" value="同样有点击事件" />
              <template #right>
                <view class="action">
                  <view class="button bg-orange-500" @click="handleEventAction('编辑')">
                    <wd-text text="编辑" />
                  </view>
                </view>
              </template>
            </wd-swipe-action>
          </wd-cell-group>

          <!-- 事件日志显示 -->
          <view class="mx-4 rounded-xl bg-gray-50 p-4">
            <view class="mb-2 text-sm font-medium">事件日志</view>
            <view class="h-32 overflow-y-auto border rounded bg-white p-2">
              <view
                v-for="(log, index) in eventLogs"
                :key="index"
                class="mb-1 text-xs text-gray-600"
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

      <!-- 禁用状态示例 -->
      <DemoSection title="禁用状态" desc="禁用滑动操作功能">
        <wd-cell-group>
          <wd-swipe-action disabled>
            <wd-cell title="禁用滑动" value="无法滑动操作" />
            <template #right>
              <view class="action">
                <view class="button bg-gray-400">
                  <wd-text text="禁用" />
                </view>
              </view>
            </template>
          </wd-swipe-action>

          <wd-swipe-action disabled>
            <wd-cell title="同样被禁用" value="滑动功能已关闭" />
            <template #right>
              <view class="action">
                <view class="button bg-gray-400">
                  <wd-text text="不可用" />
                </view>
              </view>
            </template>
          </wd-swipe-action>
        </wd-cell-group>

        <template #codes>
          <DemoCode title="模板 - 禁用状态" :code="codes.disabled.template" />
          <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
        </template>
      </DemoSection>

      <!-- 实际应用场景 -->
      <DemoSection title="实际应用场景" desc="常见的业务场景示例">
        <view class="space-y-4">
          <!-- 邮件列表场景 -->
          <view>
            <view class="mb-3 px-4 text-sm text-gray-700 font-medium">邮件列表</view>
            <wd-cell-group>
              <wd-swipe-action v-for="email in emails" :key="email.id">
                <template #left>
                  <view class="action">
                    <view
                      class="button bg-blue-500"
                      @click="handleEmailAction(email, '标记为已读')"
                    >
                      <wd-text text="已读" />
                    </view>
                    <view class="button bg-green-500" @click="handleEmailAction(email, '归档')">
                      <wd-text text="归档" />
                    </view>
                  </view>
                </template>

                <wd-cell :title="email.title" :value="email.preview" vertical />

                <template #right>
                  <view class="action">
                    <view class="button bg-orange-500" @click="handleEmailAction(email, '移动')">
                      <wd-text text="移动" />
                    </view>
                    <view class="button bg-red-500" @click="handleEmailAction(email, '删除')">
                      <wd-text text="删除" />
                    </view>
                  </view>
                </template>
              </wd-swipe-action>
            </wd-cell-group>
          </view>

          <!-- 聊天会话场景 -->
          <view>
            <view class="mb-3 px-4 text-sm text-gray-700 font-medium">聊天会话</view>
            <wd-cell-group>
              <wd-swipe-action v-for="chat in chats" :key="chat.id">
                <template #left>
                  <view class="action">
                    <view class="button bg-blue-500" @click="handleChatAction(chat, '置顶')">
                      <wd-text text="置顶" />
                    </view>
                  </view>
                </template>

                <wd-cell :title="chat.name" :value="chat.lastMessage" vertical />

                <template #right>
                  <view class="action">
                    <view class="button bg-orange-500" @click="handleChatAction(chat, '免打扰')">
                      <wd-text text="免打扰" />
                    </view>
                    <view class="button bg-red-500" @click="handleChatAction(chat, '删除')">
                      <wd-text text="删除" />
                    </view>
                  </view>
                </template>
              </wd-swipe-action>
            </wd-cell-group>
          </view>
        </view>

        <template #codes>
          <DemoCode title="模板 - 邮件列表场景" :code="codes.scenarios.emailTemplate" />
          <DemoCode title="脚本 - 邮件列表场景" :code="codes.scenarios.emailScript" />
          <DemoCode title="模板 - 聊天会话场景" :code="codes.scenarios.chatTemplate" />
          <DemoCode title="脚本 - 聊天会话场景" :code="codes.scenarios.chatScript" />
        </template>
      </DemoSection>
    </view>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type {
  SwipeActionBeforeClose,
  SwipeActionStatus,
  SwipeActionPosition,
} from '@/wd/components/wd-swipe-action/wd-swipe-action.vue'
import { useToast, useQueue } from '@/wd'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 初始化 toast 和队列管理
const toast = useToast()
const { closeOutside } = useQueue()

// 状态控制相关
const controlledState = ref<SwipeActionStatus>('close')

// 事件日志状态
interface EventLog {
  time: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

// 业务数据示例
const emails = ref([
  { id: 1, title: '系统通知', preview: '您的账户已成功登录' },
  { id: 2, title: '工作邮件', preview: '请查看本周工作总结报告' },
  { id: 3, title: '活动通知', preview: '双十一活动即将开始，敬请期待' },
])

const chats = ref([
  { id: 1, name: '张三', lastMessage: '今天开会吗？' },
  { id: 2, name: '李四', lastMessage: '文档我已经发给你了' },
  { id: 3, name: '工作群', lastMessage: '王五: 大家辛苦了！' },
])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-swipe-action>
  <wd-cell title="右滑查看操作" value="向左滑动试试" />
  <template #right>
    <view class="action">
      <view class="button bg-blue-500" @click="handleBasicAction('查看')">
        <wd-text text="查看" />
      </view>
      <view class="button bg-orange-500" @click="handleBasicAction('编辑')">
        <wd-text text="编辑" />
      </view>
      <view class="button bg-red-500" @click="handleBasicAction('删除')">
        <wd-text text="删除" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    script: `import { useToast } from '@/wd'
import { ref } from 'vue'

const toast = useToast()

const handleBasicAction = (action: string) => {
  toast.show(\`点击了\${action}\`)
}`,

    style: `/* 操作按钮容器样式 */
.action {
  height: 100%;
}

/* 操作按钮样式 */
.button {
  display: inline-block;
  padding: 0 15px;
  height: 100%;
  color: white;
  line-height: 46px;
  text-align: center;
}`,
  },

  // 左右滑动代码
  bidirectional: {
    template: `<wd-swipe-action>
  <!-- 左侧操作按钮 -->
  <template #left>
    <view class="action">
      <view class="button bg-blue-500" @click="handleLeftAction('标记')">
        <wd-text text="标记" />
      </view>
      <view class="button bg-green-500" @click="handleLeftAction('置顶')">
        <wd-text text="置顶" />
      </view>
    </view>
  </template>

  <wd-cell title="左右都能滑动" value="试试向左或向右滑动" />

  <!-- 右侧操作按钮 -->
  <template #right>
    <view class="action">
      <view class="button bg-orange-500" @click="handleRightAction('编辑')">
        <wd-text text="编辑" />
      </view>
      <view class="button bg-red-500" @click="handleRightAction('删除')">
        <wd-text text="删除" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    script: `const handleLeftAction = (action: string) => {
  toast.show(\`左侧操作：\${action}\`)
}

const handleRightAction = (action: string) => {
  toast.show(\`右侧操作：\${action}\`)
}`,
  },

  // 状态控制代码
  control: {
    template: `<wd-swipe-action
  v-model="controlledState"
  :before-close="handleBeforeClose"
>
  <template #left>
    <view class="action">
      <view class="button bg-blue-500" @click="handleControlledAction('左操作1')">
        <wd-text text="左操作1" />
      </view>
      <view class="button bg-green-500" @click="handleControlledAction('左操作2')">
        <wd-text text="左操作2" />
      </view>
    </view>
  </template>

  <wd-cell title="可编程控制" :value="\`当前状态: \${controlledState}\`" />

  <template #right>
    <view class="action">
      <view class="button bg-orange-500" @click="handleControlledAction('右操作1')">
        <wd-text text="右操作1" />
      </view>
      <view class="button bg-red-500" @click="handleControlledAction('右操作2')">
        <wd-text text="右操作2" />
      </view>
    </view>
  </template>
</wd-swipe-action>

<!-- 控制按钮 -->
<wd-button size="small" @click="changeControlledState('left')">
  打开左边
</wd-button>
<wd-button size="small" @click="changeControlledState('close')">
  全部关闭
</wd-button>
<wd-button size="small" @click="changeControlledState('right')">
  打开右边
</wd-button>`,

    script: `import type {
  SwipeActionBeforeClose,
  SwipeActionStatus,
  SwipeActionReason,
  SwipeActionPosition
} from '@/wd/components/wd-swipe-action/wd-swipe-action.vue'

const controlledState = ref<SwipeActionStatus>('close')

const changeControlledState = (state: SwipeActionStatus) => {
  controlledState.value = state
  toast.show(\`状态切换到: \${state}\`)
}

const handleControlledAction = (action: string) => {
  toast.show(\`受控组件操作：\${action}\`)
}

const handleBeforeClose: SwipeActionBeforeClose = (
  reason: SwipeActionReason,
  position: SwipeActionPosition
) => {
  toast.show(\`关闭原因: \${reason}, 位置: \${position}\`)
}`,
  },

  // 事件监听代码
  events: {
    template: `<wd-swipe-action @click="handleClickEvent">
  <wd-cell title="点击内容区域" value="试试点击这里" />
  <template #right>
    <view class="action">
      <view class="button bg-blue-500" @click="handleEventAction('收藏')">
        <wd-text text="收藏" />
      </view>
      <view class="button bg-red-500" @click="handleEventAction('删除')">
        <wd-text text="删除" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    script: `interface EventLog {
  time: string
  message: string
}

const eventLogs = ref<EventLog[]>([])

const addEventLog = (message: string) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

const handleClickEvent = ({ value }: { value: SwipeActionPosition }) => {
  addEventLog(\`点击了内容区域，位置: \${value}\`)
}

const handleEventAction = (action: string) => {
  addEventLog(\`执行操作: \${action}\`)
}

const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空')
}`,
  },

  // 禁用状态代码
  disabled: {
    template: `<wd-swipe-action disabled>
  <wd-cell title="禁用滑动" value="无法滑动操作" />
  <template #right>
    <view class="action">
      <view class="button bg-gray-400">
        <wd-text text="禁用" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    script: `// 禁用状态不需要额外的脚本逻辑
// 只需要在组件上添加 disabled 属性即可`,
  },

  // 应用场景代码
  scenarios: {
    emailTemplate: `<!-- 邮件列表场景 -->
<wd-swipe-action v-for="email in emails" :key="email.id">
  <template #left>
    <view class="action">
      <view class="button bg-blue-500" @click="handleEmailAction(email, '标记为已读')">
        <wd-text text="已读" />
      </view>
      <view class="button bg-green-500" @click="handleEmailAction(email, '归档')">
        <wd-text text="归档" />
      </view>
    </view>
  </template>

  <wd-cell :title="email.title" :value="email.preview" vertical />

  <template #right>
    <view class="action">
      <view class="button bg-orange-500" @click="handleEmailAction(email, '移动')">
        <wd-text text="移动" />
      </view>
      <view class="button bg-red-500" @click="handleEmailAction(email, '删除')">
        <wd-text text="删除" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    emailScript: `const emails = ref([
  { id: 1, title: '系统通知', preview: '您的账户已成功登录' },
  { id: 2, title: '工作邮件', preview: '请查看本周工作总结报告' },
  { id: 3, title: '活动通知', preview: '双十一活动即将开始，敬请期待' }
])

const handleEmailAction = (email: any, action: string) => {
  toast.show(\`邮件《\${email.title}》执行操作: \${action}\`)
}`,

    chatTemplate: `<!-- 聊天会话场景 -->
<wd-swipe-action v-for="chat in chats" :key="chat.id">
  <template #left>
    <view class="action">
      <view class="button bg-blue-500" @click="handleChatAction(chat, '置顶')">
        <wd-text text="置顶" />
      </view>
    </view>
  </template>

  <wd-cell :title="chat.name" :value="chat.lastMessage" vertical />

  <template #right>
    <view class="action">
      <view class="button bg-orange-500" @click="handleChatAction(chat, '免打扰')">
        <wd-text text="免打扰" />
      </view>
      <view class="button bg-red-500" @click="handleChatAction(chat, '删除')">
        <wd-text text="删除" />
      </view>
    </view>
  </template>
</wd-swipe-action>`,

    chatScript: `const chats = ref([
  { id: 1, name: '张三', lastMessage: '今天开会吗？' },
  { id: 2, name: '李四', lastMessage: '文档我已经发给你了' },
  { id: 3, name: '工作群', lastMessage: '王五: 大家辛苦了！' }
])

const handleChatAction = (chat: any, action: string) => {
  toast.show(\`会话《\${chat.name}》执行操作: \${action}\`)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'SwipeActionStatus',
    default: '"close"',
    desc: '滑动按钮的状态，可选值：left / close / right',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用滑动操作',
  },
  {
    name: 'before-close',
    type: 'SwipeActionBeforeClose',
    default: 'undefined',
    desc: '在关闭滑动按钮前调用的钩子函数',
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
    name: 'close(reason, position)',
    desc: '关闭滑动操作按钮，reason: 关闭原因，position: 关闭位置',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'click',
    desc: '点击时触发，参数为 { value: SwipeActionPosition }',
  },
  {
    name: 'update:modelValue',
    desc: '状态改变时触发，参数为新的状态值',
  },
]

// ===== 工具方法 =====

/**
 * 添加事件日志
 */
const addEventLog = (message: string) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

/**
 * 清空事件日志
 */
const clearEventLogs = () => {
  eventLogs.value = []
  addEventLog('事件日志已清空')
}

// ===== 事件处理方法 =====

/**
 * 基本用法操作处理
 */
const handleBasicAction = (action: string) => {
  toast.show(`点击了${action}`)
}

/**
 * 左侧操作处理
 */
const handleLeftAction = (action: string) => {
  toast.show(`左侧操作：${action}`)
}

/**
 * 右侧操作处理
 */
const handleRightAction = (action: string) => {
  toast.show(`右侧操作：${action}`)
}

/**
 * 状态控制操作处理
 */
const handleControlledAction = (action: string) => {
  toast.show(`受控组件操作：${action}`)
}

/**
 * 改变控制状态
 */
const changeControlledState = (state: SwipeActionStatus) => {
  controlledState.value = state
  toast.show(`状态切换到: ${state}`)
}

/**
 * 关闭前回调处理
 */
const handleBeforeClose: SwipeActionBeforeClose = (reason, position) => {
  toast.show(`关闭原因: ${reason}, 位置: ${position}`)
}

/**
 * 点击事件处理
 */
const handleClickEvent = ({ value }: { value: SwipeActionPosition }) => {
  addEventLog(`点击了内容区域，位置: ${value}`)
  toast.show(`点击了内容区域，位置: ${value}`)
}

/**
 * 事件操作处理
 */
const handleEventAction = (action: string) => {
  addEventLog(`执行操作: ${action}`)
  toast.show(`执行操作: ${action}`)
}

/**
 * 邮件操作处理
 */
const handleEmailAction = (email: any, action: string) => {
  toast.show(`邮件《${email.title}》执行操作: ${action}`)
}

/**
 * 聊天操作处理
 */
const handleChatAction = (chat: any, action: string) => {
  toast.show(`会话《${chat.name}》执行操作: ${action}`)
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
/* 操作按钮容器样式 */
.action {
  height: 100%;
}

/* 操作按钮样式 */
.button {
  display: inline-block;
  padding: 0 15px;
  height: 100%;
  color: white;
  line-height: 46px;
  text-align: center;
}
</style>
