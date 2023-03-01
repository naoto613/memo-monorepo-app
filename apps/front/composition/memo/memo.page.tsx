import MemoContainer from './containers'
import { useRouter } from 'next/router'
import { MemosQueryVariables } from '@/graphql/*'
import { useMemo, useState } from 'react'
import Head from 'next/head'
import { Flex, Heading, Box } from '@chakra-ui/react'

export default function Memo() {
  const router = useRouter()

  const [queryVariables, setQueryVariables] = useState<MemosQueryVariables>({})

  useMemo(() => {
    const queryParams = router.query

    const searchConditions =
      queryParams?.searchConditions &&
      JSON.parse(String(queryParams.searchConditions))

    // ページネーション部分のクエリパラメータを設定
    const offset = queryParams.offset ? Number(queryParams.offset) : 0
    const limit = queryParams.limit ? Number(queryParams.limit) : 50

    const condition: MemosQueryVariables = {
      offset,
      limit,
      searchConditions: {},
    } as MemosQueryVariables
    searchConditions?.content &&
      (condition.searchConditions.content = searchConditions.content as string)

    setQueryVariables(condition)
  }, [router.query])

  if (!router.isReady) return

  return (
    <>
      <Head>
        <title>メモ</title>
      </Head>
      <Flex flexDirection={'column'}>
        <Box p={4} flexShrink={0}>
          <Heading as={'h3'} size={'lg'}>
            メモ
          </Heading>
        </Box>
        <Box>
          <Box position={'absolute'} px={4}>
            <MemoContainer queryVariables={queryVariables} />
          </Box>
        </Box>
      </Flex>
    </>
  )
}
