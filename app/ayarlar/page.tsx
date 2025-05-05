'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function AyarlarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris?callbackUrl=' + encodeURIComponent('/ayarlar'));
    }
  }, [user, loading, router]);

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
      <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <nav className="space-y-2">
              <Link 
                href="/profil"
                className="flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profil Bilgileri</span>
              </Link>
              
              <Link 
                href="/ayarlar/guvenlik"
                className="flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
                </svg>
                <span>Güvenlik Ayarları</span>
              </Link>
              
              <Link 
                href="/ayarlar/bildirimler"
                className="flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Bildirim Tercihleri</span>
              </Link>
              
              <Link 
                href="/ayarlar/gorunum"
                className="flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Görünüm Ayarları</span>
              </Link>
              
              <Link 
                href="/ayarlar/gizlilik"
                className="flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Gizlilik Ayarları</span>
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ayarlar Özeti</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Kullanıcı Bilgileri</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="block"><strong>E-posta:</strong> {user.email}</span>
                  <span className="block"><strong>Kullanıcı Adı:</strong> {user.name || 'Ayarlanmamış'}</span>
                  <span className="block"><strong>Kullanıcı Rolü:</strong> {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}</span>
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Güvenlik Durumu</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">Hesap koruması aktif</span>
                </div>
                <div className="mt-2">
                  <Link 
                    href="/ayarlar/guvenlik"
                    className="text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 text-sm font-medium"
                  >
                    Güvenlik ayarlarını düzenle →
                  </Link>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">İki Faktörlü Kimlik Doğrulama</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Hesabınızı ekstra güvenlik önlemleriyle koruma altına alın.
                </p>
                <Link
                  href="/ayarlar/guvenlik"
                  className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/50 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded-md text-sm font-medium inline-block"
                >
                  İki Faktörlü Kimlik Doğrulama Ayarla
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 