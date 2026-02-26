import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodeTokenUseCase } from '../../usecases/decode-token.usecase';
import type { IUserInfo } from '../../domain/decode-tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly decodeTokenUseCase: DecodeTokenUseCase) {}

  @Get('decode-token')
  async decodeToken(
    @Headers('authorization') authorization: string,
  ): Promise<IUserInfo> {
    if (!authorization) throw new UnauthorizedException('Token não fornecido');

    const token = authorization.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Token inválido');

    return await this.decodeTokenUseCase.execute(token);
  }
}
