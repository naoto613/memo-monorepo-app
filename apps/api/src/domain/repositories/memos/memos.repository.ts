import { SearchMemosInput } from '@/infrastructure/graphql/dto/memos/search-memos.input'
import { FindManyMemosOutputType } from '@/domain/repositories/memos/memos.repository.dto'
import { CreateMemoInput } from '@/infrastructure/graphql/dto/memos/create-memo.input'

export abstract class MemosRepository {
  /**
   * メモ登録
   * @param args メモ情報
   */
  abstract createMemo(args: CreateMemoInput): Promise<void>

  /**
   * メモ削除
   * @param ids メモID
   */
  abstract deleteManyMemos(ids?: number[]): Promise<void>

  /**
   * メモ一覧取得
   * @param args 検索条件・offset・limit
   * @return data メモ一覧情報
   * @return count 合計件数
   */
  abstract findManyMemos(
    args: SearchMemosInput
  ): Promise<FindManyMemosOutputType>
}
