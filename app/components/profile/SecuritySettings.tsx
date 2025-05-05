'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TwoFactorAuth from '../TwoFactorAuth';

export default function SecuritySettings() {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    // 2FA durumunu kontrol et
    const checkTwoFactorStatus = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/auth/two-factor/status?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setTwoFactorEnabled(data.twoFactorEnabled);
          }
        } catch (error) {
          console.error('2FA durum kontrolü hatası:', error);
        }
      }
    };

    checkTwoFactorStatus();
  }, [user?.id]);

  const handleTwoFactorUpdate = async () => {
    // 2FA durumunu yeniden kontrol et
    if (user?.id) {
      try {
        const response = await fetch(`/api/auth/two-factor/status?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTwoFactorEnabled(data.twoFactorEnabled);
        }
      } catch (error) {
        console.error('2FA durum güncellemesi hatası:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Şifre en az 8 karakter uzunluğunda olmalıdır.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Şifre güncellenirken bir hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      console.error('Şifre değiştirme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Güvenlik Ayarları</h2>
      </div>

      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Password Change Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium mb-4">Şifre Değiştirme</h3>
          
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition"
                  disabled={isSubmitting}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Güvenliğiniz için şifrenizi düzenli olarak değiştirmenizi öneririz.
              </p>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Şifre Değiştir
              </button>
            </div>
          )}
        </div>
        
        {/* Two-Factor Authentication */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium mb-4">İki Faktörlü Kimlik Doğrulama (2FA)</h3>
          {user?.id && (
            <TwoFactorAuth 
              isEnabled={twoFactorEnabled} 
              userId={user.id}
              onUpdate={handleTwoFactorUpdate}
            />
          )}
        </div>
        
        {/* Session Management */}
        <div>
          <h3 className="text-lg font-medium mb-4">Oturum Yönetimi</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aktif oturumlarınızı görüntüleyin ve yönetin. Şüpheli bir giriş fark ederseniz, tüm oturumları sonlandırabilirsiniz.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md text-yellow-800 dark:text-yellow-200 mb-4">
            <p>Bu özellik yakında kullanıma sunulacaktır.</p>
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-not-allowed"
            disabled
          >
            Tüm Oturumları Sonlandır
          </button>
        </div>
      </div>
    </div>
  );
}