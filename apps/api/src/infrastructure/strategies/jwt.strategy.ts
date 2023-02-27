import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { JwtPayloadType } from '@/types/auth/jwt-payload.type'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly repository: UsersRepository) {
    super({
      jwtFromRequest: JwtStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    })
  }

  /**
   * アクセストークンによるバリデーション
   * @param payload jwtペイロード
   * @return ユーザー情報
   */
  async validate(payload: JwtPayloadType): Promise<UserOutput | null> {
    const user = await this.repository.findUniqueUser(payload.email)

    if (!user) {
      throw new UnauthorizedException('アクセストークンが無効です。')
    }

    return user
  }

  /**
   * cookieからアクセストークンを取得
   * @param req リクエスト
   * @returns アクセストークン
   */
  private static extractJWT(req: Request): string | null {
    return req.cookies && 'atlasAccessToken' in req.cookies
      ? req.cookies.atlasAccessToken
      : null
  }
}
