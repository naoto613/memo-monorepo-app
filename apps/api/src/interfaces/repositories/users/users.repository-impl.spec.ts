import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { resetTable } from '@/utils/test-helper/reset-table'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { UsersRepositoryModule } from '@/infrastructure/ioc/domain/repositories/users.repository.module'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'
import { UserCreateManyInput } from '@/infrastructure/prisma/@generated/user/user-create-many.input'

describe('UsersRepositoryImpl', () => {
  let repository: UsersRepository

  beforeEach(async () => {
    await resetTable()
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersRepositoryModule],
    }).compile()

    repository = module.get<UsersRepository>(UsersRepository)
  })

  describe('upsertUser', () => {
    it('should create a new user', async () => {
      const args: UserCreateManyInput = {
        id: 0,
        name: 'テスト 太郎',
        email: 'test@example.com',
        isAdmin: false,
      }
      // 実行
      await repository.upsertUser(args)

      const savedUser = await prismaInstance.user.findMany()

      expect(savedUser).toMatchObject([
        {
          id: 1,
          name: 'テスト 太郎',
          email: 'test@example.com',
          isAdmin: false,
        },
      ])
    })

    it('should update user', async () => {
      const user: UserFactoryArgsType = {
        email: 'test-sample@example.com',
        name: 'テスト 次郎',
        isAdmin: true,
        isValid: false,
      }
      await callUserFactory(user)

      const args: UserCreateManyInput = {
        id: 1,
        name: 'テスト 太郎',
        email: 'test@example.com',
        isAdmin: false,
        isValid: true,
      }

      // 実行
      await repository.upsertUser(args)

      const savedUser = await prismaInstance.user.findMany()

      expect(savedUser).toMatchObject([
        {
          id: 1,
          name: 'テスト 太郎',
          email: 'test@example.com',
          isAdmin: false,
          isValid: true,
        },
      ])
    })
  })

  describe('updateRefreshToken', () => {
    it('should update refreshToken', async () => {
      const user: UserFactoryArgsType = {
        name: 'テスト 太郎',
        email: 'test@example.com',
        isAdmin: true,
        refreshToken: 'token',
        isValid: true,
      }
      await callUserFactory(user)

      const args = { email: 'test@example.com', refreshToken: 'updatedToken' }

      // 実行
      await repository.updateRefreshToken(args)

      const savedUser = await prismaInstance.user.findMany()

      expect(savedUser).toMatchObject([
        {
          name: 'テスト 太郎',
          email: 'test@example.com',
          isAdmin: true,
          refreshToken: 'updatedToken',
          isValid: true,
        },
      ])
    })
  })

  describe('findUniqueUser', () => {
    const usersData: UserFactoryArgsType[] = [
      {
        name: 'テスト 一郎',
        email: 'test1@example.com',
        refreshToken: 'token1',
      },
      {
        name: 'テスト 二郎',
        email: 'test2@example.com',
        refreshToken: 'token2',
      },
    ]

    beforeEach(async () => {
      for (const user of usersData) {
        await callUserFactory(user)
      }
    })

    it('should get user by email', async () => {
      const user = await repository.findUniqueUser('test2@example.com')

      expect(user).toMatchObject({
        name: 'テスト 二郎',
        email: 'test2@example.com',
        refreshToken: 'token2',
      })
    })

    it('should not get users by Incorrect email', async () => {
      const uniqueUser = await repository.findUniqueUser('test')

      expect(uniqueUser).toEqual(null)
    })
  })

  describe('findManyUsers', () => {
    const expectedUserData: UserFactoryArgsType[] = [
      {
        name: 'テスト 一郎',
        email: 'test1@example.com',
        isAdmin: true,
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
      {
        name: '田中 四郎',
        email: 'tanaka4@example.com',
        isAdmin: true,
      },
      {
        name: '山本 五郎',
        email: 'yamamoto5@example.com',
        isAdmin: false,
      },
    ]

    beforeEach(async () => {
      for (const user of expectedUserData) {
        await callUserFactory(user)
      }
    })

    it('should get all users order by email', async () => {
      const { count, data } = await repository.findManyUsers({})

      expect(count).toEqual(5)
      expect(data.length).toEqual(5)
      expect(data[0].email).toEqual('tanaka3@example.com')
      expect(data[1].email).toEqual('tanaka4@example.com')
      expect(data[2].email).toEqual('test1@example.com')
      expect(data[3].email).toEqual('test2@example.com')
      expect(data[4].email).toEqual('yamamoto5@example.com')
    })

    it('should get determinate users by limit and offset', async () => {
      const { count, data } = await repository.findManyUsers({
        limit: 3,
        offset: 1,
      })

      expect(count).toEqual(5)
      expect(data.length).toEqual(3)
      expect(data[0].email).toEqual('tanaka4@example.com')
      expect(data[1].email).toEqual('test1@example.com')
      expect(data[2].email).toEqual('test2@example.com')
    })

    it('should get users by emails', async () => {
      const { count, data } = await repository.findManyUsers({
        searchConditions: {
          email: 'test',
        },
      })

      expect(count).toEqual(2)
      expect(data[0].email).toEqual('test1@example.com')
      expect(data[1].email).toEqual('test2@example.com')
    })

    it('should get users by name', async () => {
      const { count, data } = await repository.findManyUsers({
        searchConditions: { name: '田中' },
      })

      expect(count).toEqual(2)
      expect(data[0].email).toEqual('tanaka3@example.com')
      expect(data[1].email).toEqual('tanaka4@example.com')
    })
  })
})
