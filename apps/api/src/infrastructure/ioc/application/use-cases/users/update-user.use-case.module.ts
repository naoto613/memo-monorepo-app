import { UpdateUserUseCase } from '@/application/use-cases/users/update-user.use-case'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersRepositoryModule],
  providers: [UpdateUserUseCase],
  exports: [UpdateUserUseCase],
})
export class UpdateUserUseCaseModule {}
