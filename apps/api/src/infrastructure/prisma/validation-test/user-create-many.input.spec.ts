import { UserCreateManyInput } from '@/infrastructure/prisma/@generated/user/user-create-many.input'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

describe('validate UserCreateManyInput', () => {
  const defaultInput = {
    email: 'test@email.com',
    name: 'テスト 太郎',
    isAdmin: true,
  }

  it('success', async () => {
    const errors = await validate(
      plainToInstance(UserCreateManyInput, defaultInput)
    )
    expect(errors.length).toEqual(0)
  })

  describe('validation failed', () => {
    it('email is not an email format', async () => {
      const failInput = { ...defaultInput, email: 'test' }

      const errors = await validate(
        plainToInstance(UserCreateManyInput, failInput)
      )

      expect(errors.length).toEqual(1)
      expect(errors.toString()).toContain(
        'property email has failed the following constraints: isEmail'
      )
    })

    it('name is not empty', async () => {
      const failInput = { ...defaultInput, name: '' }

      const errors = await validate(
        plainToInstance(UserCreateManyInput, failInput)
      )

      expect(errors.length).toEqual(1)
      expect(errors.toString()).toContain(
        'property name has failed the following constraints: isNotEmpty'
      )
    })

    it('isAdmin is boolean', async () => {
      const failInput = { ...defaultInput, isAdmin: 'test' }

      const errors = await validate(
        plainToInstance(UserCreateManyInput, failInput)
      )

      expect(errors.length).toEqual(1)
      expect(errors.toString()).toContain(
        'property isAdmin has failed the following constraints: isBoolean'
      )
    })
  })
})
