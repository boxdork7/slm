<!-- 表单配置 http://127.0.0.1:100/#/pages-sub/demo/wd/configProvider -->
<template>
  <view>
    <wd-navbar title="configProvider 全局配置" show-back />

    <wd-cell title="切换主题色" title-width="240px" center>
      <wd-switch v-model="isRed" />
    </wd-cell>

    <!-- 使用 wd-form 进行表单管理 -->
    <wd-form ref="formRef" :model="formData" :rules="formRules">
      <!-- 基础信息 -->
      <view class="mx-4 mt-3">
        <view class="mb-2 text-sm text-gray-600 font-medium">基础信息</view>
        <view class="overflow-hidden rounded-xl">
          <wd-input
            v-model="formData.couponName"
            label="优惠券名称"
            label-width="100px"
            :maxlength="20"
            show-word-limit
            prop="couponName"
            suffix-icon="warn-bold"
            clearable
            placeholder="请输入优惠券名称"
            @change="handleCouponName"
            @clicksuffixicon="handleIconClick"
          />
          <wd-select-picker
            v-model="formData.platform"
            label="推广平台"
            label-width="100px"
            prop="platform"
            :columns="platformList"
            placeholder="请选择推广平台"
            @confirm="handlePlatform"
          />
          <wd-picker
            v-model="formData.promotion"
            label="优惠方式"
            label-width="100px"
            prop="promotion"
            align-right
            :columns="promotionlist"
            @confirm="handlePromotion"
          />
          <wd-cell
            custom-class=" pb-6"
            title="券面额"
            required
            title-width="100px"
            custom-value-class="cell-left"
            :border="false"
          >
            <view class="text-left">
              <span class="mx-2 inline-block align-middle text-sm text-gray-500">满</span>
              <wd-input
                v-model="formData.threshold"
                no-border
                prop="threshold"
                custom-style="display: inline-block; width: 80px; vertical-align: middle"
                placeholder="请输入金额"
                type="number"
                @change="handleThreshold"
              />
              <span class="mx-2 inline-block align-middle text-sm text-gray-500">减</span>
              <wd-input
                v-model="formData.price"
                no-border
                prop="price"
                custom-style="display: inline-block; width: 80px; vertical-align: middle"
                placeholder="请输入金额"
                type="number"
                @change="handlePrice"
              />
            </view>
          </wd-cell>
        </view>
      </view>

      <!-- 时间和地址 -->
      <view class="mx-4 mt-3">
        <view class="mb-2 text-sm text-gray-600 font-medium">时间和地址</view>
        <view class="overflow-hidden rounded-xl">
          <wd-datetime-picker
            v-model="formData.date"
            label="活动时间"
            label-width="100px"
            prop="date"
            placeholder="请选择活动时间"
            @confirm="handleDate"
          />
          <!-- 使用内置省市区数据 -->
          <wd-col-picker
            v-model="formData.address"
            label="活动地址"
            label-width="100px"
            prop="address"
            placeholder="请选择活动地址"
            @confirm="handleAddress"
          />
        </view>
      </view>

      <!-- 其他信息 -->
      <view class="mx-4 mt-3">
        <view class="mb-2 text-sm text-gray-600 font-medium">其他信息</view>
        <view class="overflow-hidden rounded-xl">
          <wd-input
            v-model="formData.content"
            label="活动细则"
            label-width="100px"
            :maxlength="300"
            show-word-limit
            placeholder="请输入活动细则信息"
            clearable
            prop="content"
            type="text"
            :rows="3"
            @change="handleContent"
          />
          <wd-cell title="发货数量" center>
            <wd-input-number
              v-model="formData.count"
              prop="count"
              :min="1"
              :max="9999"
              @change="handleCount"
            />
          </wd-cell>
          <wd-cell title="启用状态" center>
            <wd-switch v-model="formData.switchVal" prop="switchVal" @change="handleSwitch" />
          </wd-cell>
          <wd-input
            v-model="formData.cardId"
            label="身份证号"
            label-width="100px"
            prop="cardId"
            suffix-icon="camera"
            placeholder="请输入身份证号"
            clearable
            @change="handleCardId"
            @clicksuffixicon="handleCameraClick"
          />
          <wd-input
            v-model="formData.phone"
            label="联系电话"
            label-width="100px"
            prop="phone"
            type="tel"
            placeholder="请输入联系电话"
            clearable
            @change="handlePhone"
          />
          <wd-input
            v-model="formData.email"
            label="邮箱地址"
            label-width="100px"
            prop="email"
            type="text"
            placeholder="请输入邮箱地址"
            clearable
            @change="handleEmail"
          />
        </view>
      </view>

      <!-- 上传文件 -->
      <view class="mx-4 mt-3">
        <view class="mb-2 text-sm text-gray-600 font-medium">文件上传</view>
        <view class="overflow-hidden rounded-xl p-4">
          <wd-cell title="活动图片" vertical>
            <view class="mt-2">
              <wd-upload
                v-model="formData.images"
                :limit="3"
                :max-size="5 * 1024 * 1024"
                accept="image"
                prop="images"
                @success="handleUploadSuccess"
              />
            </view>
          </wd-cell>
        </view>
      </view>

      <!-- 协议同意 -->
      <view class="mx-4 mb-5 mt-3">
        <wd-checkbox
          v-model="formData.read"
          prop="read"
          custom-label-class="text-xs text-gray-500"
          @change="handleRead"
        >
          已阅读并同意
          <text class="text-blue-500" @click="showProtocol">《用户服务协议》</text>
          和
          <text class="text-blue-500" @click="showPrivacy">《隐私政策》</text>
        </wd-checkbox>
      </view>

      <!-- 操作按钮 -->
      <view class="flex gap-3 px-6 pb-5">
        <wd-button round size="large" custom-style="flex: 1" @click="handleReset">
          重置表单
        </wd-button>
        <wd-button
          round
          block
          size="large"
          type="primary"
          custom-style="flex: 2"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ submitLoading ? '提交中...' : '提交表单' }}
        </wd-button>
      </view>
    </wd-form>

    <!-- 表单数据预览 -->
    <view class="mx-4 mb-4 rounded-xl bg-gray-50 p-4">
      <view class="mb-3 text-base font-medium">表单数据预览</view>
      <view class="text-xs">
        <pre class="whitespace-pre-wrap">{{ JSON.stringify(formData, null, 2) }}</pre>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast, useMessage } from '@/wd'
