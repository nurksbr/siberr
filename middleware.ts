import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Middleware'in çalışacağı korumalı rotalar
export const config = {
  matcher: [
    // Sadece korumalı sayfalar için çalıştır
    '/profil/:path*',
    '/egitimler/:path*',
    '/panel/:path*',
    '/ayarlar/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Geçerli URL'i callback için kullan
  const callbackUrl = encodeURIComponent(url.pathname + url.search);
  
  // Token geçerli mi kontrol et
  const isValidUserToken = token ? await isValidToken(token) : false;
  
  // Hata ayıklama için token durumunu logla
  console.log(`Korumalı sayfa kontrolü - Yol: ${pathname}, Token geçerli: ${isValidUserToken}`);

  // Korumalı sayfalara erişim için token gerekli
  if (!isValidUserToken) {
    console.log(`Korumalı rota erişimi engellendi. Şuraya yönlendiriliyor: /giris?callbackUrl=${callbackUrl}`);
    
    // LocalStorage kontrolü için özel script ekleyerek response döndür
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Yönlendiriliyor...</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    </head>
    <body>
      <script>
        // LocalStorage'dan kullanıcı bilgisini kontrol et
        try {
          const user = localStorage.getItem('cyberly_user');
          if (user) {
            console.log('LocalStorage\'da kullanıcı bilgisi bulundu, sayfayı yeniliyoruz');
            window.location.reload();
          } else {
            console.log('LocalStorage\'da kullanıcı bilgisi bulunamadı, giriş sayfasına yönlendiriliyor');
            window.location.href = '/giris?callbackUrl=${callbackUrl}';
          }
        } catch (error) {
          console.error('LocalStorage kontrolünde hata:', error);
          window.location.href = '/giris?callbackUrl=${callbackUrl}';
        }
      </script>
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <div style="border: 6px solid #f3f3f3; border-radius: 50%; border-top: 6px solid #3498db; width: 50px; height: 50px; margin: 0 auto; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 20px;">Kullanıcı bilgileriniz kontrol ediliyor...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </body>
    </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  // Token geçerliyse erişime izin ver
  return NextResponse.next();
}

// Token doğrulama fonksiyonu - artık asenkron
async function isValidToken(token: string): Promise<boolean> {
  try {
    // Edge runtime ile uyumlu jose kütüphanesi kullanıyoruz
    const secret = process.env.JWT_SECRET || 'default_secret_should_be_changed';
    const secretBytes = new TextEncoder().encode(secret);
    
    // Asenkron olarak token doğrulama
    await jwtVerify(token, secretBytes);
    return true;
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return false;
  }
}