import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LogoutUseCase {
  constructor(private readonly repository: UsersRepository) {}

  /**
   * ログアウト実行
   * フロントから受け取ったユーザー情報からDBのリフレッシュトークンを削除する
   * @param args ユーザー情報
   */
  async execute(args: UserOutput) {
    // リフレッシュトークンを削除
    await this.repository.updateRefreshToken({
      email: args.email,
      refreshToken: null,
    })
  }
}
