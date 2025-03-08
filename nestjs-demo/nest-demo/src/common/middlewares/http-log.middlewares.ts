import { NestMiddleware } from "@nestjs/common";

//面向对象编程思想 - 抽象interface ->class -> 实现
// 函数式编程思想 - 函数作为一等公民,纯函数、函数组合，高阶函数、科里化
// 面向切面编程思想 - 装饰器、代理、中间件
// 插件化编程思想 - 渐渐、扩展、可插拔，插件协议、插件底座、插件生命周期
//本质是对象
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
    
  
}