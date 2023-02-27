import { Plugin } from '@nestjs/apollo'
import { GraphQLSchemaHost } from '@nestjs/graphql'
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base'
import { GraphQLError } from 'graphql'
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity'
import { Logger } from '@nestjs/common'

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  /**
   * フロントからのリクエストの複雑度を判定
   */
  async requestDidStart(): Promise<GraphQLRequestListener> {
    const { schema } = this.gqlSchemaHost

    return {
      async didResolveOperation({ request, document }) {
        if (process.env.APP_ENV === 'test') {
          return
        }

        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        })
        const allowedComplexity = 170
        if (complexity >= allowedComplexity) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${allowedComplexity}`
          )
        }
        Logger.log('Query Complexity:', complexity)
      },
    }
  }
}
