# AGENTS.md - ruoyi-plus-uniapp 项目开发规范

> 📏 **本文件须控制在 30 KB 以内**：Codex 默认只注入项目 AGENTS.md 的前 32 KiB（`project_doc_max_bytes`），超出部分**静默截断**、模型完全看不到。
> 代码模板、细分规范放进对应技能（`.agents/skills/`），这里只留规则与索引。

## 对话语言设置
**重要**: 在此代码库中工作时，Codex 必须始终使用中文与用户对话。所有响应、解释、错误信息和技术讨论都应使用简体中文。

> ⚠️ **严重警告**: 本项目 **不是 ruoyi-vue-plus 框架**,而是经过深度重构的 **ruoyi-plus-uniapp** 框架!
> **绝对禁止** 参考 ruoyi-vue-plus 的代码风格和架构设计! **必须** 严格遵循本项目现有的代码规范和架构模式!

## 🔴 文件编码与注释规范（必须遵守）

- **所有源码与配置统一 UTF-8（无 BOM）**：`.java`/`.vue`/`.ts`/`.js`/`.xml`/`.yml`/`.properties`/`.sql`/`.md` 全部适用；**禁止** UTF-8 with BOM、GBK、GB2312、ANSI、ISO-8859-1 混用
- 中文注释、日志、文档必须可读，不允许乱码（如"鍥藉"）；发现乱码先查文件实际编码与显示编码是否一致
- **所有代码注释必须使用中文**（JavaDoc、行内、块注释、Vue 模板注释、SQL 注释），类名/方法名等术语可保留英文
  - ✅ `/** 广告管理服务实现 */`、`// 根据 ID 查询广告详情`　❌ `/** Ad management service implementation */`
- **PowerShell 读中文 UTF-8 文件**：禁止裸 `Get-Content`，必须 `Get-Content -Encoding UTF8 -Path xxx`，并先设 `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`；检索优先用 `rg`
- 保留已有业务注释；新增代码注释写清"为什么这样做"；接口方法注释至少含用途、参数、返回值、异常/边界行为
- 批量改文件后必须抽查文件头字节，确认无 `EF BB BF`
- `java: 非法字符: '\ufeff'` 一律先按 BOM 处理：定位文件 → 移除 BOM → 扫描同目录 `.java` → 重新编译验证
- 提交前执行一次编译（`mvn -DskipTests compile`）；涉及注释修改时人工检查中文可读性
- 功能改动与注释改动尽量分开提交；修编码问题只做最小改动，不改业务逻辑

## 术语约定

| 术语 | 含义 | 对应目录 |
|------|------|---------|
| **前端** | PC 端 | `plus-ui/` |
| **移动端(CLI)** | 小程序/H5/不需原生插件的APP | `plus-uniapp/` |
| **移动端(原生APP)** | 需要原生插件的APP/鸿蒙APP | `plus-app/` |
| **后端** | Java 服务 | `ruoyi-modules/` |

## MCP 工具触发

| 触发词 | 工具 | 用途 |
|-------|------|------|
| 深度分析、仔细思考、全面评估 | `sequential-thinking` | 链式推理，多步骤分析 |
| 最佳实践、官方文档、标准写法 | `context7` | Vue/Element Plus/UniApp/MyBatis-Plus 等（⚠️ WD UI 禁用，只参考 `plus-uniapp/src/wd/`） |
| 打开浏览器、截图、检查元素 | `chrome-devtools` | 浏览器调试 |
| 用工作站、workstation、ai-workstation | `ai-workstation` | AI 工作站 MCP（route → get_skill → 执行） |

## 时区约定

**所有日期时间使用东八区（UTC+8）**，直接用裸 `date`：`date '+%Y-%m-%dT%H:%M:%S%:z'`（结构化数据）/ `date '+%Y-%m-%d %H:%M'`（可读时间）。
🔴 **禁止**：`TZ=Asia/Shanghai date`（Git Bash 无 zoneinfo，退化 UTC）、硬编码 `+08:00`、`date -u -d '+8 hours'`。
> 例外：Dockerfile / `.env` 里的 `TZ=Asia/Shanghai` 是容器环境变量，正确，不要改。

