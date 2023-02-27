import { JwtPayloadType } from '@/types/auth/jwt-payload.type'
import { TokensType } from '@/types/auth/tokens.type'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class GetTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * トークン取得
   * @param メールアドレス
   * @return accessToken アクセストークン
   * @return refreshToken リフレッシュトークン
   */
  async execute(email: string): Promise<TokensType> {
    const payload: JwtPayloadType = {
      email,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1d',
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
