import { CreateMemoUseCase } from '@/application/use-cases/memos/create-memo.use-case'
import { MemosRepositoryModule } from '@/infrastructure/ioc/domain/repositories/memos.repository.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [MemosRepositoryModule],
  providers: [CreateMemoUseCase],
  exports: [CreateMemoUseCase],
})
export class CreateMemoUseCaseModule {}