---

## 🔴 Skills 技能系统（最高优先级）

技能文件在 `.agents/skills/[skill-name]/SKILL.md`（唯一 Codex 技能目录；`.codex/skills/` 已删除，勿再创建。`.codex/hooks/`、`.codex/config.toml`、`.codex/agents/` 等其它组件仍留在 `.codex/`）。
Codex 启动时自动加载所有技能的 `name` 和 `description`；任务匹配时读取完整 SKILL.md，需要时再读技能目录下的 `references/`、`scripts/`。

## 技能清单与触发条件

以下是本项目的技能列表。Codex 应根据 `description` 自动判断何时使用：

| 技能名称 | 触发条件（description） |
|---------|----------------------|
| `add-skill` | 为框架添加新技能、修改现有技能、编写技能文档、同步双系统 |
| `crud-development` | CRUD 开发、业务模块、Entity/Service/DAO 创建 |
| `api-development` | API 设计、RESTful 接口、接口规范 |
| `database-ops` | 数据库操作、SQL、建表、字典、菜单配置 |
| `backend-annotations` | 后端注解、@SerialMap、@RateLimiter |
| `error-handler` | 异常处理、ServiceException、错误处理 |
| `multi-tenant` | 多租户/租户隔离/tenant_id/TenantEntity/租户切换/TenantHelper/动态租户/排除表 |
| `data-permission` | 数据权限、@DataPermission、行级权限、数据隔离、字段级权限、列级权限、@FieldResource、字段脱敏/隐藏/只读 |
| `security-guard` | 安全、Sa-Token、认证授权、加密、国密 SM2/SM4、信创、密评、接口加密算法 |
| `utils-toolkit` | 工具类、StringUtils、MapstructUtils |
| `ui-pc` | 前端组件、AForm、AModal、Element Plus 封装 |
| `ui-mobile` | 移动端、wd-组件、小程序、APP、WD UI（plus-uniapp 和 plus-app 通用） |
| `ui-design-mobile` | 移动端设计、页面布局、间距、留白（plus-uniapp 和 plus-app 通用） |
| `app-adapter` | plus-app/APP端/原生APP/原生插件/HBuilderX/鸿蒙APP/harmony/nativeplugins/APP打包/真机调试 |
| `store-pc` | 前端 Store、Pinia、useUserStore |
| `store-mobile` | 移动端 Store、useAuth、Composable |
| `uniapp-platform` | 条件编译、ifdef、平台判断 |
| `delivery-sync` | 交付/交付物/交付副本/交付目录/客户版本/对外版本/剥离技能/移除技能体系/去掉git/镜像/deliver/delivery/对外发布/同步交付/交付同步 |
| `module-strip` | 模块裁剪/裁剪模块/删除模块/移除模块/stripModules/module-strip/strip-modules/商城裁剪/IoT裁剪/支付裁剪/AI裁剪/不要mall/不要iot/不要pay/不要ai/裁掉商城/裁掉IoT/裁掉支付/裁掉AI |
| `deployment-guide` | 部署/上线/发布/生产环境/Docker/Compose/构建/JAR/密钥/Nginx/1Panel/容器编排/小程序发布/APP打包 |
| `payment-integration` | 支付、微信支付、支付宝、退款 |
| `wechat-integration` | 微信、小程序登录、订阅消息 |
| `file-oss-management` | 文件上传、OSS、云存储、MinIO |
| `ai-langchain4j` | AI、大模型、ChatGPT、DeepSeek、langchain4j、MCP、Model Context Protocol、MCP Server、对外提供 MCP、工具调用、函数调用、McpToolProvider、McpClient、AiServices、TokenStream、Spring AI、RAG、知识库、流式对话 |
| `media-processing` | 图片处理、二维码、水印、Excel |
| `bug-detective` | Bug 排查、报错、异常、不工作 |
| `performance-doctor` | 性能优化、慢查询、缓存 |
| `redis-cache` | Redis、缓存、Cache、@Cacheable、@CacheEvict、@CachePut、RedisUtils、CacheUtils、分布式锁、RLock、限流、RateLimiter、发布订阅、缓存穿透、缓存雪崩、缓存击穿 |
| `code-patterns` | 代码规范、命名、禁止事项、Git 提交 |
| `architecture-design` | 架构设计、模块划分、重构、组件注册与自动配置（@AutoConfiguration/@ConditionalOnMissingBean/静态工具类 init） |
| `project-navigator` | 项目结构、文件定位 |
| `git-workflow` | Git、提交、commit、分支 |
| `tech-decision` | 技术选型、方案对比 |
| `brainstorm` | 头脑风暴、创意、方案设计 |
| `collaborating-with-antigravity` | Antigravity、反重力、agy、agy 协同、agy CLI、委托给 Antigravity（**仅限用户点名 Antigravity**；未点名的 多模型 / 交叉验证 / 结构化输出 **不要**激活本技能） |
| `collaborating-with-codex` | Codex、codex 协同、codex CLI、codex-plugin-cc、codex review、codex rescue、adversarial-review、review-gate（**仅限用户点名 Codex**；未点名的 代码审查 / 算法分析 / 原型 **不要**激活本技能，命令正文显式编排的 review-gate 除外） |
| `collaborating-with-gemini` | Gemini、gemini 协同、gemini CLI、委托给 Gemini、gemini_bridge（**仅限用户点名 Gemini**；未点名的 UI 设计 / 前端原型 / CSS / 样式审查 **不要**激活本技能） |
| `task-tracker` | 任务跟踪、进度管理、继续任务 |
| `writing-plans` | 写计划/制定计划/实施计划/拆解任务/计划层/把方案落地/详细步骤/可执行计划/计划文档/开发计划 |
| `test-development` | 测试/单元测试/@Test/JUnit5/Mockito/断言/测试用例/测试覆盖率 |
| `e2e-test-pc` | 自动化测试/E2E/端到端测试/浏览器测试/回归测试/冒烟测试/业务验收/UI 测试/后台测试/PC 测试/plus-ui 测试/aicoder 浏览器/测试报告/附件上传测试/browser_upload |
| `e2e-test-mobile` | 移动端测试/H5 测试/小程序网页版测试/plus-uniapp 测试/移动端自动化/移动端 E2E/移动端回归/wd-paging 测试/WD UI 测试/移动端冒烟/uniapp 测试 |
| `i18n-development` | 国际化/多语言/i18n/翻译/t()/语言切换/MessageUtils/content-language/LanguageCode/useI18n/messages.properties/locale/$t/zh_CN/en_US |
| `icon-management` | 图标/icon/菜单图标/换图标/加图标/图标管理/IconSelect/wd-icon/iconfont/图标选择 |
| `scheduled-jobs` | 定时任务/SnailJob/延迟队列/@Scheduled/任务调度/重试机制/工作流编排/分布式执行 |
| `json-serialization` | JSON 序列化/反序列化/数据转换/JsonUtils/日期格式/精度/BigDecimal/Long/类型转换/JSON 验证 |
| `realtime-communication` | WebSocket/SSE/实时推送/在线聊天/消息推送/双向通信/服务端推送/流式响应/EventSource/心跳/在线状态/WebSocketUtils/SseMessageUtils/publishMessage/useWS/useSSE/useWebSocket |
| `notification-system` | 短信/SMS/邮件/Mail/Email/消息推送/MessagePushService/MessageChannel/通知/验证码/SmsFactory/MailUtils/sendText/sendHtml/统一消息/消息路由/多通道 |
| `message-queue` | RocketMQ/消息队列/MQ/异步消息/延迟消息/事务消息/RMSendUtil/RMTopicUtil/DelayLevel/Topic/消费者/生产者/削峰填谷/系统解耦/sendAsync/sendDelay/sendTransaction/RocketMQMessageListener |
| `social-login` | 社交登录/第三方登录/OAuth2/微信登录/QQ登录/GitHub登录/Gitee登录/钉钉登录/企业微信/SSO/单点登录/JustAuth/SocialUtils/socialBind/socialUnbind/授权回调/AuthRequest/socialCallback/MaxKey/TopIAM/账号绑定 |
| `third-party-api` | 高德地图/火山引擎/TTS/语音合成/地理编码/逆地理编码/IP定位/天气查询/距离计算/第三方API/HTTP客户端/Forest/GaodeMapClient/VolcengineTtsClient/声明式HTTP/ForestInterceptor/外部服务集成 |
| `project-migration` | 迁移项目/项目迁移/重构项目/代码迁移/继续迁移/迁移进度/迁移蓝图/架构迁移/框架迁移/项目重构/导入项目/搬迁代码 |
| `project-init` | 新项目/创建项目/初始化项目/开新项目/项目初始化/标识符替换/Git仓库创建/数据库初始化/启动引导 |
| `framework-sync` | 框架同步/upstream/同步框架/拉取更新/合并上游/同步上游/框架更新/upstream sync/同步原仓库/.framework-sync.json |
| `iot-mqtt` | MQTT/物联网/IoT/设备通信/设备消息/mica-mqtt/MqttClientTemplate/publish/subscribe/QoS/Topic/EMQX/Mosquitto/共享订阅/设备上线/设备离线/遗嘱消息/保留消息/传感器数据 |
| `html-to-code` | HTML转代码/设计稿转换/原型转代码/HTML转前端/HTML转移动端/UI原型转换/HTML转Vue/区块转换/组件转换/Tailwind转UnoCSS |
| `log-audit` | 操作日志/登录日志/审计/@Log/sys_oper_log/sys_logininfor/DictOperType/LogAspect/excludeParamNames/isSaveRequestData/日志记录/审计追踪/日志脱敏 |
| `env-config` | 环境配置/profile/application.yml/application-dev.yml/application-prod.yml/.env/.env.development/.env.production/VITE_APP_/多环境/环境变量/SPRING_PROFILES_ACTIVE/配置切换 |
| `exp-sediment` | 沉淀经验/经验沉淀/总结会话/记下来/self-evolution/自我进化/反哺框架/经验审计/技能漏洞/新增禁令/避免再踩坑/对应 `/exp` 命令；以及消费信号：以前怎么处理/之前的方案/之前踩过/历史经验/查记录/查笔记/有没有遇到过/上次怎么解决/类似问题 |
| `dev-startup` | 本地启动/首次启动/跑起来/装环境/装依赖/pnpm install/mvn install/启动后端/启动前端/启动移动端/JDK安装/Node安装/nvm/pnpm/HBuilderX/IDEA运行/端口占用/镜像超时/健康检查/ECONNRESET |

