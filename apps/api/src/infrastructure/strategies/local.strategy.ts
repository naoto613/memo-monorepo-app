import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { VerifyIdTokenService } from '@/domain/services/users/verify-id-token.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly repository: UsersRepository,
    private readonly verifyIdTokenService: VerifyIdTokenService
  ) {
    super({ usernameField: 'idToken', passwordField: 'dummy' })
  }

  /**
   * IDトークンによる登録ユーザーのバリデーション
   * @param idToken IDトークン
   * @return ユーザー情報
   */
  async validate(idToken: string): Promise<UserOutput> {
    // idTokenを検証・デコードしてemailを取得
    const email = await this.verifyIdTokenService.execute(idToken)

    // emailからユーザーを検索
    const user = await this.repository.findUniqueUser(email)

    // まだユーザーが登録されていない場合はエラー
    if (!user) {
      throw new UnauthorizedException('ユーザーが登録されていません。')
    }

    // context.userに該当のユーザーを渡す
    return user
  }
}
