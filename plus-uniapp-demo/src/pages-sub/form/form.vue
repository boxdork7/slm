<!-- Form 表单 http://127.0.0.1:100/#/pages-sub/demo/wd/form -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Form 表单" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="最简单的表单使用方式，包含用户名和密码输入">
      <!-- 示例效果展示 -->
      <wd-form ref="basicFormRef" :model="basicModel">
        <wd-cell-group border>
          <wd-input
            v-model="basicModel.username"
            label="用户名"
            label-width="100px"
            prop="username"
            clearable
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <wd-input
            v-model="basicModel.password"
            label="密码"
            label-width="100px"
            prop="password"

             clearable show-password
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </wd-cell-group>

        <view class="p-4">
          <wd-button type="primary" size="large" block @click="handleBasicSubmit">提交</wd-button>
        </view>
      </wd-form>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本表单" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本表单" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 校验规则示例 -->
    <DemoSection title="校验规则" desc="支持多种校验规则：正则、函数、自定义、异步等">
      <wd-form ref="validationFormRef" :model="validationModel">
        <wd-cell-group border>
          <wd-input
            v-model="validationModel.pattern"
            label="正则校验"
            label-width="100px"
            prop="pattern"
            clearable
            placeholder="请输入6位数字"
            :rules="[{ required: false, pattern: /\d{6}/, message: '请输入6位数字' }]"
          />
          <wd-input
            v-model="validationModel.phone"
            label="函数校验"
            label-width="100px"
            prop="phone"
            clearable
            placeholder="请输入手机号"
            :rules="[{ required: false, validator: validatePhone, message: '请输入正确的手机号' }]"
          />
          <wd-input
            v-model="validationModel.custom"
            label="自定义校验"
            label-width="100px"
            prop="custom"
            clearable
            placeholder="长度不能小于4位"
            :rules="[{ required: false, validator: customValidator, message: '长度不得小于4' }]"
          />
          <wd-input
            v-model="validationModel.async"
            label="异步校验"
            label-width="100px"
            prop="async"
            clearable
            placeholder="请输入1234"
            :rules="[{ required: false, validator: asyncValidator, message: '请输入1234' }]"
          />
        </wd-cell-group>

        <view class="p-4">
          <wd-button type="primary" size="large" block @click="handleValidationSubmit">
            提交校验
          </wd-button>
        </view>
      </wd-form>

      <template #codes>
        <DemoCode title="模板 - 校验规则" :code="codes.validation.template" />
        <DemoCode title="脚本 - 校验函数" :code="codes.validation.validators" />
        <DemoCode title="脚本 - 提交处理" :code="codes.validation.submit" />
      </template>
    </DemoSection>

    <!-- 动态表单示例 -->
    <DemoSection title="动态表单" desc="支持动态添加和删除表单项，适用于不确定数量的输入场景">
      <wd-form ref="dynamicFormRef" :model="dynamicModel">
        <wd-cell-group border>
          <wd-input
            v-model="dynamicModel.name"
            label="姓名"
            label-width="100px"
            prop="name"
            clearable
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />

          <!-- 动态手机号输入 -->
          <wd-input
            v-for="(phone, index) in dynamicModel.phoneNumbers"
            :key="phone.key"
            v-model="phone.value"
            :label="`手机号${index + 1}`"
            :prop="`phoneNumbers.${index}.value`"
            label-width="100px"
            clearable
            placeholder="请输入手机号"
            :rules="[{ required: true, message: `请输入手机号${index + 1}` }]"
          />
        </wd-cell-group>

        <!-- 操作按钮区域 -->
        <view class="p-4 space-y-3">
          <!-- 动态操作按钮 -->
          <view class="flex flex-wrap gap-2">
            <wd-button size="small" type="info" plain @click="handleAddPhone">
              添加手机号
            </wd-button>
            <wd-button
              size="small"
              type="warning"
              plain
              :disabled="dynamicModel.phoneNumbers.length <= 1"
              @click="handleRemovePhone"
            >
              删除手机号
            </wd-button>
            <wd-button size="small" type="info" plain @click="handleResetDynamic">
              重置表单
            </wd-button>
          </view>

          <!-- 提交按钮 -->
          <wd-button type="primary" size="large" block @click="handleDynamicSubmit">
            提交动态表单
          </wd-button>
        </view>
      </wd-form>

      <template #codes>
        <DemoCode title="模板 - 动态表单" :code="codes.dynamic.template" />
        <DemoCode title="脚本 - 数据结构" :code="codes.dynamic.dataStructure" />
        <DemoCode title="脚本 - 操作方法" :code="codes.dynamic.methods" />
      </template>
    </DemoSection>

    <!-- 失焦校验示例 -->
    <DemoSection title="失焦校验" desc="支持在字段失去焦点时触发校验，提供即时反馈">
      <wd-form ref="blurFormRef" :model="blurModel" :reset-on-change="false">
        <wd-cell-group border>
          <wd-input
            v-model="blurModel.name"
            label="姓名"
            label-width="100px"
            prop="name"
            clearable
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
            @blur="handleFieldBlur('name')"
          />
          <wd-input
            v-model="blurModel.phoneNumber"
            label="手机号"
            prop="phoneNumber"
            label-width="100px"
            clearable
            placeholder="请输入手机号"
            :rules="[{ required: true, validator: validatePhone, message: '请输入正确的手机号' }]"
            @blur="handleFieldBlur('phoneNumber')"
          />
          <wd-input
            v-model="blurModel.idCard"
            label="身份证号"
            prop="idCard"
            label-width="100px"
            clearable
            placeholder="请输入身份证号"
            :rules="[{ required: true, pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号' }]"
            @blur="handleFieldBlur('idCard')"
          />
        </wd-cell-group>

        <view class="p-4 space-y-3">
          <view class="flex gap-3">
            <wd-button type="primary" @click="handleBlurSubmit">
              完整校验
            </wd-button>
            <wd-button type="info" plain @click="handlePartialValidate">
              校验手机号和身份证
            </wd-button>
          </view>
        </view>
      </wd-form>

      <template #codes>
        <DemoCode title="模板 - 失焦校验" :code="codes.blur.template" />
        <DemoCode title="脚本 - 失焦处理" :code="codes.blur.script" />
      </template>
    </DemoSection>

    <!-- 错误提示类型示例 -->
    <DemoSection title="错误提示类型" desc="支持三种错误提示方式：消息提示、Toast提示、无提示">
      <!-- Toast 提示示例 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">Toast 提示</view>
          <wd-form ref="toastFormRef" :model="toastModel" error-type="toast">
            <wd-cell-group border>
              <wd-input
                v-model="toastModel.username"
                label="用户名"
                label-width="100px"
                prop="username"
                clearable
                placeholder="请输入用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
              />
              <wd-input
                v-model="toastModel.password"
                label="密码"
                label-width="100px"
                prop="password"
                show-password
                clearable
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              />
            </wd-cell-group>

            <view class="p-4">
              <wd-button type="primary" block @click="handleToastSubmit">
                Toast 提示校验
              </wd-button>
            </view>
          </wd-form>
        </view>

        <!-- 消息提示示例 -->
        <view>
          <view class="mb-3 text-sm text-gray-700 font-medium">消息提示（默认）</view>
          <wd-form ref="messageFormRef" :model="messageModel" error-type="message">
            <wd-cell-group border>
              <wd-input
                v-model="messageModel.email"
                label="邮箱"
                label-width="100px"
                prop="email"
                clearable
                placeholder="请输入邮箱"
                :rules="[{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱格式' }]"
              />
              <wd-input
                v-model="messageModel.confirmPassword"
                label="确认密码"
                label-width="100px"
                prop="confirmPassword"
                show-password
                clearable
                placeholder="请再次输入密码"
                :rules="[{ required: true, validator: validateConfirmPassword, message: '两次输入的密码不一致' }]"
              />
            </wd-cell-group>

            <view class="p-4">
              <wd-button type="primary" block @click="handleMessageSubmit">
                消息提示校验
              </wd-button>
            </view>
          </wd-form>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - Toast 提示" :code="codes.errorType.toastTemplate" />
        <DemoCode title="模板 - 消息提示" :code="codes.errorType.messageTemplate" />
        <DemoCode title="脚本 - 错误类型配置" :code="codes.errorType.script" />
      </template>
    </DemoSection>

    <!-- 复杂表单示例 -->
    <DemoSection title="复杂表单" desc="包含多种表单控件的复杂业务表单示例">
      <wd-form ref="complexFormRef" :model="complexModel" :rules="complexRules">
        <!-- 基础信息 -->
        <wd-cell-group title="基础信息" border>
          <wd-input
            v-model="complexModel.couponName"
            label="优惠券名称"
            label-width="100px"
            :maxlength="20"

            prop="couponName"

            suffix-icon="help"
             required clearable show-word-limit
            placeholder="请输入优惠券名称"
            @clicksuffixicon="handleShowTip"
          />
          <wd-select-picker
            v-model="complexModel.platform"
            label="推广平台"
            label-width="100px"
            prop="platform"
            :columns="platformOptions"
            placeholder="请选择推广平台"
          />
          <wd-picker
            v-model="complexModel.promotion"
            label="优惠方式"
            placeholder="请选择优惠方式"
            label-width="100px"
            prop="promotion"
            :columns="promotionOptions"
          />

          <!-- 满减金额输入 -->
          <wd-cell
            prop="threshold"
            title="券面额"
            required
            title-width="100px"
            custom-value-class="text-left"
          >
            <view class="flex items-center text-left">
              <text class="text-sm text-gray-500">满</text>
              <wd-input
                v-model="complexModel.threshold"
                no-border
                custom-style="display: inline-block; width: 70px; vertical-align: middle; margin: 0 8px;"
                placeholder="金额"
              />
              <text class="text-sm text-gray-500">减</text>
              <wd-input
                v-model="complexModel.price"
                no-border
                custom-style="display: inline-block; width: 70px; vertical-align: middle; margin: 0 8px;"
                placeholder="金额"
              />
            </view>
          </wd-cell>
        </wd-cell-group>

        <!-- 时间和地址 -->
        <wd-cell-group title="时间设置" border>
          <wd-datetime-picker
            v-model="complexModel.time"
            label="时间"
            label-width="100px"
            placeholder="请选择时间"
            prop="time"
          />
          <wd-calendar
            v-model="complexModel.date"
            label="日期"
            label-width="100px"
            placeholder="请选择日期"
            prop="date"
          />
        </wd-cell-group>

        <!-- 其他设置 -->
        <wd-cell-group title="其他设置" border>
          <wd-textarea
            v-model="complexModel.content"
            label="活动细则"
            label-width="100px"
            type="textarea"
            :maxlength="300"
            show-word-limit
            placeholder="请输入活动细则信息"
            clearable
            prop="content"
          />

          <wd-cell title="发货数量" title-width="100px" prop="count">
            <view class="text-left">
              <wd-input-number v-model="complexModel.count" />
            </view>
          </wd-cell>

          <wd-cell title="开启折扣" title-width="100px" prop="switchVal" center>
            <view class="text-left">
              <wd-switch v-model="complexModel.switchVal" />
            </view>
          </wd-cell>

          <wd-input
            v-if="complexModel.switchVal"
            v-model="complexModel.discount"
            label="折扣"
            label-width="100px"
            prop="discount"
            placeholder="请输入优惠金额"
            clearable
          />

          <wd-input
            v-model="complexModel.cardId"
            label="身份证号"
            label-width="100px"
            prop="cardId"
            suffix-icon="camera"
            placeholder="请输入身份证号"
            clearable
          />

          <wd-input
            v-model="complexModel.phone"
            label="手机号"
            label-width="100px"
            prop="phone"
            placeholder="请输入手机号"
            clearable
          />

          <wd-cell title="活动图片" title-width="100px" prop="fileList">
            <wd-upload
              :file-list="complexModel.fileList"
              action="https://mockapi.eolink.com/zhTuw2P8c29bc981a741931bdd86eb04dc1e8fd64865cb5/upload"
              @change="handleFileChange"
            />
          </wd-cell>
        </wd-cell-group>

        <!-- 协议勾选 -->
        <view class="mx-4 my-3 text-xs text-gray-500">
          <wd-checkbox v-model="complexModel.read" prop="read">
            已阅读并同意
            <text class="text-blue-500">《用户协议》</text>
          </wd-checkbox>
        </view>

        <!-- 提交按钮 -->
        <view class="p-4">
          <wd-button type="primary" size="large" block @click="handleComplexSubmit">
            提交复杂表单
          </wd-button>
        </view>
      </wd-form>

      <template #codes>
        <DemoCode title="模板 - 基础信息区域" :code="codes.complex.basicInfoTemplate" />
        <DemoCode title="模板 - 时间设置区域" :code="codes.complex.timeTemplate" />
        <DemoCode title="模板 - 其他设置区域" :code="codes.complex.otherTemplate" />
        <DemoCode title="脚本 - 数据模型" :code="codes.complex.dataModel" />
        <DemoCode title="脚本 - 校验规则" :code="codes.complex.rules" />
      </template>
    </DemoSection>

    <!-- 表单状态管理示例 -->
    <DemoSection title="表单状态管理" desc="演示表单校验状态、重置功能和手动控制">
      <!-- 状态显示区域 -->
      <view class="space-y-4">
        <!-- 表单状态显示 -->
        <view class="mx-4 rounded-lg bg-gray-50 p-4">
          <view class="mb-2 text-sm font-medium">表单状态信息</view>
          <view class="text-xs space-y-2">
            <view class="flex justify-between">
              <text>最后校验状态：</text>
              <text :class="formStatus.lastValidation.valid ? 'text-green-600' : 'text-red-600'">
                {{ formStatus.lastValidation.valid ? '✓ 校验通过' : '✗ 校验失败' }}
              </text>
            </view>
            <view class="flex justify-between">
              <text>错误数量：</text>
              <text class="text-orange-600">{{ formStatus.lastValidation.errorCount }} 个</text>
            </view>
            <view class="flex justify-between">
              <text>表单提交次数：</text>
              <text class="text-blue-600">{{ formStatus.submitCount }} 次</text>
            </view>
            <view class="flex justify-between">
              <text>表单重置次数：</text>
              <text class="text-purple-600">{{ formStatus.resetCount }} 次</text>
            </view>
          </view>
        </view>

        <!-- 状态管理表单 -->
        <wd-form ref="statusFormRef" :model="statusModel">
          <wd-cell-group border>
            <wd-input
              v-model="statusModel.username"
              label="用户名"
              label-width="100px"
              prop="username"
              clearable
              placeholder="请输入用户名"
              :rules="[{ required: true, min: 3, message: '用户名至少3个字符' }]"
            />
            <wd-input
              v-model="statusModel.email"
              label="邮箱"
              label-width="100px"
              prop="email"
              clearable
              placeholder="请输入邮箱"
              :rules="[{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱' }]"
            />
            <wd-input
              v-model="statusModel.age"
              label="年龄"
              label-width="100px"
              prop="age"
              type="number"
              clearable
              placeholder="请输入年龄"
              :rules="[{ required: true, min: 18, max: 100, message: '年龄必须在18-100之间' }]"
            />
          </wd-cell-group>

          <!-- 操作按钮区域 -->
          <view class="p-4 space-y-3">
            <view class="flex flex-wrap gap-2">
              <wd-button size="small" type="primary" @click="handleStatusSubmit">
                提交表单
              </wd-button>
              <wd-button size="small" type="info" plain @click="handleStatusReset">
                重置表单
              </wd-button>
              <wd-button size="small" type="warning" plain @click="handlePartialStatusValidate">
                校验用户名
              </wd-button>
              <wd-button size="small" type="success" plain @click="handleClearStatusErrors">
                清除错误
              </wd-button>
            </view>
          </view>
        </wd-form>
      </view>

      <template #codes>
        <DemoCode title="模板 - 状态显示" :code="codes.status.statusDisplay" />
        <DemoCode title="模板 - 状态管理表单" :code="codes.status.template" />
        <DemoCode title="脚本 - 状态管理" :code="codes.status.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi :props="apiProps" :methods="apiMethods" :events="apiEvents" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from '@/wd/components/wd-form/wd-form.vue'
