import { Memo } from '@/infrastructure/prisma/@generated/memo/memo.model'
import { User } from '@/infrastructure/prisma/@generated/user/user.model'
import { Field, Int, ObjectType, PickType } from '@nestjs/graphql'

@ObjectType()
class UserForMemoOutput extends PickType(User, ['name'] as const) {}

@ObjectType()
class DataForMemoOutput extends PickType(Memo, ['content'] as const) {
  @Field(() => UserForMemoOutput, { nullable: false })
  user?: UserForMemoOutput
}

@ObjectType()
export class MemosOutput {
  @Field(() => Int, { nullable: false, description: '取得件数' })
  count: number

  @Field(() => [DataForMemoOutput], {
    nullable: false,
    description: 'メモ',
  })
  data: Array<DataForMemoOutput>
}
