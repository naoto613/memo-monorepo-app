import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { Prisma } from '@prisma/client'

/**
 * テーブル初期化
 */
export const resetTable = async (): Promise<void> => {
  const transactions: Prisma.PrismaPromise<unknown>[] = []
  transactions.push(prismaInstance.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`)

  const tableNames = await prismaInstance.$queryRaw<
    { TABLE_NAME: string }[]
  >`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'test_database';`

  for (const { TABLE_NAME } of tableNames) {
    if (TABLE_NAME !== '_prisma_migrations') {
      transactions.push(
        prismaInstance.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`)
      )
    }
  }

  transactions.push(prismaInstance.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`)

  await prismaInstance.$transaction(transactions)
}
