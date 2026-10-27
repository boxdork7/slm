<!-- DemoApi.vue - 基于 wd-table 的API文档组件 -->
<template>
  <view class="mx-2 my-4">
    <!-- 使用 wd-cell-group 保持视觉一致性 -->
    <wd-cell-group>
      <!-- API 文档标题 -->
      <view class="p-4">
        <view class="text-base text-gray-900 font-500">{{ title }}API 文档</view>
      </view>

      <!-- Props 属性表格 -->
      <view v-if="props?.length" class="bg-white">
        <!-- Props 子标题 -->
        <view class="bg-gray-50 px-4 py-3">
          <view class="text-sm text-gray-700 font-600">Props</view>
        </view>

        <!-- 使用 wd-table 组件 -->
        <wd-table
          :data="props"
          :border="true"
          :stripe="true"
          :fixed-header="false"
          :ellipsis="false"
        >
          <wd-table-col prop="name" label="参数" :width="200" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.name, `复制参数：${row.name}`)"
              >
                <text class="code-text code-text-pink">
                  {{ row.name }}
                </text>
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="type" label="类型" :width="200" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.type, `复制类型：${row.type}`)"
              >
                <text class="code-text code-text-blue">
                  {{ row.type }}
                </text>
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="default" label="默认值" :width="200" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.default, `复制默认值：${row.default}`)"
              >
                <text class="code-text code-text-green">
                  {{ row.default }}
                </text>
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="desc" label="说明" :width="500" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.desc, `复制描述：${row.desc}`)"
              >
                <text class="desc-text">
                  {{ row.desc }}
                </text>
              </view>
            </template>
          </wd-table-col>
        </wd-table>
      </view>

      <!-- Methods 方法表格 -->
      <view v-if="methods?.length" class="border-t bg-white">
        <!-- Methods 子标题 -->
        <view class="bg-gray-50 px-4 py-3">
          <view class="text-sm text-gray-700 font-600">Methods</view>
        </view>

        <!-- 使用 wd-table 组件 -->
        <wd-table
          :data="methods"
          :border="true"
          :stripe="true"
          :fixed-header="false"
          :ellipsis="false"
        >
          <wd-table-col prop="name" label="方法名" :width="218" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.name, `复制方法名：${row.name}`)"
              >
                <text class="code-text code-text-pink">
                  {{ row.name }}
                </text>
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="desc" label="说明" :width="500" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.desc, `复制描述：${row.desc}`)"
              >
                <text class="desc-text">
                  {{ row.desc }}
                </text>
              </view>
            </template>
          </wd-table-col>
        </wd-table>
      </view>

      <!-- Events 事件表格 -->
      <view v-if="events?.length" class="border-t rounded-b-xl bg-white">
        <!-- Events 子标题 -->
        <view class="border-b border-gray-100 bg-gray-50 px-4 py-3">
          <view class="text-sm text-gray-700 font-semibold">Events</view>
        </view>

        <!-- 使用 wd-table 组件 -->
        <wd-table
          :data="events"
          :border="true"
          :stripe="true"
          :fixed-header="false"
          :ellipsis="false"
        >
          <wd-table-col prop="name" label="事件名" :width="218" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.name, `复制事件名：${row.name}`)"
              >
                <text class="code-text code-text-pink">
                  {{ row.name }}
                </text>
              </view>
            </template>
          </wd-table-col>

          <wd-table-col prop="desc" label="说明" :width="500" align="left">
            <template #value="{ row }">
              <view
                class="h-100% flex items-center"
                @click="copy(row.desc, `复制描述：${row.desc}`)"
              >
                <text class="desc-text">
                  {{ row.desc }}
                </text>
              </view>
            </template>
          </wd-table-col>
        </wd-table>
      </view>
    </wd-cell-group>
  </view>
</template>

<script setup lang="ts">
/**
 * 基于 wd-table 的 API 文档表格组件
 * 用于展示组件的 Props、Methods、Events 等 API 信息
 * 使用 WotUI 的原生表格组件，提供更专业的表格功能
 */

import { copy } from '@/utils/function'

/**
 * API 属性项接口定义
 */
interface ApiProp {
  /** 属性名称 */
  name: string
  /** 属性类型 */
  type: string
  /** 默认值 */
  default: string
  /** 属性描述 */
  desc: string
}

/**
 * API 方法项接口定义
 */
interface ApiMethod {
  /** 方法名称 */
  name: string
  /** 方法描述 */
  desc: string
}

/**
 * API 事件项接口定义
 */
interface ApiEvent {
  /** 事件名称 */
  name: string
  /** 事件描述 */
  desc: string
}

/**
 * 组件属性接口定义
 */
interface DemoApiProps {
  /** 标题 - 可选 */
  title?: string
  /** Props 列表 - 可选 */
  props?: ApiProp[]
  /** Methods 列表 - 可选 */
  methods?: ApiMethod[]
  /** Events 列表 - 可选 */
  events?: ApiEvent[]
}

/**
 * 定义组件属性
 */
defineProps<DemoApiProps>()

/**
 * 组件选项配置
 */
defineOptions({
  name: 'DemoApi',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
</script>

<style lang="scss" scoped>
// 代码文本基础样式
.code-text {
  font-family:
    'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas',
    monospace;
  font-weight: 600;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  display: inline-block;
  font-size: 26rpx;
}

// 粉色主题（参数名、方法名、事件名）
.code-text-pink {
  background-color: #fdf2f8;
  color: #ec4899;
}

// 蓝色主题（类型）
.code-text-blue {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

// 绿色主题（默认值）
.code-text-green {
  background-color: #f0fdf4;
  color: #16a34a;
  font-weight: 500;
}

// 描述文本样式
.desc-text {
  font-size: 12px;
  color: #374151;
  line-height: 1.6;
}
</style>
