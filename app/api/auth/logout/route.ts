import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Cookie'yi temizle
    const response = NextResponse.json({ message: 'Başarıyla çıkış yapıldı' }, { status: 200 });
    
    // Cookie'yi sil
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Hemen expire olsun
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Çıkış yapılırken hata:', error);
    return NextResponse.json(
      { error: 'Çıkış yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 