import type { UploadFileItem } from '@/wd/components/wd-upload/wd-upload.vue'
import { useToast } from '@/wd'
import { isArray } from '@/wd/components/common/util'

// ===== 组件状态管理 =====

// Toast 实例
const toast = useToast()

// 表单引用
const basicFormRef = ref<FormInstance>()
const validationFormRef = ref<FormInstance>()
const dynamicFormRef = ref<FormInstance>()
const blurFormRef = ref<FormInstance>()
const toastFormRef = ref<FormInstance>()
const messageFormRef = ref<FormInstance>()
const complexFormRef = ref<FormInstance>()
const statusFormRef = ref<FormInstance>()

// 手机号输入项接口
interface PhoneItem {
  key: number
  value: string
}

// 表单状态信息接口
interface FormStatus {
  lastValidation: {
    valid: boolean
    errorCount: number
  }
  submitCount: number
  resetCount: number
}

// 基础表单数据
const basicModel = ref({
  username: '',
  password: '',
})

// 校验规则表单数据
const validationModel = ref({
  pattern: '',
  phone: '',
  custom: '',
  async: '',
})

// 动态表单数据
const dynamicModel = ref<{
  name: string
  phoneNumbers: PhoneItem[]
}>({
  name: '',
  phoneNumbers: [{ key: Date.now(), value: '' }],
})

