# ChatGPT Integration Skills

本目录保存 ChatGPT 与本地/私有环境集成相关的可分发 Skill 源码。

共享连接、安全与 Secure MCP Tunnel 原则位于同级 `../references/`。

| Skill | 用途 |
| --- | --- |
| `local-workspace` | 将本地项目代码与文档接入普通 ChatGPT；默认只读，用户明确要求且客户端支持时可切换为读写，并结合 Web Search 做调研、架构分析、方案设计或有限文件修改 |

职责边界：

```text
chatgpt-integration
→ 如何让 ChatGPT 安全获得私有上下文，以及如何控制只读 / 读写访问模式

code-engineering
→ 获得上下文之后如何分析、设计、Review、重构和实现
```

二者可以组合使用，但不存在固定依赖关系。

权限原则：

- 默认只读；
- 写权限必须显式开启；
- 开启写权限不能扩大 Workspace Root；
- 删除、移动、批量替换等高风险写操作不应自动批准。
