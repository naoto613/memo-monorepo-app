import { User } from '@/infrastructure/prisma/@generated/user/user.model'

/** ユーザー情報のファクトリー生成時オプショナル引数の型 */
export type UserFactoryArgsType = Partial<User>
