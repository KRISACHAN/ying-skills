# Code Engineering Skills

本目录只保存可分发的 Skill 源码。共享工程原则位于同级 `../references/`。

| Skill | 用途 |
| --- | --- |
| `project-guardrails` | 建立/审计项目工程规范与 AI 开发约束 |
| `architecture-audit` | 建立功能/架构图谱并诊断结构问题 |
| `refactor-plan` | 生成行为保持式重构计划与回归方案 |
| `refactor` | 执行一个已批准 Refactor Unit 并验证 |
| `code-documentation` | 同步结构化注释、README、ADR 与索引 |
| `solution-review` | 审查 PRD/Spec/技术方案/重构方案 |
| `code-review` | 审查实际代码实现与验证缺口 |
| `review-followup` | 验证并处理 Review Findings |

推荐重构顺序：

```text
project-guardrails
  → architecture-audit
  → refactor-plan
  → solution-review
  → refactor
  → code-documentation（按需）
  → code-review
  → review-followup（按需）
```

真正安装到目标项目时不要直接复制本目录，请在仓库根目录执行 `pnpm migrate`，或先用 `pnpm generate` 生成对应 AI 工具的目录格式。
