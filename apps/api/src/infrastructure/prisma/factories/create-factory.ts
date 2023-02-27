import { prismaInstance } from '@/infrastructure/prisma/prisma-instance'
import { PrismaClient } from '@prisma/client'

type Awaited<T> = T extends PromiseLike<infer U> ? U : T

// モデル名をPrismaClientのClassから取得。こうするとモデルが増えても勝手に型定義もアップデートされる。(先頭に "$" が付いているのが PrismaClient の関数でそれ以外に生えてるプロパティがschema.prismaから生成されたモデルの名前)
type FilterStartsWith<
  Union,
  Prefix extends string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = Union extends `${Prefix}${infer _Property}` ? never : Union
type ModelName = FilterStartsWith<keyof Awaited<PrismaClient>, '$'>

/**
 * connect/create が生えてたらinclude できるようにする
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildPrismaIncludeFromAttrs = (attrs: Record<string, any>) => {
  const include = Object.keys(attrs).reduce((prev, curr) => {
    const value = attrs[curr]
    const isObject = typeof value === 'object'
    const isRelation =
      isObject &&
      value !== null &&
      Object.keys(value).find((v) => v.match(/connect|create/))

    if (isRelation) {
      prev[curr] = true
    }

    return prev
  }, Object.create(null))

  const hasInclude = Object.keys(include).length
  return hasInclude ? include : undefined
}

/**
 * モデル名に基づいたFactory関数を返却
 * @param modelName モデル名
 */
export const createFactory = <CreateInputType, ModelType>(
  modelName: ModelName
) => {
  return {
    create: async (attrs: Partial<CreateInputType>): Promise<ModelType> => {
      const obj = {
        ...attrs,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: Record<string, any> = {}
      const includes = buildPrismaIncludeFromAttrs(attrs)
      if (includes) options.include = includes

      return await prismaInstance[String(modelName)].create({
        data: { ...obj },
        ...options,
      })
    },
  }
}
