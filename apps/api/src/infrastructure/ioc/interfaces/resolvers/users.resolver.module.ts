import { CreateUserUseCaseModule } from '@/infrastructure/ioc/application/use-cases/users/create-user.use-case.module'
import { FindUsersUseCaseModule } from '@/infrastructure/ioc/application/use-cases/users/find-users.use-case.module'
import { UpdateUserUseCaseModule } from '@/infrastructure/ioc/application/use-cases/users/update-user.use-case.module'
import { AuthResolverModule } from '@/infrastructure/ioc/interfaces/resolvers/auth.resolver.module'
import { UsersResolver } from '@/interfaces/resolvers/users/users.resolver'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CreateUserUseCaseModule,
    UpdateUserUseCaseModule,
    FindUsersUseCaseModule,
  ],
  providers: [UsersResolver, AuthResolverModule],
})
export class UsersResolverModule {}
