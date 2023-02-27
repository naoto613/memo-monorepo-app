import { UsersRepository } from '@/domain/repositories/users/users.repository'
import { UsersRepositoryImpl } from '@/interfaces/repositories/users/users.repository-impl'
import { Module } from '@nestjs/common'

const providers = [{ provide: UsersRepository, useClass: UsersRepositoryImpl }]

@Module({
  providers,
  exports: providers.map((v) => v.provide),
})
export class UsersRepositoryModule {}
