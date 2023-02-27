import { IS_SKIP_AUTH_KEY } from '@/utils/statics/is-skip-auth-key'
import { SetMetadata } from '@nestjs/common'

/**
 * アクセスキーによる認証をスキップするために設定するデコレータ
 */
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true)
