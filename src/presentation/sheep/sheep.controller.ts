import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { IUserSheep } from '../../domain/sheep.interface';
import { ClaimSheep } from '../../usecases/claim-sheep/claim-sheep.usecase';
import { GetUserSheepsUseCase } from '../../usecases/get-user-sheeps/get-user-sheeps.usecase';

@Controller('sheep')
export class SheepController {
  constructor(
    private readonly claimSheep: ClaimSheep,
    private readonly getUserSheepsUseCase: GetUserSheepsUseCase,
  ) {}

  @Get()
  async getUserSheeps(
    @Headers('authorization') authorization: string,
  ): Promise<IUserSheep[]> {
    const token = authorization?.replace('Bearer ', '');
    return await this.getUserSheepsUseCase.execute(token);
  }

  @Post('claim/:orderId')
  async claim(
    @Headers('authorization') authorization: string,
    @Param('orderId') orderId: string,
  ): Promise<IUserSheep> {
    const token = authorization?.replace('Bearer ', '');
    const sheep = await this.claimSheep.execute(token, orderId);

    return sheep;
  }
}
