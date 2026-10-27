<!-- Rate 评分 用于快速的评价操作，或对评价进行展示。 -->
<template>
  <view :class="`wd-rate ${customClass}`" :style="customStyle" @touchmove="onTouchMove">
    <view
      v-for="(rate, index) in rateList"
      :key="index"
      :data-index="index"
      :style="{ 'margin-right': index === rateList.length - 1 ? 0 : addUnit(space) }"
      class="wd-rate__item"
    >
      <wd-icon
        custom-class="wd-rate__item-star"
        :name="isActive(rate) ? activeIcon : icon"
        :size="addUnit(size)"
        :custom-style="
          rate === '100%'
            ? `background:${disabled ? disabledColor : activeValue};`
            : `background:${color};`
        "
        @click="changeRate(index, false)"
      />
      <view v-if="allowHalf" class="wd-rate__item-half" @click.stop="changeRate(index, true)">
        <wd-icon
          custom-class="wd-rate__item-star"
          :name="isActive(rate) ? activeIcon : icon"
          :size="addUnit(size)"
          :custom-style="
            rate !== '0'
              ? `background:${disabled ? disabledColor : activeValue};`
              : `background:${color};`
          "
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, watch } from 'vue'
import { addUnit, getRect } from '../common/util'
import wdIcon from '../wd-icon/wd-icon.vue'
import { IconName } from '@/wd/components/wd-icon/wd-icon.vue'

defineOptions({
  name: 'WdRate',
  options: {
    addGlobalClass: true, // 允许组件使用全局 CSS 类名，不受样式隔离限制
    virtualHost: true, // 启用虚拟主机节点，组件不会在 DOM 中创建额外的包装元素
    styleIsolation: 'shared', // 样式隔离模式：'isolated'(完全隔离)、'apply-shared'(应用共享样式)、'shared'(共享样式)
  },
})

/**
 * 评分组件属性接口
 */
interface WdRateProps {
  /** 自定义根节点样式 */
  customStyle?: string
  /** 自定义根节点样式类 */
  customClass?: string

  /** 评分最大值 */
  num?: number
  /** 当前分数，使用v-model进行双向绑定 */
  modelValue?: string | number | null
  /** 是否只读 */
  readonly?: boolean
  /** 图标大小 */
  size?: string
  /** 图标间距 */
  space?: string
  /** 未选中的图标颜色 */
  color?: string
  /** 选中的图标颜色，支持传颜色数组（用于分段颜色） */
  activeColor?: string | Array<string>
  /** 未选中的图标类名 */
  icon?: IconName
  /** 选中的图标类名 */
  activeIcon?: IconName
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用的图标颜色 */
  disabledColor?: string
  /** 是否允许半选 */
  allowHalf?: boolean
  /** 是否允许清空评分 */
  clearable?: boolean
}

/**
 * 评分组件事件接口
 */
interface WdRateEmits {
  /** 更新 modelValue */
  'update:modelValue': [value: number]
  /** 评分变化时触发 */
  change: [{ value: number }]
}

// 使用 withDefaults 定义组件属性和默认值
const props = withDefaults(defineProps<WdRateProps>(), {
  customStyle: '',
  customClass: '',
  num: 5,
  modelValue: null,
  readonly: false,
  size: '32',
  space: '8',
  color: '#E8E8E8',
  activeColor: 'linear-gradient(180deg, rgba(255,238,0,1) 0%,rgba(250,176,21,1) 100%)',
  icon: 'star',
  activeIcon: 'star-fill',
  disabled: false,
  disabledColor: 'linear-gradient(315deg, rgba(177,177,177,1) 0%,rgba(199,199,199,1) 100%)',
  allowHalf: false,
  clearable: false,
})

// 定义组件事件
const emit = defineEmits<WdRateEmits>()

// 获取当前组件实例
const { proxy } = getCurrentInstance() as any

// 响应式数据
const rateList = ref<Array<string>>([])
const activeValue = ref<string>('')

/**
 * 计算当前应当展示的评分颜色
 * 根据激活颜色配置和当前值计算最终显示颜色
 */