// 失焦校验表单数据
const blurModel = ref({
  name: '',
  phoneNumber: '',
  idCard: '',
})

// Toast 提示表单数据
const toastModel = ref({
  username: '',
  password: '',
})

// 消息提示表单数据
const messageModel = ref({
  email: '',
  confirmPassword: '',
})

// 复杂表单数据
const complexModel = ref({
  couponName: '',
  platform: [],
  promotion: '',
  threshold: '',
  price: '',
  date: null as number | null,
  time: '',
  count: 1,
  content: '',
  switchVal: true,
  cardId: '',
  phone: '',
  read: false,
  fileList: [] as UploadFileItem[],
  discount: 1,
})

// 状态管理表单数据
const statusModel = ref({
  username: '',
  email: '',
  age: '',
})

// 表单状态信息
const formStatus = ref<FormStatus>({
  lastValidation: {
    valid: false,
    errorCount: 0,
  },
  submitCount: 0,
  resetCount: 0,
})

// 平台选项
const platformOptions = ref([
  { value: '1', label: '京东' },
  { value: '2', label: '开普勒' },
  { value: '3', label: '手Q' },
  { value: '4', label: '微信' },
  { value: '5', label: '1号店' },
  { value: '6', label: '十元街' },
  { value: '7', label: '京东极速版' },
])

