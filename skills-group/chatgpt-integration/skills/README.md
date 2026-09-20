# ChatGPT Integration Skills

本目录保存 ChatGPT 与本地/私有环境集成相关的可分发 Skill 源码。

共享连接、安全与 Secure MCP Tunnel 原则位于同级 `../references/`。

| Skill | 用途 |
| --- | --- |
| `local-workspace` | 将本地项目代码与文档以只读方式接入普通 ChatGPT，并结合 Web Search 做调研、架构分析与方案设计 |

职责边界：

```text
chatgpt-integration
→ 如何让 ChatGPT 安全获得私有上下文

code-engineering
→ 获得上下文之后如何分析、设计、Review、重构和实现
```

二者可以组合使用，但不存在固定依赖关系。
