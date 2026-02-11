import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // 解析数据库路径，确保使用绝对路径
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
  const absoluteDbPath = path.resolve(process.cwd(), dbPath);
  const datasourceUrl = `file:${absoluteDbPath}`;

  const adapter = new PrismaBetterSqlite3({ url: datasourceUrl });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