// 优惠方式选项
const promotionOptions = ref([
  { value: '1', label: '满减' },
  { value: '2', label: '无门槛' },
])

// ===== 校验函数定义 =====

/**
 * 手机号校验函数
 */
const validatePhone = (val: string) => {
  return /^1\d{10}$/.test(val)
}

/**
 * 自定义校验函数
 */
const customValidator = (val: any) => {
  if (String(val).length >= 4) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('长度不得小于4'))
  }
}

/**
 * 异步校验函数
 */
const asyncValidator = (val: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    toast.loading('验证中...')
    setTimeout(() => {
      toast.close()
      if (val === '1234') {
        resolve(true)
      } else {
        reject(new Error('请输入1234'))
      }
    }, 1000)
  })

/**
 * 确认密码校验函数
 */
const validateConfirmPassword = (val: string) => {
  // 这里应该与原密码比较，为了简化示例，直接检查是否为 '123456'
  return val === '123456'
}

// 复杂表单校验规则
const complexRules: FormRules = {
  couponName: [
    {
      required: true,
      min: 6,
      message: '优惠券名称需6个字以上',
    },
  ],
  content: [
    {
      required: true,
      min: 3,
      message: '活动细则至少3个字符',
    },
  ],
  threshold: [
    {
      required: true,
      message: '请输入满减金额',
      validator: (value) => {
        if (value && complexModel.value.price) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请输入完整的满减金额'))
        }
      },
    },
  ],
  platform: [
    {
      required: true,
      message: '请选择推广平台',
      validator: (value) => {
        if (value && isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请选择推广平台'))
        }
      },
    },
  ],
  promotion: [
    {
      required: true,
      message: '请选择优惠方式',
    },
  ],
  time: [
    {
      required: true,
      message: '请选择时间',
    },
  ],
  date: [
    {
      required: true,
      message: '请选择日期',
    },
  ],
  count: [
    {
      required: true,
      message: '发货数量需要大于1',
      validator: (value) => {
        if (Number(value) > 1) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('发货数量需要大于1'))
        }
      },
    },
  ],
  cardId: [
    {
      required: true,
      pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i,
      message: '请输入正确的身份证号',
    },
  ],
  phone: [
    {
      required: true,
      validator: validatePhone,
      message: '请输入正确的手机号',
    },
  ],
  fileList: [
    {
      required: true,
      message: '请选择活动图片',
      validator: (value) => {
        if (isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请选择活动图片'))
        }
      },
    },
  ],
  discount: [
    {
      required: true,
      message: '请输入优惠金额',
      validator: (value) => {
        if (value && Number(value) > 0) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请输入有效的优惠金额'))
        }
      },
    },
  ],
}

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-form ref="basicFormRef" :model="basicModel">
  <wd-cell-group border>
    <wd-input
      v-model="basicModel.username"
      label="用户名"
      label-width="100px"
      prop="username"
      clearable
      placeholder="请输入用户名"
      :rules="[{ required: true, message: '请输入用户名' }]"
    />
    <wd-input
      v-model="basicModel.password"
      label="密码"
      label-width="100px"
      prop="password"
      show-password
      clearable
      placeholder="请输入密码"
      :rules="[{ required: true, message: '请输入密码' }]"
    />
  </wd-cell-group>

  <view class="p-4">
    <wd-button type="primary" size="large" block @click="handleBasicSubmit">
      提交
    </wd-button>
  </view>
