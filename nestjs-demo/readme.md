### nextjs

nextjs 参考的 spring boot、AOP、IOC

- typescript 完全提供类型安全支持
- 清晰地模块化设计理念
- 可插拔的生态，express、fastify、websocket、graphql （插件化设计思想、面向切面）

### nextjs核心概念

#### 模块

面向对象编程，万物皆对象，FP

万物皆**模块**

#### 控制器（Controller）MVC

控制前后端连接点，请求处理

#### 服务（Providers）

提供者提供个性化服务，包含数据库连接池、Kafka驱动、Clickhouse访问、redis处理、文件IO、邮件、定时任务
- 数据库，PgProvider、PgServerice
- KafkaClientProvider、KafkaClientService
  
### 中间件(Middleware，axios)

中间件是面向切面的，通过不改变原逻辑的方式，为系统提供一些个性化处理

- 系统日志，日志中间件
- 操作日志

#### 守卫（Guard）
  
一般用来做权限还有模块访问性处理

#### 过滤器（Filter）
一般用作异常处理

#### 拦截器(Interceptor)


### 架构设计一个复杂业务的后端服务，数据持久化设计这块有没有什么最佳实战经验

核心设计目标

- 高可用
- 高性能
- 拓展性
- 可维护性
- 数据安全

关键性设计问题

- 缓存，数据缓存,redis
- 数据库，关系型（mysql、Postgresql）、非关系型（mongodb、clickhouse）
- 日志数据库，数据量太大，log4js,elasticsearch 列式存储数据库
- 海量数据
- 实时数据流

并发

### 数据持久化选型

- Postgresql，业务数据
- Redis,秒杀、用户常规数、聊天过程数据
- clickhouse,用户埋点数据日志、性能监控日志、用户行为日志（Hadoop、Hive、HBase）
- kafka,消息队列，削峰

#### 数据库

Nestjs 数据库驱动

1. 准备pg环境，docker-compose
2. pg模块用来处理pg连接
3. 定义nestjs模块，用来处理业务逻辑