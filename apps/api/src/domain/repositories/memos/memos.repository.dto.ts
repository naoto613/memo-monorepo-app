import { Prisma } from '@prisma/client'
import { MemosRepositoryImpl } from '@/interfaces/repositories/memos/memos.repository-impl'

/** output */
const repositoryImpl = new MemosRepositoryImpl()

/** findManyMemos */
const executeFindManyMemos = () => repositoryImpl.findManyMemos({})

export type FindManyMemosOutputType = Prisma.PromiseReturnType<
  typeof executeFindManyMemos
>
