# wd-index-bar / wd-index-anchor 迁移说明

## 迁移时间
2026-02-20

## 源文件
- `plus-app/wd/components/wd-index-bar/wd-index-bar.vue`
- `plus-app/wd/components/wd-index-bar/wd-index-bar-key.ts`
- `plus-app/wd/components/wd-index-anchor/wd-index-anchor.vue`

## 目标文件
- `plus-uniappx/wd/components/wd-index-bar/wd-index-bar.uvue`
- `plus-uniappx/wd/components/wd-index-bar/wd-index-bar-key.uts`
- `plus-uniappx/wd/components/wd-index-anchor/wd-index-anchor.uvue`

## 主要变更

### 1. 语言和文件扩展名
- `<script lang="ts" setup>` → `<script lang="uts" setup>`
- `.vue` → `.uvue`
- `.ts` → `.uts`

### 2. 组件配置
- ✅ 移除 `defineOptions({ name: 'WdIndexBar' })`
- ✅ 移除手动组件导入（easycom 自动注册）

### 3. 父子组件通信 (wd-index-bar)
**原实现 (plus-app)**:
```ts
import { useChildren } from '../composables/useChildren'
import { indexBarInjectionKey } from './wd-index-bar-key'

const { linkChildren, children } = useChildren(indexBarInjectionKey)
linkChildren({ props, anchorState: state })

// 访问子组件
watch(() => children, (newValue) => {
  if (!newValue.length) return
  // 访问 newValue[0].index, newValue[0].$.exposed!.top.value
})

// 滚动事件中访问
children.find((item) => item.$.exposed!.top.value - offsetTop <= scrolltop)
```

**新实现 (plus-uniappx)**:
```ts
import { createChildManager } from '../../composables/useChildren'
import { INDEX_BAR_KEY } from './wd-index-bar-key'

// 1. 创建子组件管理器
const manager = createChildManager()

// 2. 子组件数据映射
const childDataMap = reactive<Map<number, ChildAnchorData>>(new Map())

// 3. 提供注册方法
const registerChildData = (uid: number, index: AnchorIndex, top: number): void => {
  childDataMap.set(uid, { uid, index, top })
}

// 4. provide 给子组件
provide<IndexBarProvide>(INDEX_BAR_KEY, {
  childUids: manager.childUids,
  addChild: manager.addChild,
  removeChild: manager.removeChild,
  registerChildData,
  updateChildTop,
  // ...
})

// 5. 计算属性获取有序列表
const childDataList = computed((): ChildAnchorData[] => {
  const list: ChildAnchorData[] = []
  for (let i = 0; i < manager.childUids.length; i++) {
    const uid = manager.childUids[i]
    const data = childDataMap.get(uid)
    if (data != null) list.push(data)
  }
  return list
})

// 6. 监听子组件数量变化
watch(() => manager.childUids.length, (newLength: number) => {
  if (newLength === 0) {
    anchorState.activeIndex = null
    return
  }
  // 使用 childDataList.value 访问数据
})
```

**关键差异**:
- ❌ 不能直接访问子组件实例（`item.$.exposed`）
- ✅ 子组件通过 `registerChildData` 主动上报数据
- ✅ 父组件维护 `childDataMap` 存储子组件数据
- ✅ 使用 `childDataList` 计算属性获取有序数据

### 4. 子组件注册 (wd-index-anchor)
**原实现 (plus-app)**:
```ts
import { useParent } from '../composables/useParent'
const { parent: indexBar } = useParent(indexBarInjectionKey)

// 通过 defineExpose 暴露数据
defineExpose<WdIndexAnchorExpose>({
  top,
  getInfo,
  indexAnchorId,
  isSticky,
})
```

