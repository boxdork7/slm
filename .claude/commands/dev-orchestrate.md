# /dev-orchestrate - 智码协同编排版自主开发（总控调度 · 实现/验收异构 · 复用 /dev-loop 单步）

在【智码 AICoder】里跑长任务时，用它替代 `/loop /dev-loop`：**本会话只当「总控」**（调度 + 裁决 + 记账），
每个任务派一个**新鲜的实现子会话**跑 `/dev-loop <编号>` 单步，再按「验收方式」另开**异构验收子会话**（默认 Codex）独立审提交（默认只逐条审高风险任务，其余合并审）。
子会话跑完由智码自动唤醒总控，**零轮询**；子会话撞额度由智码自动换档案续跑。

🔴 **本命令只是调度器，不重造 dev-loop**：一轮怎么做（选类型 → 复用 `/dev`/`html-to-code`/`ui-*` → 验证门 → `/check` → 勾台账 → 规范提交）全部照 `/dev-loop`，这里只管「谁来做、谁来审、审不过怎么办」。

## 用法

- `/dev-orchestrate` —— 按台账顺序全量推进，直到全部 `[x]`
- `/dev-orchestrate mall` / `/dev-orchestrate M2` —— 只推进匹配该模块 / 里程碑的未勾任务（范围规则同 `/dev-loop`）
- `/dev-orchestrate mall --review=each` —— 指定验收方式：`risk` 按风险分级（默认）/ `each` 逐条 / `final` 只在最后验收一次 / `none` 不派验收，见下方「验收方式」

## 选型：什么时候用它，什么时候用 `/loop /dev-loop`

| 情况 | 选 |
|------|----|
| 在智码里 + 台账 ≥ 5 条，或含 UI 还原 / 复杂后端逻辑 | ✅ `/dev-orchestrate`（上下文不膨胀、异构验收、额度自动轮换） |
| 台账很小（< 5 条）/ 基本是 `/dev` 生成的标准 CRUD | `/loop /dev-loop`（省 token：每个子会话都要重载 CLAUDE.md + 技能表） |
| 不在智码里（纯终端 / IDE 插件 / 云端） | 只能 `/loop /dev-loop` |

## 前置检测（任一不满足 → 不进编排，提示改用 `/loop /dev-loop`）

1. **在智码里**：`echo $AICODER_SESSION_ID` 非空（聊天模式会剥掉该变量，此时以第 2 条为准）。
2. **编排工具可用**：能调 `mcp__aicoder__get_session_status`，返回里 `isYou=true` 那条就是总控自己 → 记下 `yourSessionId`。
3. **台账**：`docs/tasks/active/*.md` 有未勾 `[ ]`，且**台账文件已提交**（未提交的台账，实现方会当作他者文件不带进提交，勾选只留在工作区）。
   - 有需求（`docs/需求文档.md`）但无台账 → 第一个派的活就是 `/dev-loop`（不带编号 = 第 0 轮自举，按 `writing-plans` 拆台账并提交），跑完再进正式循环。
   - 需求、台账都没有 → 停下提示：「先走 `/kickoff` 或准备好需求 + 任务清单」。
4. **工作区**：`git status -s` 记下已有未提交文件 = 他者占用区（L1 协议），任务书里原样告知子会话「别碰这些」。
5. **`.gitignore` 含 `.agent-pipeline/`**：缺的话总控补一行并单独提交 `chore(gitignore): 忽略智码编排调度目录`（调度文件绝不能进 git）。
6. **总控保活**：提醒用户——若智码开了会话自动清理，请把本会话锁定 / 置顶，否则子会话跑完的唤醒无处投递。

## 三个角色

| 角色 | 谁 | 做什么 | 不做什么 |
|------|----|--------|---------|
| **总控** | 本会话 | 选任务、派活、读结论、裁决、维护 `.agent-pipeline/state.json` | 不写业务代码、不跑 mvn / pnpm build、不复跑子会话跑过的验证、不点界面、不起 dev server（保持上下文轻；要实测就派一个实测子会话） |
| **实现方** | `claude-code` 子会话（每个任务新开） | 跑 `/dev-loop <编号> [ORCH:<总控id>]` 单步：实现 → 验证门 → `/check` → 勾台账 → **规范提交** | 不续期、不做下一条任务 |
| **验收方** | `codex` 子会话（按「验收方式」派，每次新开；未装 Codex 回落 `claude-code`） | 只读审 `<基线>..HEAD` 的提交，结论写文件，给出 `VERDICT: PASS / REJECT` | 不改仓库文件、不提交 |

