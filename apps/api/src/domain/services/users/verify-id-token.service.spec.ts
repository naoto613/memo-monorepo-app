import { Test, TestingModule } from '@nestjs/testing'
import { VerifyIdTokenService } from '@/domain/services/users/verify-id-token.service'
import { VerifyIdTokenServiceModule } from '@/infrastructure/ioc/domain/services/users/verify-id-token.service.module'
import { UnauthorizedException } from '@nestjs/common'

describe('VerifyIdTokenService', () => {
  let service: VerifyIdTokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VerifyIdTokenServiceModule],
    }).compile()

    service = module.get<VerifyIdTokenService>(VerifyIdTokenService)
  })

  describe('execute', () => {
    it('failed when invalid token', async () => {
      const invalidToken = 'invalid-token'

      const errorPromise = service.execute(invalidToken)
      await expect(errorPromise).rejects.toThrowError(
        new UnauthorizedException('Google Loginに失敗しました。')
      )
    })
  })
})
