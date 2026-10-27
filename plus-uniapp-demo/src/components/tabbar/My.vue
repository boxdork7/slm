<template>
  <view class="min-h-[100vh] bg-#FFFCF5 pb-10">
    <wd-navbar :bg-color="`rgba(255,252,245,${scrollTop / 60})`" :title="t('app.my.title')" />

    <view class="relative">
      <view
        class="absolute top-0 h-35 w-35 rounded-full filter-blur-lg -left-10"
        style="background: linear-gradient(120deg, #f3f4f600 0%, #ffedda 100%)"
      />
      <view
        class="absolute left-60 h-40 w-40 rounded-full filter-blur-lg -top-15"
        style="background: linear-gradient(45deg, #ffedda 0%, #f3f4f6 100%)"
      />
    </view>

    <!-- 用户信息头部 -->
    <view class="relative pt-10">
      <view class="flex flex-col items-center justify-center">
        <wd-icon
          v-if="!userStore.userInfo?.avatar"
          custom-class="bg-#f8f6f8 rounded-full p-6"
          name="user"
          size="80"
          color="#666666"
          @click="handleUserInfo"
        />
        <wd-img v-else :src="userStore.userInfo?.avatar" width="128" height="128" round @click="handleUserInfo" />
        <view class="mt-2 flex flex-col">
          <wd-text
            size="36"
            :text="userStore.userInfo?.nickName || '昵称'"
            @click="handleUserInfo"
          />
        </view>
      </view>

      <!-- 统计数据 -->
      <wd-row custom-class="mt-6 bg-#ffffffcc mx-5! rounded-lg py-2" :gutter="12">
        <wd-col v-for="(stat, index) in statsData" :key="index" :span="8">
          <view class="text-center" @click="handleStatClick(stat)">
            <wd-text bold block size="34" :text="stat.value" />
            <wd-text block :text="stat.label" size="24" />
          </view>
        </wd-col>
      </wd-row>
    </view>
    <!-- 我的订单 -->
    <wd-cell-group custom-class="mt-2 mx-3" title="我的订单">
      <wd-grid :items="orderTypes" clickable @item-click="handleOrderClick" />
    </wd-cell-group>

    <!-- 快捷功能 -->
    <wd-cell-group custom-class="mt-2 mx-3" title="快捷功能">
      <wd-grid :items="quickActions" clickable />
    </wd-cell-group>

    <!-- 常用服务 -->
    <wd-cell-group custom-class="mt-2 mx-3" title="常用服务">
      <wd-cell
        v-for="(service, index) in services"
        :key="index"
        :title="service.title"
        :icon="service.icon"
        is-link
        @click="handleServiceClick(service)"
      />
    </wd-cell-group>

    <!-- 后台服务 -->
    <wd-cell-group custom-class="my-2 mx-3" :title="t('app.my.adminServices')">
      <wd-cell
        v-for="(menu, index) in adminMenus"
        :key="index"
        :title="menu.title"
        :icon="menu.icon"
        :to="menu.to"
        is-link
      />
    </wd-cell-group>

    <!-- 设置 -->
    <wd-cell-group custom-class="my-2 mx-3" :title="t('app.settings.title')">
      <wd-cell
        :title="t('app.settings.title')"
        icon="setting"
        is-link
        @click="navigateToSettings"
      />
    </wd-cell-group>

    <wd-button
      v-if="auth.isLoggedIn.value"
      block
      custom-class="mx-10! mt-4"
      custom-style="background: linear-gradient(to right, #4F86FD, #5D6EFF);"
      @click="handleLogout"
    >
      {{ t('app.my.logout') }}
    </wd-button>
  </view>
</template>

<script lang="ts" setup>
// 用户信息
import type { GridItem } from '@/wd/components/wd-grid/wd-grid.vue'
import { useMessage, useToast } from '@/wd'
import PLATFORM from '@/utils/platform'
import { useI18n } from '@/composables/useI18n'

const { confirm } = useMessage()
const toast = useToast()
const { t } = useI18n()

const userStore = useUserStore()
const auth = useAuth()

// 统计数据
const statsData = ref([
  { label: '优惠券', value: '3', type: 'coupon' },
  { label: '积分', value: '1285', type: 'points' },
  { label: '余额', value: '268', type: 'balance' },
])

// 订单类型
const orderTypes = ref<GridItem[]>([
  { text: '待付款', icon: 'wallet', iconColor: '#666666' },
  { text: '待收货', icon: 'calendar', iconColor: '#666666' },
  { text: '待评价', icon: 'star', iconColor: '#666666' },
  { text: '退款/售后', icon: 'service', iconColor: '#666666' },
])

// 快捷功能
const quickActions = ref<GridItem[]>([
  { text: '收货地址', icon: 'location', iconColor: '#666666' },
  { text: '优惠券', icon: 'discount', iconColor: '#666666' },
  { text: '积分商城', icon: 'star', iconColor: '#666666' },
  { text: '客服', icon: 'service', iconColor: '#666666' },
  { text: '收藏夹', icon: 'heart', iconColor: '#666666' },
  { text: '浏览记录', icon: 'history', iconColor: '#666666' },
  { text: '帮助中心', icon: 'help', iconColor: '#666666' },
  { text: '意见反馈', icon: 'edit', iconColor: '#666666' },
])

// 常用服务
const services = ref([{ title: '会员中心', icon: 'vip-fill' }])

// 后台管理
const adminMenus = ref([{ title: '用户中心', icon: 'user', to: '/pages-sub/admin/user/user' }])

// 统计数据点击
const handleStatClick = (stat: any) => {
  uni.showToast({
    title: `查看${stat.label}详情`,
    icon: 'none',
  })
}

// 订单点击
const handleOrderClick = (item: GridItem, index: number) => {
  console.log(`点击了订单类型: ${item.text} (${index})`)
}

// 服务点击
const handleServiceClick = (service: any) => {
  userStore.navigateWithUserCheck(
    {
      url: '/pages-sub/admin/user/user',
    },
    'page',
  )
}

// 跳转到设置页面
const navigateToSettings = () => {
  uni.navigateTo({
    url: '/pages/my/settings'
  })
}

// 用户信息点击
const handleUserInfo = () => {
  if (auth.isLoggedIn.value) {
    userStore.authModalVisible = true
  } else {
    uni.navigateTo({
      url: '/pages/auth/login',
    })
  }
}

// 退出登录处理
const handleLogout = async () => {
  // 使用 useMessage 的 confirm 方法显示确认对话框
  const result = await confirm({
    title: '确认退出',
    msg: '您确定要退出登录吗？',
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
  })
  // 检查用户是否确认退出
  if (result.action === 'confirm') {
    // 显示加载提示
    toast.loading('退出中...')
    // 调用用户登出方法
    const [err] = await userStore.logoutUser()
    if (!err) {
      toast.close()
      toast.success('退出成功')
    }
  }
}

const { scrollTop } = useScroll()

onMounted(async () => {
  // 拉取用户信息
  await userStore.fetchUserInfo()
  console.log('userInfo', userStore.userInfo)
})
</script>

<style lang="scss" scoped></style>
