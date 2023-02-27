import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { SearchUsersInput } from '@/infrastructure/graphql/dto/users/search-users.input'
import { UsersOutput } from '@/infrastructure/graphql/dto/users/users.output'
import { Injectable } from '@nestjs/common'

/**
 * ユーザー一覧取得
 * @param args 検索条件・offset・limit
 * @return data ユーザー一覧情報
 * @return count 合計件数
 */
@Injectable()
export class FindUsersUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(args: SearchUsersInput): Promise<UsersOutput> {
    return this.repository.findManyUsers(args)
  }
}
