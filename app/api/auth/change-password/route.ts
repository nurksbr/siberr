import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/auth/change-password
export async function POST(request: NextRequest) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }
    
    // Get the current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        id: true,
        password: true,
      },
    });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    
    // Get the request body
    const { currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gereklidir' }, { status: 400 });
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Yeni şifre en az 8 karakter uzunluğunda olmalıdır' }, { status: 400 });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword },
    });
    
    return NextResponse.json({
      message: 'Şifre başarıyla güncellendi',
    });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    return NextResponse.json({ error: 'Şifre değiştirilemedi' }, { status: 500 });
  }
}