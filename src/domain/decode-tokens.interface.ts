export interface IUserInfo {
  id: string;
  email: string;
  verifiedMail: boolean;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
}

export interface IGoogleUserInfoResponse {
  id: string;
  email: string;
  verified_mail: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}
