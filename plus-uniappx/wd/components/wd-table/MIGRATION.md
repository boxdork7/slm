# wd-table & wd-table-col 组件迁移说明

## 迁移时间
2026-02-20

## 源文件
- `plus-app/wd/components/wd-table/wd-table.vue` (990行)
- `plus-app/wd/components/wd-table-col/wd-table-col.vue` (250行)

## 目标文件
- `plus-uniappx/wd/components/wd-table/wd-table-key.uts` - 类型定义文件
- `plus-uniappx/wd/components/wd-table/wd-table.uvue` - 表格主组件
- `plus-uniappx/wd/components/wd-table-col/wd-table-col.uvue` - 表格列组件

## 主要改动

### 1. 架构层面
- **父子组件通信**: 从 `useChildren`/`useParent` 改为 `createChildManager` + `inject`/`provide` 模式
- **子组件管理**: 使用 `childrenMap: Map<uid, TableColChild>` 存储子组件信息
- **排序状态**: 配置式模式用 `columnSortDirections` 数组,子组件模式用 `childrenMap` 中的 `sortDirection` 字段

### 2. 类型系统
```typescript
// plus-app (Vue3 + TS)
export type AlignType = 'left' | 'center' | 'right'
export type SortDirection = 0 | 1 | -1
interface TableColumn { /* ... */ }

// plus-uniappx (UTS)
export type AlignType = string  // 联合字面量 → string
export type SortDirection = number  // 字面量联合 → number
export type TableColumn = { /* ... */ }  // interface → type
```

### 3. 组件通信
```typescript
// plus-app: useChildren
const { linkChildren, children } = useChildren(TABLE_KEY)
linkChildren({ props, state, children, rowClick, getIsLastFixed, getFixedStyle })

// plus-uniappx: createChildManager + provide
const manager = createChildManager()
const childrenMap = reactive<Map<number, TableColChild>>(new Map())
const addChild = (uid: number, childInfo: TableColChild) => {
  manager.addChild(uid)
  childrenMap.set(uid, childInfo)
}
provide(TABLE_KEY, {
  childUids: manager.childUids,
  addChild: addChild,
  removeChild: removeChild,
  state: state,
  props: tableProps,
  rowClick: handleRowClick,
  getIsLastFixed: getIsLastFixed,
  getFixedStyle: getFixedStyle,
})
```

### 4. 子组件注册
```typescript
// plus-app: useParent + defineExpose
const { parent: table, index: columnIndex } = useParent(TABLE_KEY)
const sortDirection = ref<SortDirection>(0)
defineExpose<WdTableColExpose>({ sortDirection })

// plus-uniappx: inject + onMounted 注册
const table = inject<TableProvide | null>(TABLE_KEY, null)
const myUid = ref<number>(0)
const sortDirection = ref<number>(0)

onMounted(() => {
  myUid.value = genChildUid()
  if (table != null) {
    const childInfo: TableColChild = {
      prop: props.prop,
      label: props.label,
      width: props.width,
      sortable: props.sortable,
      fixed: props.fixed,
      align: props.align,
      sortDirection: sortDirection.value,
      uid: myUid.value,
    }
    table.addChild(myUid.value, childInfo)
  }
})
```

### 5. 样式处理
```typescript
// plus-app: CSSProperties
import type { CSSProperties } from 'vue'
const style: CSSProperties = { width: '100px' }
return objToStyle(style)

// plus-uniappx: Map<string, any>
const style = new Map<string, any>()
style.set('width', '100px')
return objToStyle(style)
```

### 6. 计算属性类型标注
```typescript
// plus-app (可选)
const isColumnsMode = computed(() => {
  return props.columns && props.columns.length > 0
})

// plus-uniappx (必须)
const isColumnsMode = computed((): boolean => {
  return props.columns.length > 0
})
```

### 7. 排序管理
**配置式模式 (columns)**:
- 状态存储: `columnSortDirections: ref<number[]>([...])`
- 更新方式: `columnSortDirections.value[index] = value`