const computeActiveValue = () => {
  const { activeColor, modelValue, num } = props
  let tempActiveValue: string = ''

  if (Array.isArray(activeColor) && activeColor.length) {
    // 如果是颜色数组，根据分数选择对应颜色
    tempActiveValue =
      Number(modelValue) <= num * 0.6 || !activeColor[1] ? activeColor[0] : activeColor[1]
  } else {
    tempActiveValue = activeColor as string
  }

  activeValue.value = tempActiveValue
}

/**
 * 监听激活颜色变化
 * 当激活颜色发生变化时，重新计算当前应显示的颜色
 */
watch(
  () => props.activeColor,
  (newVal) => {
    if (Array.isArray(newVal) && !newVal.length) {
      console.error('activeColor cannot be an empty array')
    }
    computeActiveValue()
  },
  {
    immediate: true,
    deep: true,
  },
)

/**
 * 计算当前应当展示的评分数量
 * 根据当前值和是否允许半选生成评分列表
 */
const computeRateList = () => {
  const { modelValue, num, allowHalf } = props

  // value和num都准备好才能计算
  if (modelValue === null || !num) return

  if (typeof modelValue !== 'number') {
    console.error('error(wd-rate): the value of wd-rate should be a number')
    return
  }

  const tempRateList: string[] = []
  const fullLength = Math.floor(modelValue)

  for (let i = 0; i < num; i++) {
    if (i < fullLength) {
      tempRateList.push('100%')
    } else if (i === fullLength && allowHalf && modelValue % 1 !== 0) {
      tempRateList.push('50%')
    } else {
      tempRateList.push('0')
    }
  }

  rateList.value = tempRateList
  computeActiveValue()
}

/**
 * 监听评分数量和当前值变化
 * 当评分数量或当前值发生变化时，重新计算评分列表
 */
watch(
  [() => props.num, () => props.modelValue],
  () => {
    computeRateList()
  },
  {
    immediate: true,
    deep: true,
  },
)

/**
 * 判断当前选项是否为激活状态
 * @param rate 评分状态值
 */
const isActive = (rate: string): boolean => {
  return rate !== '0'
}

/**
 * 点击图标触发评分变化
 * @param index 点击的图标索引
 * @param isHalf 是否为半选
 */
const changeRate = (index: number, isHalf: boolean) => {
  if (props.readonly || props.disabled) return

  const value = isHalf ? index + 0.5 : index + 1

  // 支持清空：点击相同值时清零
  if (props.clearable && value === props.modelValue) {
    emit('update:modelValue', 0)
    emit('change', { value: 0 })
    return
  }

  emit('update:modelValue', value)
  emit('change', { value })
}

/**
 * 触摸移动事件处理
 * 支持滑动评分功能
 */
const onTouchMove = async (event: TouchEvent) => {
  if (props.readonly || props.disabled) return
  const { clientX } = event.touches[0]
  const rateItems = await getRect('.wd-rate__item', true, proxy)

  const targetIndex = Array.from(rateItems).findIndex((rect) => {
    return clientX >= rect.left! && clientX <= rect.right!
  })

  if (targetIndex !== -1) {
    const target = rateItems[targetIndex]
    const itemWidth = target.width!
    const isHalf = props.allowHalf && clientX - target.left! < itemWidth / 2
    const value = isHalf ? targetIndex + 0.5 : targetIndex + 1

    if (value >= 0.5) {
      changeRate(targetIndex, isHalf)
    }
  }
}
</script>

<style lang="scss">
// 引入外部样式文件
@import './../common/abstracts/_mixin.scss';
@import './../common/abstracts/variable.scss';

// 评分组件样式
@include b(rate) {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;

  // 评分项
  @include e(item) {
    position: relative;
    display: inline-block;
    touch-action: none; // 禁用默认触摸行为
  }

  // 星星图标样式
  @include edeep(item-star) {
    -webkit-background-clip: text !important;
    color: transparent;
  }

  // 半选区域
  @include e(item-half) {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 50%;
  }
}
</style>
