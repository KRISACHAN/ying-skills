# Code Engineering Skills

本目录只保存可分发的 Skill 源码。共享工程原则位于同级 `../references/`。

| Skill | 用途 |
| --- | --- |
| `project-guardrails` | 建立/审计项目工程规范与 AI 开发约束 |
| `architecture-audit` | 建立功能/架构图谱并诊断结构问题 |
| `refactor-plan` | 生成 Scope-level 重构计划、内部 Work Items 与回归策略 |
| `refactor` | 执行已批准 Scope 的重构并完成验证 |
| `code-documentation` | 同步结构化注释、README、ADR 与索引 |
| `solution-review` | 按需审查 PRD/Spec/技术方案/重构方案 |
| `code-review` | 按需审查实际代码实现与验证缺口 |
| `review-followup` | 按需验证并处理 Review Findings |

默认重构流程：

```text
project-guardrails          # 通常每项目一次
  → architecture-audit
  → refactor-plan
  → refactor
  → code-documentation（按需）
```

Review 不属于固定链路。用户可在任何需要独立第二意见或质量保证的位置显式调用：

```text
solution-review
code-review
review-followup
```

是否执行 Review / Followup、在哪个 Scope 执行、执行多少次，都由用户决定。

默认执行粒度是一个 package / app / module Scope。Plan 内可以包含多个 Work Items，但不要因为存在多个 Finding 就机械拆成多个 Refactor Units。只有职责、合同、回滚风险、验证策略或上下文规模形成真实独立边界时才继续拆 Scope。

真正安装到目标项目时不要直接复制本目录，请在仓库根目录执行 `pnpm migrate`，或先用 `pnpm generate` 生成对应 AI 工具的目录格式。
