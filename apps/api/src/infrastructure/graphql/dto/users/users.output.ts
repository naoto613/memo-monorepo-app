import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { Field, Int, ObjectType, PickType } from '@nestjs/graphql'

@ObjectType()
class DataForUserOutput extends PickType(UserOutput, [
  'email',
  'name',
] as const) {}

@ObjectType()
export class UsersOutput {
  @Field(() => Int, { nullable: false, description: '取得件数' })
  count: number

  @Field(() => [DataForUserOutput], {
    nullable: false,
    description: 'ユーザー',
  })
  data: Array<DataForUserOutput>
}
