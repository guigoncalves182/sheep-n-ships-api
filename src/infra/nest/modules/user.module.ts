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
import { CreateSheepOrderUseCase } from '../../../usecases/create-sheep-order/create-sheep-order.usecase';
import { CurrencyRepository } from '../../../data/repositories/currency/currency.repository';
import { OrderRepository } from '../../../data/repositories/order/order.repository';
import { AuthModule } from './auth.module';

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
    CreateSheepOrderUseCase,
  ],
})
export class UserModule {}
