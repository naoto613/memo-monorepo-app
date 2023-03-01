import { Memo } from '@/infrastructure/prisma/@generated/memo/memo.model'
import { MemoCreateInput } from '@/infrastructure/prisma/@generated/memo/memo-create.input'
import { createFactory } from '@/infrastructure/prisma/factories/create-factory'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'
import { getMemoDataInput } from '@/infrastructure/prisma/factories/memos/get-memo-data-input'

const memoFactory = createFactory<MemoCreateInput, Memo>('memo')

/**
 * メモ情報のファクトリー生成
 * @param args オプション引数
 */
export const callMemoFactory = (args?: MemoFactoryArgsType) =>
  memoFactory.create(getMemoDataInput(args))
