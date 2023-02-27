import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthUserOutput {
  @Field(() => String, { nullable: false, description: 'リフレッシュトークン' })
  refreshToken!: string

  @Field(() => UserOutput, {
    nullable: false,
    description: 'ユーザー',
  })
  user: UserOutput
}