> **提交策略（已定）**：实现方先提交、验收方审提交；驳回就追加 `fix(scope): …` 修复提交，不改写历史。
> 这样会话交接时工作区始终干净，不会触发 L2「15 分钟内未提交改动」打断。

## 验收方式（`--review=`，默认 `risk`）

验收查出的是真问题（智码编排统计：派了验收的编排里实现被退回返工 19%，没派的 5%），但它约占每个任务四成时间，
而且风险差别很大（实测页面类几乎不被驳回，同步 / 迁移类过半被驳回）。所以默认按风险分级，不是每条都审：

| 方式 | 做法 |
|------|------|
| `risk`（默认）按风险分级 | 满足任一条的任务**逐条**走第 5 步：改表结构 / SQL 脚本或做数据迁移、改 Controller 接口路径或入参出参（前后端约定）、权限 / 租户 / 数据权限 / 登录鉴权 / 凭据相关、同时改后端与前端（plus-ui 或 plus-uniapp）、对接外部服务（支付 / 短信 / OSS / 第三方 API）、实现超过 20 分钟或改了 15 个及以上文件。其余（纯前端页面 / 移动端页面 / 样式 / 文案 / 文档）记进 state.json 的 `pendingReview`（连同各自基线），攒到 3–5 条或里程碑边界时**合并派一次**验收 |
| `each` 逐条 | 每个任务都走第 5 步 |
| `final` 只在最后 | 中间任务过了第 4 步就记完成；本次范围全部做完后派一次整体验收，范围 `<startBaseline>..HEAD` |
| `none` 不派验收 | 不派验收方；第 4 步额外核对 `ORCH-RESULT` 写着验证门已绿（`/dev-loop` 自带验证门 + `/check`），缺了就按第 6 步驳回；收尾汇报写明「本次未经独立验收」，并列出建议人工重点看的地方 |

方式写进 state.json 的 `reviewMode`，上下文压缩后照它继续。合并 / 整体验收的任务书把这几条任务原文列全、审查范围改成对应区间（`<最早基线>..HEAD`）；
被驳回时按问题清单定位到具体任务，返工与复审照第 6 步走，不受方式影响。

## 每个任务的标准流程

1. **选任务**：读台账（按范围过滤），取「最靠前、依赖已完成」的第一个未勾 `[ ]`，记 `基线 = git rev-parse HEAD`，写入 state.json。首个任务时另记 `startBaseline`（= 编排开始时的 HEAD）。
   - **粒度**：该条预计超过 60 分钟、要改 15 个及以上文件、或任务书要写到 5000 字以上 → 先派一个子会话把它在台账里拆成几条（按台账编号规则追加并提交），再按拆后的条目推进。实测这一档返工率 22%、会触发上下文压缩；改 ≥15 个文件返工 18%，1–14 个只有 3–6%。
2. **派实现方**：
   ```
   start_agent_session(project_path=<项目根>, provider_id="claude-code", title="实现-<编号>",
     prompt="/dev-loop <编号> [ORCH:<yourSessionId>]", label="实现-<编号>", timeout_min=90)
   ```
   返回 `watching=true` = 已替你登记等待（`supervision` 缺省即 orchestrate），**不必再调 `watch_session`**；`watching=false`（系统拿不到你的身份）才补 `watch_session(watch_session_ids=[<实现方id>], notify_session_id=<yourSessionId>, label="实现-<编号>", timeout_min=90)`。
   然后**立刻停下**，不轮询、不读 transcript。
