import { Injectable } from '@nestjs/common';
import { SheepRepository } from '../../data/repositories/sheep/sheep.repository';
import { IUserSheep } from '../../domain/sheep.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';

interface IGetUserSheepsUseCase {
  execute(token: string): Promise<IUserSheep[]>;
}

@Injectable()
export class GetUserSheepsUseCase implements IGetUserSheepsUseCase {
  constructor(
    private readonly sheepRepository: SheepRepository,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(token: string): Promise<IUserSheep[]> {
    const { id: userId } = await this.decodeTokenService.execute(token);
    return await this.sheepRepository.getUserSheeps(userId);
  }
}
