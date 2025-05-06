'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function GuvenlikAyarlariPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State tanımlamaları
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('BEGINNER');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Kullanıcı oturum kontrolü
  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris?callbackUrl=' + encodeURIComponent('/ayarlar/guvenlik'));
    }
  }, [user, loading, router]);

  // Kullanıcı ayarlarını getir
  useEffect(() => {
    if (user) {
      fetchSecuritySettings();
    }
  }, [user]);

  // Güvenlik ayarlarını getir
  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch('/api/settings/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'GET_USER_SECURITY',
        }),
      });

      if (!response.ok) {
        throw new Error('Güvenlik ayarları getirilemedi');
      }

      const data = await response.json();
      setTwoFactorEnabled(data.twoFactorEnabled);
      setSecurityLevel(data.securityLevel);
    } catch (error) {
      console.error('Güvenlik ayarları yüklenirken hata:', error);
      setSaveMessage({
        type: 'error',
        text: 'Güvenlik ayarları yüklenemedi.'
      });
      
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Güvenlik ayarlarını kaydet
  const saveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'UPDATE_USER_SECURITY',
          params: {
            twoFactorEnabled,
            securityLevel,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Güvenlik ayarları güncellenemedi');
      }

      setSaveMessage({
        type: 'success',
        text: 'Güvenlik ayarlarınız güncellendi.'
      });
    } catch (error) {
      console.error('Güvenlik ayarları kaydedilirken hata:', error);
      setSaveMessage({
        type: 'error',
        text: 'Güvenlik ayarları güncellenemedi.'
      });
    } finally {
      setIsSaving(false);
      
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Router zaten yönlendirme yapacak
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/ayarlar"
          className="text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Ayarlara Geri Dön
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Güvenlik Ayarları</h1>
      
      {saveMessage && (
        <div className={`mb-4 p-3 rounded ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'}`}>
          {saveMessage.text}
        </div>
      )}
      
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xl font-semibold">Hesap Güvenlik Seviyesi</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Güvenlik seviyeniz, hesabınıza uygulanacak güvenlik önlemlerini belirler.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <input 
                type="radio" 
                id="r1" 
                name="securityLevel" 
                value="BEGINNER" 
                checked={securityLevel === 'BEGINNER'} 
                onChange={() => setSecurityLevel('BEGINNER')}
                className="mt-1"
              />
              <div>
                <label htmlFor="r1" className="font-medium">Başlangıç</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Temel güvenlik önlemleri. Siber güvenlik konusunda yeni olanlar için uygundur.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <input 
                type="radio" 
                id="r2" 
                name="securityLevel" 
                value="INTERMEDIATE" 
                checked={securityLevel === 'INTERMEDIATE'} 
                onChange={() => setSecurityLevel('INTERMEDIATE')}
                className="mt-1"
              />
              <div>
                <label htmlFor="r2" className="font-medium">Orta</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gelişmiş güvenlik önlemleri. Daha sık şifre değişikliği ve güvenlik uyarıları.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <input 
                type="radio" 
                id="r3" 
                name="securityLevel" 
                value="ADVANCED" 
                checked={securityLevel === 'ADVANCED'} 
                onChange={() => setSecurityLevel('ADVANCED')}
                className="mt-1"
              />
              <div>
                <label htmlFor="r3" className="font-medium">İleri</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Maksimum güvenlik önlemleri. Düzenli güvenlik kontrolleri ve gelişmiş koruma.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-semibold">İki Faktörlü Kimlik Doğrulama</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Hesabınızı ek bir güvenlik katmanıyla koruyun. Giriş yaparken ek bir doğrulama kodu gerekecektir.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">İki Faktörlü Kimlik Doğrulama</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {twoFactorEnabled 
                  ? 'Aktif - Hesabınız ek güvenlik katmanı ile korunuyor.'
                  : 'Pasif - Hesabınız sadece şifre ile korunuyor.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={twoFactorEnabled} 
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-500"></div>
            </label>
          </div>
          
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Not</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    İki faktörlü kimlik doğrulama etkinleştirildiğinde, giriş yaparken cep telefonunuza gönderilen bir kod istenir. Bu özellik henüz demo aşamasındadır.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={saveSecuritySettings} 
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
          >
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
} 