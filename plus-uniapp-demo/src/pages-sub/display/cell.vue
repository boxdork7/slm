<!-- Cell 单元格 http://127.0.0.1:100/#/pages-sub/demo/wd/cell -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Cell 单元格" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的单元格形式，包含标题和内容">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="用户名" value="张三" @click="handleBasicClick('用户名')" />
        <wd-cell title="手机号" value="138****8888" @click="handleBasicClick('手机号')" />
        <wd-cell
          title="邮箱"
          label="用于接收重要通知"
          value="zhangsan@example.com"
          @click="handleBasicClick('邮箱')"
        />
      </wd-cell-group>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 图标展示示例 -->
    <DemoSection title="图标展示" desc="使用图标增强视觉识别度">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell
          title="个人信息"
          value="完善度85%"
          icon="user"
          @click="handleIconClick('个人信息')"
        />
        <wd-cell title="安全设置" value="已开启" icon="lock" @click="handleIconClick('安全设置')" />
        <wd-cell
          title="消息通知"
          value="3条未读"
          icon="notification"
          @click="handleIconClick('消息通知')"
        />
        <wd-cell title="自定义图标" value="查看详情" @click="handleIconClick('自定义图标')">
          <template #icon>
            <view class="custom-icon-security" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 图标展示" :code="codes.icon.template" />
        <DemoCode title="模板 - 自定义图标" :code="codes.icon.customTemplate" />
        <DemoCode title="样式 - 自定义图标" :code="codes.icon.style" />
        <DemoCode title="脚本 - 图标展示" :code="codes.icon.script" />
      </template>
    </DemoSection>

    <!-- 分组标题示例 -->
    <DemoSection title="分组标题" desc="使用分组标题对相关功能进行分类">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-cell-group title="账户管理" value="2/5">
          <wd-cell
            title="实名认证"
            value="已认证"
            icon="check-circle"
            @click="handleGroupClick('实名认证')"
          />
          <wd-cell
            title="银行卡绑定"
            label="为保障您的资金安全，建议绑定银行卡"
            value="未绑定"
            icon="credit-card"
            @click="handleGroupClick('银行卡绑定')"
          />
        </wd-cell-group>

        <wd-cell-group title="系统设置">
          <wd-cell
            title="语言设置"
            value="简体中文"
            icon="language"
            @click="handleGroupClick('语言设置')"
          />
          <wd-cell
            title="主题模式"
            value="跟随系统"
            icon="theme"
            @click="handleGroupClick('主题模式')"
          />
        </wd-cell-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 分组标题" :code="codes.group.template" />
        <DemoCode title="脚本 - 分组标题" :code="codes.group.script" />
      </template>
    </DemoSection>

    <!-- 尺寸和样式示例 -->
    <DemoSection title="尺寸和样式" desc="不同尺寸、边框和对齐方式的展示">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 大尺寸演示 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">大尺寸</view>
          <wd-cell-group>
            <wd-cell
              size="large"
              title="VIP会员"
              value="黄金会员"
              icon="vip"
              @click="handleSizeClick('VIP会员')"
            />
            <wd-cell
              title="积分余额"
              value="12,580分"
              size="large"
              icon="gift"
              is-link
              @click="handleSizeClick('积分余额')"
            />
            <wd-cell
              size="large"
              title="推荐好友"
              label="邀请好友注册可获得积分奖励"
              value="去邀请"
              @click="handleSizeClick('推荐好友')"
            />
          </wd-cell-group>
        </view>

        <!-- 边框控制 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">边框控制</view>
          <wd-cell-group title="订单管理" border>
            <wd-cell title="待付款" value="5个订单" @click="handleSizeClick('待付款')" />
            <wd-cell
              :border="false"
              title="待发货"
              label="无边框示例"
              value="2个订单"
              @click="handleSizeClick('待发货')"
            />
            <wd-cell
              title="待收货"
              label="物流跟踪中"
              value="3个订单"
              @click="handleSizeClick('待收货')"
            />
          </wd-cell-group>
        </view>

        <!-- 对齐方式 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">对齐方式</view>
          <wd-cell-group>
            <wd-cell
              title="顶部对齐"
              value="默认对齐方式"
              label="当有描述信息时，内容默认顶部对齐"
              @click="handleSizeClick('顶部对齐')"
            />
            <wd-cell
              title="垂直居中"
              value="居中对齐"
              label="设置center属性后，内容垂直居中显示"
              center
              @click="handleSizeClick('垂直居中')"
            />
          </wd-cell-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 大尺寸" :code="codes.size.largeTemplate" />
        <DemoCode title="模板 - 边框控制" :code="codes.size.borderTemplate" />
        <DemoCode title="模板 - 对齐方式" :code="codes.size.alignTemplate" />
        <DemoCode title="脚本 - 尺寸和样式" :code="codes.size.script" />
      </template>
    </DemoSection>

    <!-- 交互功能示例 -->
    <DemoSection title="交互功能" desc="支持点击事件和页面跳转">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell
          title="点击反馈"
          value="试试点击"
          clickable
          @click="handleInteractiveClick('点击反馈')"
        />
        <wd-cell title="帮助中心" is-link @click="handleInteractiveClick('帮助中心')" />
        <wd-cell
          title="设置中心"
          value="系统配置"
          is-link
          @click="handleInteractiveClick('设置中心')"
        />
        <wd-cell title="意见反馈" is-link @click="handleInteractiveClick('意见反馈')" />
        <wd-cell
          title="页面跳转"
          value="外部链接"
          is-link
          to="/pages/help/index"
          @click="handleInteractiveClick('页面跳转')"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 交互功能" :code="codes.interactive.template" />
        <DemoCode title="脚本 - 交互功能" :code="codes.interactive.script" />
      </template>
    </DemoSection>

    <!-- 表单集成示例 -->
    <DemoSection title="表单集成" desc="与表单控件完美结合，构建复杂表单">
      <!-- 示例效果展示 -->
      <wd-cell-group border>
        <wd-cell title="服务评分" required center>
          <wd-rate v-model="formValues.rate" @change="handleFormChange('评分', $event)" />
        </wd-cell>
        <wd-cell title="价格范围" vertical>
          <wd-slider
            v-model="formValues.slider"
            :min="0"
            :max="1000"
            @change="handleFormChange('滑块', $event)"
          />
        </wd-cell>
        <wd-cell title="接收通知" center>
          <wd-switch v-model="formValues.switch" @change="handleFormChange('开关', $event)" />
        </wd-cell>
        <wd-cell title="选择日期" center>
          <wd-button size="small" plain @click="handleFormAction('选择日期')">
            {{ selectedDate }}
          </wd-button>
        </wd-cell>
        <wd-cell title="优惠券" label="可用优惠券3张" center>
          <wd-button size="small" @click="handleFormAction('选择优惠券')">选择</wd-button>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 表单集成" :code="codes.form.template" />
        <DemoCode title="脚本 - 表单集成" :code="codes.form.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="使用插槽自定义各个区域的内容">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <!-- 自定义右侧内容 -->
        <wd-cell title="快捷操作" center @click="handleCustomClick('快捷操作')">
          <wd-button size="small" plain>执行</wd-button>
        </wd-cell>

        <!-- 自定义开关 -->
        <wd-cell title="消息推送" center>
          <wd-switch v-model="pushEnabled" @change="handleFormChange('消息推送', $event)" />
        </wd-cell>

        <!-- 自定义链接内容 -->
        <wd-cell title="商品购买" is-link @click="handleCustomClick('商品购买')">
          <wd-text text="立即订购" color="#f0883a" />
        </wd-cell>

        <!-- 自定义标题 -->
        <wd-cell center @click="handleCustomClick('会员服务')">
          <template #title>
            <view class="flex items-center">
              <view class="text-base">会员服务</view>
              <view class="member-tag">25天后到期</view>
            </view>
          </template>
          <wd-button size="small">续费</wd-button>
        </wd-cell>

        <!-- 复杂自定义内容 -->
        <wd-cell @click="handleCustomClick('用户信息')">
          <template #title>
            <view class="flex items-center">
              <image
                src="https://avatars.githubusercontent.com/u/26426873?v=4"
                class="mr-3 h-10 w-10 rounded-full"
              />
              <view>
                <view class="text-base font-medium">摸鱼达人</view>
                <view class="text-sm text-gray-500">最后活跃: 2分钟前</view>
              </view>
            </view>
          </template>
          <view class="flex space-x-2">
            <wd-button size="small" plain @click.stop="handleCustomAction('发消息')">
              发消息
            </wd-button>
            <wd-button size="small" @click.stop="handleCustomAction('查看资料')">查看</wd-button>
          </view>
        </wd-cell>

        <!-- 标题宽度设置 -->
        <wd-cell
          title="默认宽度"
          label="标题区域使用默认宽度"
          value="自适应内容长度"
          @click="handleCustomClick('默认宽度')"
        />
        <wd-cell
          title="固定宽度"
          label="设置title-width属性可以固定标题区域宽度，确保对齐效果"
          title-width="200rpx"
          value="200rpx宽度"
          @click="handleCustomClick('固定宽度')"
        />
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义右侧内容" :code="codes.custom.rightTemplate" />
        <DemoCode title="模板 - 自定义标题" :code="codes.custom.titleTemplate" />
        <DemoCode title="模板 - 复杂自定义内容" :code="codes.custom.complexTemplate" />
        <DemoCode title="模板 - 标题宽度设置" :code="codes.custom.widthTemplate" />
        <DemoCode title="样式 - 自定义样式" :code="codes.custom.style" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 状态展示示例 -->
    <DemoSection title="状态展示" desc="使用不同颜色和图标展示各种状态">
      <!-- 示例效果展示 -->
      <wd-cell-group>
        <wd-cell title="系统状态" center @click="handleStatusClick('系统状态')">
          <view class="flex items-center">
            <view class="mr-2 h-2 w-2 rounded-full bg-green-500" />
            <text class="text-green-600">正常运行</text>
          </view>
        </wd-cell>
        <wd-cell title="网络连接" center @click="handleStatusClick('网络连接')">
          <view class="flex items-center">
            <view class="mr-2 h-2 w-2 rounded-full bg-orange-500" />
            <text class="text-orange-600">连接中...</text>
          </view>
        </wd-cell>
        <wd-cell title="数据同步" center @click="handleStatusClick('数据同步')">
          <view class="flex items-center">
            <view class="mr-2 h-2 w-2 rounded-full bg-red-500" />
            <text class="text-red-600">同步失败</text>
          </view>
        </wd-cell>
        <wd-cell
          title="存储空间"
          label="总容量：64GB"
          center
          @click="handleStatusClick('存储空间')"
        >
          <view class="flex items-center">
            <view class="mr-2 text-sm text-gray-600">已用75%</view>
            <view class="h-2 w-16 rounded-full bg-gray-200">
              <view class="h-full w-3/4 rounded-full bg-blue-500" />
            </view>
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 状态展示" :code="codes.status.template" />
        <DemoCode title="脚本 - 状态展示" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- 交互式配置示例 -->
    <DemoSection title="交互式配置" desc="通过配置选项实时预览不同的单元格效果">
      <!-- 配置面板和预览区域 -->
      <view class="space-y-4">
        <!-- 配置面板 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">配置选项</view>

          <!-- 单元格大小 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">单元格大小</view>
            <wd-radio-group v-model="configState.cellSize" direction="horizontal">
              <wd-radio value="normal">正常</wd-radio>
              <wd-radio value="large">大尺寸</wd-radio>
            </wd-radio-group>
          </view>

          <!-- 功能选项 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">功能选项</view>
            <view class="grid grid-cols-2 gap-2">
              <wd-checkbox v-model="configState.showIcon" shape="square" size="small">
                显示图标
              </wd-checkbox>
              <wd-checkbox v-model="configState.showLabel" shape="square" size="small">
                显示描述
              </wd-checkbox>
              <wd-checkbox v-model="configState.showBorder" shape="square" size="small">
                显示边框
              </wd-checkbox>
              <wd-checkbox v-model="configState.isRequired" shape="square" size="small">
                必填标记
              </wd-checkbox>
              <wd-checkbox v-model="configState.isLink" shape="square" size="small">
                链接样式
              </wd-checkbox>
              <wd-checkbox v-model="configState.centerAlign" shape="square" size="small">
                垂直居中
              </wd-checkbox>
              <wd-checkbox v-model="configState.verticalLayout" shape="square" size="small">
                上下布局
              </wd-checkbox>
              <wd-checkbox v-model="configState.clickable" shape="square" size="small">
                可点击
              </wd-checkbox>
            </view>
          </view>

          <!-- 演示内容选择 -->
          <view>
            <view class="mb-2 text-xs text-gray-600">演示内容</view>
            <wd-radio-group v-model="configState.demoContent" direction="horizontal">
              <wd-radio value="basic">基础信息</wd-radio>
              <wd-radio value="setting">设置项</wd-radio>
              <wd-radio value="form">表单控件</wd-radio>
            </wd-radio-group>
          </view>
        </view>

        <!-- 实时预览 -->
        <view class="rounded-lg bg-white p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">实时预览</view>
          <wd-cell-group :border="configState.showBorder">
            <wd-cell
              :title="currentDemoData.title"
              :value="configState.demoContent === 'form' ? undefined : currentDemoData.value"
              :label="configState.showLabel ? currentDemoData.label : undefined"
              :icon="configState.showIcon ? currentDemoData.icon : undefined"
              :size="configState.cellSize === 'large' ? 'large' : undefined"
              :required="configState.isRequired"
              :center="configState.centerAlign"
              :vertical="configState.verticalLayout"
              :is-link="configState.isLink"
              :clickable="configState.clickable"
              :border="configState.showBorder"
              @click="handleConfigPreviewClick"
            >
              <!-- 表单控件演示 -->
              <template v-if="configState.demoContent === 'form'">
                <wd-switch
                  v-if="currentDemoData.type === 'switch'"
                  v-model="previewFormValues.switch"
                />
                <wd-rate
                  v-else-if="currentDemoData.type === 'rate'"
                  v-model="previewFormValues.rate"
                />
                <wd-slider
                  v-else-if="currentDemoData.type === 'slider'"
                  v-model="previewFormValues.slider"
                />
                <wd-button v-else-if="currentDemoData.type === 'button'" size="small" plain>
                  {{ currentDemoData.value }}
                </wd-button>
              </template>
            </wd-cell>
          </wd-cell-group>
        </view>

        <!-- 操作记录 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 flex items-center justify-between">
            <view class="text-sm text-gray-700 font-medium">操作记录</view>
            <wd-button size="small" @click="clearRecords">清空记录</wd-button>
          </view>
          <view class="h-32 overflow-y-auto">
            <view
              v-for="(record, index) in operationRecords"
              :key="index"
              class="mb-1 text-sm"
              :class="getRecordColor(record.type)"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view
              v-if="operationRecords.length === 0"
              class="py-8 text-center text-sm text-gray-400"
            >
              暂无操作记录，点击单元格查看交互效果
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 配置面板" :code="codes.config.configTemplate" />
        <DemoCode title="模板 - 实时预览" :code="codes.config.previewTemplate" />
        <DemoCode title="脚本 - 交互式配置" :code="codes.config.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== 组件状态管理 =====

