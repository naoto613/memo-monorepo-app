import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import './styles.css'
import { createClient, Provider } from 'urql'

/** APIのエンドポイント */
const url = process.env.NEXT_PUBLIC_API_URL

const client = () => {
  return createClient({
    url,
    fetchOptions: {
      credentials: 'include',
    },
  })
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client()}>
      <ChakraProvider>
        <Head>
          <title />
        </Head>
        <main className={'app'}>
          <Component {...pageProps} />
        </main>
      </ChakraProvider>
    </Provider>
  )
}

export default CustomApp
