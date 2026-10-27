# wd-rich-text 组件迁移说明

## ⚠️ 重要提示

`wd-rich-text` 是一个非常复杂的富文本编辑器组件（1646行代码），包含：

1. **核心组件**：`wd-rich-text.vue`（主编辑器）
2. **子组件**：
   - `components/color-picker.vue`（颜色选择器）
   - `components/link-edit.vue`（链接编辑弹窗）
   - `components/fab-tool.vue`（浮动工具栏）
3. **工具函数**：`utils.ts`（链接处理、视频处理等）
4. **图标资源**：`assets/icons/editor-icon.css`（编辑器图标字体）

## UniApp X 迁移挑战

由于 UniApp X 对 `<editor>` 组件的支持可能有限制，建议：

### 方案 1：分阶段迁移

1. **先迁移基础版本**（只读显示）
2. **逐步添加编辑功能**（如果 UniApp X 支持）
3. **逐个迁移子组件**

### 方案 2：使用替代方案

如果 UniApp X 不支持 `<editor>` 组件，考虑：

1. **rich-text 组件**：仅用于显示（只读）
2. **第三方编辑器**：寻找 UniApp X 兼容的富文本编辑器
3. **Web-view 嵌入**：在 H5 中使用完整编辑器

## 关键迁移点

如果要完整迁移，需要注意：

### 1. UTS 语法转换
```typescript
// 原：Vue 3
import type { ComponentPublicInstance } from 'vue'
interface ColorValue { r: number; g: number; b: number; a: number }

// 改：UTS
// 移除 export type/interface（UTS script setup 不支持）
// ColorValue 定义在组件内部
```

### 2. 编辑器上下文
```typescript
// 原：Vue 3
const editorCtx = ref<EditorContext | null>(null)

// 改：UTS
const editorCtx = ref<EditorContext | null>(null) // 类型标注保持
```

### 3. 文件上传
```typescript
// 需要适配 UniApp X 的文件上传 API
// 原：uni.chooseImage / uni.chooseMedia / uni.chooseVideo
// 改：检查 UniApp X API 兼容性
```

### 4. 颜色选择器
```typescript
// 复杂的 RGBA/HEX 转换逻辑需要保留
// 但界面实现可能需要调整
```

## 建议迁移步骤

1. **确认需求**：是否需要完整的富文本编辑功能？
2. **测试 editor 组件**：在 UniApp X 中测试 `<editor>` 组件是否可用
3. **逐步迁移**：
   - 先迁移 `fab-tool.vue`（浮动工具，相对独立）
   - 再迁移 `color-picker.vue` 和 `link-edit.vue`
   - 最后迁移主组件 `wd-rich-text.vue`
4. **功能裁剪**：根据实际需求，可以移除不常用的工具

## 当前状态

- [ ] fab-tool 子组件
- [ ] color-picker 子组件
- [ ] link-edit 子组件
- [ ] utils.ts 工具函数
- [ ] editor-icon.css 图标资源
- [ ] wd-rich-text.uvue 主组件

**如需完整迁移，请告知具体需求，我会提供详细方案。**
