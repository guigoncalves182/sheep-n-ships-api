import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodeToken } from '../../app/services/decode-token.service';
import { IUserInfo } from 'src/domain/decode-tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: DecodeToken) {}

  @Get('decode-token')
  async decodeToken(
    @Headers('authorization') authorization: string,
  ): Promise<IUserInfo> {
    if (!authorization) throw new UnauthorizedException('Token não fornecido');

    const token = authorization.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Token inválido');

    try {
      return await this.authService.execute(token);
    } catch {
      throw new UnauthorizedException('Token do Google inválido ou expirado');
    }
  }
}
