import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class VerifyIdTokenService {
  /**
   * IDトークン確認・メールアドレス取得処理
   * @param idToken トークン
   * @return メールアドレス
   * @return refreshToken リフレッシュトークン
   */
  async execute(idToken: string): Promise<string | undefined> {
    try {
      const client = new OAuth2Client(
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
      )
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      return payload.email
    } catch (error) {
      Logger.debug(error)
      throw new UnauthorizedException('Google Loginに失敗しました。')
    }
  }
}
