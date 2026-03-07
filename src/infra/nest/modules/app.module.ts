import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { SystemController } from '../../../presentation/system/system.controller';
import { SheepModule } from './sheep.module';
import { OrderModule } from './order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING ?? ''),
    AuthModule,
    UserModule,
    SheepModule,
    OrderModule,
  ],
  controllers: [SystemController],
})
export class AppModule {}
