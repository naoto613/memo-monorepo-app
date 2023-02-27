/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppModule } from '@/infrastructure/ioc/app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe()) // 全体でValidation Pipeを使用するため
  app.enableCors({ origin: process.env.CORS_URL, credentials: true }) // CookieにTokenを入れてフロントからもらうため
  app.use(cookieParser()) // CookieをRequestから読み込むため

  const port = process.env.API_PORT || '3000'
  await app.listen(port)

  Logger.log(
    `Application is running! GraphQL endpoint is "${process.env.NEXT_PUBLIC_API_URL}".`
  )
}

bootstrap()
