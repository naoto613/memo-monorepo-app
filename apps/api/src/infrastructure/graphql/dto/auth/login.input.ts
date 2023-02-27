import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class LoginInput {
  @Field(() => String, { nullable: false })
  idToken: string
}
