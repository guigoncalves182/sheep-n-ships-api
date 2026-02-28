import type { IGoogleUserInfoGateway } from '../../../domain/gateways/google-user-info.gateway';
import { DecodeTokenService } from './decode-token.service';

describe('DecodeTokenService', () => {
  const fetchUserInfo = jest.fn();
  const gateway: IGoogleUserInfoGateway = {
    fetchUserInfo,
  };

  let service: DecodeTokenService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DecodeTokenService(gateway);
  });

  it('should decode token by mapping gateway response fields', async () => {
    fetchUserInfo.mockResolvedValue({
      id: 'google-id',
      email: 'user@email.com',
      verified_mail: true,
      name: 'Test User',
      given_name: 'Test',
      family_name: 'User',
      picture: 'https://image',
    });

    const result = await service.execute('token-123');

    expect(fetchUserInfo).toHaveBeenCalledWith('token-123');
    expect(result).toEqual({
      id: 'google-id',
      email: 'user@email.com',
      verifiedMail: true,
      name: 'Test User',
      givenName: 'Test',
      familyName: 'User',
      picture: 'https://image',
    });
  });
});