## 🚨 技能强制执行规则

1. **任务匹配必须读取技能**：请求与任何技能的 `description` 匹配时，**必须**先读取对应 `SKILL.md`（及需要的 `references/`），再按技能指令执行；**禁止**凭记忆写代码
2. **多技能组合**：复杂任务识别**所有**相关技能并全部读取，按依赖顺序（如先 `database-ops` 再 `crud-development`），综合执行；禁止只读部分
3. **标注已用技能**：涉及代码的响应里简要说明，如 `已参考技能：crud-development, database-ops`
4. **示例**："帮我开发一个优惠券管理功能" → 读 `crud-development` + `database-ops` + `api-development`；"连接数据库查询用户表结构" → 读 `database-ops`
5. **手动触发**：用户输入 `$skill-name`（如 `$bug-detective 这个接口报错了`）立即读取该技能；`/skills` 打开技能选择器
6. 技能查找优先级：项目级 `.agents/skills/` > 用户级 `~/.agents/skills/` > 系统级 `/etc/codex/skills/`

---

## 🚫 绝对禁止事项（AI 必须 100% 遵守）

### 后端架构（与 ruoyi-vue-plus 的核心区别）

| 项目 | ❌ 错误做法（ruoyi-vue-plus 风格） | ✅ 本项目正确做法 |
|------|---------|---------|
| **包名** | `com.ruoyi.xxx` | `plus.ruoyi.xxx` |
| **类型引用（零容忍）** | 内联全限定名 `plus.ruoyi.common.core.domain.R.ok(...)` | 先 `import plus.ruoyi.common.core.domain.R;` 再用 `R.ok(...)` |
| **Service 继承** | `extends ServiceImpl<>` / `IBaseService` | **不继承任何基类**，`@RequiredArgsConstructor` + `implements IXxxService` |
| **查询构建** | Service 层 `PlusLambdaQuery.of()` / `new LambdaQueryWrapper` | DAO 层 `buildQueryWrapper(bo)`，Service 调 `xxxDao.buildQueryWrapper(bo)` |
| **注入关系** | Controller 注入 DAO / Service 注入 Mapper | Controller 只注入 Service；Service 只注入 DAO（跨 Maven 模块注入对方 Service） |
| **DAO 层** | 无 DAO 层 | 独立 DAO 层，继承 `BaseDaoImpl<Mapper, Entity>`；DAO 不做对象转换、不写 `@Transactional` |
| **Mapper** | 继承 `BaseMapperPlus` | 只继承 `BaseMapper<Entity>` |
| **Entity 基类** | `extends BaseEntity` | `extends TenantEntity`（多租户版本） |
| **BO 映射** | 手动 / `@TableField` | `@AutoMappers` 注解 |
| **对象转换** | `BeanUtil.copyProperties()` | `MapstructUtils.convert(source, Target.class)`（在 Service 层） |
| **返回值** | `Map<String, Object>` 封装业务数据 | 具体的 VO 类 |
| **主键** | `AUTO_INCREMENT` | 雪花ID |
| **当前时间** | `LocalDateTime.now()` | `DateUtils.getNowDate()` 或 `new Date()` |
| **@Cacheable 返回值** | `List.of()` / `Set.of()` / `Map.of()` | `new ArrayList/HashSet/HashMap()` |
| **普通 CRUD 注解** | `@Schema(description="")` | JavaDoc 注释（仅 @OpenApi 接口用 `@Schema`） |
| **R 返回字符串** | `R.ok(stringValue)` | `R.ok(null, stringValue)` |
| **模糊查询** | 非 String 字段 `like()` | String 用 `like()`，`Long/Integer/Date` 用 `likeCast()`（PostgreSQL 必须） |
| **字段名** | `phonenumber` / `del_flag` / 菜单 `is_frame` | `phone` / `is_deleted` / `is_external_link` |
| **菜单默认值** | `visible='0'`, `status='0'` | `visible='1'`, `status='1'`（1=积极 0=消极） |