import { toValidate } from '@/utils/to'

const toast = useToast()
const messageBox = useMessage()
const isRed = ref<boolean>(false)

const { setGlobalTheme } = useTheme()
watch(
  () => isRed.value,
  (newVal) => {
    setGlobalTheme({
      colorTheme: newVal ? 'red' : '',
    })
  },
)

// 表单引用
const formRef = ref<any>(null)
const submitLoading = ref(false)

// 表单数据
const formData = ref({
  couponName: '',
  platform: [],
  promotion: '1',
  threshold: '',
  price: '',
  date: new Date().getTime(),
  address: [],
  content: '',
  count: 1,
  read: false,
  switchVal: true,
  cardId: '',
  phone: '',
  email: '',
  images: [],
})

// 平台选项
const platformList = ref([
  { value: '1', label: '京东' },
  { value: '2', label: '开普勒' },
  { value: '3', label: '手Q' },
  { value: '4', label: '微信' },
  { value: '5', label: '1号店' },
  { value: '6', label: '十元街' },
  { value: '7', label: '京东极速版' },
])

// 优惠方式选项
const promotionlist = ref([
  { value: '1', label: '满减' },
  { value: '2', label: '无门减' },
])

// 表单验证规则
const formRules = {
  couponName: [
    { required: true, message: '请输入优惠券名称' },
    { min: 2, max: 20, message: '优惠券名称长度在 2 到 20 个字符' },
  ],
  platform: [{ required: true, message: '请选择推广平台' }],
  promotion: [{ required: true, message: '请选择优惠方式' }],
  threshold: [
    { required: true, message: '请输入满减' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '输入正确格式' },
  ],
  price: [
    { required: true, message: '输入减免额' },
    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的金额格式' },
    {
      validator: (value: string) => {
        const threshold = Number.parseFloat(formData.value.threshold)
        const price = Number.parseFloat(value)
        return !threshold || !price || price < threshold
      },
      message: '减免金额不能大于等于满减门槛',
    },
  ],
  date: [{ required: true, message: '请选择活动时间' }],
  address: [{ required: true, message: '请选择活动地址' }],
  content: [
    { required: true, message: '请输入活动细则' },
    { min: 10, max: 300, message: '活动细则长度在 10 到 300 个字符' },
  ],
  count: [
    { required: true, message: '请输入发货数量' },
    { min: 1, message: '发货数量不能小于 1' },
  ],
  cardId: [
    {
      pattern:
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/i,
      message: '请输入正确的身份证号码',
    },
  ],
  phone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  ],
  email: [{ pattern: /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/, message: '请输入正确的邮箱地址' }],
  read: [
    {
      validator: (value: boolean) => value === true,
      message: '请先阅读并同意相关协议',
    },
  ],
}

