# 键盘组件迁移总结

## 迁移完成时间
2026-02-20

## 迁移组件清单

### 1. wd-keyboard（虚拟键盘）
- **源文件**: `plus-app/wd/components/wd-keyboard/wd-keyboard.vue`
- **目标文件**: `plus-uniappx/wd/components/wd-keyboard/wd-keyboard.uvue`
- **依赖组件**: `key.uvue`
- **功能**: 虚拟数字键盘，支持默认模式、自定义模式、车牌号模式

### 2. wd-number-keyboard（数字键盘）
- **源文件**: `plus-app/wd/components/wd-number-keyboard/wd-number-keyboard.vue`
- **目标文件**: `plus-uniappx/wd/components/wd-number-keyboard/wd-number-keyboard.uvue`
- **依赖组件**: `key.uvue`
- **功能**: 数字键盘，用于输入数字、密码或身份证等场景

### 3. wd-password-input（密码输入框）
- **源文件**: `plus-app/wd/components/wd-password-input/wd-password-input.vue`
- **目标文件**: `plus-uniappx/wd/components/wd-password-input/wd-password-input.uvue`
- **依赖组件**: `wd-number-keyboard`
- **功能**: 带网格的密码输入框，可用于密码、验证码等场景

### 4. key（按键组件）
- **源文件**:
  - `plus-app/wd/components/wd-keyboard/key.vue`
  - `plus-app/wd/components/wd-number-keyboard/key.vue`
- **目标文件**:
  - `plus-uniappx/wd/components/wd-keyboard/key.uvue`
  - `plus-uniappx/wd/components/wd-number-keyboard/key.uvue`
- **功能**: 虚拟键盘中的单个按键组件

## 主要变更内容

### 1. 脚本部分
- `<script lang="ts" setup>` → `<script lang="uts" setup>`
- 移除 `defineOptions({ name: 'xxx' })`
- 移除手动组件导入（依赖 easycom 自动注册）
- `TouchEvent` → `UniTouchEvent`
- `Event` → `UniEvent`
- Union literal 类型改为 `string` 类型
- `Array<T>` → `T[]`
- `Infinity` → `Number.MAX_VALUE`
- 显式标注计算属性返回类型
- 显式标注 watch 回调参数类型
- `Record<string, any>` → `UTSJSONObject`

### 2. 样式部分
- `:deep()` 伪类选择器 → 直接使用类选择器
- `@include e()` mixin → 展开为具体的类名
- `@include m()` mixin → 展开为具体的类名
- `display: inline-block` → `display: flex`

### 3. 模板部分
- 保持不变，无需修改

## 关键技术点

### 1. 泛型函数支持
```typescript
// UTS 支持泛型函数
const shuffleArray = <T>(arr: T[]): T[] => {
  const newArr = [...arr]
  // ...
  return newArr
}
```

### 2. 计算属性类型标注
```typescript
// 必须显式标注返回类型
const keyClass = computed((): string => {
  return classList.join(' ')
})

const keys = computed((): Key[] => {
  return genDefaultKeys()
})
```

### 3. Watch 回调类型标注
```typescript
watch(
  (): boolean => props.visible,
  (newValue: boolean) => {
    show.value = newValue
  },
)
```

### 4. 样式对象类型
```typescript
// 返回 UTSJSONObject 而不是普通对象
const getItemStyle = (index: number): UTSJSONObject => {
  return {
    marginLeft: index !== 0 ? gutterValue : '0',
    backgroundColor: props.bgColor,
  } as UTSJSONObject
}
```

### 5. 事件类型转换
```typescript
// TouchEvent → UniTouchEvent
const onTouchStart = (event: UniTouchEvent) => {
  touch.touchStart(event)
}

// Event → UniEvent
const onTouchStart = (event: UniEvent) => {
  event.preventDefault()
}
```

## 依赖关系

```
wd-password-input
  └── wd-number-keyboard
        └── key

wd-keyboard
  └── key

共同依赖:
  - wd-popup
  - wd-icon
  - wd-loading
  - useTouch (composable)
```

## 测试建议

1. **基础功能测试**
   - 键盘显示/隐藏
   - 按键点击反馈
   - 删除键功能
   - 关闭键功能

2. **模式测试**
   - 默认模式（数字 + 额外键）
   - 自定义模式（自定义布局）
   - 车牌号模式（省份简称 + 字母数字）

3. **密码输入框测试**
   - 光标闪烁
   - 蒙版显示
   - 内置键盘联动
   - 外部键盘模式

4. **特殊功能测试**
   - 随机键盘顺序
   - 最大长度限制
   - 安全区适配
   - 模态框交互

## 已知限制

1. UTS 不支持 `Infinity`，使用 `Number.MAX_VALUE` 替代
2. CSS 的 `::before`/`::after` 伪元素在 UTS 中需要转为真实元素
3. `:deep()` 选择器在 UTS 中不支持，需要直接使用类选择器

## 后续工作

- [ ] 在实际项目中测试组件功能
- [ ] 验证暗色主题支持
- [ ] 确认触摸事件处理
- [ ] 测试键盘与输入框的联动
- [ ] 验证车牌号键盘的中英文切换
