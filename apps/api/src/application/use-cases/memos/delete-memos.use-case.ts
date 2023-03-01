import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteMemosUseCase {
  constructor(private readonly repository: MemosRepository) {}

  /**
   * メモ削除
   * @param ids ID
   */
  async execute(ids?: number[]) {
    await this.repository.deleteManyMemos(ids)
  }
}
