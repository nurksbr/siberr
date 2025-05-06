import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';

// Test/demo kullanıcısı - gerçek üretimde kullanmayın, yalnızca test için
const TEST_USER = {
  id: 'test123',
  email: 'test@example.com',
  name: 'Test Kullanıcı',
  password: '$2b$10$YQP9YQd3lKsL1z9kLhD/5.5QIbwNqFbDt2JIqoZ8jNmMjz0Jf7pIS', // "password" şifresinin hash'i
  role: 'USER'
};

export async function POST(request: NextRequest) {
  console.log('API: Login endpoint çağrıldı');
  
  try {
    // İsteği JSON olarak parse et
    let body;
    try {
      const text = await request.text();
      console.log('API: Ham istek gövdesi:', text);
      body = JSON.parse(text);
      console.log('API: İstek gövdesi başarıyla parse edildi:', body);
    } catch (parseError) {
      console.error('API: JSON parse hatası:', parseError);
      return new NextResponse(
        JSON.stringify({ error: 'Geçersiz istek formatı', success: false }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
          }
        }
      );
    }
    
    const { email, password } = body;
    console.log('API: Giriş denemesi:', { email, passwordProvided: !!password });

    // Boş alan kontrolü
    if (!email || !password) {
      console.log('API: Eksik bilgilerle giriş denemesi');
      return new NextResponse(
        JSON.stringify({ error: 'E-posta ve şifre alanları gereklidir', success: false }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Test kullanıcısı kontrolü - geliştirme/test için
    if (email === 'test@example.com') {
      console.log('API: Test kullanıcısı ile giriş denemesi');
      
      try {
        // Şifre doğrulama
        const passwordMatch = await bcrypt.compare(password, TEST_USER.password);
        
        if (!passwordMatch) {
          console.log('API: Test kullanıcısı için şifre eşleşmiyor');
          return new NextResponse(
            JSON.stringify({ error: 'Geçersiz kimlik bilgileri', success: false }),
            { 
              status: 401,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }
        
        console.log('API: Test kullanıcısı şifresi doğrulandı, token oluşturuluyor');
        
        // JWT token oluştur
        const token = sign(
          {
            userId: TEST_USER.id,
            email: TEST_USER.email,
            role: TEST_USER.role,
          },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '1d' }
        );

        // Kullanıcı bilgileri
        const userData = {
          id: TEST_USER.id,
          email: TEST_USER.email,
          name: TEST_USER.name,
          role: TEST_USER.role,
        };

        console.log('API: Test kullanıcısı için token oluşturuldu, yanıt hazırlanıyor');
        
        // Cookie ayarla
        const response = new NextResponse(
          JSON.stringify({ 
            message: 'Başarıyla giriş yapıldı', 
            user: userData,
            success: true
          }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        );

        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 gün
          path: '/',
        });

        console.log('API: Test kullanıcısı için giriş başarılı, yanıt gönderiliyor');
        return response;
      } catch (error) {
        console.error('API: Test kullanıcısı işleme hatası:', error);
        return new NextResponse(
          JSON.stringify({ error: 'Kimlik doğrulama hatası', success: false }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Normal kullanıcı işlemi - Prisma ile veritabanı sorgusu
    try {
      console.log('API: Veritabanında kullanıcı aranıyor:', email);
      
      try {
        // Prisma kullanılabilirliğini kontrol et
        const isPrismaConnected = await prisma.$queryRaw`SELECT 1 as connected`;
        console.log('API: Prisma bağlantı kontrolü:', isPrismaConnected);
      } catch (connError) {
        console.error('API: Prisma bağlantı hatası:', connError);
        throw new Error('Veritabanı bağlantısı kurulamadı');
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

      // Kullanıcı bulunamadı
      if (!user) {
        console.log('API: Kullanıcı bulunamadı:', email);
        return new NextResponse(
          JSON.stringify({ error: 'Geçersiz kimlik bilgileri', success: false }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      console.log('API: Kullanıcı bulundu, şifre kontrol ediliyor');
      
      // Şifre doğrulama
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          console.log('API: Şifre eşleşmiyor');
          return new NextResponse(
            JSON.stringify({ error: 'Geçersiz kimlik bilgileri', success: false }),
            { 
              status: 401,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }
        
        console.log('API: Şifre doğrulandı, token oluşturuluyor');
        
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

        // Kullanıcı bilgileri - şifre hariç
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name || email.split('@')[0], // Eğer isim yoksa e-postadan oluştur
          role: user.role,
        };

        console.log('API: Token oluşturuldu, yanıt hazırlanıyor');
        
        // Cookie ayarla
        const response = new NextResponse(
          JSON.stringify({ 
            message: 'Başarıyla giriş yapıldı', 
            user: userData,
            success: true
          }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        );

        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 gün
          path: '/',
        });

        console.log('API: Giriş başarılı, yanıt gönderiliyor');
        return response;
      } catch (bcryptError) {
        console.error('API: Bcrypt karşılaştırma hatası:', bcryptError);
        return new NextResponse(
          JSON.stringify({ error: 'Kimlik doğrulama hatası', success: false }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } catch (prismaError: unknown) {
      console.error('API: Prisma hatası:', prismaError);
      const errorMessage = prismaError instanceof Error 
        ? prismaError.message 
        : 'Bilinmeyen veritabanı hatası';
      
      return new NextResponse(
        JSON.stringify({ error: 'Veritabanı hatası', success: false, details: errorMessage }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('API: Genel giriş hatası:', error);
    
    // Hata mesajını güvenli bir şekilde oluştur
    let errorMessage = 'Giriş yapılırken bir hata oluştu';
    let errorDetails = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    }
    
    return new NextResponse(
      JSON.stringify({ 
        error: errorMessage, 
        success: false,
        details: process.env.NODE_ENV !== 'production' ? errorDetails : null
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  }
}