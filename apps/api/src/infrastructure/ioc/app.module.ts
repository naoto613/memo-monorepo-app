import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { join } from 'path'
import { ComplexityPlugin } from '../plugins/complexity.plugin'
import { LoggingPlugin } from '../plugins/logging.plugin'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/infrastructure/guards/jwt-auth.guard'
import { AcceptAuthoritiesGuard } from '@/infrastructure/guards/accept-authorities.guard'
import { UsersResolverModule } from '@/infrastructure/ioc/interfaces/resolvers/users.resolver.module'
import { AuthResolverModule } from '@/infrastructure/ioc/interfaces/resolvers/auth.resolver.module'
import { GraphqlExceptionFilter } from '@/infrastructure/filters/graphql-exception.filter'
import { MemosResolverModule } from '@/infrastructure/ioc/interfaces/resolvers/memos.resolver.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      cache: 'bounded',
      autoSchemaFile: join(
        process.cwd(),
        'apps/api/src/infrastructure/graphql/@generated/schema.gql'
      ),
      cors: {
        origin: process.env.CORS_URL,
        credentials: true,
      },
      debug: process.env.APP_ENV !== 'production',
      playground: process.env.APP_ENV !== 'production',
    }),
    UsersResolverModule,
    AuthResolverModule,
    MemosResolverModule,
  ],
  providers: [
    LoggingPlugin,
    ComplexityPlugin,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AcceptAuthoritiesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
  ],
})
export class AppModule {}
