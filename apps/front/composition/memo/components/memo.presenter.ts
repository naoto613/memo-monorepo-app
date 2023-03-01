import { useCallback, useEffect, useMemo } from 'react'
import {
  MutationCreateMemoArgs,
  MemosQueryVariables,
  MemoInput,
  MemosQuery,
} from '@/graphql/*'
import { useRouter } from 'next/router'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useToast } from '@chakra-ui/react'

type Props = {
  queryData: MemosQuery['memos']['data']
  watch: UseFormWatch<MemosQueryVariables['searchConditions']>
  setValue: UseFormSetValue<MemosQueryVariables['searchConditions']>
  filter: MemosQueryVariables['searchConditions']
  onCreate: (data: MutationCreateMemoArgs) => Promise<void>
  onDelete: () => Promise<void>
}

const useMemoPresenter = (props: Props) => {
  const { queryData, watch, setValue, filter, onCreate, onDelete } = props
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    setValue('content', filter?.content)
  }, [filter?.content, setValue])

  useEffect(() => {
    // フォームの監視を開始
    const subscription = watch(async (value) => {
      // 検索条件部分
      const searchConditions: MemosQueryVariables['searchConditions'] = {
        content: value.content,
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
   * 表示するテーブルデータを作成する
   * @return テーブルデータ
   */
  const displayTableData = useMemo(() => {
    return queryData?.map((target) => {
      return {
        ...target,
        name: target.user.name,
      }
    })
  }, [queryData])

  /**
   * 登録ボタン押下時のアクション
   * @param submitData form入力値のデータ
   */
  const doRegistration = useCallback(
    async (data: MemoInput) => {
      return await onCreate({ data })
        .then(() => {
          toast({
            title: `メモ情報を登録しました`,
            status: 'success',
          })
        })
        .catch(() => {
          // 何もしない
        })
    },
    [onCreate, toast]
  )

  /**
   * 削除ボタン押下時のアクション
   */
  const doDeleting = useCallback(async () => {
    return await onDelete()
      .then(() => {
        toast({
          title: `メモを削除しました`,
          status: 'success',
        })
      })
      .catch(() => {
        // 何もしない
      })
  }, [onDelete, toast])

  return { displayTableData, doRegistration, doDeleting }
}

export default useMemoPresenter
