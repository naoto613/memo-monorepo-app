import { MemosRepository } from '@/domain/repositories/memos/memos.repository'
import { MemosRepositoryImpl } from '@/interfaces/repositories/memos/memos.repository-impl'
import { Module } from '@nestjs/common'

const providers = [{ provide: MemosRepository, useClass: MemosRepositoryImpl }]

@Module({
  providers,
  exports: providers.map((v) => v.provide),
})
export class MemosRepositoryModule {}