// 事件处理函数
const handleCouponName = ({ value }: any) => {
  console.log('优惠券名称:', value)
}

const handlePlatform = ({ value }: any) => {
  console.log('推广平台:', value)
}

const handlePromotion = ({ value }: any) => {
  console.log('优惠方式:', value)
}

const handleThreshold = ({ value }: any) => {
  console.log('满减门槛:', value)
}

const handlePrice = ({ value }: any) => {
  console.log('减免金额:', value)
}

const handleDate = ({ value }: any) => {
  console.log('选择时间:', value)
}

const handleAddress = ({ value }: any) => {
  console.log('选择地址:', value)
}

const handleContent = ({ value }: any) => {
  console.log('活动细则:', value)
}

const handleCount = ({ value }: any) => {
  console.log('发货数量:', value)
}

const handleSwitch = ({ value }: any) => {
  console.log('开关状态:', value)
}

const handleRead = ({ value }: any) => {
  console.log('协议同意:', value)
}

const handleCardId = ({ value }: any) => {
  console.log('身份证号:', value)
}

const handlePhone = ({ value }: any) => {
  console.log('联系电话:', value)
}

const handleEmail = ({ value }: any) => {
  console.log('邮箱地址:', value)
}

const handleIconClick = () => {
  toast.info('优惠券名称填写提示：\n1. 名称要简洁明了\n2. 突出优惠内容\n3. 字数控制在20字以内')
}

const handleCameraClick = () => {
  toast.info('可以使用相机扫描身份证')
}

const handleUploadSuccess = ({ file }: any) => {
  console.log('上传成功:', file)
  toast.success('图片上传成功')
}

// 显示协议
const showProtocol = () => {
  messageBox.alert('这里是《用户服务协议》的内容...')
}

const showPrivacy = () => {
  messageBox.alert('这里是《隐私政策》的内容...')
}

// 重置表单
const handleReset = async () => {
  const confirmed = await messageBox.confirm('确定要重置表单吗？所有填写的内容将被清空。')
  if (confirmed) {
    // 重置表单数据
    Object.assign(formData, {
      couponName: '',
      platform: [],
      promotion: '1',
      threshold: '',
      price: '',
      date: new Date().getTime(),
      address: [],
      content: '',
      count: 1,
      read: false,
      switchVal: true,
      cardId: '',
      phone: '',
      email: '',
      images: [],
    })

    // 清除表单验证状态
    if (formRef.value) {
      formRef.value.clearValidate()
    }

    toast.success('表单已重置')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    submitLoading.value = true

    // 使用 toValidate 方法进行表单验证
    const [error, isValid] = await toValidate(formRef)

    if (error || !isValid) {
      toast.error(error?.message || '表单验证失败')
      return
    }

    // 额外的业务逻辑验证
    if (Number.parseFloat(formData.value.price) >= Number.parseFloat(formData.value.threshold)) {
      toast.error('减免金额不能大于等于满减门槛')
      return
    }

    // 模拟提交过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 提交成功
    await messageBox.alert('表单提交成功！\n\n您的优惠券已创建，请等待审核。')

    // 可以选择重置表单或跳转页面
    console.log('提交的表单数据:', formData.value)
  } catch (err) {
    console.error('提交失败:', err)
    toast.error('提交失败，请重试')
  } finally {
    submitLoading.value = false
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

<style scoped>
.cell-left :deep(.wd-input) {
  text-align: left;
}

pre {
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  line-height: 1.2;
  color: #666;
  max-height: 200px;
  overflow-y: auto;
}
</style>
