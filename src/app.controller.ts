import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  async getHello(): Promise<any> {
    return 'Hiii';
  }
}
