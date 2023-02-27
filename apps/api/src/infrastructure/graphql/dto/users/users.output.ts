import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UsersOutput {
  @Field(() => Int, { nullable: false, description: '取得件数' })
  count: number

  @Field(() => [UserOutput], { nullable: false, description: 'ユーザー' })
  data: Array<UserOutput>
}
