import { useCallback } from 'react'
import LoginComponent from '../components'
import { useMutation } from 'urql'
import { LoginDocument, MutationLoginArgs } from '@/graphql/*'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'

export default function LoginContainer() {
  const toast = useToast()
  const router = useRouter()

  const [, login] = useMutation(LoginDocument)

  const submitLogin = useCallback(
    (variables: MutationLoginArgs) => {
      toast.closeAll()
      login(variables).then((result) => {
        if (result.error) {
          toast({
            title: 'ログインに失敗しました',
            status: 'error',
          })
          return
        }

        router.push(`user`)
      })
    },
    [login, router, toast]
  )

  return <LoginComponent submitLogin={submitLogin} />
}
