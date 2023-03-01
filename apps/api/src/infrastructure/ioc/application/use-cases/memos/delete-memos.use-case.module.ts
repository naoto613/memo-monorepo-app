import { DeleteMemosUseCase } from '@/application/use-cases/memos/delete-memos.use-case'
import { MemosRepositoryModule } from '@/infrastructure/ioc/domain/repositories/memos.repository.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [MemosRepositoryModule],
  providers: [DeleteMemosUseCase],
  exports: [DeleteMemosUseCase],
})
export class DeleteMemosUseCaseModule {}
