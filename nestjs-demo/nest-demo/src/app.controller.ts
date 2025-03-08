import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('info')
  getInfo(): string {
    //只负责请求处理转发，不负责具体业务逻辑
    return this.appService.getVersion()
  }
}
