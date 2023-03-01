import { MemoCreateWithoutUserInput } from '@/infrastructure/prisma/@generated/memo/memo-create-without-user.input'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'

/**
 * ユーザー情報を除いたメモのファクトリー生成インプット
 * @param args オプション引数
 */
export const getMemoDataWithoutUserInput = (
  args?: MemoFactoryArgsType
): Required<MemoCreateWithoutUserInput> => {
  return {
    content: 'メモです',
    createdAt: undefined,
    updatedAt: undefined,
    ...args,
  }
}
