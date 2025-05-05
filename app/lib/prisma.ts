import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-prisma-client-js

let prisma: PrismaClient;

// Global tipi için özel bir interface tanımlayalım
interface CustomGlobal {
  prisma: PrismaClient | undefined;
}

// Global nesnesini özel tipimize dönüştürelim
declare const global: CustomGlobal & typeof globalThis;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;