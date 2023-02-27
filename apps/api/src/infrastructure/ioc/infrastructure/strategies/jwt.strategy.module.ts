import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { JwtStrategy } from '@/infrastructure/strategies/jwt.strategy'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class JwtStrategyModule {}
