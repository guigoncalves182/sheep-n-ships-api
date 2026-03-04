import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Sheep } from '../../schemas/sheep.schema';
import { ERarity, IUserSheep } from '../../../domain/sheep.interface';

interface ICreateSheepParams {
  rarity: ERarity;
  hitPoint: number;
  attack: number;
  defense: number;
  speed: number;
  evasion: number;
  accuracy: number;
  userId: string;
}

@Injectable()
export class SheepRepository {
  constructor(
    @InjectModel(Sheep.name)
    private readonly sheepModel: Model<Sheep>,
  ) {}

  async getUserSheeps(userId: string): Promise<IUserSheep[]> {
    const sheeps = await this.sheepModel
      .find({ userId })
      .lean<IUserSheep[]>()
      .exec();

    return sheeps;
  }

  async getAllSheeps(): Promise<IUserSheep[]> {
    const sheeps = await this.sheepModel.find({}).lean<IUserSheep[]>().exec();

    return sheeps;
  }

  async createSheep(
    createSheepParams: ICreateSheepParams,
    session?: ClientSession,
  ): Promise<IUserSheep> {
    const [sheep] = await this.sheepModel.create([createSheepParams], {
      session,
    });

    return sheep;
  }
}
