import { ACCEPT_AUTHORITIES_KEY } from '@/utils/statics/accept-authorities-key'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

type ContextRequest = {
  user: UserOutput
}

@Injectable()
export class AcceptAuthoritiesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 権限による認証
   * @param context システム内部のcontext
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>(
      ACCEPT_AUTHORITIES_KEY,
      [context.getHandler(), context.getClass()]
    )

    // 権限による制限をしていない場合はreturn
    if (!requiredRole) {
      return true
    }

    const ctx = GqlExecutionContext.create(context)
    const req: ContextRequest = ctx.getContext().req

    // 権限による制限をしていても、テストでダミーユーザーが取得できた場合はreturn
    if (
      process.env.APP_ENV === 'test' &&
      req.user.email === 'dummytaro@example.com'
    ) {
      return true
    }

    // DBに登録された権限項目を参照し、falseならエラー
    if (!req.user[requiredRole]) {
      throw new ForbiddenException('権限がありません。')
    }

    return true
  }
}
