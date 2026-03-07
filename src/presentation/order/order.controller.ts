import { Controller, Headers, Param, Post } from '@nestjs/common';
import { IUserSheep } from '../../domain/sheep.interface';
import { ClaimSheep } from '../../usecases/claim-sheep/claim-sheep.usecase';

@Controller('order')
export class OrderController {
  constructor(private readonly claimSheep: ClaimSheep) {}

  @Post('claim/sheep/:orderId')
  async claim(
    @Headers('authorization') authorization: string,
    @Param('orderId') orderId: string,
  ): Promise<IUserSheep> {
    const token = authorization?.replace('Bearer ', '');
    const sheep = await this.claimSheep.execute(token, orderId);

    return sheep;
  }
}