3. **被 `[AGENT-EVENT]` 唤醒后按 status 分流**：
   - `idle` → 进第 4 步
   - 回执里写着「还有 N 个后台任务没回来 · 系统已替你续挂了一个跟进等待」→ 它在等自己起的构建 / 子代理，**别催、别重派、不用重新 watch**，等下一条回执（那一轮才有真结果）
   - `stalled` / `stale` / `timeout` → `get_session_status` 看 state：`awaiting-input` → `control_session(action=key)`；`context-full` → `continue`；`crashed` → `restart`；跑飞 → `interrupt`；处置后**重新 watch**
   - `rate-limited` → 什么都别做（智码在换档案 / 等额度恢复后 CLI 自己续跑），重新 watch 等它续跑
   - `dead` → `open_session` 拉起后重新 watch；`resumed` → 必须读 transcript 核实到底跑完没有
4. **核实产出（不凭猜测）**：
   - 先看回执末尾的回复摘录：收尾小结（`ORCH-RESULT` 行）在摘录里就直接用，**不读 transcript**；摘录里没有才 `read_session_transcript(id, grep="ORCH-RESULT")`
   - `git log <基线>..HEAD --oneline` 必须有新的 `feat/fix(scope)` 提交，且台账该条已 `[x]`
   - 🔴 **被唤醒 ≠ 跑完**：`mvn compile` / 前端首次全量构建会几分钟无输出，子会话可能被误判 idle。没有 `ORCH-RESULT`、也没有新提交 → 先 `get_session_status` 看它是不是还在跑（`busy` / `running`），是就**重新 watch**，别当失败处理
   - 确认已停但没提交 / 没勾 / 小结写「验证门未绿」→ 视为驳回一次，按第 6 步返工
   - 产出核实无误 → 按「验收方式」定：这一条要逐条验收就进第 5 步；否则记进 `pendingReview`（`risk`）或直接记完成（`final` / `none`），回第 1 步
5. **派验收方（逐条验收的任务每条一次；合并 / 整体验收一次审多条；必须另开，禁止复用实现方）**：
   ```
   # 任务书写进 .agent-pipeline/review-<编号>.task.md，prompt 只发单行
   start_agent_session(project_path=<项目根>, provider_id="codex", title="验收-<编号>",
     prompt="请阅读并严格执行 .agent-pipeline/review-<编号>.task.md 中的验收任务（只读审查），结论写入 .agent-pipeline/review-<编号>.result.md",
     label="验收-<编号>", timeout_min=45)
   ```
   （`watching=false` 时同第 2 步补 `watch_session`。）
   - 🔴 **验收方不可用就立刻回落，不等**：未装 Codex（`start_agent_session` 报错 / 会话起不来）、Codex 额度用完、起来几秒就退出（`stalled` / `crashed`）、或连续两次起不来 → 同样的单行 prompt 改 `provider_id="claude-code"` 另开，state.json 记 `reviewerProvider`。实测等 Codex 额度恢复白等过 4 小时，期间没有任何子会话在跑。

   🔴 **任务书与结论一律走文件**（实测踩坑）：多行 prompt 派给 Codex 会卡在输入框不提交；`read_session_transcript` 读不到 Codex 正文；Codex 跑完的唤醒事件常报 `unknown` / `awaiting-input`（其实已跑完）。所以：
   - 被唤醒后**先看结论文件**：`review-<编号>.result.md` 存在且末行是 `VERDICT:` → 直接裁决，无视事件里的 state。
   - 结论文件不在 + state=`awaiting-input` 且 stopDetail 是 prompt 原文 → `control_session(action=key, key=enter)` 补回车，**隔 10 秒再** `watch_session`（立刻登记会被误判 alreadyIdle）。
   - 结论文件不在 + 其他状态 → 等 watch 超时兜底，或请用户去该 Tab 看一眼。

   验收任务书必须写全（Codex 没有本项目斜杠命令，全靠任务书），但**通用部分只写一次**：本次编排第一次派验收前，把下面的「第一段 / 第二段 / 约束 / 输出」写进 `.agent-pipeline/review-checklist.md`；之后每份 `review-<编号>.task.md` 开头写「先读 .agent-pipeline/review-checklist.md 并逐条执行」，正文只写本任务的差异——任务原文与审查范围（下面第一条）+ 本任务特有的检查点。（实测每份任务书把同一段规范重抄一遍，平均 6.3K 字。）
   - 任务原文（台账该条的目标 / 文件清单 / 验收标准）+ 审查范围 `git diff <基线>..HEAD`
   - **第一段 · 功能正确性**：是否真达成目标、边界 / 异常 / 空态、有无回归；前后端是否打通（接口路径、入参出参与前端调用一致）
   - **第二段 · 框架规范**：包名 `plus.ruoyi`、四层架构（Service 不继承、查询在 DAO `buildQueryWrapper`、Controller 只注入 Service）、`TenantEntity`、`MapstructUtils`、API 路径 `/pageXxxs` 风格、禁内联全限定名、前端 `A*` / 移动端 `wd-*` 封装组件、`[err, data]` 调用、UTF-8 无 BOM
   - 约束：**只读**，可跑验证门命令核实（`mvn -pl ruoyi-admin -am compile` / `pnpm -C plus-ui build` / `pnpm -C plus-uniapp build:h5`）；不起 / 不停 dev server、不 kill 端口；不改仓库文件、不提交；唯一允许写的是结论文件
   - 输出：写入 `.agent-pipeline/review-<编号>.result.md`，先列 `文件:行 — 问题 — 建议`，每条标「阻断」或「非阻断」（无问题写「无」）；**只有存在阻断项才判 REJECT**（数据损坏 / 安全凭据 / 真实计费 / 核心流程走不通一律算阻断），只有非阻断项时判 PASS 并照常列出；最后一行单独 `VERDICT: PASS` 或 `VERDICT: REJECT`