### 前端 / 移动端

| ❌ 错误写法 | ✅ 正确写法 | 适用端 |
|---------|---------|--------|
| **未读现有代码直接开发** | **先 Read 参考代码（见下方「页面开发」）** | 前端/移动端 |
| `<el-form inline>` / `<el-input>` / `<el-select>` / `<el-date-picker>` / `<el-dialog>` / `<el-switch>` | `ASearchForm` / `AFormInput` / `AFormSelect` / `AFormDate` / `AModal` / `AFormSwitch` | 前端 |
| `ElMessage.success()` | 项目封装的消息组件 | 前端 |
| 业务页面命名 `index.vue` | `业务名.vue`（如 `ad.vue`、`goods.vue`） | 前端 |
| `<uni-forms>` / `<uni-field>` | `<wd-form>` / `<wd-input>` | 移动端 |
| `from 'wot-design-uni'` | `from '@/wd'`（`useToast`/`useMessage` 必须手动导入） | 移动端 |
| `uni.showToast()` | `useToast().success()` | 移动端 |
| 样式用 `px`、CSS 里写 `//` 注释 | 用 `rpx`；CSS 注释只用 `/* */`（`//` 会报错） | 移动端 |
| `try { await api() } catch {}` | `const [err, data] = await api()`，`if (!err) {...}` | 前端/移动端 |
| `.vue` / `.ts` 首行无注释 | `.vue` 首行 `<!-- 中文描述 -->`；`.ts` 首行 `// 中文描述`（已有 `/**` JSDoc 的不加） | 前端/移动端 |

