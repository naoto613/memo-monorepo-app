import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { VerifyIdTokenServiceModule } from '@/infrastructure/ioc/domain/services/users/verify-id-token.service.module'
import { LocalStrategy } from '@/infrastructure/strategies/local.strategy'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule, VerifyIdTokenServiceModule],
  providers: [LocalStrategy],
  exports: [LocalStrategy],
})
export class LocalStrategyModule {}
