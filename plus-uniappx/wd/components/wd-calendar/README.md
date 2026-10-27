# wd-calendar 和 wd-calendar-view 迁移说明

## 迁移状态

**当前版本**: 简化骨架版本
**完成度**: 30%
**可用性**: ⚠️ 仅供参考,不可直接使用

## 已完成部分

### ✅ 核心文件

1. **wd-calendar-utils.uts** (工具函数)
   - ✅ 基础日期比较函数
   - ✅ 日期格式化函数
   - ✅ 周/月/年计算函数
   - ✅ 移除 dayjs,使用原生 Date
   - ✅ 类型定义(CalendarType, CalendarDayItem 等)

2. **wd-calendar-view.uvue** (日历视图)
   - ✅ 基础结构和属性定义
   - ✅ 事件处理框架
   - ⚠️ 仅占位实现,无实际功能

3. **wd-calendar.uvue** (日历选择器)
   - ✅ 基础弹窗结构
   - ✅ 打开/关闭逻辑
   - ✅ 值格式化显示
   - ⚠️ 使用简化弹窗(非 wd-action-sheet)

## 未完成部分

### ❌ 子组件(复杂度高)

这些子组件非常复杂,需要单独迁移:

1. **month-panel.vue** → **month-panel.uvue**
   - 月份滚动面板
   - 时间选择器集成
   - 复杂度: ⭐⭐⭐⭐⭐

2. **year-panel.vue** → **year-panel.uvue**
   - 年份滚动面板
   - 复杂度: ⭐⭐⭐⭐

3. **month.vue** → **month.uvue**
   - 单个月份的日期网格
   - 日期选择逻辑(单选/多选/范围)
   - 复杂度: ⭐⭐⭐⭐⭐

4. **year.vue** → **year.uvue**
   - 单个年份的月份网格
   - 月份选择逻辑
   - 复杂度: ⭐⭐⭐⭐

### ❌ 依赖组件

需要先完成这些组件的迁移:

1. **wd-action-sheet** - 底部弹出框
2. **wd-tabs** - 类型切换标签页
3. **wd-tag** - 快捷选项标签
4. **wd-button** - 确认按钮
5. **wd-picker-view** - 时间选择器(已完成)

### ❌ 高级功能

1. 智能类型转换(valueFormat: 'timestamp' | 'string' | 'auto')
2. 快捷选项功能
3. 表单集成(useParent, FORM_KEY)
4. 自定义格式化函数(formatter)
5. 时间过滤器(timeFilter)
6. 类型切换(showTypeSwitch)

## UTS 迁移挑战

### 1. 类型系统限制

```typescript
// ❌ TS 支持,UTS 不支持
export type CalendarValue = number | number[] | string | string[] | null

// ✅ UTS 替代方案
export type CalendarValue = any
```

### 2. 复杂计算属性

```typescript
// ❌ TS 中的复杂计算
const timeData = computed<Array<CalendarItem[]>>(() => {
  // 大量条件判断和数组操作
})

// ✅ UTS 中需要简化,拆分为多个函数
```

### 3. 事件回调类型

```typescript
// ❌ TS 中的函数类型
export type CalendarFormatter = (day: CalendarDayItem) => CalendarDayItem

// ✅ UTS 中需要明确参数和返回值类型
export type CalendarFormatter = (day : CalendarDayItem) => CalendarDayItem
```

### 4. 动态组件引用

```typescript
// ❌ TS 中的动态组件
<component :is="type === 'month' ? YearPanel : MonthPanel" />

// ✅ UTS 中需要使用 v-if/v-else
<year-panel v-if="type === 'month'" />
<month-panel v-else />
```

## 完整迁移步骤建议

### Phase 1: 基础组件(1-2天)

1. ✅ wd-calendar-utils.uts
2. ✅ wd-calendar-view.uvue (骨架)
3. ✅ wd-calendar.uvue (骨架)

### Phase 2: 核心子组件(3-5天)

1. ❌ month.uvue - 最核心,最复杂
   - 日期网格渲染
   - 选择状态管理
   - 范围选择逻辑

2. ❌ year.uvue - 相对简单
   - 月份网格渲染
   - 月份选择逻辑

### Phase 3: 面板组件(2-3天)

1. ❌ month-panel.uvue
   - scroll-view 滚动
   - 时间选择器集成

2. ❌ year-panel.uvue
   - scroll-view 滚动

### Phase 4: 集成和优化(2-3天)

1. ❌ 完整功能测试
2. ❌ 性能优化
3. ❌ 边界情况处理

**总计**: 约 8-13 天工作量

## 当前可用性

### ✅ 可以做什么

1. 查看日历选择器的基础 UI 结构
2. 了解迁移思路和代码组织
3. 测试打开/关闭弹窗逻辑

### ❌ 不能做什么

1. 实际选择日期
2. 范围选择
3. 时间选择
4. 类型切换
5. 任何生产环境使用

## 使用示例(仅供测试)

```vue
<template>
  <wd-calendar
    v-model="date"
    label="选择日期"
    placeholder="请选择"
  />
</template>

<script setup lang="uts">
import { ref } from 'vue'

const date = ref<number>(Date.now())
</script>
```

## 技术债务

1. **移除的功能需要重新评估**
   - 智能类型转换是否必要?
   - 表单集成如何实现?

2. **性能优化**
   - 大量日期计算可能影响性能
   - scroll-view 滚动性能需要测试

3. **国际化**
   - 当前硬编码中文
   - 需要设计 UTS 兼容的国际化方案

## 建议

### 如果时间紧迫

1. **使用原生组件替代**
   ```vue
   <picker mode="date" v-model="date" />
   ```

2. **使用第三方插件**
   - 查找已适配 UniApp X 的日历组件

### 如果需要完整迁移

1. 优先完成 month.uvue (核心中的核心)
2. 逐步添加功能,每个功能独立测试
3. 考虑简化部分高级功能

## 相关文件

- 源文件: `plus-app/wd/components/wd-calendar-view/`
- 目标文件: `plus-uniappx/wd/components/wd-calendar-view/`
- 参考组件: `plus-uniappx/wd/components/wd-picker-view/`

## 更新日志

- 2026-02-20: 创建基础骨架和工具函数
