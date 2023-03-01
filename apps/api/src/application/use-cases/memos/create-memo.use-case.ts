import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { CreateMemoInput } from '@/infrastructure/graphql/dto/memos/create-memo.input'
import { Injectable } from '@nestjs/common'
@Injectable()
export class CreateMemoUseCase {
  constructor(private readonly repository: MemosRepository) {}

  /**
   * メモ作成
   * @param args メモ情報
   */
  async execute(args: CreateMemoInput) {
    await this.repository.createMemo(args)
  }
}
