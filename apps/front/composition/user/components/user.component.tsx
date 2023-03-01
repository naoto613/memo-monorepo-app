import { Input, HStack, Box, Flex, Button, Divider } from '@chakra-ui/react'
import DataGrid from '@/shared/molecules/data-grid/dataGrid.page'
import useUserPresenter from '@/composition/user/components/user.presenter'
import {
  MutationCreateUserArgs,
  UsersQuery,
  UsersQueryVariables,
} from '@/graphql/*'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

type Props = {
  queryData: UsersQuery['users']['data']
  filter: UsersQueryVariables['searchConditions']
  onCreate: (data: MutationCreateUserArgs) => Promise<void>
}

export default function UserComponent(props: Props) {
  const { queryData, filter, onCreate } = props
  const { register, watch, setValue, handleSubmit } =
    useForm<UsersQueryVariables['searchConditions']>()
  const router = useRouter()

  const { doRegistration } = useUserPresenter({
    watch,
    setValue,
    filter,
    onCreate,
  })

  const columns = [
    {
      accessorKey: 'email',
      header: 'メールアドレス',
    },
    {
      accessorKey: 'name',
      header: 'ユーザー名',
    },
    {
      accessorKey: 'isAdmin',
      header: '管理者フラグ',
    },
  ]

  return (
    <>
      <Button
        colorScheme={'orange'}
        size="xs"
        onClick={() =>
          router.push({
            pathname: '/memo',
          })
        }
      >
        メモ一覧へ
      </Button>
      <Divider p={2} />
      <Box flex={'1'} textAlign={'left'} fontWeight={'bold'}>
        検索条件（即時反映されます）
      </Box>
      <form onSubmit={handleSubmit(doRegistration)}>
        <Box>
          <HStack p={2}>
            <Flex minW={100}>
              <Box mr={2}>メールアドレス</Box>
            </Flex>
            <Input
              defaultValue={filter?.email}
              size={'sm'}
              placeholder={'メールアドレスを入力'}
              {...register('email')}
            />
          </HStack>
        </Box>
        <Box>
          <HStack p={2}>
            <Flex minW={100}>
              <Box mr={2}>ユーザー名</Box>
            </Flex>
            <Input
              defaultValue={filter?.name}
              size={'sm'}
              placeholder={'ユーザー名を入力'}
              {...register('name')}
            />
          </HStack>
        </Box>
        <Box p={5}>
          <Button colorScheme={'blue'} type={'submit'}>
            検索条件をそのまま登録
          </Button>
        </Box>
      </form>

      <DataGrid data={queryData} columns={columns} />
    </>
  )
}
