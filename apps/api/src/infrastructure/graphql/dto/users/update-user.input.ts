import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UserCreateInput } from '@/infrastructure/prisma/@generated/user/user-create.input'

@ArgsType()
export class UpdateUserInput {
  @Field(() => UserCreateInput, { nullable: false })
  @Type(() => UserCreateInput)
  @ValidateNested()
  @Type(() => UserCreateInput)
  data: UserCreateInput

  @Field(() => Int, { nullable: false })
  id: number
}