### API 路径规范

| 操作 | HTTP方法 | 路径格式 | 示例 |
|------|---------|---------|------|
| 分页查询 | GET | `/page{实体复数}` | `/pageAds` |
| 列表查询 | GET | `/list{实体复数}` | `/listAds` |
| 获取详情 | GET | `/get{实体}/{id}` | `/getAd/{id}` |
| 新增 | POST | `/add{实体}` | `/addAd` |
| 修改 | PUT | `/update{实体}` | `/updateAd` |
| 删除 | DELETE | `/delete{实体复数}/{ids}` | `/deleteAds/{ids}` |

> 禁止 `/page`、`/{id}` 这类裸路径。前端 API 函数与路径同名（`pageXxxs` / `getXxx` / `addXxx` / `updateXxx` / `deleteXxxs`），`http` / `Result` / `PageResult` / `PageQuery` 已全局自动导入，无需 import。

### ⚠️ Bash/Shell 禁止项（最常犯错误！）

| ❌ 禁止 | ✅ 正确 | 原因 |
|---------|---------|------|
| `command > nul` / `2> nul` | 不重定向，或 `> /dev/null 2>&1` | Windows 某些 Shell 会创建名为 `nul` 的文件 |
| 内联长脚本：`python - <<'PY'`、`cat > x.mjs <<'EOF'`、`python -c "多行"` | 先写成真文件（scratchpad 或项目 `logs/`）再执行 | 定界符/引号一嵌套就 `unexpected EOF`，还得整段重打 |
| 拿 `/tmp` 当中转目录 | scratchpad 绝对路径或项目内 `logs/` | Git Bash 的 `/tmp` 与 python/node/tar 理解的不是同一处（node 会当成 `D:\tmp`） |
| PowerShell 里给原生 exe 加 `2>&1`（如 `mvn ... 2>&1 \| Select-String`） | 不加，工具已捕获 stderr | PS 5.1 把 stderr 逐行包成 `NativeCommandError`，连 `BUILD SUCCESS` 也包，信息会丢（Bash 里 `2>&1` 合法） |
| `mvn test -Dsurefire.failIfNoSpecifiedTests=false`（PowerShell） | `mvn test "-Dsurefire.failIfNoSpecifiedTests=false"` | PowerShell 按 `.` 断词，报 Unknown lifecycle phase |
| 一个命令里循环遍历 master/single/workflow/6x/6x-single 五个平行仓库做 git/cherry-pick | 一次处理一个仓库，或显式调大 timeout | 撞 2 分钟超时整条被杀，已完成部分的输出也丢 |

