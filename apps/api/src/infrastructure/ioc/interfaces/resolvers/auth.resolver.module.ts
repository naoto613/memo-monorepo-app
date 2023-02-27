import { JwtForTestStrategyModule } from '@/infrastructure/ioc/infrastructure/strategies/jwt-for-test.strategy.module'
import { JwtRefreshStrategyModule } from '@/infrastructure/ioc/infrastructure/strategies/jwt-refresh.strategy.module'
import { JwtStrategyModule } from '@/infrastructure/ioc/infrastructure/strategies/jwt.strategy.module'
import { LocalStrategyModule } from '@/infrastructure/ioc/infrastructure/strategies/local.strategy.module'
import { LoginUseCaseModule } from '@/infrastructure/ioc/application/use-cases/auth/login.use-case.module'
import { LogoutUseCaseModule } from '@/infrastructure/ioc/application/use-cases/auth/logout.use-case.module'
import { TokenRegenerationUseCaseModule } from '@/infrastructure/ioc/application/use-cases/auth/token-regeneration.use-case.module'
import { AuthResolver } from '@/interfaces/resolvers/auth/auth.resolver'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    JwtStrategyModule,
    JwtForTestStrategyModule,
    JwtRefreshStrategyModule,
    LocalStrategyModule,
    LoginUseCaseModule,
    TokenRegenerationUseCaseModule,
    LogoutUseCaseModule,
  ],
  providers: [AuthResolver],
})
export class AuthResolverModule {}
