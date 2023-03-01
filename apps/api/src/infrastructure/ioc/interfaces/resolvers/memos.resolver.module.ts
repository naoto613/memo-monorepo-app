import { CreateMemoUseCaseModule } from '@/infrastructure/ioc/application/use-cases/memos/create-memo.use-case.module'
import { DeleteMemosUseCaseModule } from '@/infrastructure/ioc/application/use-cases/memos/delete-memos.use-case.module'
import { FindMemosUseCaseModule } from '@/infrastructure/ioc/application/use-cases/memos/find-memos.use-case.module'
import { AuthResolverModule } from '@/infrastructure/ioc/interfaces/resolvers/auth.resolver.module'
import { MemosResolver } from '@/interfaces/resolvers/memos/memos.resolver'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CreateMemoUseCaseModule,
    DeleteMemosUseCaseModule,
    FindMemosUseCaseModule,
  ],
  providers: [MemosResolver, AuthResolverModule],
})
export class MemosResolverModule {}
