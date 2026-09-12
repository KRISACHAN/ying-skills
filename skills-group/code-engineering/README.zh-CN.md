[English](./README.md) | **简体中文**

# Code Engineering Skill Group

一组面向真实软件项目的可复用 AI Coding Skills。

默认生命周期刻意保持精简：

```text
建立规范
  ↓
项目分析
  ↓
方案制定
  ↓
实施 + 验证
```

Review 是**可选的横向质量工具**，不是强制 Gate。是否执行 `solution-review`、`code-review`、`review-followup`，以及执行多少次，都由用户决定。

## 源码结构

```text
skills-group/code-engineering/
├── README.md
├── README.zh-CN.md
├── references/
│   ├── engineering-principles.md
│   ├── refactoring.md
│   ├── clean-code.md
│   ├── module-first-architecture.md
│   ├── layered-architecture.md
│   ├── ports-and-adapters.md
│   ├── strategy-and-plugin.md
│   ├── code-comments.md
│   ├── engineering-documentation.md
│   ├── verification.md
│   ├── review-system.md
│   └── artifact-protocol.md
└── skills/
    ├── project-guardrails/
    ├── architecture-audit/
    ├── refactor-plan/
    ├── refactor/
    ├── code-comments/
    ├── engineering-documentation/
    ├── solution-review/
    ├── code-review/
    └── review-followup/
```

`skills/` 与 `references/` 是唯一真源。不同 AI 工具的目录格式由脚本生成到 `.generated/`，不要手工维护生成产物。

## 核心工程基线

所有 Skill 共用以下默认工程观：

- **Refactoring**：保持行为、小步修改、持续验证；
- **Clean Code**：清晰命名、职责聚焦、高内聚低耦合、显式副作用、减少重复知识；
- **Module-first**：优先按业务/能力模块组织，再在模块内部合理分层；
- **Layered Architecture**：在项目适用时明确 Domain / Application / Ports / Infrastructure / Interface / Composition 的职责和依赖方向；
- **Ports & Adapters**：数据库、LLM、搜索、文件系统、第三方 SDK 等技术机制停留在可替换边界；
- **Strategy**：只用于同一职责存在真实可替换算法的场景；
- **Plugin**：只用于可独立增加、移除、组合的扩展能力；
- **Structured Code Comments**：让代码本身表达需求语义、能力、职责、边界、Contract、Lifecycle 与 Tradeoff，不以“少写”或“多写”为目标；
- **Engineering Documentation**：README、AGENTS、ADR、Architecture Index 与模块文档形成面向人和 AI 的渐进式知识导航；
- **Evidence-based Verification**：没有与风险匹配的新鲜验证证据，不宣称完成；
- **Anti-overengineering**：模式必须解决真实变化、职责或集成问题，不为了“架构感”制造抽象。

优先级：

```text
用户明确要求
  > 项目明确合同 / 规范
  > 项目既有且合理的架构
  > Code Engineering 默认原则
```

## 默认执行粒度

默认执行单位是一个有意义的 **Scope**，而不是一个 Finding。

优先：

```text
package / app / module
  ↓
一次 audit
  ↓
一次 plan
  ↓
一次 implementation（内部包含多个 work items）
  ↓
一次 scope-level verification
```

只有存在真正独立边界时才继续拆分 Scope，例如：

- 不同业务职责或所有权；
- 不同 Public Contract 或持久化 Schema；
- 独立 rollback / migration 风险；
- 明显不同的验证策略；
- Scope 大到一次无法可靠理解或执行。

不要仅因为 Audit 找到了多个问题、存在多个大文件、或者 Plan 有多个工作项，就机械拆成多个执行单元。

## Skills

| 阶段 | Skill | 作用 | 默认权限 |
| --- | --- | --- | --- |
| 1. 建立规范 | `$project-guardrails` | 建立/审计 AI 开发规范、架构边界、注释/文档规则、验证要求和知识导航 | 可改工程规范/配置/文档；不重构业务行为 |
| 2. 项目分析 | `$architecture-audit <scope>` | 生成功能/架构图谱、依赖/数据流、Hotspot、坏味道、知识导航与验证缺口 | 只读代码；可写审计 artifact |
| 3. 方案制定 | `$refactor-plan <scope-or-audit>` | 将确认的问题收敛成 Scope-level 目标、Work Items、行为合同、风险和回归策略 | 不实施生产代码 |
| 4. 实施与验证 | `$refactor <approved-plan-or-scope>` | 在批准 Scope 内连续实施行为保持式重构，并完成 Scope 级验证 | 可在批准范围内改代码 |
| 支撑 | `$code-comments <scope>` | 为源码补充/同步结构化语义注释，让人和 AI 理解需求、能力、职责、边界、不变量与生命周期 | 只改源码注释/Doc Comment，不改运行行为 |
| 支撑 | `$engineering-documentation <scope>` | 维护 README、AGENTS、ADR、Architecture Index 与模块工程文档 | 只改工程文档，不改运行行为或源码注释 |
| 可选 Review | `$solution-review <artifact>` | 用户需要第二意见时审查 PRD、Spec、技术方案、架构方案或重构计划 | 只审查 |
| 可选 Review | `$code-review <scope>` | 用户需要独立质量保证时审查实际实现 | 只审查 |
| 可选 Review | `$review-followup <report>` | 用户决定处理 Review Findings 时，独立验证并只处理成立的问题 | 可按需修改方案 artifact 或代码 |

