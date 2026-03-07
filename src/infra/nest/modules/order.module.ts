import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerateSheepService } from '../../../app/services/generate-sheep/generate-sheep.service';
import { OrderRepository } from '../../../data/repositories/order/order.repository';
import { Order, ORDER_SCHEMA } from '../../../data/schemas/order.schema';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { Sheep, SHEEP_SCHEMA } from '../../../data/schemas/sheep.schema';
import { OrderController } from '../../../presentation/order/order.controller';
import { ClaimSheep } from '../../../usecases/claim-sheep/claim-sheep.usecase';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: ORDER_SCHEMA },
      { name: Sheep.name, schema: SHEEP_SCHEMA },
    ]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderRepository,
    SheepRepository,
    ClaimSheep,
    GenerateSheepService,
  ],
})
export class OrderModule {}
