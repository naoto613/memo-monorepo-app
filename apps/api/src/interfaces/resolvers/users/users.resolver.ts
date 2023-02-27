import { CreateUserUseCase } from '@/application/use-cases/users/create-user.use-case'
import { UpdateUserUseCase } from '@/application/use-cases/users/update-user.use-case'
import { FindUsersUseCase } from '@/application/use-cases/users/find-users.use-case'
import { SearchUsersInput } from '@/infrastructure/graphql/dto/users/search-users.input'
import { AcceptAuthorities } from '@/infrastructure/decorators/metadata/accept-authorities'
import { CreateOneUserArgs } from '@/infrastructure/prisma/@generated/user/create-one-user.args'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UpdateUserInput } from '@/infrastructure/graphql/dto/users/update-user.input'
import { UsersOutput } from '@/infrastructure/graphql/dto/users/users.output'

@Resolver()
export class UsersResolver {
  constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  @Query(() => UsersOutput, {
    nullable: false,
    description: 'ユーザー一覧取得',
  })
  @AcceptAuthorities('isAdmin')
  async users(@Args() args: SearchUsersInput): Promise<UsersOutput> {
    return this.findUsersUseCase.execute(args)
  }

  @Mutation(() => UsersOutput, { description: 'ユーザー作成' })
  @AcceptAuthorities('isAdmin')
  async createUser(@Args() args: CreateOneUserArgs) {
    await this.createUserUseCase.execute(args)
    return {}
  }

  @Mutation(() => UsersOutput, { description: 'ユーザー修正' })
  @AcceptAuthorities('isAdmin')
  async updateUser(@Args() args: UpdateUserInput) {
    await this.updateUserUseCase.execute(args)
    return {}
  }
}