6. **裁决**：
   - `PASS` → state.json 记完成，回第 1 步取下一条。结论里列了非阻断项的，原样记进 state.json 的 `leftovers`（带任务编号），**不单开加固任务、不返工**——里程碑边界 / 全部 `[x]` 时合并处理（见「里程碑与收尾」）。实测按建议项一条条开加固、加固完再验一轮，比实现本身还耗时
   - `REJECT` → 驳回计数 +1，把问题清单原样转给返工方：
     - 实现方 `contextPercent < 50` → `send_to_session(实现方id, 驳回意见 + "按意见修复，过验证门后追加 fix(scope) 提交，结尾照旧输出 ORCH-RESULT")`
     - 否则另开 `claude-code` 子会话，任务书 = 任务原文 + 驳回意见 + 同样的提交要求
     - 返工完成后复审：验收方 `contextPercent < 50` 就 `send_to_session` 让它审新增提交，否则另开验收方（仍走任务书文件）
7. 每个任务结束输出一行：✅ `<编号>` 通过（驳回 N 次）| 📊 X/总 | ⏭️ 下一条。

## 里程碑与收尾

- **完成一个模块 / 里程碑**：`risk` 方式下先把 `pendingReview` 里剩下的任务合并验收掉；`leftovers` 非空就合并派一个实现子会话处理（任务书 = 遗留项原文 + 「按意见修复，过验证门后追加 fix(scope) 提交」），修完随下一次合并 / 整体验收一起复核；再派一个子会话跑 `/update-status`（总控不自己跑，避免上下文膨胀），watch 等它提交。大改之后另派一个只读子会话跑 `/check` 全量规范回归。
- **全部 `[x]`**：先把 `leftovers` 合并处理掉（同上；拿不准该不该修的列进最终汇报交用户定），`risk` / `final` 方式再派一次整体验收（范围 `<startBaseline>..HEAD`，重点看任务之间的衔接），通过后再往下；`none` 方式在最终汇报里写明「本次未经独立验收」。然后派 `/update-status` 汇总三文档 → 输出「✅ 全部计划功能已实现」+ 各任务驳回次数 + 熔断记录，结束编排。

## 熔断与决策分流

