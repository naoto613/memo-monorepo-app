import { INestApplication, ValidationPipe } from '@nestjs/common'
import cookieParser = require('cookie-parser')

/**
 * integration testの共通初期化処理
 * @param app アプリケーション
 */
export const initializeIntegrationTest = async (
  app: INestApplication
): Promise<INestApplication> => {
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({ origin: process.env.CORS_URL, credentials: true })
  app.use(cookieParser())
  await app.init()

  return app
}
