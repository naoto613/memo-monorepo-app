import { CreateMemoUseCase } from '@/application/use-cases/memos/create-memo.use-case'
import { FindMemosUseCase } from '@/application/use-cases/memos/find-memos.use-case'
import { SearchMemosInput } from '@/infrastructure/graphql/dto/memos/search-memos.input'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MemosOutput } from '@/infrastructure/graphql/dto/memos/memos.output'
import { DeleteMemosUseCase } from '@/application/use-cases/memos/delete-memos.use-case'
import { CreateMemoInput } from '../../../infrastructure/graphql/dto/memos/create-memo.input'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'

@Resolver()
export class MemosResolver {
  constructor(
    private readonly findMemosUseCase: FindMemosUseCase,
    private readonly createMemoUseCase: CreateMemoUseCase,
    private readonly deleteMemosUseCase: DeleteMemosUseCase
  ) {}

  @Query(() => MemosOutput, {
    nullable: false,
    description: 'メモ一覧取得',
  })
  async memos(@Args() args: SearchMemosInput): Promise<MemosOutput> {
    return this.findMemosUseCase.execute(args)
  }

  @Mutation(() => MemosOutput, { description: 'メモ作成' })
  async createMemo(@Args() args: CreateMemoInput, @Context() context) {
    const user: UserOutput = context.req.user

    await this.createMemoUseCase.execute({
      content: args.data.content,
      email: user.email,
    })
    return {}
  }

  @Mutation(() => MemosOutput, { description: 'メモ削除' })
  async deleteMemos() {
    await this.deleteMemosUseCase.execute()
    return {}
  }
}
