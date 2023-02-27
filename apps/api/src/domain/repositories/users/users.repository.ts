import { SearchUsersInput } from '@/infrastructure/graphql/dto/users/search-users.input'
import { UserCreateManyInput } from '@/infrastructure/prisma/@generated/user/user-create-many.input'
import {
  FindManyUsersOutputType,
  FindUniqueUserOutputType,
  UpdateRefreshTokenInputType,
} from '@/domain/repositories/users/users.repository.dto'

export abstract class UsersRepository {
  /**
   * ユーザー登録・更新
   * @param args ユーザー情報
   */
  abstract upsertUser(args: UserCreateManyInput): Promise<void>

  /**
   * リフレッシュトークン更新
   * @param args メールアドレス・リフレッシュトークン
   */
  abstract updateRefreshToken(args: UpdateRefreshTokenInputType): Promise<void>

  /**
   * 一意のユーザー取得
   * @param email メールアドレス
   * @return ユーザー情報
   */
  abstract findUniqueUser(email: string): Promise<FindUniqueUserOutputType>

  /**
   * ユーザー一覧取得
   * @param args 検索条件・offset・limit
   * @return data ユーザー一覧情報
   * @return count 合計件数
   */
  abstract findManyUsers(
    args: SearchUsersInput
  ): Promise<FindManyUsersOutputType>
}
