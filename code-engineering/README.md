# Code Engineering Skill Group

一组面向真实代码项目的通用 AI Coding Skills。目标不是把所有项目改造成同一种架构，而是让 AI 在明确工程边界内完成：**建立规范 → 项目分析 → 方案制定 → 实施与验证**，并通过独立 Review 系统控制质量。

## 核心工程观

默认参考：

- Refactoring：行为保持、小步修改、持续验证；
- Clean Code：清晰命名、单一职责、高内聚低耦合、显式副作用、减少重复知识；
- Module-first：优先按业务/能力模块组织，再在模块内部合理分层；
- Layered Architecture：明确 Domain / Application / Ports / Infrastructure / Interface / Composition 的职责和依赖方向；
- Ports & Adapters：数据库、LLM、搜索、文件系统、第三方 SDK 等技术细节停留在边界；
- Strategy：用于同一职责存在真实算法变化的场景；
- Plugin：用于可独立增加、移除、组合的扩展能力；
- Structured Documentation：README、AGENTS、ADR、索引与结构化注释共同服务人和 AI；
- Evidence-based Verification：没有新鲜验证证据，不宣称完成；
- Anti-overengineering：模式服务于真实变化和边界，不为了“架构感”制造抽象。

完整基线见 [`references/`](./references/)。优先级始终是：**用户明确要求 > 项目明确合同/规范 > 项目既有合理架构 > 本 Skill Group 默认原则**。

## 四阶段主流程

| 阶段 | Skill | 用途 | 默认权限 | 典型输出 |
| --- | --- | --- | --- | --- |
| 1. 建立规范 | `$project-guardrails` | 建立/审计项目的 AI 开发规范、架构边界、验证和文档约束 | 可修改工程规范；不改业务行为 | Project Engineering Profile / AGENTS / 规则建议 |
| 2. 项目分析 | `$architecture-audit <scope>` | 对 repo / package / app / module 做功能图谱、架构图谱和问题诊断 | 只读代码；可写审计 artifact | Architecture Audit |
| 3. 方案制定 | `$refactor-plan <scope-or-audit>` | 把审计结果转为可执行 Refactor Units，并绑定回归方案 | 不改业务代码 | Refactor Plan |
| 4. 实施与验证 | `$refactor <approved-unit>` | 按已批准 Unit 小步实施并持续验证 | 可改代码 | Diff + Verification Evidence |

`$code-documentation <scope>` 是支撑能力：当结构、边界、关键约束或公开 Contract 发生变化时，同步注释、README、ADR 与索引。

## 独立 Review 子系统

Review 是横向能力，不属于“重构专用流程”。需求、Feature、Bugfix、架构设计和重构都可以复用。

| Skill | 审查对象 | 核心问题 | 默认行为 |
| --- | --- | --- | --- |
| `$solution-review <artifact>` | PRD、Spec、Feature/Bugfix 方案、架构方案、Refactor Plan | “准备这样做是否合理、完整、可实施？” | 只审查，输出 Review Report |
| `$code-review <scope>` | commit / PR / diff / path / implementation | “实际实现是否正确、符合方案和工程规范？” | 只审查，输出 Review Report |
| `$review-followup <report>` | 任意 Review Report | “Finding 是否成立？成立如何最小修复，不成立如何驳回？” | 验证 Finding 后修改方案或代码并回归 |

**0 findings 是合法结果。** Review 不得为了显得有价值而制造问题。

## 推荐调用顺序

### A. 重构

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

### B. 普通需求 / Feature

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

### C. Bugfix

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

本 Skill Group **不提供一键自动串行执行整个生命周期的总控 Skill**。推荐每个高影响阶段完成后由人 Review，再显式调用下一 Skill。前序 artifact 是后序输入，不依赖聊天历史维持事实。

## Artifact 默认约定

若目标项目已经有 Requirements / Specs / Reviews / ADR 等目录，优先沿用项目约定。若没有，可使用：

```text
.engineering/
├── audits/
├── plans/
└── reviews/
```

具体协议见 [`references/artifact-protocol.md`](./references/artifact-protocol.md)。

## 目录

```text
code-engineering/
├── README.md
├── references/
├── guardrails/project-guardrails/
├── analysis/architecture-audit/
├── planning/refactor-plan/
├── implementation/refactor/
├── implementation/code-documentation/
└── review/
    ├── solution-review/
    ├── code-review/
    └── review-followup/
```

> 这是源码组织结构。不同 Agent 的 Skill discovery 规则可能不同；安装/链接到目标 Agent 时，应确保每个叶子 Skill 的 `SKILL.md` 能被发现，同时保持其对本组 `references/` 的访问。
