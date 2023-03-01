import { MemoCreateInput } from '@/infrastructure/prisma/@generated/memo/memo-create.input'
import { getMemoDataWithoutUserInput } from '@/infrastructure/prisma/factories/memos/get-memo-data-without-user-input'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'
import { getUserDataInput } from '@/infrastructure/prisma/factories/users/get-user-data-input'

/**
 * メモ情報のファクトリー生成インプット
 * @param args オプション引数
 */
export const getMemoDataInput = (
  args?: MemoFactoryArgsType
): Required<MemoCreateInput> => {
  return {
    ...getMemoDataWithoutUserInput(args),
    user: {
      connectOrCreate: {
        create: getUserDataInput(args?.user),
        where: {
          email: args?.user?.email ?? 'test@example.com',
        },
      },
    },
  }
}
