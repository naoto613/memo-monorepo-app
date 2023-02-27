import { User } from '@/infrastructure/prisma/@generated/user/user.model'
import { UserCreateInput } from '@/infrastructure/prisma/@generated/user/user-create.input'
import { createFactory } from '@/infrastructure/prisma/factories/create-factory'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'
import { getUserDataInput } from '@/infrastructure/prisma/factories/users/get-user-data-input'

const userFactory = createFactory<UserCreateInput, User>('user')

/**
 * ユーザー情報のファクトリー生成
 * @param args オプション引数
 */
export const callUserFactory = (args?: UserFactoryArgsType) =>
  userFactory.create(getUserDataInput(args))
