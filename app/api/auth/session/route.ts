import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Next.js 14+ için doğru cookies() kullanımı
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }

    // Token'ı doğrula
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      userId: string;
    };

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz oturum' },
        { status: 401 }
      );
    }

    // Kullanıcı bilgilerini döndür
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Oturum kontrolü hatası:', error);
    return NextResponse.json(
      { error: 'Geçersiz oturum' },
      { status: 401 }
    );
  }
} 