---

## 🤖 写代码前强制流程

1. **先 Read 本项目同类现有代码**，绝不凭印象或参考 ruoyi-vue-plus：
   - 后端标准模块（Ad）：`ruoyi-modules/ruoyi-business/src/main/java/plus/ruoyi/business/base/` 下 `controller/AdController.java`、`service/impl/AdServiceImpl.java`、`dao/impl/AdDaoImpl.java`、`domain/{Ad,bo/AdBo,vo/AdVo}.java`、`mapper/AdMapper.java`
   - 完整分层代码模板（Entity/BO/VO/Controller/Service/DAO/Mapper/前端 API/Types）见 **`crud-development` 技能**
2. **先查工具类是否已存在**（`ruoyi-common/*/utils/`）：优先级 项目工具类 > Hutool > 自己实现。常用：`StringUtils`、`MapstructUtils`、`DateUtils`、`ObjectUtils`、`CollUtil`、`ServiceException.of("...")`、`PlusLambdaQuery`、`TreeBuildUtils`
3. **输出前自检**：包名 `plus.ruoyi.*`；无内联全限定名、所有类型先 import；Service 不继承基类；DAO 有 `buildQueryWrapper()`；Entity 继承 `TenantEntity`；BO 用 `@AutoMappers`；用 `MapstructUtils.convert()`；无 `Map<String, Object>` 业务数据。**任何一项不满足，修正后再输出**

### 四层架构数据流转（本项目独有）

