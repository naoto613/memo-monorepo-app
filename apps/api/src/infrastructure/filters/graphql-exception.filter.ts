import { Catch, HttpException } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch(HttpException)
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  /**
   * HttpExceptionをcatch
   * @param 例外
   */
  catch(exception: HttpException) {
    const exceptionName = String(exception).split(':')[0]

    // 権限エラーはreturn
    if (exceptionName === 'UnauthorizedException') {
      return exception
    }

    return exception
  }
}
