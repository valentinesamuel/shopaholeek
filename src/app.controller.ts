import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    await this.appService.seed();
    // await this.appService.deleteEmployee(1);
    await this.appService.deleteContactInfo(1);
    return;
  }
}
