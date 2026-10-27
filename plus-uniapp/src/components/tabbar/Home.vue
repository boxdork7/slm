<!-- 首页标签 -->
<template>
  <view class="min-h-[100vh]">
    <wd-navbar title="首页" />
    <!-- 轮播图 -->
    <wd-swiper :list="swiperList" custom-class="m-2" />

    <!-- 金刚区 -->
    <wd-row custom-class="p-2 bg-white mx-4 rounded-xl" :gutter="16">
      <wd-col v-for="(item, index) in menuList" :key="index" :span="6">
        <view class="flex flex-col items-center py-2" @click="handleMenuClick(item)">
          <wd-icon :name="item.icon" size="60" :color="item.color" />
          <wd-text custom-class="mt-2" :text="item.title" />
        </view>
      </wd-col>
    </wd-row>

    <!-- 商品列表 - 使用wd-paging组件 -->
    <wd-paging
      ref="paging"
      :fetch="pageGoods"
      :params="queryParams"
      :tabs="tabsConfig"
      :scroll-top="scrollTop"
      @scroll-to-top="handleScrollToTop"
    >
      <!-- 商品列表项 -->
      <template #item="{ item, currentTabData }: { item: GoodsVo; currentTabData: any }">
        <wd-card custom-class="w-694rpx box-border">
          <!-- 根据不同tab显示不同的标签 -->
          <template #title>
            <view class="flex items-center">
              <wd-img :src="item.img" width="120" height="120" radius="8" />
              <view class="ml-2 flex items-center">
                <wd-tag v-if="currentTabData?.name === 'hot'" type="danger" size="small">
                  热销
                </wd-tag>
                <wd-tag v-else-if="currentTabData?.name === 'new'" type="success" size="small">
                  新品
                </wd-tag>
                <wd-text custom-class="ml-1" :text="item.name" />
              </view>
            </view>
          </template>

          <template #footer>
            <view class="flex justify-between">
              <wd-text :text="item.price" size="32" type="error" bold />
              <wd-button type="primary" size="small" @click="handleGoodsPay(item)">
                立即购买
              </wd-button>
            </view>
          </template>
        </wd-card>
      </template>
    </wd-paging>
  </view>
</template>

<script lang="ts" setup>
import type { AdVo, GoodsQuery, GoodsVo } from '@/api/app/home/homeTypes'
import type { CreateOrderBo } from '@/api/common/mall/order/orderTypes'
import { listAds, pageGoods } from '@/api/app/home/homeApi'
import { usePayment } from '@/composables/usePayment'
import { PaymentMethod } from '@/api/common/mall/order/orderTypes'
import { useToast } from '@/wd'

const toast = useToast()

// 使用 useScroll 获取全局滚动状态
const { scrollTop, scrollToTop } = useScroll()

// 处理滚动到顶部事件
const handleScrollToTop = () => {
  scrollToTop(300)
}
// Tabs 配置
const tabsConfig = ref([
  { name: 'hot', title: '热销', data: { category: 'hot' } },
  { name: 'new', title: '新品', data: { category: 'new' } },
])
const img=ref('')
// 轮播图数据
const swiperList = ref<string[]>([])

// 金刚区数据
const menuList = ref([
  { title: '外卖', icon: 'goods', color: '#ff6b6b' },
  { title: '超市', icon: 'cart', color: '#4ecdc4' },
  { title: '水果', icon: 'apple', color: '#45b7d1' },
  { title: '药店', icon: 'bag-fill', color: '#96ceb4' },
  { title: '鲜花', icon: 'gift', color: '#feca57' },
  { title: '蛋糕', icon: 'layers', color: '#ff9ff3' },
  { title: '酒店', icon: 'company', color: '#54a0ff' },
  { title: '更多', icon: 'more', color: '#5f27cd' },
])

// 查询参数
const queryParams = ref<GoodsQuery>({
  pageNum: 1,
  pageSize: 10,
  orderByColumn: 'createTime',
  isAsc: 'desc',
})

// 事件处理函数
const handleMenuClick = (item: any) => {
  console.log('🔥 点击金刚区:', item.title)
  uni.navigateTo({ url: item.path })
}

// 使用支付 composable
const { createOrderAndPay, pollOrderStatus } = usePayment()

/**
 * 处理商品购买
 */
const handleGoodsPay = async (goods: GoodsVo) => {
  console.log('购买商品:', goods.name)

  // 构造订单数据
  const orderData: CreateOrderBo = {
    goodsId: goods.id,
    goodsName: goods.name,
    quantity: 1,
    price: '0.01', // goods.price
  }

  // 1. 创建订单并发起支付
  const [payErr, payResult] = await createOrderAndPay({
    orderData,
    paymentMethod: PaymentMethod.WECHAT, // 默认使用微信支付
  })

  if (!payErr) {
    // 开始轮询查询支付结果
    const [pollErr] = await pollOrderStatus(payResult.orderData.orderNo, 5)

    if (!pollErr) {
      // 支付成功
      console.log('支付成功！')
      toast.success('支付成功')
    } else {
      toast.error('支付确认超时或失败')
    }
  } else {
    console.error('支付发起失败:', payErr.message)
  }
}

/** 初始化首页广告 */
const initAds = async () => {
  const [err, data] = await listAds()
  if (!err) {
    swiperList.value = data.map((ad: AdVo) => ad.img)
  }
}

// 页面生命周期
onMounted(() => {
  initAds()
})
</script>

<style lang="scss" scoped>
.action {
  height: 100%;
}

.button {
  display: inline-block;
  padding: 0 11px;
  height: 100%;
  color: white;
  line-height: 42px;
}
</style>
