import { Module } from '@nestjs/common';
import { AuthController } from '../../../presentation/auth/auth.controller';
import { DecodeToken } from '../../../app/services/decode-token.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [DecodeToken],
  exports: [DecodeToken],
})
export class AuthModule {}
