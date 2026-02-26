import { HttpException, HttpStatus } from '@nestjs/common';
import {
  IGoogleUserInfoResponse,
  IUserInfo,
} from 'src/domain/decode-tokens.interface';

export class DecodeToken {
  async execute(token: string): Promise<IUserInfo> {
    try {
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!userInfoResponse.ok)
        throw new HttpException(
          'Falha ao buscar informações do usuário',
          HttpStatus.UNAUTHORIZED,
        );

      const userInfo =
        (await userInfoResponse.json()) as IGoogleUserInfoResponse;

      return {
        id: userInfo.id,
        email: userInfo.email,
        verifiedMail: userInfo.verified_mail,
        name: userInfo.name,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        picture: userInfo.picture,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Falha ao validar token do Google',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
