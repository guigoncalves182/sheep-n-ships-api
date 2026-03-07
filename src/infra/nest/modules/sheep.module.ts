import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { Sheep, SHEEP_SCHEMA } from '../../../data/schemas/sheep.schema';
import { SheepController } from '../../../presentation/sheep/sheep.controller';
import { GetUserSheepsUseCase } from '../../../usecases/get-user-sheeps/get-user-sheeps.usecase';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sheep.name, schema: SHEEP_SCHEMA }]),
    AuthModule,
  ],
  controllers: [SheepController],
  providers: [SheepRepository, GetUserSheepsUseCase],
})
export class SheepModule {}
