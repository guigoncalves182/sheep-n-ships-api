import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { IGoogleUserInfoResponse } from '../../domain/decode-tokens.interface';
import type { IGoogleUserInfoGateway } from '../../domain/gateways/google-user-info.gateway';

@Injectable()
export class GoogleUserInfoHttpGateway implements IGoogleUserInfoGateway {
  async fetchUserInfo(token: string): Promise<IGoogleUserInfoResponse> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new UnauthorizedException('Token do Google inválido ou expirado');
      }

      return (await response.json()) as IGoogleUserInfoResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Falha ao validar token do Google');
    }
  }
}
