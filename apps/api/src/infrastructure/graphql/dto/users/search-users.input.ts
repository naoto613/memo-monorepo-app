import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class SearchConditionsForSearchUsersInput {
  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  name?: string
}

@ArgsType()
export class SearchUsersInput {
  @Field(() => SearchConditionsForSearchUsersInput, { nullable: true })
  searchConditions?: SearchConditionsForSearchUsersInput

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
