import { Inject, Injectable } from '@nestjs/common';
import type { IUserInfo } from '../../../domain/decode-tokens.interface';
import { GOOGLE_USER_INFO_GATEWAY } from '../../../domain/gateways/google-user-info.gateway';
import type { IGoogleUserInfoGateway } from '../../../domain/gateways/google-user-info.gateway';

interface IDecodeTokenService {
  execute(token: string): Promise<IUserInfo>;
}

@Injectable()
export class DecodeTokenService implements IDecodeTokenService {
  constructor(
    @Inject(GOOGLE_USER_INFO_GATEWAY)
    private readonly googleUserInfoGateway: IGoogleUserInfoGateway,
  ) {}

  async execute(token: string): Promise<IUserInfo> {
    const userInfo = await this.googleUserInfoGateway.fetchUserInfo(token);

    return {
      id: userInfo.id,
      email: userInfo.email,
      verifiedMail: userInfo.verified_mail,
      name: userInfo.name,
      givenName: userInfo.given_name,
      familyName: userInfo.family_name,
      picture: userInfo.picture,
    };
  }
}
