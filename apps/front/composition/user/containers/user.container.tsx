import UserComponent from '../components'
import { useMutation, useQuery } from 'urql'
import {
  CreateUserDocument,
  MutationCreateUserArgs,
  UsersDocument,
  UsersQueryVariables,
} from '@/graphql/*'
import { useToast } from '@chakra-ui/react'

import { useCallback, useMemo } from 'react'

type Props = {
  queryVariables: UsersQueryVariables
}

export default function UserContainer(props: Props) {
  const { queryVariables } = props

  const toast = useToast()

  const [result] = useQuery({
    query: UsersDocument,
    variables: { ...queryVariables },
  })

  const { data, error } = result

  const [, create] = useMutation(CreateUserDocument)

  const onCreate = useCallback(
    async (variables: MutationCreateUserArgs) => {
      return await create(variables).then((result) => {
        if (result.error) {
          toast({
            status: 'error',
            title: 'ユーザー作成に失敗しました',
          })
          throw result.error
        }
      })
    },
    [create, toast]
  )

  useMemo(() => {
    error &&
      toast({
        status: 'error',
        title: 'データの取得に失敗しました',
      })
  }, [error, toast])

  return (
    <UserComponent
      queryData={data?.users?.data}
      filter={queryVariables?.searchConditions}
      onCreate={onCreate}
    />
  )
}
