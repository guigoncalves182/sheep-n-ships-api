import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenerateSheepService } from 'src/app/services/generate-sheep/generate-sheep.service';
import { OrderRepository } from 'src/data/repositories/order/order.repository';
import { Order, ORDER_SCHEMA } from 'src/data/schemas/order.schema';
import { SheepRepository } from 'src/data/repositories/sheep/sheep.repository';
import { Sheep, SHEEP_SCHEMA } from 'src/data/schemas/sheep.schema';
import { OrderController } from 'src/presentation/order/order.controller';
import { ClaimSheep } from 'src/usecases/claim-sheep/claim-sheep.usecase';
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
