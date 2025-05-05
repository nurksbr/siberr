'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

// Profile sections
import ProfileInfo from '../components/profile/ProfileInfo';
import SecuritySettings from '../components/profile/SecuritySettings';
import NotificationSettings from '../components/profile/NotificationSettings';
import AppearanceSettings from '../components/profile/AppearanceSettings';
import ProgressTracking from '../components/profile/ProgressTracking';

type ProfileTab = 'info' | 'security' | 'notifications' | 'appearance' | 'progress';

// Kullanıcı tipini tanımlayalım
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  
  // Sayfa yüklendiğinde veya searchParams değiştiğinde çalışır
  useEffect(() => {
    // URL'den tab parametresini al
    const tabParam = searchParams?.get('tab');
    if (tabParam) {
      setActiveTab(tabParam as ProfileTab);
    }
    
    // LocalStorage'dan kullanıcı bilgilerini kontrol et
    const checkLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('cyberly_user');
        console.log('Profil: LocalStorage kontrolü', storedUser);
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          return true;
        }
        return false;
      } catch (error) {
        console.error('LocalStorage hatası:', error);
        return false;
      }
    };
    
    // Kullanıcı kontrolü ve yönlendirme
    const checkUser = async () => {
      // İlk önce localStorage'ı kontrol et (daha hızlı yanıt için)
      const hasLocalUser = checkLocalStorage();
      
      // Eğer localStorage'da kullanıcı yoksa ve useAuth hook'undan gelen kullanıcı yoksa
      if (!hasLocalUser && !user && !loading) {
        console.log('Kullanıcı giriş yapmamış, yönlendiriliyor...');
        router.push('/giris?callbackUrl=/profil');
      } else if (user) {
        // useAuth hook'undan kullanıcı gelirse state'i güncelle
        setUserData(user as User);
      }
    };
    
    // Kullanıcı kontrolü sadece useEffect içinde yapılmalı
    if (!loading) {
      checkUser();
    }
  }, [user, loading, router, searchParams]);

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Kullanıcı yoksa ve yükleme tamamlandıysa, bir yükleniyor ekranı göster
  // Router.push işlemini render sırasında çağırmak yerine boş bir içerik gösteriyoruz
  // Yönlendirme useEffect içerisinde gerçekleşecek
  if (!userData && !loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Profil Sayfam</h1>
                {userData && userData.role === 'ADMIN' && (
                  <span className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full">Admin</span>
                )}
                {userData && userData.role === 'USER' && (
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">Kullanıcı</span>
                )}
              </div>
              
              {/* Profil bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-4">
                        {userData?.avatarUrl ? (
                          <Image 
                            src={userData.avatarUrl} 
                            alt="Profil fotoğrafı" 
                            fill 
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-cyan-800 flex items-center justify-center text-3xl text-white">
                            {userData?.name?.charAt(0) || (userData?.email ? userData.email.charAt(0).toUpperCase() : 'U')}
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-1">{userData?.name || 'Kullanıcı'}</h2>
                      <p className="text-gray-400 text-sm mb-4">{userData?.email || 'kullanici@ornek.com'}</p>
                      <div className="w-full bg-gray-600 h-1 mb-4"></div>
                      <ul className="space-y-2 w-full">
                        <li>
                          <button 
                            onClick={() => setActiveTab('info')}
                            className={`w-full text-left px-4 py-2 rounded-md ${
                              activeTab === 'info' ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Profil Bilgileri
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full text-left px-4 py-2 rounded-md ${
                              activeTab === 'security' ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Güvenlik Ayarları
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full text-left px-4 py-2 rounded-md ${
                              activeTab === 'notifications' ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            Bildirim Tercihleri
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {activeTab === 'info' && (
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white mb-6">Profil Bilgileri</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
                          <div className="bg-gray-600 px-4 py-3 rounded-md text-white">{userData?.name || 'Belirtilmemiş'}</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">E-posta Adresi</label>
                          <div className="bg-gray-600 px-4 py-3 rounded-md text-white">{userData?.email || 'Belirtilmemiş'}</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Kullanıcı Rolü</label>
                          <div className="bg-gray-600 px-4 py-3 rounded-md text-white">
                            {userData?.role === 'ADMIN' ? 'Yönetici' : 'Standart Kullanıcı'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Hesap Durumu</label>
                          <div className="bg-green-600/30 border border-green-500 px-4 py-3 rounded-md text-green-300">Aktif</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'security' && (
                    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white mb-6">Güvenlik Ayarları</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-white mb-3">Şifre Değiştir</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Mevcut Şifre</label>
                              <input 
                                type="password" 
                                className="w-full bg-gray-600 border border-gray-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre</label>
                              <input 
                                type="password" 
                                className="w-full bg-gray-600 border border-gray-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre (Tekrar)</label>
                              <input 
                                type="password" 
                                className="w-full bg-gray-600 border border-gray-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors">
                              Şifreyi Güncelle
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-600 pt-6">
                          <h4 className="text-lg font-medium text-white mb-3">Oturum Güvenliği</h4>
                          <div className="bg-gray-600/50 p-4 rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">Aktif Oturumlar</p>
                                <p className="text-gray-400 text-sm">Tüm cihazlardaki oturumlarınızı yönetin</p>
                              </div>
                              <button className="px-4 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-700 transition-colors">
                                Tüm Oturumları Sonlandır
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}