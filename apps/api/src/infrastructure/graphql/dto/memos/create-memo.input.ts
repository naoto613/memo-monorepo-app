import { ArgsType, Field, InputType, PickType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import * as Validator from 'class-validator'

@InputType()
class MemoInput {
  @Field(() => String, { nullable: false })
  @Validator.IsEmail()
  email!: string

  @Field(() => String, { nullable: false })
  @Validator.IsNotEmpty()
  content!: string
}

@ArgsType()
export class CreateMemoInput {
  @Field(() => MemoInput, { nullable: false })
  @Type(() => MemoInput)
  @ValidateNested()
  data!: MemoInput
}
