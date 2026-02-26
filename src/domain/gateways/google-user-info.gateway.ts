import type { IGoogleUserInfoResponse } from '../decode-tokens.interface';

export interface IGoogleUserInfoGateway {
  fetchUserInfo(token: string): Promise<IGoogleUserInfoResponse>;
}

export const GOOGLE_USER_INFO_GATEWAY = Symbol('GOOGLE_USER_INFO_GATEWAY');
