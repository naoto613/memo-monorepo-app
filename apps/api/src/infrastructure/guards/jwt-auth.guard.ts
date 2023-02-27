import { IS_SKIP_AUTH_KEY } from '@/utils/statics/is-skip-auth-key'
import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { IncomingMessage } from 'http'

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  // テストの場合はテスト用のstrategyを呼び出す
  process.env.APP_ENV === 'test' ? 'jwt-for-test' : 'jwt'
) {
  constructor(private reflector: Reflector) {
    super()
  }

  /**
   * 権限スキップ確認
   * @param システム内部のcontext
   */
  canActivate(context: ExecutionContext) {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (isSkipAuth) {
      return true
    }
    return super.canActivate(context)
  }

  /**
   * リクエストの取得
   * getRequestを実行後、JwtStrategyのvalidateを実行
   *
   * @param context システム内部のcontext
   */
  getRequest(context: ExecutionContext): IncomingMessage {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
