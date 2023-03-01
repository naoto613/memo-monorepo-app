import { Input, HStack, Box, Flex, Button, Divider } from '@chakra-ui/react'
import DataGrid from '@/shared/molecules/data-grid/dataGrid.page'
import useMemoPresenter from '@/composition/memo/components/memo.presenter'
import {
  MutationCreateMemoArgs,
  MemosQuery,
  MemosQueryVariables,
} from '@/graphql/*'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

type Props = {
  queryData: MemosQuery['memos']['data']
  filter: MemosQueryVariables['searchConditions']
  onCreate: (data: MutationCreateMemoArgs) => Promise<void>
  onDelete: () => Promise<void>
}

export default function MemoComponent(props: Props) {
  const { queryData, filter, onCreate, onDelete } = props
  const { register, watch, setValue, handleSubmit } =
    useForm<MemosQueryVariables['searchConditions']>()
  const router = useRouter()

  const { displayTableData, doRegistration, doDeleting } = useMemoPresenter({
    queryData,
    watch,
    setValue,
    filter,
    onCreate,
    onDelete,
  })

  const columns = [
    {
      accessorKey: 'content',
      header: '内容',
    },
    {
      accessorKey: 'name',
      header: 'ユーザー名',
    },
  ]

  return (
    <>
      <Button
        colorScheme={'orange'}
        size={'xs'}
        onClick={() =>
          router.push({
            pathname: '/user',
          })
        }
      >
        ユーザー一覧へ
      </Button>
      <Divider p={2} />
      <Box flex={'1'} textAlign={'left'} fontWeight={'bold'}>
        検索条件（即時反映されます）
      </Box>
      <form onSubmit={handleSubmit(doRegistration)}>
        <Box>
          <HStack p={2}>
            <Flex minW={100}>
              <Box mr={2}>内容</Box>
            </Flex>
            <Input
              defaultValue={filter?.content}
              size={'sm'}
              placeholder={'メモ内容を入力'}
              {...register('content')}
            />
          </HStack>
        </Box>
        <Box p={5}>
          <Button colorScheme={'blue'} type={'submit'}>
            検索条件をそのまま登録
          </Button>
        </Box>
        <Box p={5}>
          <Button colorScheme={'red'} onClick={doDeleting}>
            メモを全削除
          </Button>
        </Box>
      </form>

      <DataGrid data={displayTableData} columns={columns} />
    </>
  )
}
