import { Controller, Get } from '@nestjs/common';

@Controller()
export class SystemController {
  private readonly startedAt = new Date();

  @Get()
  getStatus() {
    return {
      status: 'ok',
      startedAt: this.startedAt.toISOString(),
    };
  }
}
