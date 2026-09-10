# Review Subsystem

Review 是 `code-engineering` 的独立横向质量系统，不绑定重构。它同时适用于需求开发、Feature、Bugfix、架构调整、性能优化和重构。

## Skills

| Skill | 对象 | 问题 |
| --- | --- | --- |
| `$solution-review <artifact>` | PRD / Spec / 技术方案 / 架构方案 / Bugfix Plan / Refactor Plan | 准备这样做是否正确、完整、可实施？ |
| `$code-review <scope>` | commit / PR / diff / path / 实际实现 | 实际代码是否正确、符合方案、工程规范和验证要求？ |
| `$review-followup <report>` | 任意 Review Report | 每条 Finding 是否成立？应修复、部分采纳还是驳回？ |

## 流程

```text
Solution Artifact
  ↓ solution-review
PASS → Implementation
FAIL → review-followup → solution-review

Implementation
  ↓ code-review
PASS → Done
FAIL → review-followup → code-review
```

原则：

- Review 默认只审查，不修改被审对象；
- `review-followup` 才负责在验证 Finding 后进行修复；
- Finding 必须有证据和影响，不允许为了“有 Review 价值”强行找问题；
- 0 findings 是合法结果；
- Followup 可以把 Finding 判定为 `Valid / Partially Valid / Invalid / Obsolete`；
- Review 报告应保留历史，不静默覆盖上一轮。
