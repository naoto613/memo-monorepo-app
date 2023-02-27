import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { JwtForTestStrategy } from '@/infrastructure/strategies/jwt-for-test.strategy'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [JwtForTestStrategy],
  exports: [JwtForTestStrategy],
})
export class JwtForTestStrategyModule {}
