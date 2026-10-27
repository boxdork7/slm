# OpenAPI 代码生成插件

从 OpenAPI 文档自动生成符合项目风格的 TypeScript 类型和 API 函数。

## 功能特性

- ✅ 自动根据后端路径生成对应目录结构
- ✅ 生成到 `src/api/generated/` 目录，与手动代码隔离
- ✅ **所有文件只在不存在时生成，已存在则跳过（防止覆盖）**
- ✅ 支持路径参数、查询参数、请求体参数
- ✅ 自动提取泛型类型（R<T>、PageResult<T>）

## 配置

在 `vite/plugins/index.ts` 中：

```typescript
vitePlugins.push(createOpenApiPlugin({
  input: 'http://127.0.0.1:5500/v3/api-docs/business',
  output: 'src/api/generated', // 输出到 generated 目录
  mode: 'once', // 'once' 启动时生成 | 'manual' 手动触发
  enabled: true
}))
```

## 目录映射规则

| 后端路径 | 生成目录 | 文件 |
|---------|---------|------|
| `/app/home/*` | `generated/app/home/` | `homeApi.ts` + `homeTypes.ts` |
| `/app/phone/*` | `generated/app/phone/` | `phoneApi.ts` + `phoneTypes.ts` |
| `/common/mall/order/*` | `generated/common/mall/order/` | `orderApi.ts` + `orderTypes.ts` |
| `/common/system/*` | `generated/common/system/` | `systemApi.ts` + `systemTypes.ts` |
| `/base/ad/*` | `generated/business/base/ad/` | `adApi.ts` + `adTypes.ts` |

## 生成结果

```
src/api/generated/
├── app/
│   ├── home/
│   │   ├── homeApi.ts       (包含 getTenantIdByAppid, listAds, pageGoods)
│   │   └── homeTypes.ts
│   ├── phone/
│   │   ├── phoneApi.ts      (包含 bindPhone, getPhone)
│   │   └── phoneTypes.ts
│   ├── subscribe/
│   └── wxShare/
├── common/
│   ├── mall/order/
│   │   ├── orderApi.ts      (包含所有订单支付接口)
│   │   └── orderTypes.ts
│   └── system/
│       ├── systemApi.ts
│       └── systemTypes.ts
└── business/
    └── base/ad/
        ├── adApi.ts
        └── adTypes.ts
```

## 使用方式

### 1. 首次生成

启动开发服务器，插件会自动生成所有文件到 `generated` 目录：

```bash
pnpm dev:h5
```

### 2. 使用生成的代码

从 `generated` 目录导入使用：

```typescript
import { listAds, pageGoods } from '@/api/generated/app/home/homeApi'
import type { AdVo, GoodsVo } from '@/api/generated/app/home/homeTypes'

// 使用
const [err, data] = await listAds({ status: '1' })
```

### 3. 需要自定义配置的接口

如果某个接口需要特殊配置，在 `src/api/` 下创建自己的文件：

```typescript
// src/api/app/home/customHomeApi.ts
import type { AdQuery, AdVo } from '@/api/generated/app/home/homeTypes'
import { withHeaders } from '@/utils/function'

// 自定义配置的接口
export const listAds = (query?: AdQuery): Result<AdVo[]> => {
  return http.get<AdVo[]>(
    '/app/home/listAds',
    query,
    withHeaders({ auth: false }, { skipWait: true })
  )
}

// 其他接口直接从 generated 导出
export { pageGoods } from '@/api/generated/app/home/homeApi'
```

### 4. 后端接口更新

当后端接口有更新时：

1. **删除对应的 generated 文件**（如 `generated/app/home/homeApi.ts`）
2. **重启开发服务器**，插件会重新生成
3. **手动更新你的自定义文件**（如果有的话）

## 文件覆盖策略

| 文件 | 覆盖策略 | 说明 |
|------|---------|------|
| `xxxTypes.ts` | **不覆盖** | 已存在则跳过，防止覆盖 |
| `xxxApi.ts` | **不覆盖** | 已存在则跳过，防止覆盖 |

⚠️ **重要**: 如需更新生成的文件，请先删除对应文件，然后重新生成。

## 手动触发生成

如果设置为 `mode: 'manual'`：

```bash
# Windows PowerShell
Invoke-WebRequest -Method POST -Uri "http://localhost:5173/__openapi_generate"

# Linux/Mac
curl -X POST http://localhost:5173/__openapi_generate
```

## 路径解析规则

- `/app/*` → `generated/app/` (移动端)
- `/common/*` → `generated/common/` (跨平台)
- `/common/mall/*` → `generated/common/mall/` (三层结构)
- `/common/ai/chat/*` → `generated/common/ai/chat/` (三层结构)
- `/base/*` → `generated/business/base/` (业务管理)

## 常见问题

### Q: 为什么要输出到 generated 目录？

A: 将自动生成的代码与手动编写的代码隔离，更清晰。需要自定义的接口在 `src/api/` 下编写。

### Q: 后端新增接口如何更新？

A: 重启服务即可重新生成。

### Q: 可以直接修改 generated 里的文件吗？

A: 不建议。如需自定义，在 `src/api/` 下创建新文件，从 generated 导入类型。

### Q: 如何对比新旧接口差异？

A:
1. 重命名旧文件（如 `homeApi.ts.old`）
2. 重新生成
3. 使用 VS Code 对比功能查看差异