`0 findings` 是合法 Review 结果。Review Skill 不得为了显得有价值而制造问题。

## 结构化注释与工程文档

这两个能力刻意分开：

```text
$code-comments
= 代码级知识层
= Module/File → API/Class → Function → Inline

$engineering-documentation
= Repository 级知识导航
= Repository → App/Package → Module → Contract/ADR
```

`code-comments` 的目标不是克制到“尽量不写”，而是提供**足够的语义上下文**。根据实际需要表达：

```text
Purpose
Capability
Responsibility
Boundary / Non-responsibility
Contract / Invariant
Lifecycle / Side Effect / Ordering
Tradeoff / Why
Requirement semantics
```

结构统一，但深度按需；不要求每个文件/函数机械填满模板，也不允许用注释复述语法。

`engineering-documentation` 描述当前真实系统，不写“理想中应该是什么”。优先沿用现有 README / AGENTS / ADR / requirements / architecture docs，不建立平行 Source of Truth。

## 推荐重构流程

```text
$project-guardrails                    # 每个项目通常只需一次，或规范明显过时时执行
        ↓
$architecture-audit <pkg/app/module>
        ↓
$refactor-plan <audit-or-scope>
        ↓
$refactor <approved-plan-or-scope>
```

支撑 Skill 按需独立调用：

```text
Implementation / existing code
  ├─→ $code-comments <scope>
  └─→ $engineering-documentation <scope>
```

重构本身应同步**直接被改动影响**的关键注释/文档；如果需要一次专门的全 Scope 注释或工程文档治理，再调用对应支撑 Skill。

Review 可以由用户插入到任何位置：

```text
Plan ───────────────→ $solution-review     # 可选，次数由用户决定
Implementation ────→ $code-review         # 可选，次数由用户决定
Review Report ─────→ $review-followup      # 可选，只有用户想处理 Findings 时执行
```

Review 不自动阻断下一阶段。Followup 后是否再次 Review 同样由用户决定，除非项目明确规定必须复审。

## 普通需求 / Bugfix

Review 子系统同样可以独立复用：

```text
PRD / Spec / Fix Plan
  ├─→ $solution-review    # 可选
  ↓
Implementation
  ├─→ $code-review        # 可选
  ├─→ $code-comments      # 按需
  └─→ $engineering-documentation  # 按需
```

## 人工控制

本 Skill Group 刻意不提供一键跑完整生命周期的总控 Skill。

由用户决定：

- 什么时候进入下一阶段；
- 是否需要专门的注释/工程文档治理；
- 要不要 Review；
- Review 哪个 Scope；
- 要不要 Followup；
- Followup 后值不值得再 Review。

Skill 提供工程纪律，但不强制流程仪式。

## Artifact 协议

只持久化真正需要跨 Session / 阶段传递的信息。已有项目规范优先。

典型长期 Artifact：

```text
Architecture Audit
Refactor Plan
必要时的 Implementation / Verification Summary
用户显式要求 Review 时的 Review Report
```

不要为每一个微小重构步骤都创建独立 artifact，除非项目明确要求这种追踪粒度。

如果项目没有现成约定，可回退到：

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

具体约定见 [`references/artifact-protocol.md`](./references/artifact-protocol.md)。

## 生成不同 AI 工具格式

在仓库根目录执行：

```bash
pnpm generate -- --group code-engineering
```

指定一个或多个工具：

```bash
pnpm generate -- --group code-engineering --tool codex
pnpm generate -- --group code-engineering --tool claude --tool gemini
```

生成结果：

```text
skills-group/code-engineering/.generated/
├── codex/.agents/skills/<skill>/...
├── cursor/.cursor/skills/<skill>/...
├── gemini/.gemini/skills/<skill>/...
├── claude/.claude/skills/<skill>/...
├── kiro/.kiro/skills/<skill>/...
└── copilot/.github/skills/<skill>/...
```

生成后的每个 Skill 都是自包含的：

```text
<skill>/
├── SKILL.md
└── references/
    └── _shared/
```

生成器会把 Group 共享 references 复制进每个生成 Skill，并把源码中的 `../../references/...` 自动改写为 `./references/_shared/...`。

## 迁移到已有项目

交互式迁移：

```bash
pnpm migrate
```

Codex 非交互示例：

```bash
pnpm migrate -- \
  --path ../ying-knowledge \
  --group code-engineering \
  --tool codex
```

迁移采用合并模式：目标项目中无关文件会保留，同名 Skill / Reference 会按迁移策略覆盖。

> 迁移脚本不会删除目标项目中已经不存在于 Source Group 的旧 Skill。若项目曾迁移旧版 `code-documentation`，升级到本版本后需要手动删除目标项目里的旧 `code-documentation/` 目录一次。

## 当前支持的工具目录

| 工具 | 生成到项目的目录 |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |
