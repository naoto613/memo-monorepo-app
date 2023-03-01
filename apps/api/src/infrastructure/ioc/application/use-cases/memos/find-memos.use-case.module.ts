import { FindMemosUseCase } from '@/application/use-cases/memos/find-memos.use-case'
import { MemosRepositoryModule } from '@/infrastructure/ioc/domain/repositories/memos.repository.module'
import { Module } from '@nestjs/common'
@Module({
  imports: [MemosRepositoryModule],
  providers: [FindMemosUseCase],
  exports: [FindMemosUseCase],
})
export class FindMemosUseCaseModule {}
