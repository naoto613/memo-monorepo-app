import { Test, TestingModule } from '@nestjs/testing'
import { GetTokenService } from '@/domain/services/users/get-token.service'
import { GetTokenServiceModule } from '@/infrastructure/ioc/domain/services/users/get-token.service.module'

describe('GetTokenService', () => {
  let service: GetTokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GetTokenServiceModule],
    }).compile()

    service = module.get<GetTokenService>(GetTokenService)
  })

  describe('execute', () => {
    it('should get tokens', async () => {
      // 実行
      const returnToken = await service.execute('test@example.com')

      // 何かしらのアクセストークンとリフレッシュトークンが帰ってくることを確認
      expect(returnToken).toStrictEqual({
        accessToken: expect.anything(),
        refreshToken: expect.anything(),
      })
    })
  })
})
