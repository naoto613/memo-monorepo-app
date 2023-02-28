import { Center, Container, Flex, Box } from '@chakra-ui/react'
import { MutationLoginArgs } from '@/graphql/*'
import useLoginPresenter from './login.presenter'

type Props = {
  submitLogin: (args: MutationLoginArgs) => void
}

export default function LoginComponent(props: Props) {
  const { submitLogin } = props

  useLoginPresenter({ submitLogin })

  return (
    <Container centerContent maxW={'100vw'} h={'100vh'}>
      <Center h={'100%'}>
        <Box>ログインしてください</Box>
        <Box pl={5}>
          <Flex align={'center'}>
            <div className={'g_id_signin'} />
          </Flex>
        </Box>
      </Center>
    </Container>
  )
}
