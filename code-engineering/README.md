# Code Engineering Skill Group

可直接复制到真实代码项目中使用的一组通用 AI Coding Skills。

核心流程：**建立规范 → 项目分析 → 方案制定 → 实施与验证**。Review 是独立横向质量系统，可同时用于重构、Feature、Bugfix、架构设计和普通需求开发。

## 直接安装到项目

### Codex（主支持）

把本目录下的 `.agents/` 合并复制到目标项目根目录：

```bash
mkdir -p /path/to/project/.agents
cp -R code-engineering/.agents/. /path/to/project/.agents/
```

如果你已经位于目标项目根目录，例如 `ying-skills` 与项目是相邻目录：

```bash
mkdir -p .agents
cp -R ../ying-skills/code-engineering/.agents/. .agents/
```

复制完成后，项目应出现：

```text
<project>/
└── .agents/
    ├── references/
    ├── tools/
    └── skills/
        ├── project-guardrails/
        ├── architecture-audit/
        ├── refactor-plan/
        ├── refactor/
        ├── code-documentation/
        ├── solution-review/
        ├── code-review/
        └── review-followup/
```

Codex 项目级 Skills 使用 `.agents/skills/<skill-name>/SKILL.md`。安装后重启/刷新 Agent 会话，再显式调用 `$skill-name` 即可。

## 兼容性

`.agents/skills/` 是本组唯一真源，不维护多份 Skill 正文。

| Agent / 工具 | `.agents/skills` | 使用方式 |
| --- | --- | --- |
| OpenAI Codex | ✅ 主支持 | `$project-guardrails`、`$architecture-audit` 等 |
| Cursor | ✅ 原生发现 | Agent 自动选择或 `/` 选择 Skill |
| Gemini CLI | ✅ Workspace alias | 自动激活或通过 `/skills` 管理 |
| GitHub Copilot / VS Code | ✅ 原生发现 | Agent/Chat 中选择或触发 Skill |
| Claude Code | ⚠️ 官方路径为 `.claude/skills` | 使用兼容同步脚本 |
| Kiro | ⚠️ 官方路径为 `.kiro/skills` | 使用兼容同步脚本 |

Claude / Kiro 兼容同步：

```bash
bash .agents/tools/sync-code-engineering.sh claude
bash .agents/tools/sync-code-engineering.sh kiro
# 或一次同步两者
bash .agents/tools/sync-code-engineering.sh claude kiro
```

同步脚本会把同一份 `.agents/skills` 和 `.agents/references` 复制到对应 Agent 的项目目录。以后如果更新了 `.agents` 真源，需要重新执行同步。

## 核心工程观

所有 Skill 共享以下默认基线：

- **Refactoring**：行为保持、小步修改、持续验证；
- **Clean Code**：清晰命名、单一职责、高内聚低耦合、显式副作用、减少重复知识；
- **Module-first**：优先按业务/能力模块组织，再在模块内部合理分层；
- **Layered Architecture**：明确 Domain / Application / Ports / Infrastructure / Interface / Composition 的职责与依赖方向；
- **Ports & Adapters**：数据库、LLM、搜索、文件系统、第三方 SDK 等技术细节停留在边界；
- **Strategy**：只用于真实存在的算法变化；
- **Plugin**：只用于可独立增加、移除、组合的扩展能力；
- **Structured Documentation**：README、AGENTS、ADR、索引与 Why/Invariant/Boundary/Tradeoff 注释共同服务人和 AI；
- **Evidence-based Verification**：没有新鲜验证证据，不宣称完成；
- **Anti-overengineering**：不为了“架构感”制造接口、Factory、Strategy、Plugin 或碎片化小文件。

优先级始终是：**用户明确要求 > 项目明确合同/规范 > 项目既有合理架构 > 本 Skill Group 默认原则**。

详细标准位于安装后的 `.agents/references/`。

## Skill 一览

| 阶段 | Skill | 作用 | 默认权限 |
| --- | --- | --- | --- |
| 1. 建立规范 | `$project-guardrails` | 建立/审计项目 AI 开发规范、架构边界、验证和文档导航 | 可改工程规范，不改业务行为 |
| 2. 项目分析 | `$architecture-audit <scope>` | 功能图谱、架构图谱、依赖/数据流、Hotspot、坏味道与根因诊断 | 只读代码，可写审计 artifact |
| 3. 方案制定 | `$refactor-plan <scope-or-audit>` | 目标结构、Refactor Units、行为合同、风险、回归方案 | 不改业务代码 |
| 4. 实施与验证 | `$refactor <approved-unit>` | 按批准 Unit 小步修改、持续验证、最终收敛检查 | 可改代码 |
| 支撑 | `$code-documentation <scope>` | 同步结构化注释、README、ADR、文档索引 | 只改文档/注释，不改行为 |
| Review | `$solution-review <artifact>` | 审 PRD/Spec/Feature/Bugfix/架构/重构方案 | 只审查 |
| Review | `$code-review <scope>` | 审实际代码实现、架构、Clean Code、验证缺口和文档漂移 | 只审查 |
| Review | `$review-followup <report>` | 验证 Finding 后最小修复或有证据地驳回 | 可改方案或代码 |

## 推荐调用顺序

### 重构

```text
$project-guardrails                    # 第一次接入项目或规范明显过时时
        ↓ Human Review
$architecture-audit <pkg/app/module>
        ↓ Human Review
$refactor-plan <audit-or-scope>
        ↓
$solution-review <refactor-plan>
        ↓ Human Review
$refactor <approved RF unit>
        ↓
$code-documentation <scope>            # 按需
        ↓
$code-review <implementation scope>
        ↓
PASS → Next Unit
FAIL → $review-followup <report> → $code-review
```

### 普通需求 / Feature

```text
PRD / Spec / Technical Plan
        ↓
$solution-review <artifact>
        ↓ Human Review
Implementation
        ↓
$code-review <scope>
        ↓
PASS / $review-followup
```

### Bugfix

```text
Bug Analysis / Fix Plan
        ↓
$solution-review <artifact>             # 简单低风险问题可跳过
        ↓
Implementation
        ↓
$code-review <scope>
```

## 人工 Gate

本组刻意**不提供一键串行执行全部生命周期的总控 Skill**。高影响阶段结束后由人 Review，再显式进入下一阶段。前序 artifact 应持久化，后序 Skill 读取 artifact，而不是依赖聊天历史维持项目事实。

若项目已有 Requirements / Specs / Reviews / ADR 目录，优先沿用；没有时可回退到：

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

复制到项目后，`.agents/skills/README.md` 也包含一份项目内快速调用索引。
