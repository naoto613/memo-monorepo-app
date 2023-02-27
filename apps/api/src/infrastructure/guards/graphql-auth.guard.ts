import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

export class GraphQLAuthGuard extends AuthGuard('local') {
  constructor() {
    super()
  }

  /**
   * resolverで受け取ったargsを取得
   * @param context システム内部のcontext
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext()
    const args = ctx.getArgs()
    // idTokenしか使わないがpassportの形式に合わせるためにdummyを詰めておく
    request.body = { ...args, dummy: 'dummy' }

    // getRequestを実行後、LocalStrategyのvalidateを実行
    return request
  }
}
