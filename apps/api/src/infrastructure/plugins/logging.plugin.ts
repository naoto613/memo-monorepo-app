import { Plugin } from '@nestjs/apollo'
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContext,
} from 'apollo-server-plugin-base'
import { Logger } from '@nestjs/common'

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  /**
   * フロントからのリクエストをログに出力
   * @param requestContext システム内部のcontext
   */
  async requestDidStart(
    requestContext: GraphQLRequestContext
  ): Promise<GraphQLRequestListener> {
    if (process.env.APP_ENV === 'test') {
      return
    }

    Logger.debug('Request started')
    const {
      request: { query, operationName, variables },
    } = requestContext

    return {
      async didEncounterErrors({ errors }) {
        errors.forEach((error) => Logger.error(error))
      },
      async willSendResponse() {
        Logger.debug(operationName)
        Logger.debug(query)
        Logger.debug(variables)
      },
    }
  }
}
