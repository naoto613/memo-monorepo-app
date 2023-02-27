import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { GetTokenService } from '@/domain/services/users/get-token.service'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { TokensType } from '@/types/auth/tokens.type'
import { Injectable, UnauthorizedException } from '@nestjs/common'

type ArgsType = {
  user: UserOutput
  refreshToken: string
}

@Injectable()
export class TokenRegenerationUseCase {
  constructor(
    private readonly getTokenService: GetTokenService,
    private readonly repository: UsersRepository
  ) {}

  /**
   * トークン再発行
   * フロントから受け取ったユーザー情報からトークンを取得しDBのリフレッシュトークンを更新する
   * @param args ユーザー情報
   * @return アクセストークン・リフレッシュトークン
   */
  async execute(args: ArgsType): Promise<TokensType> {
    // リフレッシュトークンの整合性を確認
    if (args.refreshToken !== args.user.refreshToken) {
      throw new UnauthorizedException('リフレッシュトークンが無効です。')
    }

    // トークン取得
    const tokens = await this.getTokenService.execute(args.user.email)

    // リフレッシュトークンの更新
    await this.repository.updateRefreshToken({
      email: args.user.email,
      refreshToken: tokens.refreshToken,
    })
    return tokens
  }
}
