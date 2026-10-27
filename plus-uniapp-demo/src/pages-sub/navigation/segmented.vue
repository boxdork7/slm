<!-- Segmented 分段器 http://127.0.0.1:100/#/pages-sub/demo/wd/segmented -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Segmented 分段器" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的分段器形式，支持字符串数组选项">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="默认分段器" vertical>
          <wd-segmented
            v-model:value="basicValue"
            :options="basicOptions"
            @change="handleBasicChange"
          />
        </wd-cell>

        <wd-cell title="带事件监听" vertical>
          <wd-segmented
            v-model:value="eventValue"
            :options="basicOptions"
            @change="handleEventChange"
            @click="handleEventClick"
          />
        </wd-cell>
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 默认分段器" :code="codes.basic.defaultTemplate" />
        <DemoCode title="模板 - 带事件监听" :code="codes.basic.eventTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 尺寸规格示例 -->
    <DemoSection title="尺寸规格" desc="提供三种尺寸规格：大型、默认、小型">
      <wd-cell-group>
        <wd-cell title="大型分段器" vertical>
          <wd-segmented
            v-model:value="largeValue"
            :options="basicOptions"
            size="large"
          />
        </wd-cell>

        <wd-cell title="默认分段器" vertical>
          <wd-segmented
            v-model:value="middleValue"
            :options="basicOptions"
            size="middle"
          />
        </wd-cell>

        <wd-cell title="小型分段器" vertical>
          <wd-segmented
            v-model:value="smallValue"
            :options="basicOptions"
            size="small"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 三种尺寸" :code="codes.size.template" />
        <DemoCode title="脚本 - 尺寸配置" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 禁用状态示例 -->
    <DemoSection title="禁用状态" desc="支持整体禁用和单个选项禁用">
      <wd-cell-group>
        <wd-cell title="整体禁用" vertical>
          <wd-segmented
            v-model:value="disabledValue"
            :options="basicOptions"
            disabled
          />
        </wd-cell>

        <wd-cell title="部分选项禁用" vertical>
          <wd-segmented
            v-model:value="partialDisabledValue"
            :options="partialDisabledOptions"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 整体禁用" :code="codes.disabled.wholeTemplate" />
        <DemoCode title="模板 - 部分禁用" :code="codes.disabled.partialTemplate" />
        <DemoCode title="脚本 - 禁用配置" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 震动反馈示例 -->
    <DemoSection title="震动反馈" desc="切换选项时提供触觉反馈">
      <wd-cell-group>
        <wd-cell title="带震动效果" vertical>
          <wd-segmented
            v-model:value="vibrateValue"
            :options="basicOptions"
            :vibrate-short="true"
            @change="handleVibrateChange"
          />
        </wd-cell>

        <wd-cell title="无震动效果" vertical>
          <wd-segmented
            v-model:value="noVibrateValue"
            :options="basicOptions"
            :vibrate-short="false"
          />
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 震动反馈" :code="codes.vibrate.template" />
        <DemoCode title="脚本 - 震动配置" :code="codes.vibrate.script" />
      </template>
    </DemoSection>

    <!-- 自定义渲染示例 -->
    <DemoSection title="自定义渲染" desc="通过插槽自定义选项标签的渲染">
      <!-- 带头像的自定义渲染 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">带头像标签</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-segmented
              v-model:value="customValue"
              :options="customOptions"
              @change="handleCustomChange"
            >
              <template #label="{ option }">
                <view class="flex items-center py-1">
                  <image
                    class="mr-2 h-6 w-6 rounded-full"
                    :src="option.payload.avatar"
                  />
                  <view class="text-sm">{{ option.value }}</view>
                </view>
              </template>
            </wd-segmented>
          </view>
        </view>

        <!-- 带图标的自定义渲染 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">带图标标签</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-segmented
              v-model:value="iconValue"
              :options="iconOptions"
            >
              <template #label="{ option }">
                <view class="flex items-center py-1">
                  <wd-icon
                    :name="option.payload.icon"
                    size="16"
                    :color="iconValue === option.value ? '#4f46e5' : '#9ca3af'"
                    class="mr-1"
                  />
                  <view class="text-sm">{{ option.value }}</view>
                </view>
              </template>
            </wd-segmented>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 带头像标签" :code="codes.custom.avatarTemplate" />
        <DemoCode title="模板 - 带图标标签" :code="codes.custom.iconTemplate" />
        <DemoCode title="脚本 - 自定义选项数据" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 高级应用示例 -->
    <DemoSection title="高级应用" desc="在弹出框中使用和动态更新">
      <!-- 控制示例区域 -->
      <view class="space-y-4">
        <!-- 弹出框中使用 -->
        <wd-cell-group>
          <wd-cell title="弹出框中使用" is-link @click="handleShowPopup">
            当前选择：{{ popupValue }}
          </wd-cell>
        </wd-cell-group>

        <!-- 动态更新选项 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">动态更新选项</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4 space-y-3">
            <wd-segmented
              v-model:value="dynamicValue"
              :options="dynamicOptions"
            />
            <view class="flex space-x-2">
              <wd-button size="small" @click="addDynamicOption">添加选项</wd-button>
              <wd-button size="small" @click="removeDynamicOption">删除选项</wd-button>
              <wd-button size="small" @click="resetDynamicOptions">重置选项</wd-button>
            </view>
          </view>
        </view>

        <!-- 状态显示 -->
        <view class="mx-4 rounded-lg bg-blue-50 px-4 py-2">
          <view class="text-xs text-blue-600 font-medium">💡 当前动态选项数量：{{ dynamicOptions.length }}</view>
        </view>
      </view>

      <!-- 弹出框 -->
      <wd-popup
        v-model="showPopup"
        position="bottom"
        closable
        custom-style="height: 200px; padding: 0 24rpx;"
        @after-enter="handlePopupShow"
      >
        <view class="flex items-center justify-center py-6 text-lg">
          在弹出框中使用
        </view>
        <wd-segmented
          ref="segmentedRef"
          v-model:value="popupValue"
          :options="basicOptions"
          @change="handlePopupChange"
        />
      </wd-popup>

      <template #codes>
        <DemoCode title="模板 - 弹出框中使用" :code="codes.advanced.popupTemplate" />
        <DemoCode title="模板 - 动态更新选项" :code="codes.advanced.dynamicTemplate" />
        <DemoCode title="脚本 - 弹出框处理" :code="codes.advanced.popupScript" />
        <DemoCode title="脚本 - 动态选项管理" :code="codes.advanced.dynamicScript" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 业务场景示例 -->
      <view class="space-y-4">
        <!-- 时间筛选器 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">时间筛选器</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-segmented
              v-model:value="timeFilterValue"
              :options="timeFilterOptions"
              @change="handleTimeFilterChange"
            />
            <view class="mt-3 text-xs text-gray-500">
              已选择：{{ timeFilterValue }} 的数据
            </view>
          </view>
        </view>

        <!-- 内容分类切换 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">内容分类切换</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-segmented
              v-model:value="categoryValue"
              :options="categoryOptions"
              @change="handleCategoryChange"
            />
            <view class="mt-3 rounded bg-white p-3">
              <view class="mb-2 text-sm font-medium">{{ getCategoryContent().title }}</view>
              <view class="text-xs text-gray-600">{{ getCategoryContent().desc }}</view>
            </view>
          </view>
        </view>

        <!-- 用户角色切换 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">用户角色切换</view>
          <view class="mx-4 rounded-lg bg-gray-50 p-4">
            <wd-segmented
              v-model:value="roleValue"
              :options="roleOptions"
              @change="handleRoleChange"
            />
            <view class="mt-3 rounded bg-white p-3">
              <view class="text-xs text-gray-600">
                当前角色权限：{{ getRolePermissions() }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 时间筛选器" :code="codes.scenarios.timeFilterTemplate" />
        <DemoCode title="脚本 - 时间筛选逻辑" :code="codes.scenarios.timeFilterScript" />
        <DemoCode title="模板 - 内容分类切换" :code="codes.scenarios.categoryTemplate" />
        <DemoCode title="脚本 - 分类切换逻辑" :code="codes.scenarios.categoryScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import type { SegmentedInstance, SegmentedOption } from '@/wd/components/wd-segmented/wd-segmented.vue'
import { ref } from 'vue'

// ===== 组件状态管理 =====

// 基础选项数据
const basicOptions = ref(['评论', '点赞', '贡献', '打赏'])

// 各种分段器的选中值
const basicValue = ref('评论')
const eventValue = ref('点赞')
const largeValue = ref('评论')
const middleValue = ref('点赞')
const smallValue = ref('贡献')
const disabledValue = ref('评论')
const partialDisabledValue = ref('韩梅梅')
const vibrateValue = ref('打赏')
const noVibrateValue = ref('评论')
const customValue = ref('韩梅梅')
const iconValue = ref('首页')
const popupValue = ref('点赞')
const dynamicValue = ref('选项1')
const timeFilterValue = ref('今日')
const categoryValue = ref('推荐')
const roleValue = ref('管理员')

// 弹出框相关
const showPopup = ref(false)
const segmentedRef = ref<SegmentedInstance>()

// 部分禁用选项数据
const partialDisabledOptions = ref([
  {
    value: '李雷',
    disabled: false,
  },
  {
    value: '韩梅梅',
    disabled: false,
  },
  {
    value: '林涛',
    disabled: true,
  },
  {
    value: 'Tom',
    disabled: false,
  }
])

// 自定义渲染选项数据
const customOptions = ref([
  {
    value: '李雷',
    disabled: false,
    payload: {
      avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg'
    }
  },
  {
    value: '韩梅梅',
    disabled: false,
    payload: {
      avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg'
    }
  },
  {
    value: '林涛',
    disabled: true,
    payload: {
      avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
    }
  },
  {
    value: 'Tom',
    disabled: false,
    payload: {
      avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg'
    }
  }
])

// 带图标的选项数据
const iconOptions = ref([
  {
    value: '首页',
    payload: { icon: 'home' }
  },
  {
    value: '消息',
    payload: { icon: 'message' }
  },
  {
    value: '我的',
    payload: { icon: 'user' }
  }
])

// 动态选项数据
const dynamicOptions = ref(['选项1', '选项2', '选项3'])

// 业务场景选项数据
const timeFilterOptions = ref(['今日', '本周', '本月', '本年'])
const categoryOptions = ref(['推荐', '关注', '热门', '最新'])
const roleOptions = ref(['管理员', '编辑者', '查看者', '访客'])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    defaultTemplate: `<wd-segmented
  v-model:value="basicValue"
  :options="basicOptions"
  @change="handleBasicChange"
/>`,

    eventTemplate: `<wd-segmented
  v-model:value="eventValue"
  :options="basicOptions"
  @change="handleEventChange"
  @click="handleEventClick"
/>`,

    script: `import { ref } from 'vue'

const basicOptions = ref(['评论', '点赞', '贡献', '打赏'])
const basicValue = ref('评论')
const eventValue = ref('点赞')

const handleBasicChange = (option) => {
  console.log('基本用法选择变化:', option)
}

const handleEventChange = (option) => {
  console.log('选择变化:', option)
}

const handleEventClick = (option) => {
  console.log('选项点击:', option)
}`,
  },

  // 尺寸规格代码
  size: {
    template: `<!-- 大型分段器 -->
<wd-segmented
  v-model:value="largeValue"
  :options="basicOptions"
  size="large"
/>

<!-- 默认分段器 -->
<wd-segmented
  v-model:value="middleValue"
  :options="basicOptions"
  size="middle"
/>

<!-- 小型分段器 -->
<wd-segmented
  v-model:value="smallValue"
  :options="basicOptions"
  size="small"
/>`,

    script: `const largeValue = ref('评论')
const middleValue = ref('点赞')
const smallValue = ref('贡献')

// 尺寸类型：'large' | 'middle' | 'small'`,
  },

  // 禁用状态代码
  disabled: {
    wholeTemplate: `<wd-segmented
  v-model:value="disabledValue"
  :options="basicOptions"
  disabled
/>`,

    partialTemplate: `<wd-segmented
  v-model:value="partialDisabledValue"
  :options="partialDisabledOptions"
/>`,

    script: `const disabledValue = ref('评论')
const partialDisabledValue = ref('韩梅梅')

// 部分禁用选项配置
const partialDisabledOptions = ref([
  { value: '李雷', disabled: false },
  { value: '韩梅梅', disabled: false },
  { value: '林涛', disabled: true }, // 禁用状态
  { value: 'Tom', disabled: false },
])`,
  },

  // 震动反馈代码
  vibrate: {
    template: `<!-- 带震动效果 -->
<wd-segmented
  v-model:value="vibrateValue"
  :options="basicOptions"
  :vibrate-short="true"
  @change="handleVibrateChange"
/>

<!-- 无震动效果 -->
<wd-segmented
  v-model:value="noVibrateValue"
  :options="basicOptions"
  :vibrate-short="false"
/>`,

    script: `const vibrateValue = ref('打赏')
const noVibrateValue = ref('评论')

const handleVibrateChange = (option) => {
  console.log('震动反馈选择:', option)
  // 切换时会自动触发震动反馈
}`,
  },

  // 自定义渲染代码
  custom: {
    avatarTemplate: `<wd-segmented
  v-model:value="customValue"
  :options="customOptions"
  @change="handleCustomChange"
>
  <template #label="{ option }">
    <view class="flex items-center py-1">
      <image
        class="mr-2 h-6 w-6 rounded-full"
        :src="option.payload.avatar"
      />
      <view class="text-sm">{{ option.value }}</view>
    </view>
  </template>
</wd-segmented>`,

    iconTemplate: `<wd-segmented
  v-model:value="iconValue"
  :options="iconOptions"
>
  <template #label="{ option }">
    <view class="flex items-center py-1">
      <wd-icon
        :name="option.payload.icon"
        size="16"
        :color="iconValue === option.value ? '#4f46e5' : '#9ca3af'"
        class="mr-1"
      />
      <view class="text-sm">{{ option.value }}</view>
    </view>
  </template>
</wd-segmented>`,

    script: `const customValue = ref('韩梅梅')
const iconValue = ref('首页')

// 带头像的选项数据
const customOptions = ref([
  {
    value: '李雷',
    disabled: false,
    payload: {
      avatar: 'https://example.com/avatar1.jpg'
    }
  },
  {
    value: '韩梅梅',
    disabled: false,
    payload: {
      avatar: 'https://example.com/avatar2.jpg'
    }
  }
])

// 带图标的选项数据
const iconOptions = ref([
  { value: '首页', payload: { icon: 'home' } },
  { value: '消息', payload: { icon: 'message' } },
  { value: '我的', payload: { icon: 'user' } }
])`,
  },

  // 高级应用代码
  advanced: {
    popupTemplate: `<wd-popup
  v-model="showPopup"
  position="bottom"
  closable
  custom-style="height: 200px; padding: 0 24rpx;"
  @after-enter="handlePopupShow"
>
  <view class="flex items-center justify-center py-6 text-lg">
    在弹出框中使用
  </view>
  <wd-segmented
    ref="segmentedRef"
    v-model:value="popupValue"
    :options="basicOptions"
    @change="handlePopupChange"
  />
</wd-popup>`,

    dynamicTemplate: `<wd-segmented
  v-model:value="dynamicValue"
  :options="dynamicOptions"
/>

<view class="flex space-x-2">
  <wd-button size="small" @click="addDynamicOption">添加选项</wd-button>
  <wd-button size="small" @click="removeDynamicOption">删除选项</wd-button>
  <wd-button size="small" @click="resetDynamicOptions">重置选项</wd-button>
</view>`,

    popupScript: `import type { SegmentedInstance } from '@/wd/components/wd-segmented/wd-segmented.vue'

const showPopup = ref(false)
const popupValue = ref('点赞')
const segmentedRef = ref<SegmentedInstance>()

const handleShowPopup = () => {
  showPopup.value = true
}

const handlePopupShow = () => {
  // 弹出框显示后更新分段器样式以适应新环境
  segmentedRef.value?.updateActiveStyle()
}

const handlePopupChange = (option) => {
  console.log('弹出框中选择:', option)
}`,

    dynamicScript: `const dynamicOptions = ref(['选项1', '选项2', '选项3'])
const dynamicValue = ref('选项1')

const addDynamicOption = () => {
  const newOption = \`选项\${dynamicOptions.value.length + 1}\`
  dynamicOptions.value.push(newOption)
  console.log('添加选项:', newOption)
}

const removeDynamicOption = () => {
  if (dynamicOptions.value.length > 1) {
    const removed = dynamicOptions.value.pop()
    // 如果删除的是当前选中项，切换到第一项
    if (dynamicValue.value === removed) {
      dynamicValue.value = dynamicOptions.value[0]
    }
    console.log('删除选项:', removed)
  }
}

const resetDynamicOptions = () => {
  dynamicOptions.value = ['选项1', '选项2', '选项3']
  dynamicValue.value = '选项1'
  console.log('重置选项')
}`,
  },

  // 应用场景代码
  scenarios: {
    timeFilterTemplate: `<wd-segmented
  v-model:value="timeFilterValue"
  :options="timeFilterOptions"
  @change="handleTimeFilterChange"
/>`,

    timeFilterScript: `const timeFilterOptions = ref(['今日', '本周', '本月', '本年'])
const timeFilterValue = ref('今日')

const handleTimeFilterChange = (option) => {
  console.log('时间筛选变化:', option)
  // 根据选择的时间范围加载数据
  loadDataByTimeRange(option.value)
}

const loadDataByTimeRange = (timeRange) => {
  // 实际业务中的数据加载逻辑
  console.log(\`加载\${timeRange}的数据\`)
}`,

    categoryTemplate: `<wd-segmented
  v-model:value="categoryValue"
  :options="categoryOptions"
  @change="handleCategoryChange"
/>`,

    categoryScript: `const categoryOptions = ref(['推荐', '关注', '热门', '最新'])
const categoryValue = ref('推荐')

const handleCategoryChange = (option) => {
  console.log('分类切换:', option)
  // 根据分类加载对应内容
  loadContentByCategory(option.value)
}

const getCategoryContent = () => {
  const contentMap = {
    '推荐': { title: '智能推荐内容', desc: '基于您的兴趣推荐' },
    '关注': { title: '关注用户动态', desc: '您关注的用户最新动态' },
    '热门': { title: '热门内容', desc: '当前最受欢迎的内容' },
    '最新': { title: '最新发布', desc: '最新发布的内容' }
  }
  return contentMap[categoryValue.value] || contentMap['推荐']
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number',
    default: '""',
    desc: '当前选中的值，支持 v-model 双向绑定',
  },
  {
    name: 'options',
    type: 'Array<String | Number | SegmentedOption>',
    default: '[]',
    desc: '选项数据，支持字符串数组或对象数组',
  },
  {
    name: 'size',
    type: 'String',
    default: '"middle"',
    desc: '分段器尺寸，可选值：large / middle / small',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用分段器',
  },
  {
    name: 'vibrate-short',
    type: 'Boolean',
    default: 'false',
    desc: '切换选项时是否振动',
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
    name: 'updateActiveStyle(animation?)',
    desc: '更新滑块偏移量，animation 参数控制是否开启动画，默认为 true',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '选项改变时触发，参数为 { value: string | number }',
  },
  {
    name: 'click',
    desc: '点击选项时触发，参数为 { value: string | number }',
  },
]

// ===== 计算属性 =====

/**
 * 获取分类内容
 */
const getCategoryContent = () => {
  const contentMap: Record<string, { title: string; desc: string }> = {
    '推荐': { title: '智能推荐内容', desc: '基于您的兴趣推荐' },
    '关注': { title: '关注用户动态', desc: '您关注的用户最新动态' },
    '热门': { title: '热门内容', desc: '当前最受欢迎的内容' },
    '最新': { title: '最新发布', desc: '最新发布的内容' }
  }
  return contentMap[categoryValue.value] || contentMap['推荐']
}

/**
 * 获取角色权限描述
 */
const getRolePermissions = () => {
  const permissionMap: Record<string, string> = {
    '管理员': '完全访问权限，可进行所有操作',
    '编辑者': '内容编辑权限，可创建和修改内容',
    '查看者': '只读权限，可查看所有内容',
    '访客': '受限访问权限，仅可查看公开内容'
  }
  return permissionMap[roleValue.value] || permissionMap['访客']
}

// ===== 事件处理方法 =====

/**
 * 基本用法选择变化处理
 */
const handleBasicChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('基本用法选择变化:', option)
}

/**
 * 事件监听选择变化处理
 */
const handleEventChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('选择变化:', option)
}

/**
 * 事件监听点击处理
 */
const handleEventClick = (option: SegmentedOption | { value: string | number }) => {
  console.log('选项点击:', option)
}

/**
 * 震动反馈选择变化处理
 */
const handleVibrateChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('震动反馈选择:', option)
}

/**
 * 自定义渲染选择变化处理
 */
const handleCustomChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('自定义渲染选择:', option)
}

/**
 * 显示弹出框
 */
const handleShowPopup = () => {
  showPopup.value = true
  console.log('打开弹出框')
}

/**
 * 弹出框显示后处理
 */
const handlePopupShow = () => {
  // 弹出框显示后更新分段器样式以适应新环境
  segmentedRef.value?.updateActiveStyle()
  console.log('弹出框显示完成，更新分段器样式')
}

/**
 * 弹出框中选择变化处理
 */
const handlePopupChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('弹出框中选择:', option)
}

/**
 * 添加动态选项
 */
const addDynamicOption = () => {
  const newOption = `选项${dynamicOptions.value.length + 1}`
  dynamicOptions.value.push(newOption)
  console.log('添加选项:', newOption)
}

/**
 * 删除动态选项
 */
const removeDynamicOption = () => {
  if (dynamicOptions.value.length > 1) {
    const removed = dynamicOptions.value.pop()
    // 如果删除的是当前选中项，切换到第一项
    if (dynamicValue.value === removed) {
      dynamicValue.value = dynamicOptions.value[0]
    }
    console.log('删除选项:', removed)
  } else {
    console.log('至少保留一个选项')
  }
}

/**
 * 重置动态选项
 */
const resetDynamicOptions = () => {
  dynamicOptions.value = ['选项1', '选项2', '选项3']
  dynamicValue.value = '选项1'
  console.log('重置选项')
}

/**
 * 根据时间范围加载数据
 */
const loadDataByTimeRange = (timeRange: string) => {
  console.log(`加载${timeRange}的数据`)
  // 实际业务中的数据加载逻辑
}
/**
 * 时间筛选变化处理
 */
const handleTimeFilterChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('时间筛选变化:', option)
  loadDataByTimeRange(option.value as string)
}

/**
 * 根据分类加载内容
 */
const loadContentByCategory = (category: string) => {
  console.log(`加载${category}分类内容`)
  // 实际业务中的内容加载逻辑
}
/**
 * 内容分类变化处理
 */
const handleCategoryChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('分类切换:', option)
  loadContentByCategory(option.value as string)
}

/**
 * 更新用户权限
 */
const updateUserPermissions = (role: string) => {
  console.log(`切换到${role}角色，更新用户权限`)
  // 实际业务中的权限更新逻辑
}
/**
 * 用户角色变化处理
 */
const handleRoleChange = (option: SegmentedOption | { value: string | number }) => {
  console.log('角色切换:', option)
  updateUserPermissions(option.value as string)
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
