import MemoComponent from '../components'
import { useMutation, useQuery } from 'urql'
import {
  CreateMemoDocument,
  MutationCreateMemoArgs,
  MemosDocument,
  MemosQueryVariables,
  DeleteMemosDocument,
} from '@/graphql/*'
import { useToast } from '@chakra-ui/react'

import { useCallback, useMemo } from 'react'

type Props = {
  queryVariables: MemosQueryVariables
}

export default function MemoContainer(props: Props) {
  const { queryVariables } = props

  const toast = useToast()

  const [result] = useQuery({
    query: MemosDocument,
    variables: { ...queryVariables },
  })

  const { data, error } = result

  const [, create] = useMutation(CreateMemoDocument)

  const onCreate = useCallback(
    async (variables: MutationCreateMemoArgs) => {
      return await create(variables).then((result) => {
        if (result.error) {
          toast({
            status: 'error',
            title: 'メモ作成に失敗しました',
          })
          throw result.error
        }
      })
    },
    [create, toast]
  )

  const [, deleteMemo] = useMutation(DeleteMemosDocument)

  const onDelete = useCallback(async () => {
    return await deleteMemo().then((result) => {
      if (result.error) {
        toast({
          status: 'error',
          title: 'メモ削除に失敗しました',
        })
        throw result.error
      }
    })
  }, [toast, deleteMemo])

  useMemo(() => {
    error &&
      toast({
        status: 'error',
        title: 'データの取得に失敗しました',
      })
  }, [error, toast])

  return (
    <MemoComponent
      queryData={data?.memos?.data}
      filter={queryVariables?.searchConditions}
      onCreate={onCreate}
      onDelete={onDelete}
    />
  )
}
