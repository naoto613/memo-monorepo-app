import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import {
  GraphQLErrorExtensionsType,
  GraphQLErrorType,
} from '@/types/errors/graphql-error.type'
import { callUserFactory } from '@/infrastructure/prisma/factories/users/call-user-factory'

/**
 * 権限がある場合のテスト
 * @param app nestjs のコアオブジェクト
 * @param getQuery GraphQL クエリ
 * @param authority 権限
 */
const existsAuthority = async (
  app: INestApplication,
  sendParameter: { query: string },
  authority
) => {
  // 指定された権限ユーザーのemail
  const authorityTestEmail = 'exsist.authority.test@example.com'

  // 引数から登録する項目を作成
  const permissionColumn = { [authority]: true }

  // 事前にユーザーを登録
  await callUserFactory({
    ...permissionColumn,
    email: authorityTestEmail,
    name: '権限 太郎',
  })

  return request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', [`testEmail= "${authorityTestEmail}"`])
    .send(sendParameter)
    .expect(HttpStatus.OK)
    .expect((res) => {
      const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(jsonResponse.errors).toStrictEqual(undefined)
    })
}

/**
 * 権限がない場合のテスト
 * @param app nestjs のコアオブジェクト
 * @param getQuery GraphQL クエリ
 */
const noAuthority = async (
  app: INestApplication,
  sendParameter: { query: string }
) => {
  // 権限がないユーザーのemail
  const browsingOnlyUserEmail = 'non.authority.test@example.com'

  // 事前にユーザーを登録
  await callUserFactory({
    email: browsingOnlyUserEmail,
    name: '閲覧 太郎',
  })

  return request(app.getHttpServer())
    .post('/graphql')
    .set('Cookie', [`testEmail= "${browsingOnlyUserEmail}"`])
    .send(sendParameter)
    .expect(HttpStatus.OK)
    .expect((res) => {
      const jsonResponse: GraphQLErrorType = JSON.parse(res.text)
      const errorExtensions: GraphQLErrorExtensionsType =
        jsonResponse.errors[0].extensions

      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      expect(errorExtensions.code).toEqual('FORBIDDEN')
      // @ts-ignore
      expect(errorExtensions.response.error).toEqual('Forbidden')
      // @ts-ignore
      expect(errorExtensions.response.message).toEqual('権限がありません。')
      // @ts-ignore
      expect(errorExtensions.response.statusCode).toEqual(HttpStatus.FORBIDDEN)
      /* eslint-disable @typescript-eslint/ban-ts-comment */
    })
}

/**
 * 権限関連のテスト
 */
export const authorityCheckTests = {
  existsAuthority,
  noAuthority,
}
