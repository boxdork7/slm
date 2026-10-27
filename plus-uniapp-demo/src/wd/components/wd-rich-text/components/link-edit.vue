<template>
  <!-- 链接编辑弹窗容器，只有在showPopup为true时才显示 -->
  <view class="link-edit-container" v-if="showPopup">
    <!-- 主弹窗内容区域 -->
    <view class="link-edit">
      <!-- 弹窗标题 -->
      <view class="title">添加链接</view>

      <!-- 表单编辑区域 -->
      <view class="edit">
        <!-- 链接描述输入框 -->
        <view class="description">
          链接描述：
          <input v-model="descVal" type="text" class="input" placeholder="请输入链接描述" />
        </view>

        <!-- 链接地址输入框 -->
        <view class="address">
          链接地址：
          <input v-model="addrVal" type="text" class="input" placeholder="请输入链接地址" />
        </view>
      </view>

      <!-- 操作按钮区域 -->
      <view class="control">
        <view class="cancel" @click="close">取消</view>
        <view class="confirm" @click="onConfirm">确认</view>
      </view>
    </view>

    <!-- 背景遮罩层 -->
    <view class="mask"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ========== 类型定义 ==========
/** 链接数据接口 */
interface LinkData {
  text: string // 链接显示文本
  href: string // 链接地址
}

// ========== 事件定义 ==========
const emit = defineEmits<{
  open: [] // 弹窗打开事件
  close: [] // 弹窗关闭事件
  confirm: [data: LinkData] // 确认添加链接事件，携带链接数据
}>()

// ========== 响应式数据 ==========
/** 控制弹窗显示/隐藏状态 */
const showPopup = ref<boolean>(false)

/** 链接描述文本的输入值 */
const descVal = ref<string>('')

/** 链接地址的输入值 */
const addrVal = ref<string>('')

// ========== 方法定义 ==========

/**
 * 打开链接编辑弹窗
 * 设置显示状态并触发open事件
 */
const open = () => {
  showPopup.value = true
  emit('open')
}

/**
 * 关闭链接编辑弹窗
 * 重置输入值，隐藏弹窗，并触发close事件
 */
const close = () => {
  showPopup.value = false
  descVal.value = ''
  addrVal.value = ''
  emit('close')
}

/**
 * 确认添加链接
 * 验证输入内容，如果有效则触发confirm事件并关闭弹窗
 */
const onConfirm = () => {
  // 验证链接描述是否为空
  if (!descVal.value) {
    uni.showToast({
      title: '请输入链接描述',
      icon: 'none',
    })
    return
  }

  // 验证链接地址是否为空
  if (!addrVal.value) {
    uni.showToast({
      title: '请输入链接地址',
      icon: 'none',
    })
    return
  }

  // 验证通过，触发confirm事件并传递链接数据
  emit('confirm', {
    text: descVal.value,
    href: addrVal.value,
  })

  // 关闭弹窗
  close()
}

// ========== 导出方法供父组件调用 ==========
defineExpose({
  open, // 打开弹窗方法
  close, // 关闭弹窗方法
})
</script>

<style lang="scss" scoped>
.link-edit-container {
  /* 弹窗主体样式 */
  .link-edit {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 居中定位 */
    background-color: #ffffff;
    box-shadow:
      -2px -2px 4px rgba(0, 0, 0, 0.05),
      2px 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 12rpx;
    box-sizing: border-box;
    z-index: 999;
    font-size: 14px;

    /* 弹窗标题样式 */
    .title {
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* 表单编辑区域样式 */
    .edit {
      padding: 24rpx;
      border-top: 1px solid #eeeeee; /* 上边框分隔线 */
      border-bottom: 1px solid #eeeeee; /* 下边框分隔线 */
      box-sizing: border-box;

      /* 输入框通用样式 */
      .input {
        flex: 1;
        padding: 4px;
        font-size: 14px;
        border: 1px solid #eeeeee;
        border-radius: 8rpx;

        /* 占位符文本颜色 */
        .uni-input-placeholder {
          color: #dddddd;
        }
      }

      /* 链接描述输入行 */
      .description {
        display: flex;
        align-items: center;
      }

      /* 链接地址输入行 */
      .address {
        display: flex;
        align-items: center;
        margin-top: 24rpx; /* 与描述输入框的间距 */
      }
    }

    /* 操作按钮区域样式 */
    .control {
      height: 80rpx;
      display: flex;
      cursor: pointer;

      /* 取消按钮样式 */
      .cancel {
        flex: 1;
        color: #dd524d; /* 红色文字 */
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* 确认按钮样式 */
      .confirm {
        border-left: 1px solid #eeeeee; /* 左边框分隔线 */
        flex: 1;
        color: #007aff; /* 蓝色文字 */
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  /* 背景遮罩层样式 */
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.05); /* 半透明黑色背景 */
    z-index: 998; /* 层级低于弹窗主体 */
  }
}
</style>
