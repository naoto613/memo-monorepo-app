import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { resetTable } from '@/utils/test-helper/reset-table'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { MemosRepositoryModule } from '@/infrastructure/ioc/domain/repositories/memos.repository.module'
import { callMemoFactory } from '@/infrastructure/prisma/factories/memos/call-memo-factory'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { CreateMemoInputType } from '@/domain/repositories/memos/memos.repository.dto'

describe('MemosRepositoryImpl', () => {
  let repository: MemosRepository

  beforeEach(async () => {
    await resetTable()
    const module: TestingModule = await Test.createTestingModule({
      imports: [MemosRepositoryModule],
    }).compile()

    repository = module.get<MemosRepository>(MemosRepository)
  })

  describe('createMemo', () => {
    it('should create a new memo', async () => {
      // 事前にユーザーを作成
      const user: UserFactoryArgsType = {
        email: 'test@example.com',
      }
      await callUserFactory(user)

      const args: CreateMemoInputType = {
        content: 'テストです',
        email: 'test@example.com',
      }
      // 実行
      await repository.createMemo(args)

      const savedMemo = await prismaInstance.memo.findMany()

      expect(savedMemo).toMatchObject([
        {
          content: 'テストです',
          email: 'test@example.com',
        },
      ])
    })
  })

  describe('deleteManyMemos', () => {
    const memoData: MemoFactoryArgsType[] = [
      {
        content: 'テスト1',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト2',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト3',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト4',
        user: { email: 'test@example.com' },
      },
    ]

    beforeEach(async () => {
      for (const memo of memoData) {
        await callMemoFactory(memo)
      }
    })

    it('should delete all memos', async () => {
      // 実行
      await repository.deleteManyMemos()

      const savedMemo = await prismaInstance.memo.findMany()

      expect(savedMemo.length).toEqual(0)
    })

    it('should delete selected memos', async () => {
      // 実行
      await repository.deleteManyMemos([1, 2])

      const savedMemos = await prismaInstance.memo.findMany()

      expect(savedMemos).toMatchObject([
        {
          content: 'テスト3',
        },
        {
          content: 'テスト4',
        },
      ])
    })
  })

  describe('findManyMemos', () => {
    const expectedMemoData: MemoFactoryArgsType[] = [
      {
        content: 'テスト1',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト2',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト3memo',
        user: { email: 'test@example.com' },
      },
      {
        content: 'テスト4memo',
        user: { email: 'test@example.com' },
      },
    ]

    beforeEach(async () => {
      for (const memo of expectedMemoData) {
        await callMemoFactory(memo)
      }
    })

    it('should get memo and user', async () => {
      const { count, data } = await repository.findManyMemos({
        searchConditions: { content: 'テスト1' },
      })

      expect(count).toEqual(1)
      expect(data).toMatchObject([
        {
          content: 'テスト1',
          user: {
            email: 'test@example.com',
          },
        },
      ])
    })

    it('should get determinate memos by limit and offset', async () => {
      const { count, data } = await repository.findManyMemos({
        limit: 2,
        offset: 1,
      })

      expect(count).toEqual(4)
      expect(data.length).toEqual(2)
      expect(data[0].content).toEqual('テスト2')
      expect(data[1].content).toEqual('テスト3memo')
    })

    it('should get memos by content', async () => {
      const { count, data } = await repository.findManyMemos({
        searchConditions: { content: 'memo' },
      })

      expect(count).toEqual(2)
      expect(data[0].content).toEqual('テスト3memo')
      expect(data[1].content).toEqual('テスト4memo')
    })
  })
})
