import { Memo } from '@/infrastructure/prisma/@generated/memo/memo.model'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'

/** メモ情報のファクトリー生成時オプショナル引数の型 */
export type MemoFactoryArgsType = Partial<
  Omit<Memo, 'email' | 'user' | '_count'>
> & {
  user?: UserFactoryArgsType
}
