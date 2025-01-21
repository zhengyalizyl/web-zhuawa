# 多种主流LLM的集成封装

目标：封装集成多家LLM模型，基于openai的标准进行输入输出

- .vscode
 - settinging
 - extensions
- doc/docs 
 - vue:vitepress vuepress
 - react:dumi  docusaurus
- samples / tests
  
eol end of line lf crlf
package.json

- type
   - commonjs module
 - main
 - types
 - sideEffects & shims


背景：AI的接入LLM交互
技术选型：
1. chatgpt model 文本交互
2. chatgpt -> 其他llm形式，统一标准方便后续开发迭代
   
 - > 通过交互回答的方式，封装了一套AI智能对话系统（最佳实践）
 - > 基于openai代码导入导出为标准，统一封装了包含主流LLM(xxx)在内的SDK，能够做到多模型的统一


技术实现（最佳实战）
1. monorepo multirepo
2. 前端
   1. 基于chatGPT社区内的SDk的双模型版本为基础，支持多模型切换，支持openai key及accessToken的接入
   2. 保留回话上下文，基于parentId，在每次会话创建时关联上次的id节点，保证会话上下文的连贯性
   3. 流式会话：基于event-stream,通过服务端持续下发会话内容，实现流失渲染，并且通过AbortContorller实现异常流式状态兼容
   4. 基于pinia,针对不同（模块）创建单独的逻辑管理，通过hooks的方式，提供访问权限的控制及主题色、布局xxx
   5. 基于naiv-ui,实现i18n以及全局组件的注入与函数式的引用
   6. 基于dot env实现通用配置的抽离
   7. 基于axios,封装interceptor，实现接口发送&返回大的出入参一致
   8. tailwind组件模块
   9. 业务hooks
   10. router permission
3. 后端
   1. 基于express实现接口的统一封装，转发与调用
   2. 基于openai的标准，创建多个模型的sdk，支持后续统一接入
   3. 基于请求封装middleware，实现会话token的校验与单ip节点最大调用次数的限制

结果：




