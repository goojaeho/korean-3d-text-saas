import { PrismaClient } from '@prisma/client'

/**
 * Prisma 클라이언트 설정
 * 개발 환경에서 Hot Reload 시 연결 재사용을 위한 글로벌 캐싱
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma