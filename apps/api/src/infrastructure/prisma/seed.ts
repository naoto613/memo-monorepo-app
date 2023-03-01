import { Logger } from '@nestjs/common'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'
import { callMemoFactory } from '@/infrastructure/prisma/factories/memos/call-memo-factory'
import { MemoFactoryArgsType } from '@/infrastructure/prisma/factories/memos/memo-factory-args.type'

// User
const createUsers = async () => {
  const userSeedData: UserFactoryArgsType[] = [
    {
      name: 'テスト 一郎',
      email: 'test1@example.com',
      isAdmin: true,
    },
    {
      name: 'テスト 二郎',
      email: 'test2@example.com',
    },
    {
      name: 'テスト 三郎',
      email: 'test3@example.com',
    },
  ]

  Logger.log('User作成開始')
  for (const userSeed of userSeedData) {
    await callUserFactory(userSeed)
  }
  Logger.log('User作成完了')
}

const createMemos = async () => {
  const memoSeedData: MemoFactoryArgsType[] = [
    {
      content: '歯を磨く',
      user: { email: 'test1@example.com' },
    },
    {
      content: 'ご飯を食べる',
      user: { email: 'test2@example.com' },
    },
    {
      content: '寝る',
      user: { email: 'test3@example.com' },
    },
    {
      content: '遊ぶ',
      user: { email: 'test3@example.com' },
    },
  ]

  Logger.log('Memo作成開始')
  for (const memoSeed of memoSeedData) {
    await callMemoFactory(memoSeed)
  }
  Logger.log('Memo作成完了')
}

const main = async () => {
  Logger.log('Start seeding ...')

  await createUsers()
  await createMemos()

  Logger.log('Seeding finished.')
}

main().catch((e) => {
  Logger.error(e)
  process.exit(1)
})
