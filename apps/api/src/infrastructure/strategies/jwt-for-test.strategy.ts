import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-custom'

@Injectable()
export class JwtForTestStrategy extends PassportStrategy(
  Strategy,
  'jwt-for-test'
) {
  constructor(private readonly repository: UsersRepository) {
    super()
  }

  /**
   * 権限が必要なユーザーを認証する場合はemailを設定する必要がある
   * 権限によるテストを行わない場合はemailを設定しなければパスする
   *
   * @param req リクエスト
   * @return ユーザー情報
   */
  public async validate(req: Request): Promise<UserOutput | null> {
    // cookieからemailを取得
    const email = req.cookies.testEmail

    // emailを設定していない場合はダミーユーザーを返す
    if (!email) {
      const dummyUser: UserOutput = {
        id: 1000,
        name: 'ダミー 太郎',
        email: 'dummytaro@example.com',
        isAdmin: false,
        refreshToken: '',
        isValid: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return dummyUser
    }

    const user = await this.repository.findUniqueUser(email)

    // ユーザーが登録されていない場合はエラー
    if (!user) {
      throw new Error(
        'ユーザーが取得できません。処理前にユーザーの作成をして下さい。'
      )
    }

    return user
  }
}
