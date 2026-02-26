import { Module } from '@nestjs/common';
import { AuthController } from '../../../presentation/auth/auth.controller';
import { GOOGLE_USER_INFO_GATEWAY } from '../../../domain/gateways/google-user-info.gateway';
import { GoogleUserInfoHttpGateway } from '../../google/google-user-info-http.gateway';
import { DecodeTokenUseCase } from '../../../usecases/decode-token.usecase';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    GoogleUserInfoHttpGateway,
    {
      provide: GOOGLE_USER_INFO_GATEWAY,
      useExisting: GoogleUserInfoHttpGateway,
    },
    DecodeTokenUseCase,
  ],
  exports: [DecodeTokenUseCase],
})
export class AuthModule {}
