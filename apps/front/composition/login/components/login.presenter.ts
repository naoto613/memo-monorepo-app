import { useCallback, useEffect, useState } from 'react'
import { MutationLoginArgs } from '@/graphql/*'

type Props = {
  submitLogin: (args: MutationLoginArgs) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (param: unknown) => unknown
          prompt: () => unknown
          cancel: () => unknown
        }
      }
    }
  }
}

const useLoginPresenter = (props: Props) => {
  const { submitLogin } = props

  // google login に関する部分
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false)

  const handleGoogleSignIn = useCallback(
    (res: { credential?: string; select_by?: string; clientId?: string }) => {
      submitLogin({ idToken: res.credential })
    },
    [submitLogin]
  )

  const initializeGsi = useCallback(() => {
    if (!window.google || gsiScriptLoaded) return

    setGsiScriptLoaded(true)
    window.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      callback: handleGoogleSignIn,
    })
  }, [gsiScriptLoaded, handleGoogleSignIn])

  useEffect(() => {
    // googleのスクリプトを読み込み
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = initializeGsi
    script.async = true
    script.id = 'google-client-script'
    document.querySelector('body')?.appendChild(script)

    return () => {
      window.google?.accounts.id.cancel()
      document.getElementById('google-client-script')?.remove()
    }
  }, [gsiScriptLoaded, handleGoogleSignIn, initializeGsi])
}

export default useLoginPresenter
