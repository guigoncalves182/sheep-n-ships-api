import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/nest/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL;
  const corsOrigin = isProduction
    ? frontendUrl || false
    : frontendUrl || 'http://localhost:3000';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
