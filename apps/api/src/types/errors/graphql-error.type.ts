type GraphQLErrorExceptionType = {
  stacktrace?: string
}

type GraphQLErrorResponseType = {
  error?: string
  message?: string[]
  statusCode?: string
}

export type GraphQLErrorExtensionsType = {
  code?: string
  response?: GraphQLErrorResponseType
  exception?: GraphQLErrorExceptionType
}

type GraphQLErrorDetailType = {
  extensions?: GraphQLErrorExtensionsType
  message?: string
}

/** GraphQLエラーの型 */
export type GraphQLErrorType = {
  errors?: GraphQLErrorDetailType[]
  data?: object
}
