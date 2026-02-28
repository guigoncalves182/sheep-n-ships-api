import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Currency,
  CURRENCY_SCHEMA,
} from '../../../data/schemas/currency.schema';
import { UserController } from '../../../presentation/user/user.controller';
import { GetUserCurrencyUseCase } from '../../../usecases/get-user-currency.usecase';
import { UserRepository } from '../../../data/repositories/user.repository';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CURRENCY_SCHEMA },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserRepository, GetUserCurrencyUseCase],
  exports: [GetUserCurrencyUseCase],
})
export class UserModule {}
