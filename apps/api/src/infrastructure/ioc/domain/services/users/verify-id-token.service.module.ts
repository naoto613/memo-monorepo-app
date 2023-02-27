import { VerifyIdTokenService } from '@/domain/services/users/verify-id-token.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [VerifyIdTokenService],
  exports: [VerifyIdTokenService],
})
export class VerifyIdTokenServiceModule {}
