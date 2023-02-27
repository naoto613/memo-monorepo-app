import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { SearchUsersInput } from '@/infrastructure/graphql/dto/users/search-users.input'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { Injectable } from '@nestjs/common'
import { UserCreateManyInput } from '@/infrastructure/prisma/@generated/user/user-create-many.input'
import { UpdateRefreshTokenInputType } from '@/domain/repositories/users/users.repository.dto'

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  async upsertUser(args: UserCreateManyInput) {
    const { id, ...createItems } = args

    await prismaInstance.user.upsert({
      where: {
        id,
      },
      update: args,
      create: createItems,
    })
  }

  async updateRefreshToken({
    email,
    refreshToken,
  }: UpdateRefreshTokenInputType) {
    await prismaInstance.user.update({
      data: { refreshToken },
      where: { email },
    })
  }

  async findUniqueUser(email: string) {
    return prismaInstance.user.findFirst({ where: { email, isValid: true } })
  }

  async findManyUsers(args: SearchUsersInput) {
    const { searchConditions, offset, limit } = args

    // 条件句を設定
    const where = {
      email: { contains: searchConditions?.email },
      name: { contains: searchConditions?.name },
      isValid: true,
    }

    // 合計件数を取得
    const count = await prismaInstance.user.count({
      where,
    })

    // DBからデータを取得
    const data = await prismaInstance.user.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        email: 'asc',
      },
    })

    return {
      count,
      data,
    }
  }
}