**子组件模式 (wd-table-col)**:
- 状态存储: `childrenMap.get(uid).sortDirection`
- 更新方式: 通过 v-model 绑定到 `childrenMap.get(child.uid)!.sortDirection`

### 8. 条件判断增强
```typescript
// plus-app: 简单判断
if (column.fixed && isDef(table) && isFunction(table.getFixedStyle)) { ... }

// plus-uniappx: 显式 null 检查
if (column.fixed === true && isDef(table) && table != null) { ... }
```

## 功能支持

### ✅ 已完整支持
- [x] 配置式模式 (通过 `columns` 数组)
- [x] 子组件模式 (通过 `<wd-table-col>`)
- [x] 固定表头 (`fixedHeader`)
- [x] 固定列 (`fixed`)
- [x] 列排序 (`sortable`)
- [x] 边框模式 (`border`)
- [x] 斑马纹 (`stripe`)
- [x] 序号列 (`index`)
- [x] 列对齐 (`align`: left/center/right)
- [x] 自定义渲染 (`render` 函数)
- [x] 自定义插槽 (`useSlot` + `slotName`)
- [x] 行点击事件 (`@row-click`)
- [x] 排序事件 (`@sort-method`)
- [x] 固定列阴影效果
- [x] 水平滚动同步

### ⚠️ 注意事项
1. **无 InjectionKey**: UTS 不支持 `Symbol`,改用字符串 key `'wd-table'`
2. **无 ComponentInternalInstance**: 子组件无法通过 `getCurrentInstance()` 获取实例,改用 `uid` 标识
3. **无 VNode 操作**: 不能遍历 `children` VNode,改用注册模式
4. **类型必须显式**: 所有计算属性、watch 回调、函数返回值都需要显式类型标注
5. **Map 替代对象**: `CSSProperties` 改为 `Map<string, any>`

## 测试建议

### 配置式模式测试
```vue
<template>
  <wd-table
    :columns="columns"
    :data="tableData"
    :border="true"
    :stripe="true"
    :index="true"
    @row-click="handleRowClick"
    @sort-method="handleSort"
  >
    <template #column-status="{ row }">
      <text :style="`color: ${row.status === '1' ? 'green' : 'red'}`">
        {{ row.status === '1' ? '正常' : '禁用' }}
      </text>
    </template>
  </wd-table>
</template>

<script setup lang="uts">
const columns = [
  { prop: 'name', label: '姓名', width: 150, sortable: true },
  { prop: 'age', label: '年龄', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 120, useSlot: true },
]

const tableData = [
  { name: '张三', age: 25, status: '1' },
  { name: '李四', age: 30, status: '0' },
]
</script>
```

### 子组件模式测试
```vue
<template>
  <wd-table :data="tableData" :border="true" :stripe="true">
    <wd-table-col prop="name" label="姓名" :width="150" :sortable="true" />
    <wd-table-col prop="age" label="年龄" :width="100" align="center" />
    <wd-table-col prop="address" label="地址" :width="200">
      <template #value="{ row }">
        <text>{{ row.province }} - {{ row.city }}</text>
      </template>
    </wd-table-col>
  </wd-table>
</template>
```

### 固定列测试
```typescript
const columns = [
  { prop: 'name', label: '姓名', width: 150, fixed: true },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'address', label: '地址', width: 300 },
  { prop: 'phone', label: '电话', width: 200 },
]
```

## 参考组件
- `plus-uniappx/wd/components/wd-tabs/` - 父子组件通信模式
- `plus-uniappx/wd/composables/useChildren.uts` - 子组件管理工具

## 相关文件
- 类型定义: `wd-table-key.uts`
- 工具函数: `../common/util` (addUnit, isDef, isOdd, objToStyle, uuid, debounce)
- 多语言: `../../composables/useTranslate`
- 子组件管理: `../../composables/useChildren` (createChildManager, genChildUid)
