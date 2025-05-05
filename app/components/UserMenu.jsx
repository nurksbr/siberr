'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AUTH_CHANGE_EVENT } from '../context/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaChartBar, FaLock, FaShieldAlt } from 'react-icons/fa';
import { createPortal } from 'react-dom';

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const [localUser, setLocalUser] = useState(null);
  // İstemci tarafında olduğumuzdan emin olmak için bir bayrak
  const [isMounted, setIsMounted] = useState(false);

  // Dropdown portal için ek state
  const [menuPortal, setMenuPortal] = useState(null);

  // Portal için DOM elementini tanımla
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Eğer zaten bir portal elementi varsa, onu kullan
      let portalContainer = document.getElementById('user-menu-portal');
      if (!portalContainer) {
        // Yoksa yeni bir tane oluştur
        portalContainer = document.createElement('div');
        portalContainer.id = 'user-menu-portal';
        portalContainer.style.position = 'fixed';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.width = '100%';
        portalContainer.style.height = '100%';
        portalContainer.style.pointerEvents = 'none';
        portalContainer.style.zIndex = '99999';
        document.body.appendChild(portalContainer);
      }
      setMenuPortal(portalContainer);
    }
  }, []);

  // Bileşen yüklendiğinde bunu işaretle
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    // Eğer istemci tarafında değilsek, bu kodu çalıştırma
    if (!isMounted) return;
    
    // LocalStorage'da kullanıcı kontrolü
    const checkLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('cyberly_user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('UserMenu: LocalStorage kontrol hatası', error);
        return null;
      }
    };

    // Sayfa yüklendiğinde localStorage kontrolü
    const userData = checkLocalStorage();
    setLocalUser(userData);

    // Düzenli olarak localStorage kontrolü yap
    const interval = setInterval(() => {
      const userData = checkLocalStorage();
      setLocalUser(userData);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);
  
  // Auth değişikliklerini dinle
  useEffect(() => {
    // İstemci tarafında değilsek, event listener'ları ekleme
    if (!isMounted) return;
    
    const handleAuthChange = (event) => {
      console.log('UserMenu: Auth değişiklik olayı alındı', event.detail);
      const { user: authUser } = event.detail;
      setLocalUser(authUser);
    };
    
    // Event listener ekle
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    // Cleanup
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, [isMounted]);

  // user state'i değiştiğinde localUser'ı güncelle
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  // Görüntülenecek kullanıcı bilgisi
  const currentUser = user || localUser;

  // Dışarıya tıklandığında menüyü kapat
  useClickOutside(ref, () => setIsOpen(false));

  // Çıkış işlemi ve ana sayfaya yönlendirme
  const handleLogout = async () => {
    try {
      // Önce localStorage'ı temizle
      localStorage.removeItem('cyberly_user');
      localStorage.removeItem('cyberly_token');
      
      // AuthContext üzerinden çıkış yap
      await logout();
      
      // Menüyü kapat
      setIsOpen(false);
      
      // Ana sayfaya doğrudan yönlendir
      window.location.href = '/';
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
    }
  };

  // İlgili sayfaya yönlendirme
  const handleNavigation = (path) => {
    setIsOpen(false);
    window.location.href = path;
  };

  // Kullanıcı yoksa veya SSR ise menüyü gösterme
  if (!isMounted || !currentUser) {
    return null;
  }

  // Kullanıcı adının ilk harfini ve soyadının ilk harfini göster
  // Eğer bu bilgiler yoksa e-postanın ilk harfini göster
  const getInitials = () => {
    if (!currentUser) return '?';
    if (currentUser.name) {
      const nameParts = currentUser.name.split(' ');
      if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    if (currentUser.email) return currentUser.email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Kullanıcı menüsünü aç</span>
        <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800 transition">
          <FaUserCircle className="w-6 h-6 text-gray-300 mr-2" />
          <span className="max-w-[120px] truncate">{currentUser?.name}</span>
        </div>
      </button>

      {isOpen && menuPortal && createPortal(
        <>
          {/* Overlay to capture clicks outside menu */}
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
            style={{ zIndex: 99990, pointerEvents: 'auto' }}
            aria-hidden="true"
          />
        
          {/* Dropdown menu */}
          <div 
            className="fixed rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{ 
              zIndex: 99999,
              pointerEvents: 'auto',
              width: '14rem',
              top: '60px', 
              right: '20px'
            }}
          >
            {/* Kullanıcı bilgileri */}
            <div className="px-4 py-3">
              <p className="text-sm text-gray-300">Giriş yapan kullanıcı</p>
              <p className="text-sm font-medium text-white truncate">{currentUser.email}</p>
              {currentUser.role === 'ADMIN' && (
                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-800 text-cyan-100">
                  Yönetici
                </span>
              )}
            </div>
            
            {/* Menü öğeleri */}
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              <button
                className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                onClick={() => handleNavigation('/profil')}
                role="menuitem"
              >
                <FaUserCog className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                Profil
              </button>
              
              <button
                className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                onClick={() => handleNavigation('/egitimlerim')}
                role="menuitem"
              >
                <FaChartBar className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                Eğitimlerim
              </button>
              
              <button
                className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                onClick={() => handleNavigation('/ayarlar')}
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ayarlar
              </button>
              
              <button
                className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                onClick={() => handleNavigation('/bildirimler')}
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Bildirimler
              </button>
            </div>
            
            {/* Admin menüsü */}
            {currentUser.role === 'ADMIN' && (
              <div className="py-1">
                <button
                  className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                  onClick={() => handleNavigation('/profil')}
                  role="menuitem"
                >
                  <FaShieldAlt className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                  Yönetim Paneli
                </button>
              </div>
            )}
            
            {/* 2FA Ayarları */}
            <button
              className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
              onClick={() => handleNavigation('/profil?tab=2fa')}
              role="menuitem"
            >
              <FaLock className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
              2FA Ayarları
            </button>
            
            {/* Çıkış */}
            <div className="py-1">
              <button
                className="group flex items-center w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                onClick={handleLogout}
                role="menuitem"
              >
                <FaSignOutAlt className="h-5 w-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                Oturumu Kapat
              </button>
            </div>
          </div>
        </>,
        menuPortal
      )}
    </div>
  );
} 