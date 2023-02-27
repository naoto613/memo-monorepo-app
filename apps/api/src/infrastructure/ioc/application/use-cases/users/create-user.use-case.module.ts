import { CreateUserUseCase } from '@/application/use-cases/users/create-user.use-case'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class CreateUserUseCaseModule {}