</wd-form>`,

    script: `import { ref, reactive } from 'vue'
import type { FormInstance } from '@/wd/components/wd-form/wd-form.vue'
import { useToast } from '@/wd'

const toast = useToast()
const basicFormRef = ref<FormInstance>()

const basicModel = reactive({
  username: '',
  password: '',
})

const handleBasicSubmit = async () => {
  const { valid } = await basicFormRef.value!.validate()
  if (valid) {
    toast.success('提交成功')
  }
}`,
  },

  // 校验规则代码
  validation: {
    template: `<wd-form ref="validationFormRef" :model="validationModel">
  <wd-cell-group border>
    <wd-input
      v-model="validationModel.pattern"
      label="正则校验"
      prop="pattern"
      placeholder="请输入6位数字"
      :rules="[{ required: false, pattern: /\\d{6}/, message: '请输入6位数字' }]"
    />
    <wd-input
      v-model="validationModel.phone"
      label="函数校验"
      prop="phone"
      placeholder="请输入手机号"
      :rules="[{ required: false, validator: validatePhone, message: '请输入正确的手机号' }]"
    />
    <wd-input
      v-model="validationModel.async"
      label="异步校验"
      prop="async"
      placeholder="请输入1234"
      :rules="[{ required: false, validator: asyncValidator, message: '请输入1234' }]"
    />
  </wd-cell-group>
</wd-form>`,

    validators: `// 手机号校验函数
const validatePhone = (val: string) => {
  return /^1\\d{10}$/.test(val)
}

// 自定义校验函数
const customValidator = (val: any) => {
  if (String(val).length >= 4) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('长度不得小于4'))
  }
}

