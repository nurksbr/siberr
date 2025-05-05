import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

// Kullanıcı kimlik doğrulama işlevi
async function authenticateUser(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// 2FA durum kontrolü API endpoint'i
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // Kullanıcı kimlik doğrulama
    const decodedToken = await authenticateUser(request);
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      );
    }
    
    // Sadece kullanıcının kendi 2FA durumunu kontrol etmesine izin ver
    if (decodedToken.userId !== userId) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmuyor' },
        { status: 403 }
      );
    }
    
    // Kullanıcı 2FA durumunu kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error('2FA durum kontrolü hatası:', error);
    return NextResponse.json(
      { error: 'İki faktörlü kimlik doğrulama durumu kontrol edilirken bir hata oluştu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 