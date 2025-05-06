import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// SQL sorgusu güvenlik şeması
const sqlRequestSchema = z.object({
  operation: z.enum(['GET_USER_THEME', 'UPDATE_USER_THEME', 'GET_USER_SECURITY', 'UPDATE_USER_SECURITY']),
  params: z.record(z.string(), z.any()).optional()
});

// POST /api/settings/sql
export async function POST(request: NextRequest) {
  try {
    // Kullanıcı oturumunu doğrula
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }
    
    // İstek gövdesini al ve doğrula
    const body = await request.json();
    const validationResult = sqlRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Geçersiz istek formatı',
        details: validationResult.error.errors
      }, { status: 400 });
    }
    
    // Geçerli veriyi al
    const { operation, params } = validationResult.data;
    
    // Mevcut kullanıcıyı e-posta ile bul
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    
    // Sadece kendi kullanıcı verilerine erişime izin ver
    // Admin olmayan kullanıcılar sadece kendi verilerine erişebilir
    if (currentUser.role !== 'ADMIN' && params?.userId && params.userId !== currentUser.id) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }
    
    // Desteklenen SQL işlemleri
    switch (operation) {
      case 'GET_USER_THEME': {
        // Prisma'nın güvenli parametreli sorgulama özelliğini kullan
        const userId = params?.userId || currentUser.id;
        
        // SQL sorgusu yerine Prisma kullanımı
        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: { theme: true }
        });
        
        return NextResponse.json({
          theme: profile?.theme || 'LIGHT'
        });
      }
      
      case 'UPDATE_USER_THEME': {
        const userId = params?.userId || currentUser.id;
        const theme = params?.theme;
        
        if (!theme || !['LIGHT', 'DARK', 'SYSTEM'].includes(theme)) {
          return NextResponse.json({ error: 'Geçersiz tema değeri' }, { status: 400 });
        }
        
        // Profili kontrol et
        const existingProfile = await prisma.profile.findUnique({
          where: { userId }
        });
        
        if (existingProfile) {
          // Tema güncelleme (parametre kullanımı)
          await prisma.profile.update({
            where: { userId },
            data: { theme: theme as 'LIGHT' | 'DARK' | 'SYSTEM' }
          });
        } else {
          // Profil yoksa oluştur
          await prisma.profile.create({
            data: {
              userId,
              theme: theme as 'LIGHT' | 'DARK' | 'SYSTEM',
              securityLevel: 'BEGINNER',
              preferredLanguage: 'tr',
              contentPreferences: '[]',
              interests: '[]'
            }
          });
        }
        
        return NextResponse.json({ success: true, message: 'Tema güncellendi' });
      }
      
      case 'GET_USER_SECURITY': {
        const userId = params?.userId || currentUser.id;
        
        // Kullanıcı güvenlik seviyesini al
        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: { 
            securityLevel: true,
            userId: true
          }
        });
        
        // İki faktörlü kimlik doğrulama bilgisini al
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { twoFactorEnabled: true }
        });
        
        return NextResponse.json({
          securityLevel: profile?.securityLevel || 'BEGINNER',
          twoFactorEnabled: user?.twoFactorEnabled || false
        });
      }
      
      case 'UPDATE_USER_SECURITY': {
        const userId = params?.userId || currentUser.id;
        const securityLevel = params?.securityLevel;
        const twoFactorEnabled = params?.twoFactorEnabled;
        
        // Verileri doğrula
        if (securityLevel && !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(securityLevel)) {
          return NextResponse.json({ error: 'Geçersiz güvenlik seviyesi' }, { status: 400 });
        }
        
        // Transaction için tipini any olarak belirtiyoruz
        // Bu durumda linter hatası olmaması için tipini açıkça belirtmek makul bir çözüm
        await prisma.$transaction(async (tx: any) => {
          // İki faktörlü kimlik doğrulama ayarını güncelle
          if (twoFactorEnabled !== undefined) {
            await tx.user.update({
              where: { id: userId },
              data: { twoFactorEnabled: !!twoFactorEnabled }
            });
          }
          
          // Güvenlik seviyesini güncelle
          if (securityLevel) {
            const existingProfile = await tx.profile.findUnique({
              where: { userId }
            });
            
            if (existingProfile) {
              await tx.profile.update({
                where: { userId },
                data: { securityLevel: securityLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' }
              });
            } else {
              await tx.profile.create({
                data: {
                  userId,
                  securityLevel: securityLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                  theme: 'LIGHT',
                  preferredLanguage: 'tr',
                  contentPreferences: '[]',
                  interests: '[]'
                }
              });
            }
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Güvenlik ayarları güncellendi' 
        });
      }
      
      default:
        return NextResponse.json({ error: 'Desteklenmeyen işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('SQL işlemi sırasında hata:', error);
    return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu' }, { status: 500 });
  }
} 