import { Prisma } from '@prisma/client'
import { UsersRepositoryImpl } from '@/interfaces/repositories/users/users.repository-impl'

/** input */

/** updateRefreshToken */
export type UpdateRefreshTokenInputType = {
  email: string
  refreshToken: string
}

/** output */
const repositoryImpl = new UsersRepositoryImpl()

/** findUniqueUser */
const executeFindUniqueUser = () => repositoryImpl.findUniqueUser('')

export type FindUniqueUserOutputType = Prisma.PromiseReturnType<
  typeof executeFindUniqueUser
>

/** findManyUsers */
const executeFindManyUsers = () => repositoryImpl.findManyUsers({})

export type FindManyUsersOutputType = Prisma.PromiseReturnType<
  typeof executeFindManyUsers
>
