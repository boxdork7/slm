<!-- Card 卡片 http://127.0.0.1:100/#/pages-sub/demo/wd/card -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Card 卡片" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的卡片形式，包含标题、内容和底部操作区域">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 基础卡片 -->
        <wd-card title="经营分析报告">
          <view class="space-y-2">
            <view class="flex justify-between">
              <text class="text-gray-600">本月营收</text>
              <text class="text-green-600 font-medium">¥125,680</text>
            </view>
            <view class="flex justify-between">
              <text class="text-gray-600">环比增长</text>
              <text class="text-red-500 font-medium">-5.2%</text>
            </view>
            <view class="flex justify-between">
              <text class="text-gray-600">订单数量</text>
              <text class="font-medium">2,456</text>
            </view>
          </view>
          <template #footer>
            <wd-button size="small" plain @click="handleBasicAction('查看详情')">
              查看详情
            </wd-button>
          </template>
        </wd-card>

        <!-- 带图片的卡片 -->
        <wd-card title="新订单通知">
          <view class="flex items-center">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              alt="商品图片"
              class="mr-3 h-18 w-18 rounded"
            />
            <view class="space-y-1">
              <view class="text-sm font-medium">蜜子兰 MIZLAND 新西兰进口多花种</view>
              <view class="text-xs text-gray-500">数量：1件</view>
              <view class="text-xs text-gray-500">金额：¥290.8</view>
              <view class="text-xs text-gray-500">买家昵称：Joy</view>
            </view>
          </view>
          <template #footer>
            <view class="flex space-x-2">
              <wd-button size="small" plain @click="handleBasicAction('忽略')">忽略</wd-button>
              <wd-button size="small" @click="handleBasicAction('处理订单')">处理订单</wd-button>
            </view>
          </template>
        </wd-card>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基础卡片" :code="codes.basic.basicTemplate" />
        <DemoCode title="模板 - 带图片卡片" :code="codes.basic.imageTemplate" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 无底部按钮示例 -->
    <DemoSection title="无底部按钮" desc="适用于纯信息展示的场景，不需要用户操作">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 用户档案卡片 -->
        <wd-card title="用户档案">
          <view class="flex items-center">
            <image
              src="https://avatars.githubusercontent.com/u/26426873?v=4"
              alt="头像"
              class="mr-3 h-12 w-12 rounded-full"
            />
            <view class="space-y-1">
              <view class="text-base font-medium">摸鱼达人</view>
              <view class="text-sm text-gray-500">高级会员 · 活跃用户</view>
              <view class="text-xs text-gray-400">最后登录：2024-01-20 14:30</view>
            </view>
          </view>
        </wd-card>

        <!-- 服务状态卡片 -->
        <wd-card>
          <template #title>
            <view class="flex items-center justify-between">
              <view class="flex items-center">
                <wd-icon name="warning" size="16px" class="mr-2 text-orange-500" />
                <text>服务即将到期</text>
              </view>
              <view class="flex items-center text-xs text-gray-400">
                <wd-icon name="time" size="12px" class="mr-1" />
                <text>2024-02-03 到期</text>
              </view>
            </view>
          </template>
          <view class="flex items-center">
            <image
              src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
              alt="服务图标"
              class="mr-3 h-12 w-12 rounded"
            />
            <view class="space-y-1">
              <view class="text-base font-medium">智云客服 CRM 短信催评营销</view>
              <view class="text-sm text-gray-500">高级版，快速细分，周期一年</view>
              <view class="text-xs text-gray-400">剩余使用时间：15天</view>
            </view>
          </view>
        </wd-card>
      </view>

      <template #codes>
        <DemoCode title="模板 - 用户档案卡片" :code="codes.noFooter.userTemplate" />
        <DemoCode title="模板 - 自定义标题卡片" :code="codes.noFooter.customTitleTemplate" />
        <DemoCode title="脚本 - 无底部按钮" :code="codes.noFooter.script" />
      </template>
    </DemoSection>

    <!-- 矩形卡片示例 -->
    <DemoSection title="矩形卡片" desc="适用于列表页面，卡片之间无间距，视觉上更紧凑">
      <!-- 示例效果展示 -->
      <view class="rounded-xl bg-white">
        <view class="space-y-0">
          <!-- 系统通知卡片 -->
          <wd-card title="系统通知" type="rectangle">
            <view class="flex items-start">
              <view
                class="mr-3 h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100"
              >
                <wd-icon name="notification" size="16px" class="text-blue-600" />
              </view>
              <view class="flex-1 space-y-1">
                <view class="text-base font-medium">版本更新通知</view>
                <view class="text-sm text-gray-600">新版本已发布，包含多项功能优化和Bug修复</view>
                <view class="text-xs text-gray-400">2024-01-20 10:30</view>
              </view>
            </view>
            <template #footer>
              <view class="flex justify-end space-x-2">
                <wd-button size="small" plain @click="handleRectangleAction('稍后提醒')">
                  稍后提醒
                </wd-button>
                <wd-button size="small" @click="handleRectangleAction('立即更新')">
                  立即更新
                </wd-button>
              </view>
            </template>
          </wd-card>

          <!-- 活动推荐卡片 -->
          <wd-card type="rectangle">
            <template #title>
              <view class="flex items-center justify-between">
                <view class="flex items-center">
                  <wd-icon name="gift" size="16px" class="mr-2 text-red-500" />
                  <text>活动推荐</text>
                </view>
                <view class="flex items-center text-xs text-red-500">
                  <wd-icon name="fire" size="12px" class="mr-1" />
                  <text>热门</text>
                </view>
              </view>
            </template>
            <view class="flex items-center">
              <image
                src="https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg"
                alt="活动图片"
                class="mr-3 h-16 w-16 rounded"
              />
              <view class="space-y-1">
                <view class="text-base font-medium">春节大促销</view>
                <view class="text-sm text-gray-500">全场商品5折起，满300减50</view>
                <view class="text-xs text-red-500">活动时间：2024-01-20 至 2024-02-10</view>
              </view>
            </view>
            <template #footer>
              <view class="flex justify-end space-x-2">
                <wd-button size="small" plain @click="handleRectangleAction('分享')">
                  分享
                </wd-button>
                <wd-button size="small" @click="handleRectangleAction('参与活动')">
                  参与活动
                </wd-button>
              </view>
            </template>
          </wd-card>

          <!-- 数据统计卡片 -->
          <wd-card title="数据统计" type="rectangle">
            <view class="grid grid-cols-3 gap-4">
              <view class="text-center">
                <view class="text-2xl text-blue-600 font-bold">1,234</view>
                <view class="text-xs text-gray-500">今日访问</view>
              </view>
              <view class="text-center">
                <view class="text-2xl text-green-600 font-bold">56</view>
                <view class="text-xs text-gray-500">新增用户</view>
              </view>
              <view class="text-center">
                <view class="text-2xl text-orange-600 font-bold">89%</view>
                <view class="text-xs text-gray-500">转化率</view>
              </view>
            </view>
          </wd-card>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 系统通知卡片" :code="codes.rectangle.notificationTemplate" />
        <DemoCode title="模板 - 活动推荐卡片" :code="codes.rectangle.activityTemplate" />
        <DemoCode title="模板 - 数据统计卡片" :code="codes.rectangle.statisticsTemplate" />
        <DemoCode title="脚本 - 矩形卡片" :code="codes.rectangle.script" />
      </template>
    </DemoSection>

    <!-- 主题样式示例 -->
    <DemoSection title="主题样式" desc="展示不同样式主题和自定义配置的效果">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 成功主题 -->
        <wd-card title="操作成功" custom-style="border-left: 4px solid #28a745;">
          <view class="flex items-center">
            <wd-icon name="check-circle" size="20px" class="mr-3 text-green-500" />
            <view class="space-y-1">
              <view class="text-base text-green-700 font-medium">数据同步完成</view>
              <view class="text-sm text-gray-600">所有数据已成功同步到服务器</view>
            </view>
          </view>
        </wd-card>

        <!-- 警告主题 -->
        <wd-card
          title="注意事项"
          custom-style="border-left: 4px solid #ffc107; background: #fff8e1;"
        >
          <view class="flex items-center">
            <wd-icon name="warning" size="20px" class="mr-3 text-orange-500" />
            <view class="space-y-1">
              <view class="text-base text-orange-700 font-medium">存储空间不足</view>
              <view class="text-sm text-gray-600">建议清理不必要的文件或升级存储空间</view>
            </view>
          </view>
          <template #footer>
            <wd-button size="small" @click="handleThemeAction('清理文件')">清理文件</wd-button>
          </template>
        </wd-card>

        <!-- 错误主题 -->
        <wd-card
          title="系统错误"
          custom-style="border-left: 4px solid #dc3545; background: #ffebee;"
        >
          <view class="flex items-center">
            <wd-icon name="close-circle" size="20px" class="mr-3 text-red-500" />
            <view class="space-y-1">
              <view class="text-base text-red-700 font-medium">连接失败</view>
              <view class="text-sm text-gray-600">无法连接到服务器，请检查网络设置</view>
            </view>
          </view>
          <template #footer>
            <view class="flex justify-end space-x-2">
              <wd-button size="small" plain @click="handleThemeAction('取消')">取消</wd-button>
              <wd-button size="small" @click="handleThemeAction('重试')">重试</wd-button>
            </view>
          </template>
        </wd-card>

        <!-- 信息主题 -->
        <wd-card
          title="系统提示"
          custom-style="border-left: 4px solid #17a2b8; background: #e3f2fd;"
        >
          <view class="flex items-center">
            <wd-icon name="info-circle" size="20px" class="mr-3 text-blue-500" />
            <view class="space-y-1">
              <view class="text-base text-blue-700 font-medium">新功能上线</view>
              <view class="text-sm text-gray-600">我们为您推出了全新的数据分析功能</view>
            </view>
          </view>
          <template #footer>
            <view class="flex justify-end space-x-2">
              <wd-button size="small" plain @click="handleThemeAction('稍后查看')">
                稍后查看
              </wd-button>
              <wd-button size="small" @click="handleThemeAction('立即体验')">立即体验</wd-button>
            </view>
          </template>
        </wd-card>
      </view>

      <template #codes>
        <DemoCode title="模板 - 成功主题" :code="codes.theme.successTemplate" />
        <DemoCode title="模板 - 警告主题" :code="codes.theme.warningTemplate" />
        <DemoCode title="模板 - 错误主题" :code="codes.theme.errorTemplate" />
        <DemoCode title="模板 - 信息主题" :code="codes.theme.infoTemplate" />
        <DemoCode title="脚本 - 主题样式" :code="codes.theme.script" />
      </template>
    </DemoSection>

    <!-- 交互式配置示例 -->
    <DemoSection title="交互式配置" desc="通过配置选项实时预览不同的卡片效果">
      <!-- 配置面板 -->
      <view class="space-y-4">
        <!-- 配置选项 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">配置选项</view>

          <!-- 卡片类型选择 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">卡片类型</view>
            <wd-radio-group v-model="cardType" direction="horizontal">
              <wd-radio value="normal">普通卡片</wd-radio>
              <wd-radio value="rectangle">矩形卡片</wd-radio>
            </wd-radio-group>
          </view>

          <!-- 演示数据选择 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">演示场景</view>
            <wd-radio-group v-model="demoScene" direction="horizontal">
              <wd-radio value="business">商业分析</wd-radio>
              <wd-radio value="order">订单详情</wd-radio>
              <wd-radio value="service">服务管理</wd-radio>
              <wd-radio value="user">用户信息</wd-radio>
            </wd-radio-group>
          </view>

          <!-- 功能选项 -->
          <view>
            <view class="mb-2 text-xs text-gray-600">功能选项</view>
            <view class="grid grid-cols-2 gap-2">
              <wd-checkbox v-model="showTitle" shape="square" size="small">显示标题</wd-checkbox>
              <wd-checkbox v-model="showFooter" shape="square" size="small">
                显示底部按钮
              </wd-checkbox>
              <wd-checkbox v-model="showImage" shape="square" size="small">显示图片</wd-checkbox>
              <wd-checkbox v-model="useCustomTitle" shape="square" size="small">
                自定义标题
              </wd-checkbox>
            </view>
          </view>
        </view>

        <!-- 实时预览 -->
        <view class="rounded-lg bg-white p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">实时预览</view>
          <view :class="cardType === 'rectangle' ? 'rounded-xl bg-white' : ''">
            <wd-card
              :title="showTitle && !useCustomTitle ? currentData.title : undefined"
              :type="cardType === 'rectangle' ? 'rectangle' : undefined"
            >
              <!-- 自定义标题 -->
              <template v-if="showTitle && useCustomTitle" #title>
                <view class="flex items-center justify-between">
                  <view class="flex items-center">
                    <wd-icon :name="currentData.titleIcon" size="16px" class="mr-2 text-blue-500" />
                    <text>{{ currentData.title }}</text>
                  </view>
                  <view v-if="currentData.status" class="flex items-center text-xs text-gray-400">
                    <wd-icon name="time" size="12px" class="mr-1" />
                    <text>{{ currentData.status }}</text>
                  </view>
                </view>
              </template>

              <!-- 内容区域 -->
              <view class="space-y-3">
                <view v-if="showImage && currentData.image" class="flex items-start">
                  <image
                    :src="currentData.image"
                    :alt="currentData.imageAlt"
                    class="mr-3 h-16 w-16 flex-shrink-0 rounded"
                  />
                  <view class="flex-1 space-y-1">
                    <view class="text-base font-medium">{{ currentData.name }}</view>
                    <view
                      v-for="(detail, index) in currentData.details"
                      :key="index"
                      class="text-sm text-gray-600"
                    >
                      {{ detail }}
                    </view>
                  </view>
                </view>

                <view v-else>
                  <view class="mb-2 text-base font-medium">{{ currentData.name }}</view>
                  <view
                    v-for="(detail, index) in currentData.details"
                    :key="index"
                    class="mb-1 text-sm text-gray-600"
                  >
                    {{ detail }}
                  </view>
                </view>
              </view>

              <!-- 底部按钮 -->
              <template v-if="showFooter" #footer>
                <view class="flex justify-end space-x-2">
                  <wd-button
                    v-for="(button, index) in currentData.buttons"
                    :key="index"
                    size="small"
                    :plain="button.type === 'secondary'"
                    @click="handleInteractiveAction(button.text)"
                  >
                    {{ button.text }}
                  </wd-button>
                </view>
              </template>
            </wd-card>
          </view>
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
              class="mb-1 text-sm text-gray-600"
            >
              [{{ record.time }}] {{ record.message }}
            </view>
            <view
              v-if="operationRecords.length === 0"
              class="py-8 text-center text-sm text-gray-400"
            >
              暂无操作记录，点击卡片中的按钮查看效果
            </view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 配置面板" :code="codes.interactive.configTemplate" />
        <DemoCode title="模板 - 实时预览" :code="codes.interactive.previewTemplate" />
        <DemoCode title="脚本 - 交互配置" :code="codes.interactive.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== 组件状态管理 =====

