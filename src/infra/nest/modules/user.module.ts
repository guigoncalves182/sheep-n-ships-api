import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Currency,
  CURRENCY_SCHEMA,
} from '../../../data/schemas/currency.schema';
import { Order, ORDER_SCHEMA } from '../../../data/schemas/order.schema';
import { UserController } from '../../../presentation/user/user.controller';
import { GetUserCurrencyUseCase } from '../../../usecases/get-user-currency/get-user-currency.usecase';
import { GetUserOrdersUseCase } from '../../../usecases/get-user-orders/get-user-orders.usecase';
import { AuthModule } from './auth.module';
import { CurrencyRepository } from 'src/data/repositories/currency/currency.repository';
import { OrderRepository } from 'src/data/repositories/order/order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CURRENCY_SCHEMA },
      { name: Order.name, schema: ORDER_SCHEMA },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    CurrencyRepository,
    OrderRepository,
    GetUserCurrencyUseCase,
    GetUserOrdersUseCase,
  ],
  exports: [GetUserCurrencyUseCase, GetUserOrdersUseCase],
})
export class UserModule {}
