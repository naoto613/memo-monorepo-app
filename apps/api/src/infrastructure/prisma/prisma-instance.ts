import { PrismaService } from '@/infrastructure/prisma/prisma.service'

/**
 * DBアクセス時はprismaInstanceを呼ぶようにすることで
 * PrismaClientのインスタンスを1回しか生成しないようにする
 */
export const prismaInstance = new PrismaService()