// 异步校验函数
const asyncValidator = (val: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    toast.loading('验证中...')
    setTimeout(() => {
      toast.close()
      if (val === '1234') {
        resolve(true)
      } else {
        reject(new Error('请输入1234'))
      }
    }, 1000)
  })`,

    submit: `const handleValidationSubmit = async () => {
  const { valid, errors } = await validationFormRef.value!.validate()
  if (valid) {
    toast.success('校验通过')
  } else {
    console.log('校验失败：', errors)
  }
}`,
  },

  // 动态表单代码
  dynamic: {
    template: `<wd-form ref="dynamicFormRef" :model="dynamicModel">
  <wd-cell-group border>
    <wd-input
      v-model="dynamicModel.name"
      label="姓名"
      prop="name"
      placeholder="请输入姓名"
      :rules="[{ required: true, message: '请输入姓名' }]"
    />

    <!-- 动态手机号输入 -->
    <wd-input
      v-for="(phone, index) in dynamicModel.phoneNumbers"
      :key="phone.key"
      v-model="phone.value"
      :label="\`手机号\${index + 1}\`"
      :prop="\`phoneNumbers.\${index}.value\`"
      placeholder="请输入手机号"
      :rules="[{ required: true, message: \`请输入手机号\${index + 1}\` }]"
    />
  </wd-cell-group>
</wd-form>`,

    dataStructure: `interface PhoneItem {
  key: number
  value: string
}

const dynamicModel = reactive<{
  name: string
  phoneNumbers: PhoneItem[]
}>({
  name: '',
  phoneNumbers: [{ key: Date.now(), value: '' }],
})`,

    methods: `const handleAddPhone = () => {
  dynamicModel.phoneNumbers.push({
    key: Date.now(),
    value: '',
  })
}

const handleRemovePhone = () => {
  if (dynamicModel.phoneNumbers.length > 1) {
    dynamicModel.phoneNumbers.splice(dynamicModel.phoneNumbers.length - 1, 1)
  }
}

const handleResetDynamic = () => {
  dynamicFormRef.value!.reset()
  dynamicModel.name = ''
  dynamicModel.phoneNumbers = [{ key: Date.now(), value: '' }]
}`,
  },

  // 失焦校验代码
  blur: {
    template: `<wd-form ref="blurFormRef" :model="blurModel" :reset-on-change="false">
  <wd-cell-group border>
    <wd-input
      v-model="blurModel.name"
      label="姓名"
      prop="name"
      placeholder="请输入姓名"
      :rules="[{ required: true, message: '请输入姓名' }]"
      @blur="handleFieldBlur('name')"
    />
    <wd-input
      v-model="blurModel.phoneNumber"
      label="手机号"
      prop="phoneNumber"
      placeholder="请输入手机号"
      :rules="[{ required: true, validator: validatePhone, message: '请输入正确的手机号' }]"
      @blur="handleFieldBlur('phoneNumber')"
    />
  </wd-cell-group>
</wd-form>`,

    script: `const handleFieldBlur = async (prop: string) => {
  await blurFormRef.value!.validate(prop)
}

const handlePartialValidate = async () => {
  const { valid } = await blurFormRef.value!.validate(['phoneNumber', 'idCard'])
  if (valid) {
    toast.success('部分字段校验通过')
  }
}`,
  },

  // 错误提示类型代码
  errorType: {
    toastTemplate: `<wd-form ref="toastFormRef" :model="toastModel" error-type="toast">
  <wd-cell-group border>
    <wd-input
      v-model="toastModel.username"
      label="用户名"
      prop="username"
      placeholder="请输入用户名"
      :rules="[{ required: true, message: '请输入用户名' }]"
    />
  </wd-cell-group>
</wd-form>`,

    messageTemplate: `<wd-form ref="messageFormRef" :model="messageModel" error-type="message">
  <wd-cell-group border>
    <wd-input
      v-model="messageModel.email"
      label="邮箱"
      prop="email"
      placeholder="请输入邮箱"
      :rules="[{ required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: '请输入正确的邮箱格式' }]"
    />
  </wd-cell-group>
</wd-form>`,

    script: `// 错误提示类型：
// 'toast' - 使用 Toast 提示，只显示第一个错误
// 'message' - 在表单项下方显示错误信息（默认）
// 'none' - 不显示错误信息，仅返回校验结果

const toastModel = reactive({
  username: '',
  password: '',
})

const messageModel = reactive({
  email: '',
  confirmPassword: '',
})`,
  },

  // 复杂表单代码
  complex: {
    basicInfoTemplate: `<!-- 基础信息 -->
<wd-cell-group title="基础信息" border>
  <wd-input
    v-model="complexModel.couponName"
    label="优惠券名称"
    prop="couponName"
    :maxlength="20"
    show-word-limit
    required
    suffix-icon="help"
    clearable
    placeholder="请输入优惠券名称"
    @clicksuffixicon="handleShowTip"
  />
  <wd-select-picker
    v-model="complexModel.platform"
    label="推广平台"
    prop="platform"
    :columns="platformOptions"
    placeholder="请选择推广平台"
  />
</wd-cell-group>`,

    timeTemplate: `<!-- 时间设置 -->
<wd-cell-group title="时间设置" border>
  <wd-datetime-picker
    v-model="complexModel.time"
    label="时间"
    placeholder="请选择时间"
    prop="time"
  />
  <wd-calendar
    v-model="complexModel.date"
    label="日期"
    placeholder="请选择日期"
    prop="date"
  />
