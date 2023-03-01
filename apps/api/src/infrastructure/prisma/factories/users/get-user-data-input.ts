import { UserCreateInput } from '@/infrastructure/prisma/@generated/user/user-create.input'
import { getMemoDataWithoutUserInput } from '@/infrastructure/prisma/factories/memos/get-memo-data-without-user-input'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'

/**
 * ユーザー情報のファクトリー生成インプット
 * @param args オプション引数
 */
export const getUserDataInput = (
  args?: UserFactoryArgsType
): Required<UserCreateInput> => {
  const memoObjects = args?.memos?.map((memo) =>
    getMemoDataWithoutUserInput(memo)
  )

  const memos = memoObjects && {
    create: memoObjects,
  }

  const relationalTables = {
    memos,
  }

  return {
    email: 'test@example.com',
    name: 'テスト 太郎',
    isAdmin: false,
    refreshToken: null,
    isValid: true,
    createdAt: undefined,
    updatedAt: undefined,
    ...args,
    ...relationalTables,
  }
}
