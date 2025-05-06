import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/prisma';

// GET /api/settings
export async function GET(request: NextRequest) {
  try {
    // Kullanıcı oturumunu doğrula
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }
    
    // Kullanıcıyı e-posta ile bul
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
    
    // Güvenli yanıt formatı - hassas bilgileri içermez
    const safeUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      twoFactorEnabled: user.twoFactorEnabled,
      settings: {
        theme: user.profile?.theme || 'LIGHT',
        preferredLanguage: user.profile?.preferredLanguage || 'tr',
        securityLevel: user.profile?.securityLevel || 'BEGINNER',
        contentPreferences: user.profile?.contentPreferences ? 
          JSON.parse(user.profile.contentPreferences) : 
          [],
        notifications: user.profile?.notificationPrefs ? {
          emailNotifications: user.profile.notificationPrefs.emailNotifications,
          pushNotifications: user.profile.notificationPrefs.pushNotifications,
          securityAlerts: user.profile.notificationPrefs.securityAlerts,
          marketingEmails: user.profile.notificationPrefs.marketingEmails,
          courseUpdates: user.profile.notificationPrefs.courseUpdates
        } : null
      }
    };
    
    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('Kullanıcı ayarları getirilirken hata:', error);
    return NextResponse.json({ error: 'Kullanıcı ayarları getirilemedi' }, { status: 500 });
  }
} 