import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { JwtRefreshStrategy } from '@/infrastructure/strategies/jwt-refresh.strategy'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [JwtRefreshStrategy],
  exports: [JwtRefreshStrategy],
})
export class JwtRefreshStrategyModule {}
