import { FindUsersUseCase } from '@/application/use-cases/users/find-users.use-case'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { Module } from '@nestjs/common'
@Module({
  imports: [UsersRepositoryModule],
  providers: [FindUsersUseCase],
  exports: [FindUsersUseCase],
})
export class FindUsersUseCaseModule {}
