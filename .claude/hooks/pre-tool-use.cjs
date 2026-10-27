#!/usr/bin/env node
/**
 * PreToolUse Hook - 工具使用前触发
 * 功能:
 * 1. 阻止危险命令
 * 2. 提醒敏感操作
 * 3. 自动修正常见错误
 */

const fs = require('fs');

// 从 stdin 读取输入
let inputData = '';
try {
  inputData = fs.readFileSync(0, 'utf8');
} catch {
  // 无输入时允许继续
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

let input;
try {
  input = JSON.parse(inputData);
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const toolName = input.tool_name;
const toolInput = input.tool_input || {};

// ===========================================================================
// Shell 卫生检查（Bash 与 PowerShell 共用）
// 对应 CLAUDE.md /AGENTS.md「⚠️ Bash/Shell 禁止项」新增的三条
// ===========================================================================
if (toolName === 'Bash' || toolName === 'PowerShell') {
  const command = toolInput.command || '';

  // --- 规则 A：heredoc 内联长脚本 ---
  // 只拦「内联脚本」，不拦「多行文本输入」——两者形似而危害完全不同：
  //   拦：python - <<'PY' / cat > x.py <<'PY'  （脚本要过 shell 解析，引号嵌套易崩）
  //   放：git commit -F - <<'EOF' / cat > x.md <<'EOF'（纯文本，本来就该这么传）
  const heredoc = command.match(/<<-?\s*(['"]?)([A-Za-z_]\w*)\1/);
  if (heredoc) {
    const tag = heredoc[2];
    const lines = command.split('\n');
    const start = lines.findIndex(l => new RegExp('<<-?\\s*[\'"]?' + tag + '[\'"]?').test(l));
    let end = -1;
    for (let i = start + 1; i < lines.length; i++) {
      if (new RegExp('^\\s*' + tag + '\\s*$').test(lines[i])) { end = i; break; }
    }
    const body = end === -1 ? lines.length - start - 1 : end - start - 1;

    // 🔑 判定只看 heredoc 的**起始行**，绝不看正文：正文里把坏写法当例子引用
    //   （比如本次改动的 commit message 里写 `cat > x.mjs <<'JS'`）会被自己命中，
    //   那样以后就没法在文档和提交信息里讨论这些写法了。
    const opener = start >= 0 ? lines[start] : command;
    const feedsInterpreter = /\b(python3?|node|deno|bun|sh|bash|zsh|perl|ruby|php)\b[^<]*<<-?\s*['"]?\w/i.test(opener);
    const writesScript = /\b(cat|tee)\b[^|<]*>\s*\S+\.(py|js|cjs|mjs|ts|sh|ps1|rb|pl|php)\b[^<]*<<-?\s*['"]?\w/i.test(opener);

    // 15 行以内的短 heredoc 放行；未闭合的只要是脚本一律拦（那正是 unexpected EOF 成因）
    if ((feedsInterpreter || writesScript) && (body > 15 || end === -1)) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: `🛑 **内联长脚本被阻止**（定界符 \`${tag}\`，正文约 ${body} 行${end === -1 ? '，**且未找到闭合定界符**' : ''}）\n\n` +
          '**问题**：定界符没闭合、或三层引号嵌套（单引号套双引号套反引号）会把 bash 解析搞崩，' +
          '报 `unexpected EOF while looking for matching`；失败时整段脚本还得重打一遍。\n\n' +
          '**解决方案**：用 Write 工具落成真文件再执行\n' +
          '  1. `Write` → `<scratchpad>/fix.py`（内容不过 shell 解析，引号随便嵌套）\n' +
          '  2. `Bash` → `python <scratchpad>/fix.py`（出错只改那一行重跑）\n\n' +
          '（15 行以内的短 heredoc、以及 `git commit -F -` 这类纯文本输入不受此限制。）'
      }));
      process.exit(0);
    }
  }

  // --- 规则 B：拿 /tmp 当中转目录 ---
  // 大小写敏感：scratchpad 路径里的 /Temp/ 是大写 T，不会被误命中
  if (/(^|[\s"'>|=(])\/tmp\//.test(command)) {
    console.log(JSON.stringify({
      decision: 'block',
      reason: '🛑 **`/tmp` 路径被阻止**\n\n' +
        '**问题**：Git Bash 的 `/tmp` 和 Windows 原生程序（python / node / tar）理解的不是同一个位置。' +
        'bash 明明写进去了，python 去读却报 `FileNotFoundError: \'/tmp/xxx\'`；' +
        'node 更会把它当成当前盘符下的 `D:\\tmp`。两边各写各的，排查极费时间。\n\n' +
        '**解决方案**：改用 scratchpad 的绝对路径，或项目内 `logs/`。\n' +
        '需要临时目录时用 `$env:TEMP`（PowerShell）/ `$TEMP`（Bash），不要用 `/tmp`。'
    }));
    process.exit(0);
  }

  // --- 规则 C：PowerShell 里给原生 exe 加 2>&1（自动摘掉，不打断）---
  if (toolName === 'PowerShell' && /2>&1/.test(command)) {
    // cmd /c "... 2>&1" 是正确用法（由 cmd 处理，不经 PS 的 ErrorRecord 包装），跳过
    const delegated = /\bcmd(\.exe)?\s*\/c\b|\bbash\s+-c\b|\bsh\s+-c\b/i.test(command);
    const native = /\b(mvn|java|javac|gradle|cargo|cmake|ctest|npm|npx|pnpm|yarn|node|tsc|python3?|git|docker|rg)\b/i.test(command);

    if (!delegated && native) {
      // 只摘引号外的 2>&1：引号内的是字面量（如 rg "2>&1" x.log），改了就是静默改坏
      let out = '', quote = null, i = 0;
      while (i < command.length) {
        const c = command[i];
        if (quote) { out += c; if (c === quote) quote = null; i++; continue; }
        if (c === '"' || c === "'") { quote = c; out += c; i++; continue; }
        if (command.startsWith('2>&1', i)) {
          const after = command[i + 4];
          if (after === undefined || /\s/.test(after)) { out = out.replace(/[ \t]+$/, ''); i += 4; continue; }
        }
        out += c; i++;
      }
      if (out !== command) {
        console.log(JSON.stringify({
          systemMessage: 'pre-tool-use: 已摘掉 `2>&1` —— PowerShell 5.1 会把原生程序的 stderr 逐行包成 NativeCommandError。',
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            updatedInput: Object.assign({}, toolInput, { command: out })
          }
        }));
        process.exit(0);
      }
    }
  }
}

// Bash 命令检查
if (toolName === 'Bash') {
  const command = toolInput.command || '';

  // 检测 > nul 错误用法（Windows 会创建名为 nul 的文件）
  const nulPattern = /[12]?\s*>\s*nul\b/i;
  if (nulPattern.test(command)) {
    const output = {
      decision: 'block',
      reason: `🚫 **命令被阻止**：检测到 \`> nul\`\n\n**问题**：Windows 下某些 Shell 会创建名为 \`nul\` 的文件\n\n**解决方案**：\n- 移除输出重定向，或\n- 使用 \`> /dev/null 2>&1\`（跨平台）\n\n原命令: \`${command}\``
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // 危险命令模式
  const dangerousPatterns = [
    { pattern: /rm\s+-rf\s+\/(?!\w)/, reason: '删除根目录' },
    { pattern: /rm\s+-rf\s+\*/, reason: '删除所有文件' },
    // 拦截 rm -rf 后跟 Windows 绝对路径（如 D:/xxx 或 D:\xxx），带或不带引号、带或不带尾部 *
    { pattern: /rm\s+-rf\s+["']?[A-Za-z]:[\/\\][^"'\s]*["']?\s*\*?/i, reason: '删除 Windows 绝对路径下的文件' },
    // 拦截 rm -rf 后跟 Unix 风格绝对路径（如 /home/xxx、/usr/xxx），但放过当前项目工作目录内的相对路径
    { pattern: /rm\s+-rf\s+["']?\/(home|usr|etc|var|opt|root|tmp|bin|sbin|lib)\b/i, reason: '删除系统关键目录' },
    { pattern: /drop\s+database/i, reason: '删除数据库' },
    { pattern: /truncate\s+table/i, reason: '清空表数据' },
    { pattern: /git\s+push\s+--force\s+(origin\s+)?(main|master)/i, reason: '强制推送到主分支' },
    { pattern: /git\s+reset\s+--hard\s+HEAD~\d+/, reason: '硬重置多个提交' },
    { pattern: />\s*\/dev\/sd[a-z]/, reason: '直接写入磁盘设备' },
    { pattern: /mkfs\./, reason: '格式化文件系统' },
    { pattern: /:(){ :|:& };:/, reason: 'Fork 炸弹' },
  ];

  for (const { pattern, reason } of dangerousPatterns) {
    if (pattern.test(command)) {
      const output = {
        decision: 'block',
        reason: `⚠️ **危险操作被阻止**\n\n命令: \`${command}\`\n原因: ${reason}\n\n如确需执行，请手动在终端运行`
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }

  // 警告但不阻止的命令
  const warningPatterns = [
    { pattern: /git\s+push\s+--force/, warning: 'Force push 可能覆盖他人代码' },
    { pattern: /npm\s+publish/, warning: '即将发布到 npm' },
    { pattern: /docker\s+system\s+prune/, warning: '将清理所有未使用的 Docker 资源' },
  ];

  for (const { pattern, warning } of warningPatterns) {
    if (pattern.test(command)) {
      const output = {
        continue: true,
        systemMessage: `⚠️ **注意**: ${warning}`
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }
}

// Write 工具检查
if (toolName === 'Write') {
  const filePath = toolInput.file_path || '';

  // 检查是否写入敏感配置文件
  const sensitiveFiles = [
    '.env.production',
    'application-prod.yml',
    'credentials.json',
    'secrets.json'
  ];

  for (const sensitive of sensitiveFiles) {
    if (filePath.endsWith(sensitive)) {
      const output = {
        continue: true,
        systemMessage: `⚠️ **敏感文件**: 正在写入 \`${sensitive}\`\n\n请确保不要提交敏感信息到 Git`
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }
  }
}

// 默认：允许继续（不输出 decision 字段，使用默认权限系统）
console.log(JSON.stringify({ continue: true }));
