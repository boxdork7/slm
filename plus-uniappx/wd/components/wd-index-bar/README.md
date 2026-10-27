# IndexBar 索引栏

用于列表的索引分类显示和快速定位。

## 基本用法

```vue
<template>
  <view class="page">
    <wd-index-bar>
      <wd-index-anchor index="A">
        <view class="item">Apple</view>
        <view class="item">Ant</view>
      </wd-index-anchor>

      <wd-index-anchor index="B">
        <view class="item">Banana</view>
        <view class="item">Bear</view>
      </wd-index-anchor>

      <wd-index-anchor index="C">
        <view class="item">Cat</view>
        <view class="item">Cherry</view>
      </wd-index-anchor>
    </wd-index-bar>
  </view>
</template>

<style lang="scss">
.page {
  height: 100vh;
}

.item {
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}
</style>
```

## 吸顶效果

```vue
<template>
  <wd-index-bar sticky>
    <wd-index-anchor index="A">
      <view class="item">Apple</view>
    </wd-index-anchor>
    <wd-index-anchor index="B">
      <view class="item">Banana</view>
    </wd-index-anchor>
  </wd-index-bar>
</template>
```

## IndexBar Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| sticky | 索引是否吸顶 | boolean | false |

## IndexAnchor Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| index | 索引值 | string \| number | - |
| customStyle | 自定义根节点样式 | string | '' |
| customClass | 自定义根节点样式类 | string | '' |

## IndexAnchor Slots

| 名称 | 说明 |
|------|------|
| default | 锚点内容，默认为索引值 |

## 注意事项

1. **容器高度**：IndexBar 必须有固定高度，建议使用 `height: 100vh` 或具体数值
2. **嵌套结构**：IndexAnchor 必须作为 IndexBar 的直接子组件
3. **索引唯一性**：每个 IndexAnchor 的 index 值应该唯一
4. **滚动性能**：大量数据时建议使用虚拟列表优化

## 实现细节（UniApp X）

### 父子组件通信
- 使用 `createChildManager` + `provide/inject` 模式
- 子组件通过 `registerChildData` 主动上报数据
- 父组件维护 `childDataMap` 存储子组件状态

### 位置计算
- 使用 `getRect` 获取组件位置信息
- 不依赖 `getCurrentInstance().proxy`
- 滚动位置使用 px 单位

### 触摸事件
- 使用 `UniTouchEvent` 类型
- 支持 touchstart/touchmove/touchend/touchcancel

## 与 plus-app 版本的差异

请参考 `MIGRATION.md` 文件了解详细的迁移说明和实现差异。
