import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRepository } from '../../../data/repositories/order/order.repository';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { Order, ORDER_SCHEMA } from '../../../data/schemas/order.schema';
import { Sheep, SHEEP_SCHEMA } from '../../../data/schemas/sheep.schema';
import { SheepController } from '../../../presentation/sheep/sheep.controller';
import { ClaimSheep } from '../../../usecases/claim-sheep/claim-sheep.usecase';
import { GetUserSheepsUseCase } from '../../../usecases/get-user-sheeps/get-user-sheeps.usecase';
import { AuthModule } from './auth.module';
import { GenerateSheepService } from 'src/app/services/generate-sheep/generate-sheep.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sheep.name, schema: SHEEP_SCHEMA },
      { name: Order.name, schema: ORDER_SCHEMA },
    ]),
    AuthModule,
  ],
  controllers: [SheepController],
  providers: [
    SheepRepository,
    OrderRepository,
    ClaimSheep,
    GetUserSheepsUseCase,
    GenerateSheepService,
  ],
})
export class SheepModule {}