**新实现 (plus-uniappx)**:
```ts
import { genChildUid } from '../../composables/useChildren'
const indexBar = inject<IndexBarProvide | null>(INDEX_BAR_KEY, null)
const myUid = ref<number>(0)

onMounted(() => {
  myUid.value = genChildUid()
  if (indexBar != null) {
    indexBar.addChild(myUid.value)
    indexBar.registerChildData(myUid.value, props.index, 0)
  }
  getInfo() // 获取位置后更新
})

const getInfo = () => {
  getRect(`#${indexAnchorId.value}`, false).then((res: any) => {
    top.value = Math.floor(res['top'] as number)
    if (indexBar != null) {
      indexBar.updateChildTop(myUid.value, top.value)
    }
  })
}
```

**关键差异**:
- ❌ 移除 `defineExpose`（父组件无法直接访问）
- ✅ 通过 `registerChildData` 主动上报数据
- ✅ 数据更新时调用 `updateChildTop`

### 5. getCurrentInstance 移除
**原实现**:
```ts
const { proxy } = getCurrentInstance()!
getRect('#selector', false, proxy)
```

**新实现**:
```ts
// 直接调用，不传 scope
getRect('#selector', false)
```

### 6. 类型定义
**原实现 (wd-index-bar-key.ts)**:
```ts
import type { InjectionKey } from 'vue'

export interface IndexBarProvide {
  props: { sticky?: boolean }
  anchorState: { activeIndex: AnchorIndex | null }
}

export const indexBarInjectionKey: InjectionKey<IndexBarProvide> = Symbol('wd-index-bar')
```

**新实现 (wd-index-bar-key.uts)**:
```ts
// 移除 InjectionKey，使用字符串 key
export type IndexBarProvide = {
  childUids: number[]
  addChild: (uid: number) => void
  removeChild: (uid: number) => void
  props: IndexBarProps
  anchorState: AnchorState
  registerChildData: (uid: number, index: AnchorIndex, top: number) => void
  updateChildTop: (uid: number, top: number) => void
}

export const INDEX_BAR_KEY = 'wd-index-bar'
```

### 7. 事件类型
- `TouchEvent` → `UniTouchEvent`
- `e.touches[0].pageY` → `e.touches[0].pageY`（API 一致）
- `e.changedTouches[0].pageY` → `e.changedTouches[0].pageY`（API 一致）

### 8. 计算属性和 watch 类型标注
```ts
// 必须显式标注返回类型
const isSticky = computed((): boolean => {
  return indexBar != null && indexBar.props.sticky && indexBar.anchorState.activeIndex === props.index
})

// watch 回调参数需要类型标注
watch(
  () => manager.childUids.length,
  (newLength: number) => {
    // ...
  }
)
```

### 9. getRect 数据访问
**原实现**:
```ts
const [bar, sidebar, index] = await Promise.all([...])
offsetTop = bar.top!
sidebarInfo.offsetTop = sidebar.top!
```

**新实现**:
```ts
Promise.all([...]).then((results: any[]) => {
  const bar = results[0]
  if (bar != null && bar['top'] != null) {
    offsetTop = bar['top'] as number
  }
})
```

## 测试建议

1. **基础功能**
   - ✅ 索引栏是否正确显示
   - ✅ 点击侧边栏索引是否正确跳转
   - ✅ 滚动列表时侧边栏激活状态是否正确

2. **吸顶功能**
   - ✅ `sticky=true` 时锚点是否吸顶
   - ✅ 激活的锚点样式是否正确

3. **触摸交互**
   - ✅ 滑动侧边栏索引是否平滑切换
   - ✅ touchstart/touchmove/touchend 事件是否正常

4. **动态数据**
   - ✅ 动态添加/删除锚点是否正常
   - ✅ 子组件数量变化时激活状态是否正确

## 已知限制

1. **不支持 MP-DINGTALK 条件编译**
   - UniApp X 不支持钉钉小程序
   - 移除了 `#ifdef MP-DINGTALK` 相关代码

2. **子组件通信方式改变**
   - 父组件无法直接访问子组件实例
   - 子组件需要主动上报数据变化

## 兼容性说明

- ✅ 组件 API 完全兼容（props、slots、events）
- ✅ 样式完全兼容
- ⚠️ 内部实现有较大差异（父子通信模式）
- ⚠️ 性能特征可能不同（UTS 原生渲染）
