import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class SearchConditionsForSearchMemosInput {
  @Field(() => String, { nullable: true })
  content?: string
}

@ArgsType()
export class SearchMemosInput {
  @Field(() => SearchConditionsForSearchMemosInput, { nullable: true })
  searchConditions?: SearchConditionsForSearchMemosInput

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
