'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Kullanıcı tipi
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Auth context tipleri
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage anahtarı
const USER_STORAGE_KEY = 'cyberly_user';

// Özel olay ekleyelim - oturum değişikliği için
export const AUTH_CHANGE_EVENT = 'auth_state_changed';

// LocalStorage'dan kullanıcı bilgisini al
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('LocalStorage hatası:', error);
    return null;
  }
};

// LocalStorage'a kullanıcı bilgisini kaydet
const storeUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      // Özel olay tetikle
      const authEvent = new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user } });
      window.dispatchEvent(authEvent);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      // Özel olay tetikle - çıkış durumu
      const authEvent = new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user: null } });
      window.dispatchEvent(authEvent);
    }
  } catch (error) {
    console.error('LocalStorage kayıt hatası:', error);
  }
};

// Cookie alıcı (istemci tarafında çalışır)
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return part.split(';').shift() || null;
    }
  }
  return null;
};

// JWT token çözümleyici
const parseJwt = (token: string) => {
  try {
    return jwtDecode<{
      userId: string;
      email: string;
      role: string;
      exp: number;
    }>(token);
  } catch (e) {
    console.error('Token çözümleme hatası:', e);
    return null;
  }
};

// Token geçerli mi kontrol et
const isTokenValid = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded) return false;
  
  // Süre kontrolü
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// AuthProvider bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
  // LocalStorage'dan başlangıç kullanıcı durumu
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Kullanıcı durumu değiştiğinde LocalStorage'ı güncelle
  useEffect(() => {
    storeUser(user);
  }, [user]);

  // Sayfa yüklendiğinde oturum durumunu kontrol et
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Eğer kullanıcı zaten varsa tekrar kontrol etmeye gerek yok
        if (user) {
          setLoading(false);
          return;
        }

        // LocalStorage'daki kullanıcı bilgisini kontrol et
        const storedUser = getStoredUser();
        if (storedUser) {
          // Kullanıcı bilgisi localStorage'da varsa doğrudan kullan
          setUser(storedUser);
          setLoading(false);
          return;
        }

        const isAuthenticated = await checkAuth();
        
        // Callback URL'i kontrol et
        const callbackUrl = searchParams?.get('callbackUrl');
        
        // Kullanıcı giriş yapmış ve bir callback URL varsa, pathname'e bakmaksızın yönlendir
        if (isAuthenticated && callbackUrl && callbackUrl !== pathname) {
          console.log(`Callback URL'e yönlendiriliyor: ${callbackUrl}`);
          router.push(decodeURIComponent(callbackUrl));
        }
      } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [pathname, router, searchParams]);

  // Kullanıcı oturumunu kontrol et
  const checkAuth = async (): Promise<boolean> => {
    try {
      // LocalStorage'da oturum varsa kontrol et
      const storedUser = getStoredUser();
      if (storedUser) {
        // Sadece istemci tarafı doğrulama yaparak işlemi hızlandır
        setUser(storedUser);
        return true;
      }
      
      // İstemci tarafında cookie kontrolü yap
      const token = getCookie('auth_token');
      
      if (!token) {
        setUser(null);
        storeUser(null);
        return false;
      }
      
      // Token geçerliliğini istemci tarafında kontrol et
      if (!isTokenValid(token)) {
        setUser(null);
        storeUser(null);
        return false;
      }
      
      // Token geçerli, sunucu doğrulamasına git
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Kullanıcı bilgisini güncelle
          setUser(data.user);
          storeUser(data.user);
          return true;
        }
      }
      
      // Sunucu tarafından doğrulama yapılamadıysa kullanıcı state'ini temizle
      setUser(null);
      storeUser(null);
      return false;
    } catch (error) {
      console.error('checkAuth: Oturum kontrolü hatası:', error);
      setUser(null);
      storeUser(null);
      return false;
    }
  };

  // Giriş fonksiyonu
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    console.log('AuthContext login fonksiyonu başladı');
    try {
      console.log('API isteği gönderiliyor...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      });

      const data = await response.json();
      console.log('API yanıtı alındı:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || 'Giriş yapılırken bir hata oluştu');
      }

      // Kullanıcı bilgilerini doğrudan yanıttan al
      if (data.user) {
        console.log('Kullanıcı bilgileri alındı, state güncelleniyor');
        setUser(data.user);
        
        // Kullanıcıyı localStorage'a kaydetme işlemini güçlendirelim
        try {
          // Önce localStorage'ı temizle
          localStorage.removeItem(USER_STORAGE_KEY);
          // Sonra yeni kullanıcı bilgilerini kaydet
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          console.log('Kullanıcı bilgileri localStorage\'a kaydedildi', data.user);
          
          // Kullanıcı state'ini güncelle
          storeUser(data.user);
        } catch (storageError) {
          console.error('LocalStorage kayıt hatası:', storageError);
        }
        
        // Navbar'ı ve diğer bileşenleri bilgilendir
        if (typeof window !== 'undefined') {
          // Olay yayınla - hızlı güncelleme için
          const authEvent = new CustomEvent(AUTH_CHANGE_EVENT, { 
            detail: { user: data.user, loggedIn: true } 
          });
          window.dispatchEvent(authEvent);
        }
        
        // Callback URL varsa doğrudan yönlendir, yoksa ana sayfaya
        const callbackUrl = searchParams?.get('callbackUrl');
        console.log('Callback URL:', callbackUrl);
        
        if (callbackUrl) {
          console.log(`Callback URL'e yönlendiriliyor: ${callbackUrl}`);
          // Sayfayı tamamen yenile
          window.location.href = decodeURIComponent(callbackUrl);
        } else {
          // Ana sayfaya yönlendir - tamamen sayfa yenilemesi ile
          console.log('Kullanıcı giriş yaptı, ana sayfaya yönlendiriliyor');
          window.location.href = '/';
        }
      } else {
        // Oturum durumunu kontrol et
        console.log('Kullanıcı bilgisi bulunamadı, checkAuth çağrılıyor');
        await checkAuth();
      }
    } catch (error) {
      console.error('Login fonksiyonu hatası:', error);
      throw error;
    } finally {
      setLoading(false);
      console.log('Login fonksiyonu tamamlandı, loading:', false);
    }
  };

  // Çıkış işlemi
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Çıkış yapılırken bir hata oluştu');
      }

      setUser(null);
      storeUser(null);
      
      // Navbar'ı ve diğer bileşenleri bilgilendir
      if (typeof window !== 'undefined') {
        // Olay yayınla - hızlı güncelleme için
        const authEvent = new CustomEvent(AUTH_CHANGE_EVENT, { 
          detail: { user: null, loggedIn: false } 
        });
        window.dispatchEvent(authEvent);
        
        // Sayfayı yenilemeden ana sayfaya yönlendir
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Auth context hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  return context;
}