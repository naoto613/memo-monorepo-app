import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { resetTable } from '@/utils/test-helper/reset-table'
import { initializeIntegrationTest } from '@/utils/test-helper/initialize-integration-test'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@/infrastructure/ioc/app.module'
import {
  GraphQLErrorType,
  GraphQLErrorExtensionsType,
} from '@/types/errors/graphql-error.type'
import { authorityCheckTests } from '@/utils/test-helper/authority-check-tests'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'

describe('Users', () => {
  let app: INestApplication

  beforeEach(async () => {
    await resetTable()
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    app = await initializeIntegrationTest(app)
  })

  afterEach(async () => {
    await app.close()
  })

  describe('users', () => {
    const getQuery = {
      query: `
        query {
          users (
            searchConditions: {
              email: "test"
            }
            offset: 1
            limit: 3
          )
          {
            count
            data {
              email
              name
            }
          }
        }
      `,
    }

    describe('authority check', () => {
      it('success when permitted user management user executed', async () => {
        await authorityCheckTests.existsAuthority(app, getQuery, 'isAdmin')
      })

      it('failed when browsing only user executed', async () => {
        await authorityCheckTests.noAuthority(app, getQuery)
      })
    })

    describe('returned successfully', () => {
      it('should get users', async () => {
        const userData: UserFactoryArgsType[] = [
          {
            name: 'テスト 一郎',
            email: 'test1@example.com',
          },
          {
            name: 'テスト 二郎',
            email: 'test2@example.com',
            isAdmin: true,
          },
          {
            name: '田中 三郎',
            email: 'tanaka3@example.com',
            isAdmin: true,
          },
        ]

        for (const user of userData) {
          await callUserFactory(user)
        }

        return request(app.getHttpServer())
          .post('/graphql')
          .send(getQuery)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data.users).toStrictEqual({
              count: 2,
              data: [
                {
                  name: 'テスト 二郎',
                  email: 'test2@example.com',
                },
              ],
            })
          })
      })
    })
  })

  describe('createUser', () => {
    const createMutation = (email: string) => {
      return {
        query: `
        mutation {
          createUser(
            data: {
              email: "${email}",
              name: "テスト 一郎",
              isAdmin: true
            }
          ) {
            __typename
          }
        }
      `,
      }
    }

    const validEmail = 'test1@example.com'

    describe('authority check', () => {
      it('success when permitted user management user executed', async () => {
        await authorityCheckTests.existsAuthority(
          app,
          createMutation(validEmail),
          'isAdmin'
        )
      })

      it('failed when browsing only user executed', async () => {
        await authorityCheckTests.noAuthority(app, createMutation(validEmail))
      })
    })

    describe('returned successfully', () => {
      it('should create a new user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(createMutation(validEmail))
          .expect(HttpStatus.OK)
          .expect(async (res) => {
            expect(res.body.data.createUser).toStrictEqual({
              __typename: 'UsersOutput',
            })

            // ユーザーが登録されていることを確認
            const savedUser = await prismaInstance.user.findMany()

            expect(savedUser).toStrictEqual([
              {
                id: expect.anything(),
                email: 'test1@example.com',
                name: 'テスト 一郎',
                isAdmin: true,
                refreshToken: null,
                isValid: true,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              },
            ])
          })
      })
    })

    describe('validation error', () => {
      it('when email is not an email format, an error will occur', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(createMutation('test'))
          .expect(HttpStatus.OK)
          .expect((res) => {
            const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
            const errorExtensions: GraphQLErrorExtensionsType =
              jsonResponse.errors[0].extensions

            expect(errorExtensions.code).toEqual('BAD_USER_INPUT')
            expect(errorExtensions.response.error).toEqual('Bad Request')
            expect(errorExtensions.response.message).toStrictEqual([
              'data.email must be an email',
            ])
            expect(errorExtensions.response.statusCode).toEqual(
              HttpStatus.BAD_REQUEST
            )
          })
      })
    })
  })

  describe('updateUser', () => {
    const testUserEmail = 'test@example.com'

    beforeEach(async () => {
      await callUserFactory({
        email: testUserEmail,
        name: 'テスト 太郎',
        isAdmin: true,
      })
    })

    const updateMutation = (email: string) => {
      return {
        query: `
        mutation {
          updateUser(
            data: {
              email: "${email}"
              name: "テスト 一郎",
              isAdmin: false,
            },
            id: 1
          ) {
            __typename
          }
        }
      `,
      }
    }

    describe('authority check', () => {
      it('success when permitted user management  user executed', async () => {
        await authorityCheckTests.existsAuthority(
          app,
          updateMutation(testUserEmail),
          'isAdmin'
        )
      })

      it('failed when browsing only user executed', async () => {
        await authorityCheckTests.noAuthority(
          app,
          updateMutation(testUserEmail)
        )
      })
    })

    describe('returned successfully', () => {
      it('should update a user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(updateMutation(testUserEmail))
          .expect(HttpStatus.OK)
          .expect(async (res) => {
            expect(res.body.data.updateUser).toStrictEqual({
              __typename: 'UsersOutput',
            })

            // ユーザーが更新されていることを確認
            const savedUser = await prismaInstance.user.findMany()

            expect(savedUser).toStrictEqual([
              {
                id: 1,
                email: 'test@example.com',
                name: 'テスト 一郎',
                isAdmin: false,
                refreshToken: null,
                isValid: true,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              },
            ])
          })
      })
    })

    describe('validation error', () => {
      it('when email is not an email format, an error will occur', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(updateMutation('test'))
          .expect(HttpStatus.OK)
          .expect((res) => {
            const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
            const errorExtensions: GraphQLErrorExtensionsType =
              jsonResponse.errors[0].extensions

            expect(errorExtensions.code).toEqual('BAD_USER_INPUT')
            expect(errorExtensions.response.error).toEqual('Bad Request')
            expect(errorExtensions.response.message).toStrictEqual([
              'data.email must be an email',
            ])
            expect(errorExtensions.response.statusCode).toEqual(
              HttpStatus.BAD_REQUEST
            )
          })
      })
    })
  })
})