`请求 → Controller（@Validated 分组校验，返回 R<T>，只注入 Service）→ Service（不继承基类，只注入 DAO，调 buildQueryWrapper，MapstructUtils 转换，管事务）→ DAO（继承 BaseDaoImpl，buildQueryWrapper 构建查询，提供 CRUD）→ Mapper（只继承 BaseMapper<Entity>，无需额外方法）→ 数据库`

### 组件注册与自动配置

新增/修改 `ruoyi-common-*` 模块的 Bean 注册、`@AutoConfiguration`、`@ConditionalOnMissingBean`、静态工具类初始化时，**必须先读 `architecture-design` 技能的「组件注册与自动配置规范」章节**（参考 `ruoyi-common-langchain4j`、`ruoyi-common-rocketmq`）。要点：配置类集中注册、不用 `@ComponentScan`；静态工具类提供 `init()` 由配置类调用，禁止内部 `@Component` 静态类；`@ConditionalOnMissingBean` 只按返回类型判断，禁用 `name` 属性，初始化器 Bean 不加。

---

## 🔴 多会话并发自动避让协议（L1/L2/L3 三层触发）

> 用户可能同时开多个 Codex / Claude Code 会话操作同一仓库。本会话必须**自动感知并避让**，**默认静默执行，不打扰用户**。原则：宁可绕路，绝不覆盖；宁可静默放弃，绝不擅自 stash / reset / checkout。

- **L1 启动时（首次响应前一次）**：`git status -s` + `git branch --show-current`，记下未提交清单与分支，**不向用户复述**。清单中与本次任务无关的文件视为"他者占用区"，**不修改、不 stash、不 checkout、不 reset**；与任务相关（用户接续之前工作）则正常处理
- **L2 修改已存在文件前**：`git log -1 --format="%ar|%s" <file>`，严格按下表处置、不询问：

| 条件 | 处置 |
|------|------|
| 距今 ≥ 15 分钟 | ✅ 自由修改 |
| 距今 < 15 分钟 + 文件**不在** L1 未提交清单 | ✅ 自由修改 |
| 距今 < 15 分钟 + **在**清单 + 可绕开（新增功能/换路径） | ⚠️ **静默换路径绕开**，不告知用户 |
| 距今 < 15 分钟 + **在**清单 + 必须改同文件 | 🛑 唯一允许打扰一次："`<file>` 15min 内有未提交改动，疑似其他会话占用，是否继续？" |

- **L3 提交前（必做）**：`git diff --cached --name-only` 对照本会话改过的文件清单，越界文件**静默 `git restore --staged <file>`**；逐个 `git add <具体文件>`；commit message 末尾可附 `[scope: <模块>]`
- **跨会话禁令（不询问、直接禁止）**：❌ `git stash` / `stash pop`　❌ `git reset --hard`　❌ `git checkout <file>`（丢弃改动）　❌ `git checkout <branch>`（除非用户明确指示）　❌ `git add -A` / `git add .`　❌ `git clean -fd`　❌ kill 端口 / `taskkill /F` 进程、`npx kill-port` 非本会话端口（他者 dev server 可能在用）　❌ 删除 `docs/tasks/active/` 下非本会话任务文档
- **高并发升级**：用户明确"并行开发"或预计 30+ 分钟同时改不同模块时，建议 `git worktree add ../proj-feature-x -b feature-x` 后在该目录启动新 Codex 会话；3-5 个并行最佳。worktree **不能**隔离数据库、Redis、端口（8080/80/5173）

---

## ⚠️ 页面开发强制要求（最高优先级）

**开发任何页面前：先读参考代码 → 了解封装组件 → 100% 按相同风格编写**，否则代码将被要求重写。

| 开发类型 | 必须先阅读的参考代码 |
|---------|-------------------|
| **前端页面** | `plus-ui/src/views/business/base/ad/ad.vue` |
| **前端 API / 类型** | `plus-ui/src/api/business/base/ad/adApi.ts`、`adTypes.ts` |
| **移动端列表页** | `plus-uniapp/src/components/tabbar/Home.vue`（列表 + wd-paging 分页 + 支付） |
| **移动端表单页** | `plus-uniapp/src/pages/auth/login.vue`（wd-form + wd-input + 校验） |
| **移动端 API / 类型** | `plus-uniapp/src/api/app/home/homeApi.ts`、`homeTypes.ts` |
| **WD UI 封装组件** | `plus-uniapp/src/wd/components/wd-*/`（80+ 组件，导出见 `src/wd/index.ts`） |

