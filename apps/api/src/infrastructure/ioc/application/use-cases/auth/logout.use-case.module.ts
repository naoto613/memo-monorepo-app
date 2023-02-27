import { LogoutUseCase } from '@/application/use-cases/auth/logout.use-case'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [LogoutUseCase],
  exports: [LogoutUseCase],
})
export class LogoutUseCaseModule {}
