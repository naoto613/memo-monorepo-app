import { ACCEPT_AUTHORITIES_KEY } from '@/utils/statics/accept-authorities-key'
import { SetMetadata } from '@nestjs/common'

/**
 * 権限による制御を行うために制御対象権限を設定するデコレータ
 * @param 権限
 */
export const AcceptAuthorities = (authority) =>
  SetMetadata(ACCEPT_AUTHORITIES_KEY, authority)
