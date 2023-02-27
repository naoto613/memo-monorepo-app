import { GetTokenService } from '@/domain/services/users/get-token.service'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Module({
  providers: [GetTokenService, JwtService],
  exports: [GetTokenService],
})
export class GetTokenServiceModule {}