- **同一任务驳回达 2 次** → 停止编排：在台账该条下补一行 `⚠️ 编排熔断：<验收意见摘要>`，报告用户（错误原文 + 判断 + 建议）。
- **连续 3 个任务无实质进展**（无新提交 / 反复 stalled）→ 停止并报告。
- 实现方在 `docs/BLOCKERS.md` 记了「需人工决策」项（不可逆 / 合规 / 改库结构影响存量 / 缺外部凭据）→ 总控停下问用户，不替用户拍板。
- **除以上几种情况，不停下来问人**：任务之间、里程碑之间照常往下派，不请示「要不要继续」（实测 60 次这样的长等待里 11 次本可自主继续，白等 9.3 小时）。
- 真要问时：先把不依赖答案的下一条派出去再问；**有子会话在跑时不用 AskUserQuestion**——选项菜单挂着时回执会扣在菜单后面，你答之前一条都进不来，改用普通文字把问题写清楚。

## 状态恢复（上下文被压缩后）

`.agent-pipeline/state.json`（已 gitignore，只存调度信息，**进度真相源仍是台账**），每次派活 / 裁决后更新：

```json
{
  "orchestratorSessionId": "…", "scope": "mall", "startBaseline": "<sha>", "reviewMode": "risk",
  "current": { "taskId": "T12", "phase": "implement|review|fix", "baseline": "<sha>",
               "implementerSessionId": "…", "reviewerSessionId": "…", "reviewerProvider": "codex",
               "rejections": 1 },
  "pendingReview": [{ "taskId": "T13", "baseline": "<sha>" }],
  "leftovers": [{ "taskId": "T12", "item": "<验收列出的非阻断项原文>" }],
  "done": ["T10", "T11"], "fused": []
}
```

压缩后恢复：读 state.json + `get_session_status`（`childSessionIds` 是系统记的派活拓扑）→ 对当前任务的子会话查 state → 该 watch 的重新 watch。

## 总控是 Codex 时（补充）

Codex 不把 `AICODER_SESSION_ID` 透传给 MCP 子进程，系统可能认不出你是谁：先 `get_session_status` 找 `isYou=true` 那条拿到自己的 id；`watch_session` **显式传 `notify_session_id=<你的id>`**（Codex 下 `start_agent_session` / `send_to_session` 多半拿不到你的身份、返回 `watching=false`，所以派完都要补这一步）；`start_agent_session` **显式传 `provider_id`**（实现方用 `claude-code`，因为本项目斜杠命令只在 Claude 侧齐全）。

## 红线

- 🔴 **改代码的子会话同一时刻只能有 1 个**（共用一个 git 仓库和编译产物）；只有只读的活（调研 / 审查）可以并行。
- 🔴 **每次派活后确认已登记等待**（watcher 一次性，触发即失效）：`start_agent_session`、以及发给自己子会话的 `send_to_session` 返回 `watching=true` 即已登记，`false` 才补 `watch_session`；**不传 `replace_existing=true`**；不写轮询循环。
- 🔴 判断子会话死活只信 `get_session_status`，不拿 transcript 内容推断。
- 「实现 → 验收」必须另开会话；验收方不看实现方的自辩，只看任务原文 + diff。
- 总控不 kill 进程、不关 Tab；dev server 由实现方用 `resolve_and_start_task` 起（智码托管，跨子会话存活）。
- 子会话默认全自动权限（`cli_args` 省略），红线靠 `CLAUDE.md` + `/dev-loop` 约束——所以任务书里**不许**放宽任何项目禁令。
- 不 `git push`，也不为推送停下来问（收尾汇报列出未推送的提交，由用户自己推）；仓库私有；反捏造（验收意见、完成度以 diff 与编译结果为准）。
- 严守 `CLAUDE.md` / `.claude/PROJECT.md` 项目禁令（**优先级最高**）。

## 与相邻能力的边界

| 能力 | 角色 |
|------|------|
| `/loop /dev-loop` | 单会话自主循环（通用、省 token，任何环境可用） |
| **/dev-orchestrate**（本命令） | 智码内的多会话编排：总控调度 + 实现方跑 `/dev-loop` 单步 + 异构验收 |
| `/dev-loop <编号>` | 一个任务的标准作业（两种模式共用） |
| `/check` | 全量规范回归（编排里由实现方每轮跑，里程碑由总控另派） |
| 智码「协同编排」弹窗 | 通用编排（不懂本项目规范）；意图不固定的长任务用 `/loop-gen` 生成弹窗变量 |
