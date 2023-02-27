import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UpdateUserInput } from '@/infrastructure/graphql/dto/users/update-user.input'
import { Injectable } from '@nestjs/common'
@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly repository: UsersRepository) {}

  /**
   * ユーザー修正
   * @param args ユーザー情報
   */
  async execute(args: UpdateUserInput) {
    const updateInput = {
      ...args.data,
      id: args.id,
      // 論理削除したデータを再度登録する場合にも対応できるようにisValidをtrueにする
      isValid: true,
    }
    await this.repository.upsertUser(updateInput)
  }
}
