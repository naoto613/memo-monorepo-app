import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { SearchMemosInput } from '@/infrastructure/graphql/dto/memos/search-memos.input'
import { MemosOutput } from '@/infrastructure/graphql/dto/memos/memos.output'
import { Injectable } from '@nestjs/common'

/**
 * メモ一覧取得
 * @param args 検索条件・offset・limit
 * @return data メモ一覧情報
 * @return count 合計件数
 */
@Injectable()
export class FindMemosUseCase {
  constructor(private readonly repository: MemosRepository) {}

  async execute(args: SearchMemosInput): Promise<MemosOutput> {
    return this.repository.findManyMemos(args)
  }
}
