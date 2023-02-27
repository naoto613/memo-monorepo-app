import { User } from '@/infrastructure/prisma/@generated/user/user.model'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserOutput extends User {}
