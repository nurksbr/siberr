'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function GorunumAyarlariPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State tanımlamaları
  const [theme, setTheme] = useState('LIGHT');
  const [language, setLanguage] = useState('tr');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Kullanıcı oturum kontrolü
  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris?callbackUrl=' + encodeURIComponent('/ayarlar/gorunum'));
    }
  }, [user, loading, router]);

  // Kullanıcı ayarlarını getir
  useEffect(() => {
    if (user) {
      fetchThemeSettings();
    }
  }, [user]);

  // HTML'in tema sınıfını güncelleme
  useEffect(() => {
    // Tema değiştiğinde HTML'e uygula (client-side)
    if (theme === 'DARK') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'LIGHT') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'SYSTEM') {
      // Sistem temasını kontrol et
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Tema ayarlarını getir
  const fetchThemeSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Tema ayarları getirilemedi');
      }

      const data = await response.json();
      setTheme(data.settings?.theme || 'LIGHT');
      setLanguage(data.settings?.preferredLanguage || 'tr');
    } catch (error) {
      console.error('Tema ayarları yüklenirken hata:', error);
      setSaveMessage({
        type: 'error',
        text: 'Görünüm ayarları yüklenemedi.'
      });
      
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Tema ayarlarını kaydet
  const saveThemeSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          preferredLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Tema ayarları güncellenemedi');
      }

      setSaveMessage({
        type: 'success',
        text: 'Görünüm ayarlarınız başarıyla güncellendi.'
      });
    } catch (error) {
      console.error('Tema ayarları kaydedilirken hata:', error);
      setSaveMessage({
        type: 'error',
        text: 'Görünüm ayarlarınız güncellenirken bir hata oluştu.'
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
      
      <h1 className="text-3xl font-bold mb-8">Görünüm Ayarları</h1>
      
      {saveMessage && (
        <div className={`mb-4 p-3 rounded ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'}`}>
          {saveMessage.text}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Tema Seçimi
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Platformun genel görünümünü kişiselleştirin.
        </p>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-light"
              name="theme"
              value="LIGHT"
              checked={theme === 'LIGHT'}
              onChange={() => setTheme('LIGHT')}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Açık Tema
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-dark"
              name="theme"
              value="DARK"
              checked={theme === 'DARK'}
              onChange={() => setTheme('DARK')}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Koyu Tema
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-system"
              name="theme"
              value="SYSTEM"
              checked={theme === 'SYSTEM'}
              onChange={() => setTheme('SYSTEM')}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sistem Ayarlarına Göre (Otomatik)
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Dil Seçimi
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Platform dilini değiştirin.
        </p>
        
        <div className="mt-4">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="tr">Türkçe</option>
            <option value="en">English (İngilizce)</option>
          </select>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Not: Dil desteği şu anda sınırlıdır.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={saveThemeSettings}
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
} 