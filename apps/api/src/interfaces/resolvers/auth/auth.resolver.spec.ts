import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { resetTable } from '@/utils/test-helper/reset-table'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { initializeIntegrationTest } from '@/utils/test-helper/initialize-integration-test'
import { VerifyIdTokenService } from '@/domain/services/users/verify-id-token.service'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@/infrastructure/ioc/app.module'
import { UpdateOneUserArgs } from '@/infrastructure/prisma/@generated/user/update-one-user.args'
import {
  GraphQLErrorExtensionsType,
  GraphQLErrorType,
} from '@/types/errors/graphql-error.type'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'

describe('Auth', () => {
  let app: INestApplication
  let verifyIdTokenService: VerifyIdTokenService

  // テスト用email
  const testUserEmail = 'test@example.com'

  beforeEach(async () => {
    await resetTable()
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    app = await initializeIntegrationTest(app)

    verifyIdTokenService =
      module.get<VerifyIdTokenService>(VerifyIdTokenService)
  })

  afterEach(async () => {
    await app.close()
  })

  // それぞれの処理で利用するためここで定義
  const loginQuery = {
    query: `
      mutation {
        login(
          idToken: "12345ABCDE"
        )
        {
          refreshToken
          user {
            email
            name
          }
        }
      }
    `,
  }

  const tokenRegenerationQuery = {
    query: `
      mutation {
        tokenRegeneration {
          refreshToken
          user {
            email
            name
          }
        }
      }
    `,
  }

  describe('login', () => {
    it('success when registered user', async () => {
      // idTokenの検証処理をmock
      jest
        .spyOn(verifyIdTokenService, 'execute')
        .mockImplementation(() => Promise.resolve(testUserEmail))

      // 事前にユーザーを登録
      await callUserFactory({
        email: testUserEmail,
        name: 'テスト 太郎',
      })

      return request(app.getHttpServer())
        .post('/graphql')
        .send(loginQuery)
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          // アクセストークンがcookieに保存されていること
          expect(
            res
              .get('Set-Cookie')[0]
              .split(';')[0]
              .startsWith('atlasAccessToken=')
          ).toEqual(true)

          // リフレッシュトークンとユーザーがbodyに返却されていること
          expect(res.body.data.login).toStrictEqual({
            refreshToken: expect.anything(),
            user: {
              name: 'テスト 太郎',
              email: 'test@example.com',
            },
          })

          // リフレッシュトークンがDBに保存されていること
          const user = await prismaInstance.user.findUnique({
            where: { email: testUserEmail },
          })

          expect(res.body.data.login.refreshToken).toEqual(user.refreshToken)
        })
    })

    it('failed when not registered user', async () => {
      // idTokenの検証処理をmock
      jest
        .spyOn(verifyIdTokenService, 'execute')
        .mockImplementation(() => Promise.resolve(testUserEmail))

      // ユーザーの登録を行わずにログインを実行
      return request(app.getHttpServer())
        .post('/graphql')
        .send(loginQuery)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
          const errorExtensions: GraphQLErrorExtensionsType =
            jsonResponse.errors[0].extensions

          expect(errorExtensions.code).toEqual('UNAUTHENTICATED')
          expect(errorExtensions.response.error).toEqual('Unauthorized')
          expect(errorExtensions.response.message).toEqual(
            'ユーザーが登録されていません。'
          )
          expect(errorExtensions.response.statusCode).toEqual(
            HttpStatus.UNAUTHORIZED
          )
        })
    })
  })

  describe('tokenRegeneration', () => {
    it('success when valid refresh token', async () => {
      // idTokenの検証処理をmock
      jest
        .spyOn(verifyIdTokenService, 'execute')
        .mockImplementation(() => Promise.resolve(testUserEmail))

      // 事前にユーザーを登録
      await callUserFactory({
        email: testUserEmail,
        name: 'テスト 太郎',
      })

      // ログインを実行
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send(loginQuery)

      const accessToken = loginResponse.get('Set-Cookie')[0].split(';')[0]
      const refreshToken = loginResponse.body.data.login.refreshToken

      // リフレッシュトークン再発行までに時間を空けないと同じ値が返却されるため
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${refreshToken}`)
        .send(tokenRegenerationQuery)
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          const updatedAccessToken = res.get('Set-Cookie')[0].split(';')[0]

          // アクセストークンがcookieに保存されていること
          expect(updatedAccessToken.startsWith('atlasAccessToken=')).toEqual(
            true
          )
          // アクセストークンが更新されていること
          expect(updatedAccessToken).not.toEqual(accessToken)

          // リフレッシュトークンとユーザーがbodyに返却されていること
          expect(res.body.data.tokenRegeneration).toStrictEqual({
            refreshToken: expect.anything(),
            user: {
              name: 'テスト 太郎',
              email: 'test@example.com',
            },
          })
          const updatedRefreshToken =
            res.body.data.tokenRegeneration.refreshToken
          // リフレッシュトークンが更新されていること
          expect(updatedRefreshToken).not.toEqual(refreshToken)

          // 更新されたリフレッシュトークンがDBに保存されていること
          const user = await prismaInstance.user.findUnique({
            where: { email: testUserEmail },
          })
          expect(updatedRefreshToken).toEqual(user.refreshToken)
        })
    })

    it('failed when refresh token was invalid', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer 12345`)
        .send(tokenRegenerationQuery)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
          const errorExtensions: GraphQLErrorExtensionsType =
            jsonResponse.errors[0].extensions

          expect(errorExtensions.code).toEqual('UNAUTHENTICATED')
          expect(errorExtensions.response.message).toEqual('Unauthorized')
          expect(errorExtensions.response.statusCode).toEqual(
            HttpStatus.UNAUTHORIZED
          )
        })
    })

    it('failed when db refresh token was deleted', async () => {
      // idTokenの検証処理をmock
      jest
        .spyOn(verifyIdTokenService, 'execute')
        .mockImplementation(() => Promise.resolve(testUserEmail))

      // 事前にユーザーを登録
      await callUserFactory({
        email: testUserEmail,
        name: 'テスト 太郎',
      })

      // ログインを実行
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send(loginQuery)

      const refreshToken = loginResponse.body.data.login.refreshToken

      // DBのリフレッシュトークンをnullで更新
      const userUpdateArgs: UpdateOneUserArgs = {
        data: {
          refreshToken: '',
        },
        where: { email: testUserEmail },
      }
      await prismaInstance.user.update(userUpdateArgs)

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${refreshToken}`)
        .send(tokenRegenerationQuery)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
          const errorExtensions: GraphQLErrorExtensionsType =
            jsonResponse.errors[0].extensions

          expect(errorExtensions.code).toEqual('UNAUTHENTICATED')
          expect(errorExtensions.response.error).toEqual('Unauthorized')
          expect(errorExtensions.response.message).toEqual(
            'リフレッシュトークンが無効です。'
          )
          expect(errorExtensions.response.statusCode).toEqual(
            HttpStatus.UNAUTHORIZED
          )
        })
    })
  })

  describe('logout', () => {
    const logoutQuery = {
      query: `
        mutation {
          logout
        }
      `,
    }

    it('success', async () => {
      // idTokenの検証処理をmock
      jest
        .spyOn(verifyIdTokenService, 'execute')
        .mockImplementation(() => Promise.resolve(testUserEmail))

      // 事前にユーザーを登録
      await callUserFactory({
        email: testUserEmail,
        name: 'テスト 太郎',
      })

      // ログインを実行
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send(loginQuery)

      const refreshToken = loginResponse.body.data.login.refreshToken

      return request(app.getHttpServer())
        .post('/graphql')
        .send(logoutQuery)
        .set('Cookie', [`testEmail= "${testUserEmail}"`]) // 対象のユーザーを特定するために設定
        .expect(HttpStatus.OK)
        .expect(async (res) => {
          // アクセストークンがcookieから削除されていること
          expect(res.get('Set-Cookie')[0].split(';')[0]).toEqual(
            'atlasAccessToken='
          )

          // trueがbodyに返却されていること
          expect(res.body.data.logout).toEqual(true)
        })
        .then(() =>
          request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${refreshToken}`)
            .send(tokenRegenerationQuery)
            .expect(HttpStatus.OK)
            .expect((res) => {
              // リフレッシュトークンによる再発行ができないこと
              const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
              const errorExtensions: GraphQLErrorExtensionsType =
                jsonResponse.errors[0].extensions

              expect(errorExtensions.code).toEqual('UNAUTHENTICATED')
            })
        )
    })
  })
})
