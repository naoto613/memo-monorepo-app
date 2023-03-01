import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { SearchMemosInput } from '@/infrastructure/graphql/dto/memos/search-memos.input'
import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { Injectable } from '@nestjs/common'
import { CreateMemoInput } from '@/infrastructure/graphql/dto/memos/create-memo.input'

@Injectable()
export class MemosRepositoryImpl implements MemosRepository {
  async createMemo(args: CreateMemoInput) {
    const { content, email } = args.data

    await prismaInstance.memo.create({
      data: { content, user: { connect: { email } } },
    })
  }

  async deleteManyMemos(ids?: number[]) {
    await prismaInstance.memo.deleteMany({
      where: { id: { in: ids } },
    })
  }

  async findManyMemos(args: SearchMemosInput) {
    const { searchConditions, offset, limit } = args

    // 条件句を設定
    const where = {
      content: { contains: searchConditions?.content },
    }

    // 合計件数を取得
    const count = await prismaInstance.memo.count({
      where,
    })

    // DBからデータを取得
    const data = await prismaInstance.memo.findMany({
      skip: offset,
      take: limit,
      where,
      include: {
        user: true,
      },
    })

    return {
      count,
      data,
    }
  }
}