// 交互式配置状态
const cardType = ref<string>('normal')
const demoScene = ref<string>('business')
const showTitle = ref<boolean>(true)
const showFooter = ref<boolean>(true)
const showImage = ref<boolean>(true)
const useCustomTitle = ref<boolean>(false)

// 操作记录
interface OperationRecord {
  time: string
  message: string
}

const operationRecords = ref<OperationRecord[]>([])

// 演示数据
const demoData = {
  business: {
    title: '经营分析报告',
    titleIcon: 'chart',
    status: '实时更新',
    name: '本月业务概览',
    image:
      'https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg',
    imageAlt: '分析图表',
    details: [
      '总营收：¥125,680（环比 -5.2%）',
      '订单数：2,456单（环比 +12.3%）',
      '客单价：¥51.2（环比 -15.8%）',
      '活跃用户：1,234人',
    ],
    buttons: [
      { text: '导出报告', type: 'secondary' },
      { text: '查看详情', type: 'primary' },
    ],
  },
  order: {
    title: '订单 #20240120001',
    titleIcon: 'cart',
    status: '待处理',
    name: '蜜子兰 MIZLAND 新西兰进口多花种',
    image:
      'https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg',
    imageAlt: '商品图片',
    details: ['数量：1件', '单价：¥290.8', '买家：Joy（VIP会员）', '下单时间：2024-01-20 14:30'],
    buttons: [
      { text: '拒绝', type: 'secondary' },
      { text: '接受订单', type: 'primary' },
    ],
  },
  service: {
    title: '智云客服 CRM',
    titleIcon: 'service',
    status: '15天后到期',
    name: '短信催评营销服务',
    image:
      'https://img11.360buyimg.com/imagetools/jfs/t1/143248/37/5695/265818/5f3a8546E98d998a4/745897ca9c9e474b.jpg',
    imageAlt: '服务图标',
    details: [
      '服务等级：高级版',
      '功能特色：快速细分，智能推送',
      '服务周期：一年',
      '使用情况：活跃使用中',
    ],
    buttons: [
      { text: '评价服务', type: 'secondary' },
      { text: '续费', type: 'primary' },
    ],
  },
  user: {
    title: '用户档案',
    titleIcon: 'user',
    status: '在线',
    name: '摸鱼达人',
    image: 'https://avatars.githubusercontent.com/u/26426873?v=4',
    imageAlt: '用户头像',
    details: ['会员等级：高级会员', '注册时间：2023-05-15', '最后登录：刚刚', '积分余额：2,580分'],
    buttons: [
      { text: '发送消息', type: 'secondary' },
      { text: '查看详情', type: 'primary' },
    ],
  },
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    basicTemplate: `<!-- 基础卡片 -->
<wd-card title="经营分析报告">
  <view class="space-y-2">
    <view class="flex justify-between">
      <text class="text-gray-600">本月营收</text>
      <text class="font-medium text-green-600">¥125,680</text>
    </view>
    <view class="flex justify-between">
      <text class="text-gray-600">环比增长</text>
      <text class="font-medium text-red-500">-5.2%</text>
    </view>
    <view class="flex justify-between">
      <text class="text-gray-600">订单数量</text>
      <text class="font-medium">2,456</text>
    </view>
  </view>
  <template #footer>
    <wd-button size="small" plain @click="handleBasicAction('查看详情')">查看详情</wd-button>
  </template>
</wd-card>`,

    imageTemplate: `<!-- 带图片的卡片 -->
<wd-card title="新订单通知">
  <view class="flex items-center">
    <image
      src="https://example.com/product.jpg"
      alt="商品图片"
      class="mr-3 h-18 w-18 rounded"
    />
    <view class="space-y-1">
      <view class="text-sm font-medium">蜜子兰 MIZLAND 新西兰进口多花种</view>
      <view class="text-xs text-gray-500">数量：1件</view>
      <view class="text-xs text-gray-500">金额：¥290.8</view>
      <view class="text-xs text-gray-500">买家昵称：Joy</view>
    </view>
  </view>
  <template #footer>
    <view class="flex space-x-2">
      <wd-button size="small" plain @click="handleBasicAction('忽略')">忽略</wd-button>
      <wd-button size="small" @click="handleBasicAction('处理订单')">处理订单</wd-button>
    </view>
  </template>
</wd-card>`,

    script: `const handleBasicAction = (action: string) => {
  console.log('基本卡片操作：', action)
}`,
  },

  // 无底部按钮代码
  noFooter: {
    userTemplate: `<!-- 用户档案卡片 -->
<wd-card title="用户档案">
  <view class="flex items-center">
    <image
      src="https://avatars.githubusercontent.com/u/26426873?v=4"
      alt="头像"
      class="mr-3 h-12 w-12 rounded-full"
    />
    <view class="space-y-1">
      <view class="text-base font-medium">摸鱼达人</view>
      <view class="text-sm text-gray-500">高级会员 · 活跃用户</view>
      <view class="text-xs text-gray-400">最后登录：2024-01-20 14:30</view>
    </view>
  </view>
</wd-card>`,

    customTitleTemplate: `<!-- 自定义标题卡片 -->
<wd-card>
  <template #title>
    <view class="flex items-center justify-between">
      <view class="flex items-center">
        <wd-icon name="warning" size="16px" class="mr-2 text-orange-500" />
        <text>服务即将到期</text>
      </view>
      <view class="flex items-center text-xs text-gray-400">
        <wd-icon name="time" size="12px" class="mr-1" />
        <text>2024-02-03 到期</text>
      </view>
    </view>
  </template>
  <view class="flex items-center">
    <image
      src="https://example.com/service.jpg"
      alt="服务图标"
      class="mr-3 h-12 w-12 rounded"
    />
    <view class="space-y-1">
      <view class="text-base font-medium">智云客服 CRM 短信催评营销</view>
      <view class="text-sm text-gray-500">高级版，快速细分，周期一年</view>
      <view class="text-xs text-gray-400">剩余使用时间：15天</view>
    </view>
  </view>
</wd-card>`,

    script: `// 无底部按钮卡片示例
// 适用于纯信息展示场景，不需要用户操作`,
  },

  // 矩形卡片代码
  rectangle: {
    notificationTemplate: `<!-- 系统通知卡片 -->
<wd-card title="系统通知" type="rectangle">
  <view class="flex items-start">
    <view class="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
      <wd-icon name="notification" size="16px" class="text-blue-600" />
    </view>
    <view class="flex-1 space-y-1">
      <view class="text-base font-medium">版本更新通知</view>
      <view class="text-sm text-gray-600">新版本已发布，包含多项功能优化和Bug修复</view>
      <view class="text-xs text-gray-400">2024-01-20 10:30</view>
    </view>
  </view>
  <template #footer>
    <view class="flex justify-end space-x-2">
      <wd-button size="small" plain @click="handleRectangleAction('稍后提醒')">稍后提醒</wd-button>
      <wd-button size="small" @click="handleRectangleAction('立即更新')">立即更新</wd-button>
    </view>
  </template>
</wd-card>`,

    activityTemplate: `<!-- 活动推荐卡片 -->
<wd-card type="rectangle">
  <template #title>
    <view class="flex items-center justify-between">
      <view class="flex items-center">
        <wd-icon name="gift" size="16px" class="mr-2 text-red-500" />
        <text>活动推荐</text>
      </view>
      <view class="flex items-center text-xs text-red-500">
        <wd-icon name="fire" size="12px" class="mr-1" />
        <text>热门</text>
      </view>
    </view>
  </template>
  <view class="flex items-center">
    <image
      src="https://example.com/activity.jpg"
      alt="活动图片"
      class="mr-3 h-16 w-16 rounded"
    />
    <view class="space-y-1">
      <view class="text-base font-medium">春节大促销</view>
      <view class="text-sm text-gray-500">全场商品5折起，满300减50</view>
      <view class="text-xs text-red-500">活动时间：2024-01-20 至 2024-02-10</view>
    </view>
  </view>
  <template #footer>
    <view class="flex justify-end space-x-2">
      <wd-button size="small" plain @click="handleRectangleAction('分享')">分享</wd-button>
      <wd-button size="small" @click="handleRectangleAction('参与活动')">参与活动</wd-button>
    </view>
  </template>
</wd-card>`,

    statisticsTemplate: `<!-- 数据统计卡片 -->
<wd-card title="数据统计" type="rectangle">
  <view class="grid grid-cols-3 gap-4">
    <view class="text-center">
      <view class="text-2xl font-bold text-blue-600">1,234</view>
      <view class="text-xs text-gray-500">今日访问</view>
    </view>
    <view class="text-center">
      <view class="text-2xl font-bold text-green-600">56</view>
      <view class="text-xs text-gray-500">新增用户</view>
    </view>
    <view class="text-center">
      <view class="text-2xl font-bold text-orange-600">89%</view>
      <view class="text-xs text-gray-500">转化率</view>
    </view>
  </view>
</wd-card>`,

    script: `const handleRectangleAction = (action: string) => {
  console.log('矩形卡片操作：', action)
}`,
  },

  // 主题样式代码
  theme: {
    successTemplate: `<!-- 成功主题 -->
<wd-card title="操作成功" custom-style="border-left: 4px solid #28a745;">
  <view class="flex items-center">
    <wd-icon name="check-circle" size="20px" class="mr-3 text-green-500" />
    <view class="space-y-1">
      <view class="text-base font-medium text-green-700">数据同步完成</view>
      <view class="text-sm text-gray-600">所有数据已成功同步到服务器</view>
    </view>
  </view>
</wd-card>`,

    warningTemplate: `<!-- 警告主题 -->
<wd-card
  title="注意事项"
  custom-style="border-left: 4px solid #ffc107; background: #fff8e1;"
>
  <view class="flex items-center">
    <wd-icon name="warning" size="20px" class="mr-3 text-orange-500" />
    <view class="space-y-1">
      <view class="text-base font-medium text-orange-700">存储空间不足</view>
      <view class="text-sm text-gray-600">建议清理不必要的文件或升级存储空间</view>
    </view>
  </view>
  <template #footer>
    <wd-button size="small" @click="handleThemeAction('清理文件')">清理文件</wd-button>
  </template>
</wd-card>`,

    errorTemplate: `<!-- 错误主题 -->
<wd-card
  title="系统错误"
  custom-style="border-left: 4px solid #dc3545; background: #ffebee;"
>
  <view class="flex items-center">
    <wd-icon name="close-circle" size="20px" class="mr-3 text-red-500" />
    <view class="space-y-1">
      <view class="text-base font-medium text-red-700">连接失败</view>
      <view class="text-sm text-gray-600">无法连接到服务器，请检查网络设置</view>
    </view>
  </view>
  <template #footer>
    <view class="flex justify-end space-x-2">
      <wd-button size="small" plain @click="handleThemeAction('取消')">取消</wd-button>
      <wd-button size="small" @click="handleThemeAction('重试')">重试</wd-button>
    </view>
  </template>
</wd-card>`,

    infoTemplate: `<!-- 信息主题 -->
<wd-card
  title="系统提示"
  custom-style="border-left: 4px solid #17a2b8; background: #e3f2fd;"
>
  <view class="flex items-center">
    <wd-icon name="info-circle" size="20px" class="mr-3 text-blue-500" />
    <view class="space-y-1">
      <view class="text-base font-medium text-blue-700">新功能上线</view>
      <view class="text-sm text-gray-600">我们为您推出了全新的数据分析功能</view>
    </view>
  </view>
  <template #footer>
    <view class="flex justify-end space-x-2">
      <wd-button size="small" plain @click="handleThemeAction('稍后查看')">稍后查看</wd-button>
      <wd-button size="small" @click="handleThemeAction('立即体验')">立即体验</wd-button>
    </view>
  </template>
</wd-card>`,

    script: `const handleThemeAction = (action: string) => {
  console.log('主题卡片操作：', action)
}`,
  },

  // 交互式配置代码
  interactive: {
    configTemplate: `<!-- 配置面板 -->
<view class="rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-sm font-medium text-gray-700">配置选项</view>

  <!-- 卡片类型选择 -->
  <view class="mb-4">
    <view class="mb-2 text-xs text-gray-600">卡片类型</view>
    <wd-radio-group v-model="cardType" direction="horizontal">
      <wd-radio value="normal">普通卡片</wd-radio>
      <wd-radio value="rectangle">矩形卡片</wd-radio>
    </wd-radio-group>
  </view>

  <!-- 功能选项 -->
  <view>
    <view class="mb-2 text-xs text-gray-600">功能选项</view>
    <view class="grid grid-cols-2 gap-2">
      <wd-checkbox v-model="showTitle" shape="square" size="small">显示标题</wd-checkbox>
      <wd-checkbox v-model="showFooter" shape="square" size="small">显示底部按钮</wd-checkbox>
      <wd-checkbox v-model="showImage" shape="square" size="small">显示图片</wd-checkbox>
      <wd-checkbox v-model="useCustomTitle" shape="square" size="small">自定义标题</wd-checkbox>
    </view>
  </view>
</view>`,

    previewTemplate: `<!-- 实时预览 -->
<wd-card
  :title="showTitle && !useCustomTitle ? currentData.title : undefined"
  :type="cardType === 'rectangle' ? 'rectangle' : undefined"
>
  <!-- 自定义标题 -->
  <template v-if="showTitle && useCustomTitle" #title>
    <view class="flex items-center justify-between">
      <view class="flex items-center">
        <wd-icon :name="currentData.titleIcon" size="16px" class="mr-2 text-blue-500" />
        <text>{{ currentData.title }}</text>
      </view>
      <view v-if="currentData.status" class="flex items-center text-xs text-gray-400">
        <wd-icon name="time" size="12px" class="mr-1" />
        <text>{{ currentData.status }}</text>
      </view>
    </view>
  </template>

  <!-- 内容区域 -->
  <view class="space-y-3">
    <!-- 内容展示逻辑 -->
  </view>

  <!-- 底部按钮 -->
  <template v-if="showFooter" #footer>
    <view class="flex justify-end space-x-2">
      <wd-button
        v-for="(button, index) in currentData.buttons"
        :key="index"
        size="small"
        :plain="button.type === 'secondary'"
        @click="handleInteractiveAction(button.text)"
      >
        {{ button.text }}
      </wd-button>
    </view>
  </template>
</wd-card>`,

    script: `// 交互式配置状态
const cardType = ref('normal')
const demoScene = ref('business')
const showTitle = ref(true)
const showFooter = ref(true)
const showImage = ref(true)
const useCustomTitle = ref(false)

// 计算当前演示数据
const currentData = computed(() => {
  return demoData[demoScene.value as keyof typeof demoData]
})

const handleInteractiveAction = (action: string) => {
  addOperationRecord(\`交互式配置操作：\${action}\`)
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
    desc: '卡片标题',
  },
  {
    name: 'type',
    type: 'String',
    default: '""',
    desc: '卡片类型，可选值：rectangle',
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
  {
    name: 'custom-title-class',
    type: 'String',
    default: '""',
    desc: '标题自定义样式类',
  },
  {
    name: 'custom-content-class',
    type: 'String',
    default: '""',
    desc: '内容自定义样式类',
  },
  {
    name: 'custom-footer-class',
    type: 'String',
    default: '""',
    desc: '底部自定义样式类',
  },
]

// Events 事件文档（Card 组件没有事件）
const apiEvents: any[] = []

// Methods 方法文档（Card 组件没有暴露方法）
const apiMethods: any[] = []

// ===== 计算属性 =====

/**
 * 计算当前演示数据
 */
const currentData = computed(() => {
  return demoData[demoScene.value as keyof typeof demoData]
})

// ===== 工具方法 =====

/**
 * 添加操作记录
 */
const addOperationRecord = (message: string) => {
  operationRecords.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  })
  // 限制记录数量
  if (operationRecords.value.length > 15) {
    operationRecords.value = operationRecords.value.slice(0, 15)
  }
}

/**
 * 清空操作记录
 */
const clearRecords = () => {
  operationRecords.value = []
  addOperationRecord('清空了操作记录')
}

// ===== 事件处理方法 =====

/**
 * 基本卡片操作事件
 */
const handleBasicAction = (action: string) => {
  addOperationRecord(`基本卡片操作：${action}`)
  console.log('基本卡片操作：', action)
}

/**
 * 矩形卡片操作事件
 */
const handleRectangleAction = (action: string) => {
  addOperationRecord(`矩形卡片操作：${action}`)
  console.log('矩形卡片操作：', action)
}

/**
 * 主题卡片操作事件
 */
const handleThemeAction = (action: string) => {
  addOperationRecord(`主题卡片操作：${action}`)
  console.log('主题卡片操作：', action)
}

/**
 * 交互式配置操作事件
 */
const handleInteractiveAction = (action: string) => {
  addOperationRecord(`交互式配置操作：${action}`)
  console.log('交互式配置操作：', action)
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
