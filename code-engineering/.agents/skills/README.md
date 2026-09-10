# Code Engineering Skills — 项目内调用索引

本目录由 `ying-skills/code-engineering` 复制而来。Skill 正文位于各自子目录，公共工程标准位于 `../references/`。

## 推荐顺序

### 重构

```text
$project-guardrails
  ↓ 人工 Review
$architecture-audit <scope>
  ↓ 人工 Review
$refactor-plan <audit-or-scope>
  ↓
$solution-review <plan>
  ↓ 人工 Review
$refactor <approved RF unit>
  ↓
$code-documentation <scope>   # 按需
  ↓
$code-review <scope>
  ↓
PASS → Next Unit
FAIL → $review-followup <report> → $code-review
```

### 普通需求

```text
PRD / Spec / Technical Plan
  ↓
$solution-review <artifact>
  ↓ 人工 Review
Implementation
  ↓
$code-review <scope>
  ↓
PASS / $review-followup
```

## Skills

| Skill | 用途 |
| --- | --- |
| `project-guardrails` | 建立/审计项目工程规范、AI 规则、架构边界、验证和文档索引 |
| `architecture-audit` | 对 repo/package/app/module 做只读功能与架构审计 |
| `refactor-plan` | 把已确认问题转成可执行 Refactor Units 与回归计划 |
| `refactor` | 只实施已批准的 Refactor Unit，并持续验证 |
| `code-documentation` | 同步 Why/Invariant/Boundary/Tradeoff 注释、README、ADR 和索引 |
| `solution-review` | 审 PRD/Spec/Feature/Bugfix/架构/重构方案 |
| `code-review` | 审已实现代码、架构、Clean Code、验证缺口与文档漂移 |
| `review-followup` | 独立验证 Finding，成立则最小修复，不成立则带证据驳回 |

## 原则

- 项目明确规范优先于本组默认工程观。
- Refactoring 保持行为、小步推进、持续验证。
- Clean Code 不等于机械行数限制。
- Module-first + 分层 + Ports/Adapters 是默认启发式，不强制改写成熟项目架构。
- Strategy 只解决真实算法变化；Plugin 只解决真实可插拔扩展。
- Review 允许 `0 findings`。
- 没有新鲜验证证据，不宣称完成。

公共参考：`../references/`。
