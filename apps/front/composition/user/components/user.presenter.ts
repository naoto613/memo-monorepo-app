import { useCallback, useEffect } from 'react'
import {
  MutationCreateUserArgs,
  UserCreateInput,
  UsersQueryVariables,
} from '@/graphql/*'
import { useRouter } from 'next/router'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useToast } from '@chakra-ui/react'

type Props = {
  watch: UseFormWatch<UsersQueryVariables['searchConditions']>
  setValue: UseFormSetValue<UsersQueryVariables['searchConditions']>
  filter: UsersQueryVariables['searchConditions']
  onCreate: (data: MutationCreateUserArgs) => Promise<void>
}

const useUserPresenter = (props: Props) => {
  const { watch, setValue, filter, onCreate } = props
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    setValue('email', filter?.email)
    setValue('name', filter?.name)
  }, [filter?.email, filter?.name, setValue])

  useEffect(() => {
    // フォームの監視を開始
    const subscription = watch(async (value) => {
      // 検索条件部分
      const searchConditions: UsersQueryVariables['searchConditions'] = {
        email: value.email,
        name: value.name,
      }

      // クエリパラメータに設定する値を作成
      const query = {
        searchConditions: JSON.stringify(searchConditions),
      }

      // クエリパラメータを反映
      await router.replace({
        pathname: router.locale,
        query,
      })
    })

    // フォームの監視を終了
    return () => subscription.unsubscribe()
  }, [router, watch])

  /**
   * 登録・更新ボタン押下時のアクション
   * @param submitData form入力値のデータ
   */
  const doRegistration = useCallback(
    async (data: UserCreateInput) => {
      return await onCreate({ data: { ...data, isAdmin: false } })
        .then(() => {
          toast({
            title: `ユーザー情報を登録しました`,
            status: 'success',
          })
        })
        .catch(() => {
          // 何もしない
        })
    },
    [onCreate, toast]
  )

  return { doRegistration }
}

export default useUserPresenter