- 前端 100% 使用 `A*` 封装组件、0% `el-*`；移动端 100% `wd-*`、0% `uni-*`（对照上方「前端 / 移动端」禁止表）
- plus-app（原生 APP / 鸿蒙）目录扁平、无 `src/` 层级，其余规范与 plus-uniapp 相同；用户只说"移动端 / APP"而未指明时**先问清是哪个项目**
- 移动端路由由 `uni-pages` 插件自动生成：新建 `pages/` 或 `pages-sub/` 下的页面后**无需手改 `pages.json`**

## 🎨 图标使用规范

- **前端**：类型文件 `plus-ui/src/types/icons.d.ts`，组件 `<Icon name="图标名" />`，使用前先 Grep 确认图标名存在
- **移动端**：`<wd-icon name="图标名" />`，名称清单见 `plus-uniapp/src/wd/components/wd-icon/wd-icon.vue`；支持字体图标（`home`、`user-fill`）、UnoCSS 图标（`i-carbon-user`）、图片路径；使用前先确认存在

## 💾 数据库设计规范

- **设计表结构前必须先读** `.claude/数据库设计规范.md`，并参考现有表（`script/sql/ry_plus_app.sql`，如 `b_ad`、`b_bind`）
- 状态字段 `status`：`1`=正常(积极) `0`=停用(消极)；删除标记 `is_deleted`：`0`=正常 `1`=已删除；是否字段 `is_xxx`：`1`=是 `0`=否
- 必须含 `tenant_id` 与审计字段（`create_dept`/`create_by`/`create_time`/`update_by`/`update_time`/`remark`/`is_deleted`），主键雪花ID；表前缀：base=`b_`、mall=`m_`、crm=`crm_`、iot=`iot_`、系统=`sys_`

## 📄 文档生成规范

**🚫 绝不主动生成文档**（`*.md`、README 等），除非用户明确要求；即使要求，也**必须**放在项目根目录 `docs/` 下（✅ `docs/api-design.md`　❌ 根目录 `README.md`、❌ 模块内 `ruoyi-modules/ruoyi-business/docs/xxx.md`）。

---

## 📁 项目结构速查

```
ruoyi-plus-uniapp/
├── ruoyi-admin/          # 后端启动入口（application*.yml）
├── ruoyi-common/         # 通用模块：core 核心工具、mybatis（含 DAO 基类）、tenant（含 TenantEntity）…
├── ruoyi-modules/ruoyi-business/   # 业务模块：controller/（PC）、api/app|pc/（移动端/PC 接口）、service/、dao/（本项目独有）、mapper/、domain/{bo,vo}
├── plus-ui/              # 前端管理端
├── plus-uniapp/          # 移动端（src/ 下：pages、pages-sub、components、api、composables、wd）
└── plus-app/             # 原生 APP（扁平，无 src/）
```

> 更细的文件定位用 `project-navigator` 技能。

## 快速命令

| 命令 | 用途 |
|------|------|
| `/dev` | 开发新功能（完整流程） |
| `/crud` | 快速生成 CRUD |
| `/check` | 代码规范检查 |
| `/init-docs` | 初始化项目文档（支持空白模板/扫描代码） |
| `/progress` | 查看项目进度 |
| `/add-todo` | 快速添加待办事项 |

## 📖 深度参考（按需查阅）

- **后端开发**：`.claude/后端开发指南.md` — 架构理解、业务开发
- **前端开发**：`.claude/前端开发指南.md` — Vue3 组件、状态管理
- **移动端开发**：`.claude/移动端开发指南.md` — WD UI 组件库详解
- **工具类使用**：`.claude/工具类使用指南.md` — 工具类完整用法
- **数据库设计**：`.claude/数据库设计规范.md` — 表设计、索引优化

> 最后提醒: 写代码前先 Read 本项目现有代码,不要凭印象或参考其他框架!
