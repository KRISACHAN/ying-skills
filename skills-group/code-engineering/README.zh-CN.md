[English](./README.md) | **简体中文**

# Code Engineering Skill Group

一组面向真实软件项目的可复用 AI Coding Skills。

目标不是把所有仓库强制改造成同一种架构，而是让 AI 在明确工程边界内，通过一套可重复执行的生命周期完成开发与重构：

```text
建立规范
  ↓
项目分析
  ↓
方案 / 重构计划
  ↓
实施 + 验证
```

Review 是独立的横向质量体系，可复用于重构、Feature、Bugfix、架构方案、迁移方案和普通需求开发。

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
│   ├── comments-and-documentation.md
│   ├── verification.md
│   ├── review-system.md
│   └── artifact-protocol.md
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

`skills/` 与 `references/` 是唯一真源。不同 AI 工具的目录格式由脚本生成到 `.generated/`，不要手工维护生成产物。

## 核心工程基线

所有 Skill 共用以下默认工程观：

- **Refactoring**：保持行为、小步修改、持续验证；
- **Clean Code**：清晰命名、单一职责、高内聚低耦合、显式副作用、减少重复知识；
- **Module-first**：优先按业务/能力模块组织，再在模块内部合理分层；
- **Layered Architecture**：在项目适用时明确 Domain / Application / Ports / Infrastructure / Interface / Composition 的职责和依赖方向；
- **Ports & Adapters**：数据库、LLM、搜索、文件系统、第三方 SDK 等技术机制停留在可替换边界；
- **Strategy**：只用于同一职责存在真实可替换算法的场景；
- **Plugin**：只用于可独立增加、移除、组合的扩展能力；
- **Structured Documentation**：README、AGENTS/Agent Instructions、ADR、索引，以及 Why / Invariant / Boundary / Tradeoff 注释共同服务人和 AI；
- **Evidence-based Verification**：没有与风险匹配的新鲜验证证据，不宣称完成；
- **Anti-overengineering**：模式必须解决真实变化、职责或集成问题，不为了“架构感”制造抽象。

优先级：

```text
用户明确要求
  > 项目明确合同 / 规范
  > 项目既有且合理的架构
  > Code Engineering 默认原则
```

## Skills

| 阶段 | Skill | 作用 | 默认权限 |
| --- | --- | --- | --- |
| 1. 建立规范 | `$project-guardrails` | 建立/审计 AI 开发规范、架构边界、验证要求和文档导航 | 可改工程规范/配置/文档；不重构业务行为 |
| 2. 项目分析 | `$architecture-audit <scope>` | 生成功能/架构图谱、依赖/数据流、Hotspot、坏味道、验证缺口和根因诊断 | 只读代码；可写审计 artifact |
| 3. 方案制定 | `$refactor-plan <scope-or-audit>` | 将已确认问题转为目标结构、Refactor Units、行为合同、风险和回归方案 | 不实施生产代码 |
| 4. 实施与验证 | `$refactor <approved-unit>` | 按批准 Unit 小步实施行为保持式重构并持续验证 | 可在批准范围内改代码 |
| 支撑 | `$code-documentation <scope>` | 结构变化后同步注释、README、ADR 和导航索引 | 只改文档/注释，不改运行行为 |
| Review | `$solution-review <artifact>` | 实施前审查 PRD、Spec、Feature/Bugfix 方案、架构方案、迁移或重构计划 | 只审查 |
| Review | `$code-review <scope>` | 审实际实现的正确性、方案一致性、Clean Code、架构、模式、验证缺口和文档漂移 | 只审查 |
| Review | `$review-followup <report>` | 独立验证每条 Finding，成立则最小修复，不成立则带证据驳回 | 可按需修改方案 artifact 或代码 |

`0 findings` 是合法 Review 结果。Review Skill 不得为了显得有价值而制造问题。

## 推荐调用顺序

### 重构

```text
$project-guardrails                    # 第一次接入项目或项目规范明显过时时
        ↓ Human Review
$architecture-audit <pkg/app/module>
        ↓ Human Review
$refactor-plan <audit-or-scope>
        ↓
$solution-review <refactor-plan>
        ↓ Human Review
$refactor <approved RF unit>
        ↓
$code-documentation <scope>            # 结构/文档发生变化时按需执行
        ↓
$code-review <implementation scope>
        ↓
PASS → 下一个 Refactor Unit
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
$solution-review <artifact>     # 简单低风险问题可跳过
        ↓
Implementation
        ↓
$code-review <scope>
```

## 人工 Gate

本 Skill Group 刻意**不提供一键自动跑完整生命周期的总控 Skill**。

对高影响工作，推荐控制模型：

```text
AI 执行当前阶段
  ↓
持久化 artifact / 验证证据
  ↓
人工 Review
  ↓
显式进入下一阶段
```

这样人始终掌握问题理解、架构方向、方案批准和最终实现验收的推进权。

## Artifact 协议

已有项目规范优先。如果仓库已经存在 Requirements、Specs、ADR、Review Archive 或技术设计目录，继续沿用，不另造平行体系。

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

迁移采用合并模式：目标 AI 工具目录中原有的无关文件会保留。对于同名生成 Skill / Reference 冲突，脚本会在替换前报告；只有明确提供非交互确认时才会直接覆盖。

## 当前支持的工具目录

| 工具 | 生成到项目的目录 |
| --- | --- |
| OpenAI Codex | `.agents/skills/` |
| Cursor | `.cursor/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Claude Code | `.claude/skills/` |
| Kiro | `.kiro/skills/` |
| GitHub Copilot | `.github/skills/` |
