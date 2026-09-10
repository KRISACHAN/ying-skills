# Code Engineering Skill Group

面向真实代码项目的通用 AI Coding Skill Group。

核心流程：**建立规范 → 项目分析 → 方案制定 → 实施与验证**。Review 是独立横向质量系统，可同时用于重构、Feature、Bugfix、架构设计和普通需求开发。

## 源码结构

```text
skills-group/code-engineering/
├── README.md
├── references/                 # 全组共享工程原则
└── skills/                     # Agent Skill 源码
    ├── project-guardrails/
    ├── architecture-audit/
    ├── refactor-plan/
    ├── refactor/
    ├── code-documentation/
    ├── solution-review/
    ├── code-review/
    └── review-followup/
```

`.generated/` 由根目录 `scripts/generate-skills.mjs` 自动产生并被 Git 忽略，不是源码。

## 核心工程观

所有 Skill 共享以下默认基线：

- **Refactoring**：行为保持、小步修改、持续验证；
- **Clean Code**：清晰命名、单一职责、高内聚低耦合、显式副作用、减少重复知识；
- **Module-first**：优先按业务/能力模块组织，再在模块内部合理分层；
- **Layered Architecture**：明确 Domain / Application / Ports / Infrastructure / Interface / Composition 的职责与依赖方向；
- **Ports & Adapters**：数据库、LLM、搜索、文件系统、第三方 SDK 等技术细节停留在边界；
- **Strategy**：只用于真实存在的算法变化；
- **Plugin**：只用于可独立增加、移除、组合的扩展能力；
- **Structured Documentation**：README、AGENTS、ADR、索引与 Why / Invariant / Boundary / Tradeoff 注释共同服务人和 AI；
- **Evidence-based Verification**：没有新鲜验证证据，不宣称完成；
- **Anti-overengineering**：不为了“架构感”制造接口、Factory、Strategy、Plugin 或碎片化小文件。

优先级始终是：**用户明确要求 > 项目明确合同/规范 > 项目既有合理架构 > 本 Skill Group 默认原则**。

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

## 生成不同 AI 工具格式

在仓库根目录：

```bash
pnpm generate -- --group code-engineering
```

生成结果位于：

```text
skills-group/code-engineering/.generated/
├── codex/.agents/skills/<skill>/...
├── cursor/.cursor/skills/<skill>/...
├── gemini/.gemini/skills/<skill>/...
├── claude/.claude/skills/<skill>/...
├── kiro/.kiro/skills/<skill>/...
└── copilot/.github/skills/<skill>/...
```

源码中的共享 `references/` 不直接作为外部目录依赖。生成时，每个 Skill 都会得到一份自包含的：

```text
<skill>/
├── SKILL.md
└── references/
    └── _shared/
```

生成器会把源码中的 `../../references/...` 自动改写为 `./references/_shared/...`。这样生成后的 Skill 符合“Skill 目录自包含”的跨 Agent 使用方式，同时源码仍只维护一份共享工程原则。

## 迁移到现有项目

推荐直接从仓库根目录执行：

```bash
pnpm migrate
```

迁移器会：

1. 询问目标项目路径；
2. 选择 Skill Group；
3. 选择一个或多个 AI 工具格式；
4. 自动生成对应格式；
5. 检查目标项目同名文件冲突；
6. 合并到目标项目，保留无关文件；
7. 提醒你检查目标项目的 `git status` / `git diff`。

本 Skill Group 不提供一键自动执行整个工程生命周期的总控 Skill；高影响阶段应保留人工 Review Gate。
