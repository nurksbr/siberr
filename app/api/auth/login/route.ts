import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Boş alan kontrolü
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre alanları gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
      },
    });

    // Kullanıcı bulunamadı veya şifre eşleşmiyor
    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz kimlik bilgileri' },
        { status: 401 }
      );
    }

    // Şifre doğrulama
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Geçersiz kimlik bilgileri' },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    // Cookie ayarla
    const response = NextResponse.json(
      { message: 'Başarıyla giriş yapıldı', user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }},
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 gün
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
}