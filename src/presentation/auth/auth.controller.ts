import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodeTokenService } from '../../app/services/decode-token.service';
import type { IUserInfo } from '../../domain/decode-tokens.interface';

/**
 * TODO: remover o endpoint e usar somente o decodeTokenService diretamente nos outros usecases
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly decodeTokenService: DecodeTokenService) {}

  @Get('decode-token')
  async decodeToken(
    @Headers('authorization') authorization: string,
  ): Promise<IUserInfo> {
    if (!authorization) throw new UnauthorizedException('Token não fornecido');

    const token = authorization.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Token inválido');

    return await this.decodeTokenService.execute(token);
  }
}
