import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { LogoutUseCase } from '@/application/use-cases/auth/logout.use-case'
import { TokenRegenerationUseCase } from '@/application/use-cases/auth/token-regeneration.use-case'
import { UserOutput } from '@/infrastructure/graphql/dto/users/user.output'
import { AuthUserOutput } from '@/infrastructure/graphql/dto/auth/auth-user.output'
import { LoginInput } from '@/infrastructure/graphql/dto/auth/login.input'
import { SkipAuth } from '@/infrastructure/decorators/metadata/skip_auth'
import { GraphQLAuthGuard } from '@/infrastructure/guards/graphql-auth.guard'
import { JwtRefreshAuthGuard } from '@/infrastructure/guards/jwt-refresh-auth.guard'
import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly tokenRegenerationUseCase: TokenRegenerationUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  @Mutation(() => AuthUserOutput, { description: 'ログイン' })
  @SkipAuth()
  @UseGuards(GraphQLAuthGuard)
  async login(
    @Args() args: LoginInput, // GraphQLAuthGuardにて使用
    @Context() context
  ): Promise<AuthUserOutput> {
    // トークンを取得するためにguard経由で取得したuserを連携
    const user: UserOutput = context.user
    const tokens = await this.loginUseCase.execute(user)

    // Cookieにaccess tokenを設定
    context.req.res?.cookie('atlasAccessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    // refresh tokenのみbodyに返却
    return { refreshToken: tokens.refreshToken, user }
  }

  @Mutation(() => AuthUserOutput, { description: 'トークン再発行' })
  @SkipAuth()
  @UseGuards(JwtRefreshAuthGuard)
  async tokenRegeneration(@Context() context): Promise<AuthUserOutput> {
    const user: UserOutput = context.req.user
    const refreshToken: string = context.req.headers.authorization
      .replace('Bearer', '')
      .trim()

    const tokens = await this.tokenRegenerationUseCase.execute({
      user,
      refreshToken,
    })

    // Cookieにaccess tokenを設定
    context.req.res?.cookie('atlasAccessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    // refresh tokenのみbodyに返却
    return { refreshToken: tokens.refreshToken, user }
  }

  @Mutation(() => Boolean, { description: 'ログアウト' })
  async logout(@Context() context) {
    this.logoutUseCase.execute(context.req.user)

    // Cookieのaccess tokenを上書き
    context.req.res?.cookie('atlasAccessToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
    return true
  }
}
