import { Injectable } from '@nestjs/common';
import { SheepRepository } from '../../data/repositories/sheep/sheep.repository';
import { IUserSheep } from '../../domain/sheep.interface';

interface IGetUserSheepsUseCase {
  execute(): Promise<IUserSheep[]>;
}

@Injectable()
export class GetUserSheepsUseCase implements IGetUserSheepsUseCase {
  constructor(private readonly sheepRepository: SheepRepository) {}

  async execute(): Promise<IUserSheep[]> {
    return await this.sheepRepository.getAllSheeps();
  }
}
