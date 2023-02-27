import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { GetTokenService } from '@/domain/services/users/get-token.service'
import { TokensType } from '@/types/auth/tokens.type'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly getTokenService: GetTokenService,
    private readonly repository: UsersRepository
  ) {}

  /**
   * ログイン実行
   * フロントから受け取ったユーザー情報からトークンを取得しDBのリフレッシュトークンを更新する
   * @param args ユーザー情報
   * @return accessToken アクセストークン
   * @return refreshToken リフレッシュトークン
   */
  async execute(args: UserOutput): Promise<TokensType> {
    // トークン取得
    const tokens = await this.getTokenService.execute(args.email)

    // リフレッシュトークンの更新
    await this.repository.updateRefreshToken({
      email: args.email,
      refreshToken: tokens.refreshToken,
    })

    return tokens
  }
}