// 表单控件值
const formValues = ref({
  rate: 3,
  slider: 300,
  switch: true,
})

const pushEnabled = ref<boolean>(true)
const selectedDate = ref<string>('2024-01-20')

// 交互式配置状态
const configState = ref({
  cellSize: 'normal',
  showIcon: true,
  showLabel: true,
  showBorder: false,
  isRequired: false,
  isLink: false,
  centerAlign: false,
  verticalLayout: false,
  clickable: true,
  demoContent: 'basic',
})

const previewFormValues = ref({
  switch: true,
  rate: 4,
  slider: 500,
})

// 操作记录
interface OperationRecord {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

// 演示数据
const demoData = {
  basic: {
    title: '基础信息',
    value: '演示内容',
    label: '这是描述信息',
    icon: 'user',
  },
  setting: {
    title: '设置选项',
    value: '已开启',
    label: '功能配置说明',
    icon: 'setting',
  },
  form: {
    switch: { title: '开关控件', type: 'switch', icon: 'switch' },
    rate: { title: '评分控件', type: 'rate', icon: 'star' },
    slider: { title: '滑块控件', type: 'slider', icon: 'slider' },
    button: { title: '按钮控件', type: 'button', value: '点击按钮', icon: 'button' },
  },
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基本用法 -->
<wd-cell-group>
  <wd-cell title="用户名" value="张三" @click="handleBasicClick('用户名')" />
  <wd-cell title="手机号" value="138****8888" @click="handleBasicClick('手机号')" />
  <wd-cell title="邮箱" label="用于接收重要通知" value="zhangsan@example.com" @click="handleBasicClick('邮箱')" />
</wd-cell-group>`,

    script: `const handleBasicClick = (title: string) => {
  console.log('点击了基本单元格：', title)
}`,
  },

  // 图标展示代码
  icon: {
    template: `<!-- 图标展示 -->
<wd-cell-group>
  <wd-cell title="个人信息" value="完善度85%" icon="user" @click="handleIconClick('个人信息')" />
  <wd-cell title="安全设置" value="已开启" icon="lock" @click="handleIconClick('安全设置')" />
  <wd-cell title="消息通知" value="3条未读" icon="notification" @click="handleIconClick('消息通知')" />
</wd-cell-group>`,

    customTemplate: `<!-- 自定义图标 -->
<wd-cell title="自定义图标" value="查看详情" @click="handleIconClick('自定义图标')">
  <template #icon>
    <view class="custom-icon-security" />
  </template>
</wd-cell>`,

    style: `.custom-icon-security {
  display: block;
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  margin: 4px 4px 0 0;
  background: url('https://example.com/icon.png') no-repeat;
  background-size: cover;
}`,

    script: `const handleIconClick = (title: string) => {
  console.log('点击了图标单元格：', title)
}`,
  },

  // 分组标题代码
  group: {
    template: `<!-- 分组标题 -->
<wd-cell-group title="账户管理" value="2/5">
  <wd-cell title="实名认证" value="已认证" icon="check-circle" @click="handleGroupClick('实名认证')" />
  <wd-cell
    title="银行卡绑定"
    label="为保障您的资金安全，建议绑定银行卡"
    value="未绑定"
    icon="credit-card"
    @click="handleGroupClick('银行卡绑定')"
  />
</wd-cell-group>

<wd-cell-group title="系统设置">
  <wd-cell title="语言设置" value="简体中文" icon="language" @click="handleGroupClick('语言设置')" />
  <wd-cell title="主题模式" value="跟随系统" icon="theme" @click="handleGroupClick('主题模式')" />
</wd-cell-group>`,

    script: `const handleGroupClick = (title: string) => {
  console.log('点击了分组单元格：', title)
}`,
  },

  // 尺寸和样式代码
  size: {
    largeTemplate: `<!-- 大尺寸 -->
<wd-cell-group>
  <wd-cell size="large" title="VIP会员" value="黄金会员" icon="vip" @click="handleSizeClick('VIP会员')" />
  <wd-cell title="积分余额" value="12,580分" size="large" icon="gift" is-link @click="handleSizeClick('积分余额')" />
  <wd-cell size="large" title="推荐好友" label="邀请好友注册可获得积分奖励" value="去邀请" @click="handleSizeClick('推荐好友')" />
</wd-cell-group>`,

    borderTemplate: `<!-- 边框控制 -->
<wd-cell-group title="订单管理" border>
  <wd-cell title="待付款" value="5个订单" @click="handleSizeClick('待付款')" />
  <wd-cell :border="false" title="待发货" label="无边框示例" value="2个订单" @click="handleSizeClick('待发货')" />
  <wd-cell title="待收货" label="物流跟踪中" value="3个订单" @click="handleSizeClick('待收货')" />
</wd-cell-group>`,

    alignTemplate: `<!-- 对齐方式 -->
<wd-cell-group>
  <wd-cell title="顶部对齐" value="默认对齐方式" label="当有描述信息时，内容默认顶部对齐" @click="handleSizeClick('顶部对齐')" />
  <wd-cell
    title="垂直居中"
    value="居中对齐"
    label="设置center属性后，内容垂直居中显示"
    center
    @click="handleSizeClick('垂直居中')"
  />
</wd-cell-group>`,

    script: `const handleSizeClick = (title: string) => {
  console.log('点击了尺寸样式单元格：', title)
}`,
  },

  // 交互功能代码
  interactive: {
    template: `<!-- 交互功能 -->
<wd-cell-group>
  <wd-cell title="点击反馈" value="试试点击" clickable @click="handleInteractiveClick('点击反馈')" />
  <wd-cell title="帮助中心" is-link @click="handleInteractiveClick('帮助中心')" />
  <wd-cell title="设置中心" value="系统配置" is-link @click="handleInteractiveClick('设置中心')" />
  <wd-cell title="意见反馈" is-link @click="handleInteractiveClick('意见反馈')" />
  <wd-cell title="页面跳转" value="外部链接" is-link to="/pages/help/index" @click="handleInteractiveClick('页面跳转')" />
</wd-cell-group>`,

    script: `const handleInteractiveClick = (title: string) => {
  console.log('点击了交互单元格：', title)
  // 实际应用中可以进行页面跳转或其他操作
}`,
  },

  // 表单集成代码
  form: {
    template: `<!-- 表单集成 -->
<wd-cell-group border>
  <wd-cell title="服务评分" required center>
    <wd-rate v-model="formValues.rate" @change="handleFormChange('评分', $event)" />
  </wd-cell>
  <wd-cell title="价格范围" vertical>
    <wd-slider v-model="formValues.slider" :min="0" :max="1000" @change="handleFormChange('滑块', $event)" />
  </wd-cell>
  <wd-cell title="接收通知" center>
    <wd-switch v-model="formValues.switch" @change="handleFormChange('开关', $event)" />
  </wd-cell>
  <wd-cell title="选择日期" center>
    <wd-button size="small" plain @click="handleFormAction('选择日期')">
      {{ selectedDate }}
    </wd-button>
  </wd-cell>
</wd-cell-group>`,

    script: `const formValues = ref({
  rate: 3,
  slider: 300,
  switch: true,
})

const selectedDate = ref('2024-01-20')

const handleFormChange = (type: string, event: any) => {
  console.log(\`\${type}变更：\`, event.value)
}

const handleFormAction = (action: string) => {
  console.log('表单操作：', action)
}`,
  },

  // 自定义内容代码
  custom: {
    rightTemplate: `<!-- 自定义右侧内容 -->
<wd-cell title="快捷操作" center @click="handleCustomClick('快捷操作')">
  <wd-button size="small" plain>执行</wd-button>
</wd-cell>

<wd-cell title="消息推送" center>
  <wd-switch v-model="pushEnabled" @change="handleFormChange('消息推送', $event)" />
</wd-cell>`,

    titleTemplate: `<!-- 自定义标题 -->
<wd-cell center @click="handleCustomClick('会员服务')">
  <template #title>
    <view class="flex items-center">
      <view class="text-base">会员服务</view>
      <view class="member-tag">25天后到期</view>
    </view>
  </template>
  <wd-button size="small">续费</wd-button>
</wd-cell>`,

    complexTemplate: `<!-- 复杂自定义内容 -->
<wd-cell @click="handleCustomClick('用户信息')">
  <template #title>
    <view class="flex items-center">
      <image
        src="https://avatars.githubusercontent.com/u/26426873?v=4"
        class="mr-3 h-10 w-10 rounded-full"
      />
      <view>
        <view class="text-base font-medium">摸鱼达人</view>
        <view class="text-sm text-gray-500">最后活跃: 2分钟前</view>
      </view>
    </view>
  </template>
  <view class="flex space-x-2">
    <wd-button size="small" plain @click.stop="handleCustomAction('发消息')">发消息</wd-button>
    <wd-button size="small" @click.stop="handleCustomAction('查看资料')">查看</wd-button>
  </view>
</wd-cell>`,

    widthTemplate: `<!-- 标题宽度设置 -->
<wd-cell title="默认宽度" label="标题区域使用默认宽度" value="自适应内容长度" />
<wd-cell
  title="固定宽度"
  label="设置title-width属性可以固定标题区域宽度，确保对齐效果"
  title-width="200rpx"
  value="200rpx宽度"
/>`,

    style: `.member-tag {
  display: inline-block;
  margin-left: 8px;
  border: 1px solid #faa21e;
  padding: 0 4px;
  font-size: 10px;
  color: #faa21e;
  border-radius: 2px;
}

.custom-icon-security {
  display: block;
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  margin: 4px 4px 0 0;
  background: url('https://example.com/security-icon.png') no-repeat;
  background-size: cover;
}`,

    script: `const pushEnabled = ref(true)

const handleCustomClick = (title: string) => {
  console.log('点击了自定义单元格：', title)
}

const handleCustomAction = (action: string) => {
  console.log('自定义操作：', action)
}`,
  },

  // 状态展示代码
  status: {
    template: `<!-- 状态展示 -->
<wd-cell-group>
  <wd-cell title="系统状态" center @click="handleStatusClick('系统状态')">
    <view class="flex items-center">
      <view class="mr-2 h-2 w-2 rounded-full bg-green-500" />
      <text class="text-green-600">正常运行</text>
    </view>
  </wd-cell>
  <wd-cell title="网络连接" center @click="handleStatusClick('网络连接')">
    <view class="flex items-center">
      <view class="mr-2 h-2 w-2 rounded-full bg-orange-500" />
      <text class="text-orange-600">连接中...</text>
    </view>
  </wd-cell>
  <wd-cell title="数据同步" center @click="handleStatusClick('数据同步')">
    <view class="flex items-center">
      <view class="mr-2 h-2 w-2 rounded-full bg-red-500" />
      <text class="text-red-600">同步失败</text>
    </view>
  </wd-cell>
  <wd-cell title="存储空间" label="总容量：64GB" center @click="handleStatusClick('存储空间')">
    <view class="flex items-center">
      <view class="mr-2 text-sm text-gray-600">已用75%</view>
      <view class="h-2 w-16 rounded-full bg-gray-200">
        <view class="h-full w-3/4 rounded-full bg-blue-500" />
      </view>
    </view>
  </wd-cell>
</wd-cell-group>`,

    script: `const handleStatusClick = (title: string) => {
  console.log('点击了状态单元格：', title)
}`,
  },

  // 交互式配置代码
  config: {
    configTemplate: `<!-- 配置面板 -->
<view class="rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-sm font-medium text-gray-700">配置选项</view>

  <!-- 单元格大小 -->
  <view class="mb-4">
    <view class="mb-2 text-xs text-gray-600">单元格大小</view>
    <wd-radio-group v-model="configState.cellSize" direction="horizontal">
      <wd-radio value="normal">正常</wd-radio>
      <wd-radio value="large">大尺寸</wd-radio>
    </wd-radio-group>
  </view>

  <!-- 功能选项 -->
  <view class="mb-4">
    <view class="mb-2 text-xs text-gray-600">功能选项</view>
    <view class="grid grid-cols-2 gap-2">
      <wd-checkbox v-model="configState.showIcon" shape="square" size="small">显示图标</wd-checkbox>
      <wd-checkbox v-model="configState.showLabel" shape="square" size="small">显示描述</wd-checkbox>
      <wd-checkbox v-model="configState.showBorder" shape="square" size="small">显示边框</wd-checkbox>
      <wd-checkbox v-model="configState.isRequired" shape="square" size="small">必填标记</wd-checkbox>
    </view>
  </view>
</view>`,

    previewTemplate: `<!-- 实时预览 -->
<wd-cell-group :border="configState.showBorder">
  <wd-cell
    :title="currentDemoData.title"
    :value="configState.demoContent === 'form' ? undefined : currentDemoData.value"
    :label="configState.showLabel ? currentDemoData.label : undefined"
    :icon="configState.showIcon ? currentDemoData.icon : undefined"
    :size="configState.cellSize === 'large' ? 'large' : undefined"
    :required="configState.isRequired"
    :center="configState.centerAlign"
    :vertical="configState.verticalLayout"
    :is-link="configState.isLink"
    :clickable="configState.clickable"
    :border="configState.showBorder"
    @click="handleConfigPreviewClick"
  >
    <!-- 动态内容展示 -->
  </wd-cell>
</wd-cell-group>`,

    script: `// 交互式配置状态
const configState = ref({
  cellSize: 'normal',
  showIcon: true,
  showLabel: true,
  showBorder: false,
  isRequired: false,
  isLink: false,
  centerAlign: false,
  verticalLayout: false,
  clickable: true,
  demoContent: 'basic',
})

// 计算当前演示数据
const currentDemoData = computed(() => {
  if (configState.value.demoContent === 'form') {
    return demoData.form.switch
  }
  return demoData[configState.value.demoContent] || demoData.basic
})

const handleConfigPreviewClick = () => {
  console.log('配置预览单元格被点击')
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '标题',
  },
  {
    name: 'value',
    type: 'String | Number',
    default: '""',
    desc: '右侧内容',
  },
  {
    name: 'icon',
    type: 'String',
    default: '""',
    desc: '图标类名',
  },
  {
    name: 'label',
    type: 'String',
    default: '""',
    desc: '描述信息',
  },
  {
    name: 'is-link',
    type: 'Boolean',
    default: 'false',
    desc: '是否为跳转链接',
  },
  {
    name: 'to',
    type: 'String',
    default: '""',
    desc: '跳转地址',
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: '跳转时是否替换栈顶页面',
  },
  {
    name: 'clickable',
    type: 'Boolean',
    default: 'false',
    desc: '开启点击反馈，is-link 默认开启',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置单元格大小，可选值：large',
  },
  {
    name: 'border',
    type: 'Boolean',
    default: 'false',
    desc: '是否展示边框线',
  },
  {
    name: 'title-width',
    type: 'String',
    default: '""',
    desc: '设置左侧标题宽度',
  },
  {
    name: 'center',
    type: 'Boolean',
    default: 'false',
    desc: '是否垂直居中，默认顶部居中',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    desc: '是否必填',
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '表单属性，上下结构',
  },
  {
    name: 'prop',
    type: 'String',
    default: '""',
    desc: '表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的',
  },
  {
    name: 'rules',
    type: 'Array',
    default: '[]',
    desc: '表单验证规则，结合wd-form组件使用',
  },
  {
    name: 'custom-icon-class',
    type: 'String',
    default: '""',
    desc: 'icon 使用 slot 时的自定义样式',
  },
  {
    name: 'custom-label-class',
    type: 'String',
    default: '""',
    desc: 'label 使用 slot 时的自定义样式',
  },
  {
    name: 'custom-value-class',
    type: 'String',
    default: '""',
    desc: 'value 使用 slot 时的自定义样式',
  },
  {
    name: 'custom-title-class',
    type: 'String',
    default: '""',
    desc: 'title 使用 slot 时的自定义样式',
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

// Events 事件文档
const apiEvents = [
  {
    name: 'click',
    desc: '点击 cell 时触发',
  },
]

// Methods 方法文档（Cell 组件没有暴露方法）
const apiMethods: any[] = []

// ===== 计算属性 =====

/**
 * 计算当前演示数据
 */
const currentDemoData = computed<any>(() => {
  if (configState.value.demoContent === 'form') {
    return demoData.form.switch
  }
  return demoData[configState.value.demoContent as keyof typeof demoData] || demoData.basic
})

// ===== 工具方法 =====

/**
 * 添加操作记录
 */
const addOperationRecord = (message: string, type: OperationRecord['type'] = 'info') => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  })
  // 限制记录数量
  if (operationRecords.value.length > 20) {
    operationRecords.value = operationRecords.value.slice(0, 20)
  }
}

/**
 * 清空操作记录
 */
const clearRecords = () => {
  operationRecords.value = []
  addOperationRecord('清空了操作记录', 'success')
}

/**
 * 获取记录颜色类名
 */
const getRecordColor = (type: OperationRecord['type']) => {
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
 * 基本用法点击事件
 */
const handleBasicClick = (title: string) => {
  addOperationRecord(`基本单元格点击：${title}`, 'info')
  console.log('点击了基本单元格：', title)
}

/**
 * 图标展示点击事件
 */
const handleIconClick = (title: string) => {
  addOperationRecord(`图标单元格点击：${title}`, 'info')
  console.log('点击了图标单元格：', title)
}

/**
 * 分组点击事件
 */
const handleGroupClick = (title: string) => {
  addOperationRecord(`分组单元格点击：${title}`, 'info')
  console.log('点击了分组单元格：', title)
}

/**
 * 尺寸样式点击事件
 */
const handleSizeClick = (title: string) => {
  addOperationRecord(`尺寸样式单元格点击：${title}`, 'info')
  console.log('点击了尺寸样式单元格：', title)
}

/**
 * 交互功能点击事件
 */
const handleInteractiveClick = (title: string) => {
  addOperationRecord(`交互单元格点击：${title}`, 'info')
  console.log('点击了交互单元格：', title)
}

/**
 * 表单变更事件
 */
const handleFormChange = (type: string, event: any) => {
  addOperationRecord(`表单控件变更：${type} = ${event.value}`, 'success')
  console.log(`${type}变更：`, event.value)
}

/**
 * 表单操作事件
 */
const handleFormAction = (action: string) => {
  addOperationRecord(`表单操作：${action}`, 'info')
  console.log('表单操作：', action)
}

/**
 * 自定义内容点击事件
 */
const handleCustomClick = (title: string) => {
  addOperationRecord(`自定义单元格点击：${title}`, 'info')
  console.log('点击了自定义单元格：', title)
}

/**
 * 自定义操作事件
 */
const handleCustomAction = (action: string) => {
  addOperationRecord(`自定义操作：${action}`, 'warning')
  console.log('自定义操作：', action)
}

/**
 * 状态展示点击事件
 */
const handleStatusClick = (title: string) => {
  addOperationRecord(`状态单元格点击：${title}`, 'info')
  console.log('点击了状态单元格：', title)
}

/**
 * 配置预览点击事件
 */
const handleConfigPreviewClick = () => {
  addOperationRecord('配置预览单元格被点击', 'success')
  console.log('配置预览单元格被点击')
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
.custom-icon-security {
  display: block;
  box-sizing: border-box;
  width: 1rem;
  height: 1rem;
  margin: 4px 4px 0 0;
  background: url('https://img10.360buyimg.com/jmadvertisement/jfs/t1/71075/7/3762/1820/5d1f26d1E0d600b9e/a264c901943080ac.png')
    no-repeat;
  background-size: cover;
}

.member-tag {
  display: inline-block;
  margin-left: 8px;
  border: 1px solid #faa21e;
  padding: 0 4px;
  font-size: 10px;
  color: #faa21e;
  border-radius: 2px;
}
</style>
