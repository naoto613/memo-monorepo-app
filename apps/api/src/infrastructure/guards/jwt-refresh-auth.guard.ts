import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { IncomingMessage } from 'http'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  /**
   * リクエストの取得
   * getRequestを実行後、JwtRefreshStrategyのvalidateを実行
   *
   * @param context システム内部のcontext
   */
  getRequest(context: ExecutionContext): IncomingMessage {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
