import { MemoCreateManyInput } from '@/infrastructure/prisma/@generated/memo/memo-create-many.input'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

describe('validate MemoCreateManyInput', () => {
  const defaultInput = {
    content: 'メモです',
  }

  it('success', async () => {
    const errors = await validate(
      plainToInstance(MemoCreateManyInput, defaultInput)
    )
    expect(errors.length).toEqual(0)
  })

  describe('validation failed', () => {
    it('content is not empty', async () => {
      const failInput = { ...defaultInput, content: '' }

      const errors = await validate(
        plainToInstance(MemoCreateManyInput, failInput)
      )

      expect(errors.length).toEqual(1)
      expect(errors.toString()).toContain(
        'property content has failed the following constraints: isNotEmpty'
      )
    })
  })
})
