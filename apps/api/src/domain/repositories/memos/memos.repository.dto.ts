import { Prisma } from '@prisma/client'
import { MemosRepositoryImpl } from '@/interfaces/repositories/memos/memos.repository-impl'

/** input */

/** createMemo */
export type CreateMemoInputType = {
  email: string
  content: string
}

/** output */
const repositoryImpl = new MemosRepositoryImpl()

/** findManyMemos */
const executeFindManyMemos = () => repositoryImpl.findManyMemos({})

export type FindManyMemosOutputType = Prisma.PromiseReturnType<
  typeof executeFindManyMemos
>