</wd-cell-group>`,

    otherTemplate: `<!-- 其他设置 -->
<wd-cell-group title="其他设置" border>
  <wd-textarea
    v-model="complexModel.content"
    label="活动细则"
    type="textarea"
    :maxlength="300"
    show-word-limit
    placeholder="请输入活动细则信息"
    prop="content"
  />

  <wd-cell title="发货数量" prop="count">
    <wd-input-number v-model="complexModel.count" />
  </wd-cell>

  <wd-cell title="开启折扣" prop="switchVal" center>
    <wd-switch v-model="complexModel.switchVal" />
  </wd-cell>
</wd-cell-group>`,

    dataModel: `const complexModel = reactive({
  couponName: '',
  platform: [],
  promotion: '',
  threshold: '',
  price: '',
  date: null as number | null,
  time: '',
  count: 1,
  content: '',
  switchVal: true,
  cardId: '',
  phone: '',
  read: false,
  fileList: [] as UploadFileItem[],
  discount: 1,
})`,

    rules: `const complexRules: FormRules = {
  couponName: [
    {
      required: true,
      min: 6,
      message: '优惠券名称需6个字以上',
    },
  ],
  platform: [
    {
      required: true,
      message: '请选择推广平台',
      validator: (value) => {
        if (value && isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('请选择推广平台'))
        }
      },
    },
  ],
  cardId: [
    {
      required: true,
      pattern: /^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号',
    },
  ],
}`,
  },

  // 状态管理代码
  status: {
    statusDisplay: `<!-- 表单状态显示 -->
<view class="mx-4 rounded-lg bg-gray-50 p-4">
  <view class="mb-2 text-sm font-medium">表单状态信息</view>
  <view class="space-y-2 text-xs">
    <view class="flex justify-between">
      <text>最后校验状态：</text>
      <text :class="formStatus.lastValidation.valid ? 'text-green-600' : 'text-red-600'">
        {{ formStatus.lastValidation.valid ? '✓ 校验通过' : '✗ 校验失败' }}
      </text>
    </view>
    <view class="flex justify-between">
      <text>错误数量：</text>
      <text class="text-orange-600">{{ formStatus.lastValidation.errorCount }} 个</text>
    </view>
  </view>
</view>`,

    template: `<wd-form ref="statusFormRef" :model="statusModel">
  <wd-cell-group border>
    <wd-input
      v-model="statusModel.username"
      label="用户名"
      prop="username"
      placeholder="请输入用户名"
      :rules="[{ required: true, min: 3, message: '用户名至少3个字符' }]"
    />
    <wd-input
      v-model="statusModel.email"
      label="邮箱"
      prop="email"
      placeholder="请输入邮箱"
      :rules="[{ required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: '请输入正确的邮箱' }]"
    />
  </wd-cell-group>
</wd-form>`,

    script: `interface FormStatus {
  lastValidation: {
    valid: boolean
    errorCount: number
  }
  submitCount: number
  resetCount: number
}

const formStatus = reactive<FormStatus>({
  lastValidation: {
    valid: false,
    errorCount: 0,
  },
  submitCount: 0,
  resetCount: 0,
})

