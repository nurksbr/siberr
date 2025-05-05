import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

// Kayıt şeması doğrulama
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Ad en az 2 karakter olmalıdır' }),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  password: z
    .string()
    .min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
    }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Gelen verileri doğrula
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Doğrulama hatası', issues: result.error.issues },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // E-posta adresi zaten kullanılıyor mu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Varsayılan rol USER olarak ayarlandı
        backupCodes: JSON.stringify([]), // SQLite için String tipinde boş bir array
      },
    });
    
    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}