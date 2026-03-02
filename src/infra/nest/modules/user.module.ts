import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Currency,
  CURRENCY_SCHEMA,
} from '../../../data/schemas/currency.schema';
import { UserController } from '../../../presentation/user/user.controller';
import { GetUserCurrencyUseCase } from '../../../usecases/get-user-currency/get-user-currency.usecase';
import { AuthModule } from './auth.module';
import { CurrencyRepository } from 'src/data/repositories/currency/currency.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CURRENCY_SCHEMA },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [CurrencyRepository, GetUserCurrencyUseCase],
  exports: [GetUserCurrencyUseCase],
})
export class UserModule {}