const handleStatusSubmit = async () => {
  const { valid, errors } = await statusFormRef.value!.validate()
  formStatus.lastValidation.valid = valid
  formStatus.lastValidation.errorCount = errors.length
  formStatus.submitCount++

  if (valid) {
    toast.success('提交成功')
  }
}`,
  },
}

// ===== API 文档数据 =====

// Props 属性文档
const apiProps = [
  {
    name: 'model',
    type: 'Object',
    default: '{}',
    desc: '表单数据对象',
  },
  {
    name: 'rules',
    type: 'FormRules',
    default: '{}',
    desc: '表单验证规则',
  },
  {
    name: 'reset-on-change',
    type: 'Boolean',
    default: 'true',
    desc: '是否在输入时重置表单校验信息',
  },
  {
    name: 'error-type',
    type: 'String',
    default: '"message"',
    desc: '错误提示类型：toast / message / none',
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
    name: 'validate(prop?)',
    desc: '表单校验方法，可传入字段名或字段数组进行部分校验，返回 Promise<{valid: boolean, errors: ErrorMessage[]}>'
  },
  {
    name: 'reset()',
    desc: '重置表单项的验证提示'
  },
]

// Events 事件文档（Form 组件没有自定义事件）
const apiEvents: any[] = []

// ===== 事件处理方法 =====

/**
 * 基本表单提交
 */
const handleBasicSubmit = async () => {
  const { valid } = await basicFormRef.value!.validate()
  if (valid) {
    toast.success('基本表单提交成功')
    console.log('基本表单数据：', basicModel.value)
  }
}

/**
 * 校验规则表单提交
 */
const handleValidationSubmit = async () => {
  const { valid, errors } = await validationFormRef.value!.validate()
  if (valid) {
    toast.success('校验规则表单提交成功')
    console.log('校验规则表单数据：', validationModel.value)
  } else {
    console.log('校验失败：', errors)
  }
}

/**
 * 添加手机号
 */
const handleAddPhone = () => {
  dynamicModel.value.phoneNumbers.push({
    key: Date.now(),
    value: '',
  })
  console.log('添加手机号，当前数量：', dynamicModel.value.phoneNumbers.length)
}

/**
 * 删除手机号
 */
const handleRemovePhone = () => {
  if (dynamicModel.value.phoneNumbers.length > 1) {
    dynamicModel.value.phoneNumbers.splice(dynamicModel.value.phoneNumbers.length - 1, 1)
    console.log('删除手机号，当前数量：', dynamicModel.value.phoneNumbers.length)
  }
}

/**
 * 重置动态表单
 */
const handleResetDynamic = () => {
  dynamicFormRef.value!.reset()
  dynamicModel.value.name = ''
  dynamicModel.value.phoneNumbers = [{ key: Date.now(), value: '' }]
  console.log('动态表单已重置')
}

/**
 * 动态表单提交
 */
const handleDynamicSubmit = async () => {
  const { valid } = await dynamicFormRef.value!.validate()
  if (valid) {
    toast.success('动态表单提交成功')
    console.log('动态表单数据：', dynamicModel.value)
  }
}

/**
 * 处理字段失焦校验
 */
const handleFieldBlur = async (prop: string) => {
  await blurFormRef.value!.validate(prop)
  console.log(`字段 ${prop} 失焦校验完成`)
}

/**
 * 部分字段校验
 */
const handlePartialValidate = async () => {
  const { valid, errors } = await blurFormRef.value!.validate(['phoneNumber', 'idCard'])
  if (valid) {
    toast.success('部分字段校验通过')
  } else {
    console.log('部分字段校验失败：', errors)
  }
}

/**
 * 失焦表单提交
 */
const handleBlurSubmit = async () => {
  const { valid } = await blurFormRef.value!.validate()
  if (valid) {
    toast.success('失焦校验表单提交成功')
    console.log('失焦表单数据：', blurModel.value)
  }
}

/**
 * Toast 表单提交
 */
const handleToastSubmit = async () => {
  const { valid } = await toastFormRef.value!.validate()
  if (valid) {
    toast.success('Toast 表单提交成功')
    console.log('Toast 表单数据：', toastModel.value)
  }
}

/**
 * 消息提示表单提交
 */
const handleMessageSubmit = async () => {
  const { valid } = await messageFormRef.value!.validate()
  if (valid) {
    toast.success('消息提示表单提交成功')
    console.log('消息提示表单数据：', messageModel.value)
  }
}

/**
 * 复杂表单提交
 */
const handleComplexSubmit = async () => {
  const { valid, errors } = await complexFormRef.value!.validate()
  if (valid) {
    toast.success('复杂表单提交成功')
    console.log('复杂表单数据：', complexModel.value)
  } else {
    console.log('复杂表单校验失败：', errors)
  }
}

/**
 * 文件上传变化处理
 */
const handleFileChange = ({ fileList }: any) => {
  complexModel.value.fileList = fileList
  console.log('文件列表更新：', fileList)
}

/**
 * 显示提示信息
 */
const handleShowTip = () => {
  toast.info('优惠券名称建议使用具有吸引力的词汇')
}

/**
 * 状态管理表单提交
 */
const handleStatusSubmit = async () => {
  const { valid, errors } = await statusFormRef.value!.validate()
  formStatus.value.lastValidation.valid = valid
  formStatus.value.lastValidation.errorCount = errors.length
  formStatus.value.submitCount++

  if (valid) {
    toast.success('状态管理表单提交成功')
    console.log('状态管理表单数据：', statusModel.value)
  } else {
    console.log('状态管理表单校验失败：', errors)
  }
}

/**
 * 状态管理表单重置
 */
const handleStatusReset = () => {
  statusFormRef.value!.reset()
  statusModel.value.username = ''
  statusModel.value.email = ''
  statusModel.value.age = ''
  formStatus.value.resetCount++
  formStatus.value.lastValidation.valid = false
  formStatus.value.lastValidation.errorCount = 0
  toast.info('表单已重置')
  console.log('状态管理表单已重置')
}

/**
 * 部分状态校验
 */
const handlePartialStatusValidate = async () => {
  const { valid, errors } = await statusFormRef.value!.validate(['username'])
  formStatus.value.lastValidation.valid = valid
  formStatus.value.lastValidation.errorCount = errors.length

  if (valid) {
    toast.success('用户名校验通过')
  } else {
    console.log('用户名校验失败：', errors)
  }
}

/**
 * 清除状态错误
 */
const handleClearStatusErrors = () => {
  statusFormRef.value!.reset()
  formStatus.value.lastValidation.valid = false
  formStatus.value.lastValidation.errorCount = 0
  toast.info('错误信息已清除')
  console.log('错误信息已清除')
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>
