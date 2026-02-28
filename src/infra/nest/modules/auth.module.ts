import { Module } from '@nestjs/common';
import { GOOGLE_USER_INFO_GATEWAY } from '../../../domain/gateways/google-user-info.gateway';
import { GoogleUserInfoHttpGateway } from '../../google/google-user-info-http.gateway';
import { DecodeTokenService } from '../../../app/services/decode-token.service';

@Module({
  imports: [],
  providers: [
    GoogleUserInfoHttpGateway,
    {
      provide: GOOGLE_USER_INFO_GATEWAY,
      useExisting: GoogleUserInfoHttpGateway,
    },
    DecodeTokenService,
  ],
  exports: [DecodeTokenService],
})
export class AuthModule {}
