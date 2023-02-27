import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { JwtPayloadType } from '@/types/auth/jwt-payload.type'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private readonly repository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // refresh token検証時はheaderから取得
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    })
  }

  /**
   * リフレッシュトークンによるバリデーション
   * @param payload jwtペイロード
   * @return ユーザー情報
   */
  async validate(payload: JwtPayloadType): Promise<UserOutput | null> {
    const user = await this.repository.findUniqueUser(payload.email)

    if (!user) {
      throw new UnauthorizedException('リフレッシュトークンが無効です。')
    }

    return user
  }
}
