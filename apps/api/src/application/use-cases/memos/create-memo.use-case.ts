import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { CreateMemoInputType } from '@/domain/repositories/memos/memos.repository.dto'
import { Injectable } from '@nestjs/common'
@Injectable()
export class CreateMemoUseCase {
  constructor(private readonly repository: MemosRepository) {}

  /**
   * メモ作成
   * @param args メモ情報
   */
  async execute(args: CreateMemoInputType) {
    await this.repository.createMemo(args)
  }
}
