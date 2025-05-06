import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

// Güvenlik için giriş doğrulama şeması
const settingsSchema = z.object({
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  preferredLanguage: z.string().min(2).max(5).optional(),
  contentPreferences: z.array(z.string()).optional(),
  securityLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  twoFactorEnabled: z.boolean().optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    security: z.boolean().optional(),
    marketing: z.boolean().optional(),
    courses: z.boolean().optional(),
  }).optional(),
});

// PUT /api/settings/update
export async function PUT(request: NextRequest) {
  try {
    // Kullanıcı oturumunu doğrula
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }
    
    // Mevcut kullanıcıyı bul
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        profile: true,
      }
    });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    
    // İstek gövdesini al ve doğrula
    const requestBody = await request.json();
    
    // Zod ile veri doğrulama
    const validationResult = settingsSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Geçersiz veri formatı', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const validatedData = validationResult.data;
    
    // Kullanıcı ayarlarını güncelleme işlemleri
    // Veritabanı işlemleri için parametreli SQL sorguları kullanılıyor
    
    // 1. İki faktörlü kimlik doğrulama ayarlarını güncelle
    if (validatedData.twoFactorEnabled !== undefined) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { 
          twoFactorEnabled: validatedData.twoFactorEnabled 
        }
      });
    }
    
    // 2. Profil ayarlarını güncelle
    const profileData: any = {};
    
    if (validatedData.theme !== undefined) profileData.theme = validatedData.theme;
    if (validatedData.preferredLanguage !== undefined) profileData.preferredLanguage = validatedData.preferredLanguage;
    if (validatedData.securityLevel !== undefined) profileData.securityLevel = validatedData.securityLevel;
    
    // Content preferences JSON olarak saklanıyor
    if (validatedData.contentPreferences !== undefined) {
      profileData.contentPreferences = JSON.stringify(validatedData.contentPreferences);
    }
    
    // Profil varsa güncelle, yoksa oluştur
    if (Object.keys(profileData).length > 0) {
      if (currentUser.profile) {
        await prisma.profile.update({
          where: { userId: currentUser.id },
          data: profileData
        });
      } else {
        await prisma.profile.create({
          data: {
            ...profileData,
            userId: currentUser.id,
            theme: validatedData.theme || 'LIGHT',
            securityLevel: validatedData.securityLevel || 'BEGINNER',
            preferredLanguage: validatedData.preferredLanguage || 'tr',
            contentPreferences: validatedData.contentPreferences ? 
              JSON.stringify(validatedData.contentPreferences) : 
              '[]',
            interests: '[]'
          }
        });
      }
    }
    
    // 3. Bildirim tercihlerini güncelle
    if (validatedData.notificationPreferences) {
      const notificationData: any = {};
      const preferences = validatedData.notificationPreferences;
      
      if (preferences.email !== undefined) notificationData.emailNotifications = preferences.email;
      if (preferences.push !== undefined) notificationData.pushNotifications = preferences.push;
      if (preferences.security !== undefined) notificationData.securityAlerts = preferences.security;
      if (preferences.marketing !== undefined) notificationData.marketingEmails = preferences.marketing;
      if (preferences.courses !== undefined) notificationData.courseUpdates = preferences.courses;
      
      // Bildirim tercihleri varsa güncelle, yoksa oluştur
      const existingPrefs = await prisma.notificationPreferences.findUnique({
        where: { profileId: currentUser.profile?.id }
      });
      
      if (existingPrefs && currentUser.profile) {
        await prisma.notificationPreferences.update({
          where: { profileId: currentUser.profile.id },
          data: notificationData
        });
      } else if (currentUser.profile) {
        await prisma.notificationPreferences.create({
          data: {
            ...notificationData,
            profileId: currentUser.profile.id
          }
        });
      }
    }
    
    // Güncel kullanıcı bilgilerini getir
    const updatedUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        profile: {
          include: {
            notificationPrefs: true
          }
        }
      }
    });
    
    // Yanıt formatını düzenle
    const responseData = {
      message: 'Ayarlar başarıyla güncellendi',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        twoFactorEnabled: updatedUser?.twoFactorEnabled,
        profile: updatedUser?.profile ? {
          theme: updatedUser.profile.theme,
          preferredLanguage: updatedUser.profile.preferredLanguage,
          securityLevel: updatedUser.profile.securityLevel,
          contentPreferences: updatedUser.profile.contentPreferences ? 
            JSON.parse(updatedUser.profile.contentPreferences) : 
            [],
          notificationPreferences: updatedUser.profile.notificationPrefs
        } : null
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Ayarlar güncellenirken hata:', error);
    return NextResponse.json({ error: 'Ayarlar güncellenemedi' }, { status: 500 });
  }
}

// GET /api/settings/update
export async function GET(request: NextRequest) {
  try {
    // Kullanıcı oturumunu doğrula
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }
    
    // Kullanıcı bilgilerini getir
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        profile: {
          include: {
            notificationPrefs: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }
    
    // Yanıt formatını düzenle
    const responseData = {
      id: user.id,
      email: user.email,
      name: user.name,
      twoFactorEnabled: user.twoFactorEnabled,
      profile: user.profile ? {
        theme: user.profile.theme,
        preferredLanguage: user.profile.preferredLanguage,
        securityLevel: user.profile.securityLevel,
        contentPreferences: user.profile.contentPreferences ? 
          JSON.parse(user.profile.contentPreferences) : 
          [],
        notificationPreferences: user.profile.notificationPrefs
      } : null
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error);
    return NextResponse.json({ error: 'Ayarlar getirilemedi' }, { status: 500 });
  }
} 