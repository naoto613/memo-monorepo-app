import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { GetTokenServiceModule } from '@/infrastructure/ioc/domain/services/users/get-token.service.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [GetTokenServiceModule, UsersRepositoryModule],
  providers: [LoginUseCase],
  exports: [LoginUseCase],
})
export class LoginUseCaseModule {}
