import { Logger } from '@nestjs/common'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'
import { UserFactoryArgsType } from '@/infrastructure/prisma/factories/users/user-factory-args.type'

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

const main = async () => {
  Logger.log('Start seeding ...')

  await createUsers()

  Logger.log('Seeding finished.')
}

main().catch((e) => {
  Logger.error(e)
  process.exit(1)
})
