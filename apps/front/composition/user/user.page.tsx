import UserContainer from './containers'
import { useRouter } from 'next/router'
import { UsersQueryVariables } from '@/graphql/*'
import { useMemo, useState } from 'react'
import Head from 'next/head'
import { Flex, Heading, Box } from '@chakra-ui/react'

export default function User() {
  const router = useRouter()

  const [queryVariables, setQueryVariables] = useState<UsersQueryVariables>({})

  useMemo(() => {
    const queryParams = router.query

    const searchConditions =
      queryParams?.searchConditions &&
      JSON.parse(String(queryParams.searchConditions))

    // ページネーション部分のクエリパラメータを設定
    const offset = queryParams.offset ? Number(queryParams.offset) : 0
    const limit = queryParams.limit ? Number(queryParams.limit) : 50

    const condition: UsersQueryVariables = {
      offset,
      limit,
      searchConditions: {},
    } as UsersQueryVariables
    searchConditions?.name &&
      (condition.searchConditions.name = searchConditions.name as string)
    searchConditions?.email &&
      (condition.searchConditions.email = searchConditions.email as string)

    setQueryVariables(condition)
  }, [router.query])

  if (!router.isReady) return

  return (
    <>
      <Head>
        <title>ユーザー</title>
      </Head>
      <Flex flexDirection={'column'}>
        <Box p={4} flexShrink={0}>
          <Heading as={'h3'} size={'lg'} data-qa={'pageTitle'}>
            ユーザー
          </Heading>
        </Box>
        <Box>
          <Box position={'absolute'} px={4}>
            <UserContainer queryVariables={queryVariables} />
          </Box>
        </Box>
      </Flex>
    </>
  )
}
