import { Controller, Get } from '@nestjs/common';

@Controller()
export class SystemController {
  private readonly startedAt = new Date();
  private readonly environment = process.env.NODE_ENV || 'development';

  @Get()
  getStatus() {
    return {
      status: 'ok',
      environment: this.environment,
      startedAt: this.startedAt.toISOString(),
    };
  }
}
