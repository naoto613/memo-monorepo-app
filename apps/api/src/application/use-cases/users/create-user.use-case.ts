import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { CreateOneUserArgs } from '@/infrastructure/prisma/@generated/user/create-one-user.args'
import { Injectable } from '@nestjs/common'
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: UsersRepository) {}

  /**
   * ユーザー作成
   * @param args ユーザー情報
   */
  async execute(args: CreateOneUserArgs) {
    await this.repository.upsertUser({
      ...args.data,
      // upsertの条件句を設定するために存在しないIDの0を指定する
      id: 0,
    })
  }
}
