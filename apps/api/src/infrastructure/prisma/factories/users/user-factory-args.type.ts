import { User } from '@/infrastructure/prisma/@generated/user/user.model'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'

/** ユーザー情報のファクトリー生成時オプショナル引数の型 */
export type UserFactoryArgsType = Partial<Omit<User, 'memos' | '_count'>> & {
  memos?: MemoFactoryArgsType[]
}
