<!-- Checkbox 复选框 http://127.0.0.1:100/#/pages-sub/demo/wd/checkbox -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Checkbox 复选框" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的复选框，支持单独使用">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-checkbox v-model="basicCheck" @change="handleBasicChange('基本复选框', $event)">
          我已阅读并同意用户协议
        </wd-checkbox>
        <view class="text-sm text-gray-500">当前值：{{ basicCheck }}</view>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 形状变化示例 -->
    <DemoSection title="形状变化" desc="支持圆形、方形和按钮三种形状">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">圆形（默认）</view>
          <wd-checkbox v-model="shapeChecks.circle" @change="handleShapeChange('圆形', $event)">
            圆形复选框
          </wd-checkbox>
        </view>
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">方形</view>
          <wd-checkbox
            v-model="shapeChecks.square"
            shape="square"
            @change="handleShapeChange('方形', $event)"
          >
            方形复选框
          </wd-checkbox>
        </view>
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">按钮</view>
          <wd-checkbox
            v-model="shapeChecks.button"
            shape="button"
            @change="handleShapeChange('按钮', $event)"
          >
            按钮复选框
          </wd-checkbox>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 形状变化" :code="codes.shape.template" />
        <DemoCode title="脚本 - 形状变化" :code="codes.shape.script" />
      </template>
    </DemoSection>

    <!-- 自定义颜色示例 -->
    <DemoSection title="自定义颜色" desc="可以自定义选中状态的颜色">
      <!-- 示例效果展示 -->
      <view class="space-y-3">
        <wd-checkbox
          v-model="colorChecks.red"
          checked-color="#ff4757"
          shape="circle"
          @change="handleColorChange('红色主题', $event)"
        >
          红色主题
        </wd-checkbox>
        <wd-checkbox
          v-model="colorChecks.green"
          checked-color="#2ed573"
          shape="square"
          @change="handleColorChange('绿色主题', $event)"
        >
          绿色主题
        </wd-checkbox>
        <wd-checkbox
          v-model="colorChecks.orange"
          checked-color="#ffa502"
          shape="button"
          @change="handleColorChange('橙色主题', $event)"
        >
          橙色主题
        </wd-checkbox>
        <wd-checkbox
          v-model="colorChecks.purple"
          checked-color="#8e44ad"
          shape="circle"
          @change="handleColorChange('紫色主题', $event)"
        >
          紫色主题
        </wd-checkbox>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.color.template" />
        <DemoCode title="脚本 - 自定义颜色" :code="codes.color.script" />
      </template>
    </DemoSection>

    <!-- 禁用状态示例 -->
    <DemoSection title="禁用状态" desc="可以禁用整个分组或单个复选框">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 整体禁用 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">整体禁用</view>
          <wd-checkbox-group
            v-model="disabledGroup1"
            disabled
            @change="handleGroupChange('整体禁用组', $event)"
          >
            <wd-checkbox :model-value="1">选项一</wd-checkbox>
            <wd-checkbox :model-value="2" :disabled="false">选项二（强制启用）</wd-checkbox>
            <wd-checkbox :model-value="3" shape="square">选项三</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 按钮禁用 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">按钮禁用</view>
          <wd-checkbox-group
            v-model="disabledGroup2"
            disabled
            shape="button"
            @change="handleGroupChange('按钮禁用组', $event)"
          >
            <wd-checkbox :model-value="1">选项A</wd-checkbox>
            <wd-checkbox :model-value="2">选项B</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 单个禁用 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">单个禁用</view>
          <wd-checkbox-group
            v-model="disabledGroup3"
            @change="handleGroupChange('单个禁用组', $event)"
          >
            <wd-checkbox :model-value="1">正常选项</wd-checkbox>
            <wd-checkbox :model-value="2" disabled>禁用选项</wd-checkbox>
            <wd-checkbox :model-value="3">正常选项</wd-checkbox>
          </wd-checkbox-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 整体禁用" :code="codes.disabled.groupTemplate" />
        <DemoCode title="模板 - 单个禁用" :code="codes.disabled.singleTemplate" />
        <DemoCode title="脚本 - 禁用状态" :code="codes.disabled.script" />
      </template>
    </DemoSection>

    <!-- 自定义值示例 -->
    <DemoSection title="自定义值" desc="可以自定义选中和未选中时的值">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <wd-checkbox
          v-model="customValueCheck"
          true-value="已同意"
          false-value="未同意"
          @change="handleCustomValueChange('自定义值', $event)"
        >
          同意服务条款
        </wd-checkbox>
        <view class="text-sm text-gray-500">当前值：{{ customValueCheck }}</view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义值" :code="codes.customValue.template" />
        <DemoCode title="脚本 - 自定义值" :code="codes.customValue.script" />
      </template>
    </DemoSection>

    <!-- 布局方式示例 -->
    <DemoSection title="布局方式" desc="支持垂直排列和水平排列">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 垂直排列 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">垂直排列（默认）</view>
          <wd-checkbox-group
            v-model="layoutGroup1"
            @change="handleGroupChange('垂直排列组', $event)"
          >
            <wd-checkbox :model-value="1">选项一</wd-checkbox>
            <wd-checkbox :model-value="2">选项二</wd-checkbox>
            <wd-checkbox :model-value="3">选项三</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 水平排列 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">水平排列</view>
          <wd-checkbox-group
            v-model="layoutGroup2"
            inline
            @change="handleGroupChange('水平排列组', $event)"
          >
            <wd-checkbox :model-value="1">选项一</wd-checkbox>
            <wd-checkbox :model-value="2">选项二</wd-checkbox>
            <wd-checkbox :model-value="3">选项三</wd-checkbox>
          </wd-checkbox-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 垂直排列" :code="codes.layout.verticalTemplate" />
        <DemoCode title="模板 - 水平排列" :code="codes.layout.horizontalTemplate" />
        <DemoCode title="脚本 - 布局方式" :code="codes.layout.script" />
      </template>
    </DemoSection>

    <!-- 复选框组示例 -->
    <DemoSection title="复选框组" desc="将多个复选框组合使用，统一管理选中状态">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="text-sm text-gray-500">当前选中：{{ JSON.stringify(skillsGroup) }}</view>
        <wd-checkbox-group v-model="skillsGroup" @change="handleGroupChange('技能选择组', $event)">
          <wd-checkbox model-value="frontend">前端开发</wd-checkbox>
          <wd-checkbox model-value="backend">后端开发</wd-checkbox>
          <wd-checkbox model-value="mobile">移动开发</wd-checkbox>
          <wd-checkbox model-value="design">UI设计</wd-checkbox>
          <wd-checkbox model-value="testing">测试</wd-checkbox>
        </wd-checkbox-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 复选框组" :code="codes.group.template" />
        <DemoCode title="脚本 - 复选框组" :code="codes.group.script" />
      </template>
    </DemoSection>

    <!-- 表单模式示例 -->
    <DemoSection title="表单模式" desc="结合 Cell 组件使用，适合表单场景">
      <!-- 示例效果展示 -->
      <wd-checkbox-group v-model="formGroup" cell @change="handleGroupChange('表单模式组', $event)">
        <wd-checkbox :model-value="1">推送通知</wd-checkbox>
        <wd-checkbox :model-value="2">邮件提醒</wd-checkbox>
        <wd-checkbox :model-value="3">短信通知</wd-checkbox>
        <wd-checkbox :model-value="4">系统消息</wd-checkbox>
      </wd-checkbox-group>

      <template #codes>
        <DemoCode title="模板 - 表单模式" :code="codes.form.template" />
        <DemoCode title="脚本 - 表单模式" :code="codes.form.script" />
      </template>
    </DemoSection>

    <!-- 按钮组样式示例 -->
    <DemoSection title="按钮组样式" desc="按钮样式的复选框组，适合选择标签场景">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 普通按钮组 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">技术栈选择</view>
          <wd-checkbox-group
            v-model="techGroup"
            shape="button"
            inline
            @change="handleGroupChange('技术栈组', $event)"
          >
            <wd-checkbox :model-value="1">JavaScript</wd-checkbox>
            <wd-checkbox :model-value="2">TypeScript</wd-checkbox>
            <wd-checkbox :model-value="3">Vue.js</wd-checkbox>
            <wd-checkbox :model-value="4">React</wd-checkbox>
            <wd-checkbox :model-value="5">Node.js</wd-checkbox>
            <wd-checkbox :model-value="6" disabled>PHP</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- Cell模式按钮组 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">Cell模式按钮组</view>
          <wd-checkbox-group
            v-model="cellButtonGroup"
            cell
            shape="button"
            @change="handleGroupChange('Cell按钮组', $event)"
          >
            <wd-checkbox :model-value="1">选项A</wd-checkbox>
            <wd-checkbox :model-value="2">选项B</wd-checkbox>
            <wd-checkbox :model-value="3">选项C</wd-checkbox>
          </wd-checkbox-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 按钮组样式" :code="codes.button.template" />
        <DemoCode title="模板 - Cell模式按钮组" :code="codes.button.cellTemplate" />
        <DemoCode title="脚本 - 按钮组样式" :code="codes.button.script" />
      </template>
    </DemoSection>

    <!-- 数量限制示例 -->
    <DemoSection title="数量限制" desc="限制最少选择1个，最多选择3个">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <view class="text-sm text-gray-500">
          当前选中 {{ limitGroup.length }} 个（最少1个，最多3个）
        </view>
        <wd-checkbox-group
          v-model="limitGroup"
          :min="1"
          :max="3"
          cell
          @change="handleGroupChange('数量限制组', $event)"
        >
          <wd-checkbox :model-value="1">产品设计</wd-checkbox>
          <wd-checkbox :model-value="2">用户研究</wd-checkbox>
          <wd-checkbox :model-value="3">数据分析</wd-checkbox>
          <wd-checkbox :model-value="4">项目管理</wd-checkbox>
          <wd-checkbox :model-value="5">市场营销</wd-checkbox>
        </wd-checkbox-group>
      </view>

      <template #codes>
        <DemoCode title="模板 - 数量限制" :code="codes.limit.template" />
        <DemoCode title="脚本 - 数量限制" :code="codes.limit.script" />
      </template>
    </DemoSection>

    <!-- 大尺寸示例 -->
    <DemoSection title="大尺寸" desc="更大的复选框，适合触摸屏操作">
      <!-- 示例效果展示 -->
      <view class="space-y-4">
        <!-- 水平大尺寸 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">水平大尺寸</view>
          <wd-checkbox-group
            v-model="largeGroup1"
            inline
            size="large"
            @change="handleGroupChange('水平大尺寸组', $event)"
          >
            <wd-checkbox model-value="design">设计</wd-checkbox>
            <wd-checkbox model-value="develop">开发</wd-checkbox>
            <wd-checkbox model-value="test">测试</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 垂直大尺寸 -->
        <view>
          <view class="mb-2 text-sm text-gray-700 font-medium">垂直大尺寸</view>
          <wd-checkbox-group
            v-model="largeGroup2"
            size="large"
            @change="handleGroupChange('垂直大尺寸组', $event)"
          >
            <wd-checkbox model-value="ios">iOS开发</wd-checkbox>
            <wd-checkbox model-value="android">Android开发</wd-checkbox>
            <wd-checkbox model-value="flutter">Flutter开发</wd-checkbox>
          </wd-checkbox-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 水平大尺寸" :code="codes.large.horizontalTemplate" />
        <DemoCode title="模板 - 垂直大尺寸" :code="codes.large.verticalTemplate" />
        <DemoCode title="脚本 - 大尺寸" :code="codes.large.script" />
      </template>
    </DemoSection>

    <!-- 结合 Cell 使用示例 -->
    <DemoSection title="结合 Cell 使用" desc="在列表项中嵌入复选框，支持点击整行切换">
      <!-- 示例效果展示 -->
      <wd-cell-group border>
        <wd-checkbox-group
          v-model="cellGroup"
          size="large"
          @change="handleGroupChange('Cell结合组', $event)"
        >
          <wd-cell title="点赞" clickable center @click="handleCellClick(0)">
            <view @click.stop="noop">
              <wd-checkbox ref="cellCheckbox1" model-value="like" custom-style="margin:0;" />
            </view>
          </wd-cell>
          <wd-cell title="投币" clickable center @click="handleCellClick(1)">
            <view @click.stop="noop">
              <wd-checkbox ref="cellCheckbox2" model-value="coin" custom-style="margin:0;" />
            </view>
          </wd-cell>
          <wd-cell title="收藏" clickable center @click="handleCellClick(2)">
            <view @click.stop="noop">
              <wd-checkbox ref="cellCheckbox3" model-value="collect" custom-style="margin:0;" />
            </view>
          </wd-cell>
          <wd-cell title="分享" clickable center @click="handleCellClick(3)">
            <view @click.stop="noop">
              <wd-checkbox ref="cellCheckbox4" model-value="share" custom-style="margin:0;" />
            </view>
          </wd-cell>
        </wd-checkbox-group>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 结合Cell使用" :code="codes.cell.template" />
        <DemoCode title="脚本 - 结合Cell使用" :code="codes.cell.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景示例 -->
    <DemoSection title="实际应用场景" desc="模拟真实业务场景的使用方式">
      <!-- 示例效果展示 -->
      <view class="space-y-6">
        <!-- 权限设置 -->
        <view>
          <view class="mb-3 text-sm text-gray-800 font-medium">用户权限设置</view>
          <wd-checkbox-group
            v-model="permissions"
            shape="square"
            @change="handleGroupChange('权限设置组', $event)"
          >
            <wd-checkbox model-value="read">
              <view class="flex items-center">
                <wd-icon name="read" size="16px" class="mr-2 text-blue-500" />
                <text>查看权限</text>
              </view>
            </wd-checkbox>
            <wd-checkbox model-value="write">
              <view class="flex items-center">
                <wd-icon name="edit" size="16px" class="mr-2 text-green-500" />
                <text>编辑权限</text>
              </view>
            </wd-checkbox>
            <wd-checkbox model-value="delete">
              <view class="flex items-center">
                <wd-icon name="delete" size="16px" class="mr-2 text-red-500" />
                <text>删除权限</text>
              </view>
            </wd-checkbox>
            <wd-checkbox model-value="admin">
              <view class="flex items-center">
                <wd-icon name="setting" size="16px" class="mr-2 text-purple-500" />
                <text>管理员权限</text>
              </view>
            </wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 兴趣标签 -->
        <view>
          <view class="mb-3 text-sm text-gray-800 font-medium">兴趣标签选择</view>
          <wd-checkbox-group
            v-model="interests"
            shape="button"
            inline
            @change="handleGroupChange('兴趣标签组', $event)"
          >
            <wd-checkbox model-value="tech">科技</wd-checkbox>
            <wd-checkbox model-value="design">设计</wd-checkbox>
            <wd-checkbox model-value="travel">旅行</wd-checkbox>
            <wd-checkbox model-value="food">美食</wd-checkbox>
            <wd-checkbox model-value="music">音乐</wd-checkbox>
            <wd-checkbox model-value="sports">运动</wd-checkbox>
            <wd-checkbox model-value="reading">阅读</wd-checkbox>
            <wd-checkbox model-value="movie">电影</wd-checkbox>
          </wd-checkbox-group>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 权限设置" :code="codes.scenario.permissionTemplate" />
        <DemoCode title="模板 - 兴趣标签" :code="codes.scenario.interestTemplate" />
        <DemoCode title="脚本 - 实际应用场景" :code="codes.scenario.script" />
      </template>
    </DemoSection>

    <!-- 交互式配置示例 -->
    <DemoSection title="交互式配置" desc="通过配置选项实时预览不同的复选框效果">
      <!-- 配置面板和预览区域 -->
      <view class="space-y-4">
        <!-- 配置面板 -->
        <view class="rounded-lg bg-gray-50 p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">配置选项</view>

          <!-- 形状类型 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">形状类型</view>
            <wd-radio-group v-model="configState.shape" direction="horizontal">
              <wd-radio value="circle">圆形</wd-radio>
              <wd-radio value="square">方形</wd-radio>
              <wd-radio value="button">按钮</wd-radio>
            </wd-radio-group>
          </view>

          <!-- 大小设置 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">大小设置</view>
            <wd-radio-group v-model="configState.size" direction="horizontal">
              <wd-radio value="normal">正常</wd-radio>
              <wd-radio value="large">大尺寸</wd-radio>
            </wd-radio-group>
          </view>

          <!-- 功能选项 -->
          <view class="mb-4">
            <view class="mb-2 text-xs text-gray-600">功能选项</view>
            <view class="grid grid-cols-2 gap-2">
              <wd-checkbox v-model="configState.disabled" shape="square" size="small">
                禁用状态
              </wd-checkbox>
              <wd-checkbox v-model="configState.inline" shape="square" size="small">
                同行展示
              </wd-checkbox>
              <wd-checkbox v-model="configState.customColor" shape="square" size="small">
                自定义颜色
              </wd-checkbox>
              <wd-checkbox v-model="configState.groupMode" shape="square" size="small">
                使用分组
              </wd-checkbox>
            </view>
          </view>

          <!-- 颜色选择 -->
          <view v-if="configState.customColor" class="mb-4">
            <view class="mb-2 text-xs text-gray-600">选中颜色</view>
            <view class="flex space-x-2">
              <view
                v-for="color in colorOptions"
                :key="color.value"
                :class="`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  configState.selectedColor === color.value ? 'border-gray-400' : 'border-gray-200'
                }`"
                :style="`background-color: ${color.value}`"
                @click="configState.selectedColor = color.value"
              >
                <wd-icon
                  v-if="configState.selectedColor === color.value"
                  name="check"
                  class="h-full w-full flex items-center justify-center text-white"
                  size="16px"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 实时预览 -->
        <view class="rounded-lg bg-white p-4">
          <view class="mb-3 text-sm text-gray-700 font-medium">实时预览</view>
          <view class="mb-4 text-sm text-gray-600">
            根据配置生成的复选框效果（值：{{ JSON.stringify(configState.demoValue) }}）
          </view>

          <template v-if="configState.groupMode">
            <wd-checkbox-group
              v-model="configState.demoValue"
              :shape="configState.shape"
              :size="configState.size === 'large' ? 'large' : undefined"
              :disabled="configState.disabled"
              :inline="configState.inline"
              :checked-color="configState.customColor ? configState.selectedColor : undefined"
              @change="handleConfigChange('配置预览组', $event)"
            >
              <wd-checkbox
                v-for="option in previewOptions"
                :key="option.value"
                :model-value="option.value"
              >
                {{ option.label }}
              </wd-checkbox>
            </wd-checkbox-group>
          </template>
          <template v-else>
            <wd-checkbox
              v-model="configState.singleValue"
              :shape="configState.shape"
              :size="configState.size === 'large' ? 'large' : undefined"
              :disabled="configState.disabled"
              :checked-color="configState.customColor ? configState.selectedColor : undefined"
              @change="handleConfigChange('单个配置预览', $event)"
            >
              单个复选框示例
            </wd-checkbox>
          </template>
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
              暂无操作记录，点击复选框查看交互效果
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
import type { CheckboxInstance } from '@/wd/components/wd-checkbox/wd-checkbox.vue'
import { ref } from 'vue'

import type { CheckShape } from '@/wd/components/wd-checkbox-group/wd-checkbox-group.vue'

// ===== 组件状态管理 =====

// 基本用法
const basicCheck = ref<boolean>(true)

// 形状变化
const shapeChecks = ref({
  circle: true,
  square: true,
  button: true,
})

// 自定义颜色
const colorChecks = ref({
  red: false,
  green: false,
  orange: false,
  purple: false,
})

// 禁用状态
const disabledGroup1 = ref([1, 3])
const disabledGroup2 = ref([1])
const disabledGroup3 = ref([1])

// 自定义值
const customValueCheck = ref<string>('已同意')

// 布局方式
const layoutGroup1 = ref([1])
const layoutGroup2 = ref([2])

// 复选框组
const skillsGroup = ref<string[]>(['frontend'])

// 表单模式
const formGroup = ref([1])

// 按钮组样式
const techGroup = ref([1, 3])
const cellButtonGroup = ref([1])

// 数量限制
const limitGroup = ref([1])

// 大尺寸
const largeGroup1 = ref<string[]>([])
const largeGroup2 = ref<string[]>([])

// 结合Cell使用
const cellGroup = ref<string[]>(['like'])

// 实际应用场景
const permissions = ref<string[]>(['read'])
const interests = ref<string[]>(['tech', 'design'])

// Cell复选框引用
const cellCheckbox1 = ref<CheckboxInstance>()
const cellCheckbox2 = ref<CheckboxInstance>()
const cellCheckbox3 = ref<CheckboxInstance>()
const cellCheckbox4 = ref<CheckboxInstance>()

// 交互式配置状态
const configState = ref({
  shape: 'circle' as CheckShape,
  size: 'normal',
  disabled: false,
  inline: false,
  customColor: false,
  groupMode: true,
  selectedColor: '#007aff',
  demoValue: [1],
  singleValue: false,
})

// 颜色选项
const colorOptions = [
  { name: '蓝色', value: '#007aff' },
  { name: '红色', value: '#ff4757' },
  { name: '绿色', value: '#2ed573' },
  { name: '橙色', value: '#ffa502' },
  { name: '紫色', value: '#8e44ad' },
  { name: '粉色', value: '#e84393' },
]

// 预览选项
const previewOptions = [
  { value: 1, label: '选项一' },
  { value: 2, label: '选项二' },
  { value: 3, label: '选项三' },
]

// 操作记录
interface OperationRecord {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const operationRecords = ref<OperationRecord[]>([])

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<!-- 基本用法 -->
<wd-checkbox v-model="basicCheck" @change="handleBasicChange('基本复选框', $event)">
  我已阅读并同意用户协议
</wd-checkbox>
<view class="text-sm text-gray-500">当前值：{{ basicCheck }}</view>`,

    script: `const basicCheck = ref(true)

const handleBasicChange = (name: string, event: any) => {
  console.log(\`\${name} 状态变更：\`, event.value)
}`,
  },

  // 形状变化代码
  shape: {
    template: `<!-- 形状变化 -->
<!-- 圆形（默认） -->
<wd-checkbox v-model="shapeChecks.circle" @change="handleShapeChange('圆形', $event)">
  圆形复选框
</wd-checkbox>

<!-- 方形 -->
<wd-checkbox v-model="shapeChecks.square" shape="square" @change="handleShapeChange('方形', $event)">
  方形复选框
</wd-checkbox>

<!-- 按钮 -->
<wd-checkbox v-model="shapeChecks.button" shape="button" @change="handleShapeChange('按钮', $event)">
  按钮复选框
</wd-checkbox>`,

    script: `const shapeChecks = ref({
  circle: true,
  square: true,
  button: true,
})

const handleShapeChange = (shape: string, event: any) => {
  console.log(\`\${shape} 复选框状态变更：\`, event.value)
}`,
  },

  // 自定义颜色代码
  color: {
    template: `<!-- 自定义颜色 -->
<wd-checkbox v-model="colorChecks.red" checked-color="#ff4757" shape="circle">
  红色主题
</wd-checkbox>
<wd-checkbox v-model="colorChecks.green" checked-color="#2ed573" shape="square">
  绿色主题
</wd-checkbox>
<wd-checkbox v-model="colorChecks.orange" checked-color="#ffa502" shape="button">
  橙色主题
</wd-checkbox>
<wd-checkbox v-model="colorChecks.purple" checked-color="#8e44ad" shape="circle">
  紫色主题
</wd-checkbox>`,

    script: `const colorChecks = ref({
  red: false,
  green: false,
  orange: false,
  purple: false,
})

const handleColorChange = (theme: string, event: any) => {
  console.log(\`\${theme} 状态变更：\`, event.value)
}`,
  },

  // 禁用状态代码
  disabled: {
    groupTemplate: `<!-- 整体禁用 -->
<wd-checkbox-group v-model="disabledGroup1" disabled>
  <wd-checkbox :model-value="1">选项一</wd-checkbox>
  <wd-checkbox :model-value="2" :disabled="false">选项二（强制启用）</wd-checkbox>
  <wd-checkbox :model-value="3" shape="square">选项三</wd-checkbox>
</wd-checkbox-group>

<!-- 按钮禁用 -->
<wd-checkbox-group v-model="disabledGroup2" disabled shape="button">
  <wd-checkbox :model-value="1">选项A</wd-checkbox>
  <wd-checkbox :model-value="2">选项B</wd-checkbox>
</wd-checkbox-group>`,

    singleTemplate: `<!-- 单个禁用 -->
<wd-checkbox-group v-model="disabledGroup3">
  <wd-checkbox :model-value="1">正常选项</wd-checkbox>
  <wd-checkbox :model-value="2" disabled>禁用选项</wd-checkbox>
  <wd-checkbox :model-value="3">正常选项</wd-checkbox>
</wd-checkbox-group>`,

    script: `const disabledGroup1 = ref([1, 3])
const disabledGroup2 = ref([1])
const disabledGroup3 = ref([1])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 自定义值代码
  customValue: {
    template: `<!-- 自定义值 -->
<wd-checkbox
  v-model="customValueCheck"
  true-value="已同意"
  false-value="未同意"
  @change="handleCustomValueChange('自定义值', $event)"
>
  同意服务条款
</wd-checkbox>
<view class="text-sm text-gray-500">当前值：{{ customValueCheck }}</view>`,

    script: `const customValueCheck = ref('已同意')

const handleCustomValueChange = (name: string, event: any) => {
  console.log(\`\${name} 状态变更：\`, event.value)
}`,
  },

  // 布局方式代码
  layout: {
    verticalTemplate: `<!-- 垂直排列（默认） -->
<wd-checkbox-group v-model="layoutGroup1">
  <wd-checkbox :model-value="1">选项一</wd-checkbox>
  <wd-checkbox :model-value="2">选项二</wd-checkbox>
  <wd-checkbox :model-value="3">选项三</wd-checkbox>
</wd-checkbox-group>`,

    horizontalTemplate: `<!-- 水平排列 -->
<wd-checkbox-group v-model="layoutGroup2" inline>
  <wd-checkbox :model-value="1">选项一</wd-checkbox>
  <wd-checkbox :model-value="2">选项二</wd-checkbox>
  <wd-checkbox :model-value="3">选项三</wd-checkbox>
</wd-checkbox-group>`,

    script: `const layoutGroup1 = ref([1])
const layoutGroup2 = ref([2])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 复选框组代码
  group: {
    template: `<!-- 复选框组 -->
<view class="text-sm text-gray-500">当前选中：{{ JSON.stringify(skillsGroup) }}</view>
<wd-checkbox-group v-model="skillsGroup" @change="handleGroupChange('技能选择组', $event)">
  <wd-checkbox model-value="frontend">前端开发</wd-checkbox>
  <wd-checkbox model-value="backend">后端开发</wd-checkbox>
  <wd-checkbox model-value="mobile">移动开发</wd-checkbox>
  <wd-checkbox model-value="design">UI设计</wd-checkbox>
  <wd-checkbox model-value="testing">测试</wd-checkbox>
</wd-checkbox-group>`,

    script: `const skillsGroup = ref(['frontend'])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 表单模式代码
  form: {
    template: `<!-- 表单模式 -->
<wd-checkbox-group v-model="formGroup" cell @change="handleGroupChange('表单模式组', $event)">
  <wd-checkbox :model-value="1">推送通知</wd-checkbox>
  <wd-checkbox :model-value="2">邮件提醒</wd-checkbox>
  <wd-checkbox :model-value="3">短信通知</wd-checkbox>
  <wd-checkbox :model-value="4">系统消息</wd-checkbox>
</wd-checkbox-group>`,

    script: `const formGroup = ref([1])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 按钮组样式代码
  button: {
    template: `<!-- 按钮组样式 -->
<wd-checkbox-group v-model="techGroup" shape="button" inline>
  <wd-checkbox :model-value="1">JavaScript</wd-checkbox>
  <wd-checkbox :model-value="2">TypeScript</wd-checkbox>
  <wd-checkbox :model-value="3">Vue.js</wd-checkbox>
  <wd-checkbox :model-value="4">React</wd-checkbox>
  <wd-checkbox :model-value="5">Node.js</wd-checkbox>
  <wd-checkbox :model-value="6" disabled>PHP</wd-checkbox>
</wd-checkbox-group>`,

    cellTemplate: `<!-- Cell模式按钮组 -->
<wd-checkbox-group v-model="cellButtonGroup" cell shape="button">
  <wd-checkbox :model-value="1">选项A</wd-checkbox>
  <wd-checkbox :model-value="2">选项B</wd-checkbox>
  <wd-checkbox :model-value="3">选项C</wd-checkbox>
</wd-checkbox-group>`,

    script: `const techGroup = ref([1, 3])
const cellButtonGroup = ref([1])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 数量限制代码
  limit: {
    template: `<!-- 数量限制 -->
<view class="text-sm text-gray-500">
  当前选中 {{ limitGroup.length }} 个（最少1个，最多3个）
</view>
<wd-checkbox-group v-model="limitGroup" :min="1" :max="3" cell>
  <wd-checkbox :model-value="1">产品设计</wd-checkbox>
  <wd-checkbox :model-value="2">用户研究</wd-checkbox>
  <wd-checkbox :model-value="3">数据分析</wd-checkbox>
  <wd-checkbox :model-value="4">项目管理</wd-checkbox>
  <wd-checkbox :model-value="5">市场营销</wd-checkbox>
</wd-checkbox-group>`,

    script: `const limitGroup = ref([1])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 大尺寸代码
  large: {
    horizontalTemplate: `<!-- 水平大尺寸 -->
<wd-checkbox-group v-model="largeGroup1" inline size="large">
  <wd-checkbox model-value="design">设计</wd-checkbox>
  <wd-checkbox model-value="develop">开发</wd-checkbox>
  <wd-checkbox model-value="test">测试</wd-checkbox>
</wd-checkbox-group>`,

    verticalTemplate: `<!-- 垂直大尺寸 -->
<wd-checkbox-group v-model="largeGroup2" size="large">
  <wd-checkbox model-value="ios">iOS开发</wd-checkbox>
  <wd-checkbox model-value="android">Android开发</wd-checkbox>
  <wd-checkbox model-value="flutter">Flutter开发</wd-checkbox>
</wd-checkbox-group>`,

    script: `const largeGroup1 = ref([])
const largeGroup2 = ref([])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 结合Cell使用代码
  cell: {
    template: `<!-- 结合Cell使用 -->
<wd-cell-group border>
  <wd-checkbox-group v-model="cellGroup" size="large">
    <wd-cell title="点赞" clickable center @click="handleCellClick(0)">
      <view @click.stop="noop">
        <wd-checkbox ref="cellCheckbox1" model-value="like" custom-style="margin:0;" />
      </view>
    </wd-cell>
    <wd-cell title="投币" clickable center @click="handleCellClick(1)">
      <view @click.stop="noop">
        <wd-checkbox ref="cellCheckbox2" model-value="coin" custom-style="margin:0;" />
      </view>
    </wd-cell>
    <wd-cell title="收藏" clickable center @click="handleCellClick(2)">
      <view @click.stop="noop">
        <wd-checkbox ref="cellCheckbox3" model-value="collect" custom-style="margin:0;" />
      </view>
    </wd-cell>
  </wd-checkbox-group>
</wd-cell-group>`,

    script: `import type { CheckboxInstance } from '@/wd/components/wd-checkbox/wd-checkbox.vue'

const cellGroup = ref(['like'])
const cellCheckbox1 = ref<CheckboxInstance>()
const cellCheckbox2 = ref<CheckboxInstance>()
const cellCheckbox3 = ref<CheckboxInstance>()

const handleCellClick = (index: number) => {
  const checkboxRefs = [cellCheckbox1, cellCheckbox2, cellCheckbox3]
  const labels = ['点赞', '投币', '收藏']

  if (checkboxRefs[index]?.value) {
    checkboxRefs[index].value.toggle()
    console.log(\`点击 \${labels[index]} 单元格\`)
  }
}

const noop = () => {}`,
  },

  // 实际应用场景代码
  scenario: {
    permissionTemplate: `<!-- 权限设置 -->
<wd-checkbox-group v-model="permissions" shape="square">
  <wd-checkbox model-value="read">
    <view class="flex items-center">
      <wd-icon name="read" size="16px" class="mr-2 text-blue-500" />
      <text>查看权限</text>
    </view>
  </wd-checkbox>
  <wd-checkbox model-value="write">
    <view class="flex items-center">
      <wd-icon name="edit" size="16px" class="mr-2 text-green-500" />
      <text>编辑权限</text>
    </view>
  </wd-checkbox>
  <wd-checkbox model-value="delete">
    <view class="flex items-center">
      <wd-icon name="delete" size="16px" class="mr-2 text-red-500" />
      <text>删除权限</text>
    </view>
  </wd-checkbox>
</wd-checkbox-group>`,

    interestTemplate: `<!-- 兴趣标签 -->
<wd-checkbox-group v-model="interests" shape="button" inline>
  <wd-checkbox model-value="tech">科技</wd-checkbox>
  <wd-checkbox model-value="design">设计</wd-checkbox>
  <wd-checkbox model-value="travel">旅行</wd-checkbox>
  <wd-checkbox model-value="food">美食</wd-checkbox>
  <wd-checkbox model-value="music">音乐</wd-checkbox>
  <wd-checkbox model-value="sports">运动</wd-checkbox>
  <wd-checkbox model-value="reading">阅读</wd-checkbox>
  <wd-checkbox model-value="movie">电影</wd-checkbox>
</wd-checkbox-group>`,

    script: `const permissions = ref(['read'])
const interests = ref(['tech', 'design'])

const handleGroupChange = (groupName: string, value: any) => {
  console.log(\`\${groupName} 状态变更：\`, value)
}`,
  },

  // 交互式配置代码
  config: {
    configTemplate: `<!-- 配置面板 -->
<view class="rounded-lg bg-gray-50 p-4">
  <view class="mb-3 text-sm font-medium text-gray-700">配置选项</view>

  <!-- 形状类型 -->
  <view class="mb-4">
    <view class="mb-2 text-xs text-gray-600">形状类型</view>
    <wd-radio-group v-model="configState.shape" direction="horizontal">
      <wd-radio value="circle">圆形</wd-radio>
      <wd-radio value="square">方形</wd-radio>
      <wd-radio value="button">按钮</wd-radio>
    </wd-radio-group>
  </view>

  <!-- 功能选项 -->
  <view class="mb-4">
    <view class="mb-2 text-xs text-gray-600">功能选项</view>
    <view class="grid grid-cols-2 gap-2">
      <wd-checkbox v-model="configState.disabled" shape="square" size="small">禁用状态</wd-checkbox>
      <wd-checkbox v-model="configState.inline" shape="square" size="small">同行展示</wd-checkbox>
      <wd-checkbox v-model="configState.customColor" shape="square" size="small">自定义颜色</wd-checkbox>
      <wd-checkbox v-model="configState.groupMode" shape="square" size="small">使用分组</wd-checkbox>
    </view>
  </view>
</view>`,

    previewTemplate: `<!-- 实时预览 -->
<template v-if="configState.groupMode">
  <wd-checkbox-group
    v-model="configState.demoValue"
    :shape="configState.shape"
    :size="configState.size === 'large' ? 'large' : undefined"
    :disabled="configState.disabled"
    :inline="configState.inline"
    :checked-color="configState.customColor ? configState.selectedColor : undefined"
  >
    <wd-checkbox
      v-for="option in previewOptions"
      :key="option.value"
      :model-value="option.value"
    >
      {{ option.label }}
    </wd-checkbox>
  </wd-checkbox-group>
</template>
<template v-else>
  <wd-checkbox
    v-model="configState.singleValue"
    :shape="configState.shape"
    :size="configState.size === 'large' ? 'large' : undefined"
    :disabled="configState.disabled"
    :checked-color="configState.customColor ? configState.selectedColor : undefined"
  >
    单个复选框示例
  </wd-checkbox>
</template>`,

    script: `// 交互式配置状态
const configState = ref({
  shape: 'circle',
  size: 'normal',
  disabled: false,
  inline: false,
  customColor: false,
  groupMode: true,
  selectedColor: '#007aff',
  demoValue: [1],
  singleValue: false,
})

const previewOptions = [
  { value: 1, label: '选项一' },
  { value: 2, label: '选项二' },
  { value: 3, label: '选项三' },
]

const handleConfigChange = (name: string, value: any) => {
  console.log(\`\${name} 状态变更：\`, value)
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model-value',
    type: 'String | Number | Boolean | Array',
    default: 'false',
    desc: '复选框选中时的值，在复选框组中为数组',
  },
  {
    name: 'shape',
    type: 'String',
    default: '"circle"',
    desc: '复选框形状，可选值：circle / square / button',
  },
  {
    name: 'checked-color',
    type: 'String',
    default: '""',
    desc: '选中的颜色',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '禁用',
  },
  {
    name: 'true-value',
    type: 'String | Number | Boolean',
    default: 'true',
    desc: '选中值，在 checkbox-group 中使用无效，需同 false-value 一块使用',
  },
  {
    name: 'false-value',
    type: 'String | Number | Boolean',
    default: 'false',
    desc: '非选中时的值，在 checkbox-group 中使用无效，需同 true-value 一块使用',
  },
  {
    name: 'size',
    type: 'String',
    default: '""',
    desc: '设置大小，可选值：large',
  },
  {
    name: 'max-width',
    type: 'String',
    default: '""',
    desc: '文字位置最大宽度',
  },
  {
    name: 'inline',
    type: 'Boolean',
    default: 'false',
    desc: '同行展示（仅复选框组）',
  },
  {
    name: 'min',
    type: 'Number',
    default: '0',
    desc: '最小选中的数量（仅复选框组）',
  },
  {
    name: 'max',
    type: 'Number',
    default: '0',
    desc: '最大选中的数量，0 为无限数量（仅复选框组）',
  },
  {
    name: 'cell',
    type: 'Boolean',
    default: 'false',
    desc: '表单模式，结合 Cell 组件使用（仅复选框组）',
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
    name: 'custom-label-class',
    type: 'String',
    default: '""',
    desc: '自定义标签样式类',
  },
  {
    name: 'custom-shape-class',
    type: 'String',
    default: '""',
    desc: '自定义形状样式类',
  },
]

// Events 事件文档
const apiEvents = [
  {
    name: 'change',
    desc: '值变化时触发，参数为 { value: 当前值 }',
  },
]

// Methods 方法文档
const apiMethods = [
  {
    name: 'toggle()',
    desc: '切换当前选中状态（仅单个复选框）',
  },
]

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

/**
 * 空操作函数
 */
const noop = () => {}

// ===== 事件处理方法 =====

/**
 * 基本复选框变更事件
 */
const handleBasicChange = (name: string, event: any) => {
  addOperationRecord(`${name} 状态变更：${JSON.stringify(event.value)}`, 'info')
  console.log(`${name} 状态变更：`, event.value)
}

/**
 * 形状复选框变更事件
 */
const handleShapeChange = (shape: string, event: any) => {
  addOperationRecord(`${shape} 复选框状态变更：${JSON.stringify(event.value)}`, 'info')
  console.log(`${shape} 复选框状态变更：`, event.value)
}

/**
 * 自定义颜色复选框变更事件
 */
const handleColorChange = (theme: string, event: any) => {
  addOperationRecord(`${theme} 状态变更：${JSON.stringify(event.value)}`, 'info')
  console.log(`${theme} 状态变更：`, event.value)
}

/**
 * 自定义值复选框变更事件
 */
const handleCustomValueChange = (name: string, event: any) => {
  addOperationRecord(`${name} 状态变更：${JSON.stringify(event.value)}`, 'info')
  console.log(`${name} 状态变更：`, event.value)
}

/**
 * 复选框组变更事件
 */
const handleGroupChange = (groupName: string, value: any) => {
  addOperationRecord(`${groupName} 状态变更：${JSON.stringify(value)}`, 'success')
  console.log(`${groupName} 状态变更：`, value)
}

/**
 * Cell复选框点击事件
 */
const handleCellClick = (index: number) => {
  const checkboxRefs = [cellCheckbox1, cellCheckbox2, cellCheckbox3, cellCheckbox4]
  const labels = ['点赞', '投币', '收藏', '分享']

  if (checkboxRefs[index]?.value) {
    checkboxRefs[index].value.toggle()
    addOperationRecord(`点击 ${labels[index]} 单元格`, 'info')
  }
}

/**
 * 配置预览变更事件
 */
const handleConfigChange = (name: string, value: any) => {
  addOperationRecord(`${name} 状态变更：${JSON.stringify(value)}`, 'info')
  console.log(`${name} 状态变更：`, value)
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
