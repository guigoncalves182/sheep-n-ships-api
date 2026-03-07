import { Controller, Get, Headers } from '@nestjs/common';
import { IUserSheep } from '../../domain/sheep.interface';
import { GetUserSheepsUseCase } from '../../usecases/get-user-sheeps/get-user-sheeps.usecase';

@Controller('sheep')
export class SheepController {
  constructor(private readonly getUserSheepsUseCase: GetUserSheepsUseCase) {}

  @Get()
  async getUserSheeps(
    @Headers('authorization') authorization: string,
  ): Promise<IUserSheep[]> {
    const token = authorization?.replace('Bearer ', '');
    return await this.getUserSheepsUseCase.execute(token);
  }
}
