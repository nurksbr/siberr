'use client';

import { useState } from 'react';

type AppearanceSettingsProps = {
  profileData: any;
  onUpdate: () => void;
};

export default function AppearanceSettings({ profileData, onUpdate }: AppearanceSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    theme: profileData?.theme || 'LIGHT',
    preferredLanguage: profileData?.preferredLanguage || 'tr',
    contentPreferences: profileData?.contentPreferences || [],
  });

  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({ ...prev, theme }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }));
  };

  const handleContentPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, contentPreferences: [...prev.contentPreferences, value] };
      } else {
        return { ...prev, contentPreferences: prev.contentPreferences.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Görünüm ayarları başarıyla güncellendi.' });
        onUpdate(); // Refresh profile data
      } else {
        setMessage({ type: 'error', text: data.error || 'Görünüm ayarları güncellenirken bir hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      console.error('Görünüm ayarları güncelleme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Görünüm Ayarları</h2>
      </div>

      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Theme Selection */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium mb-4">Tema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`p-4 border rounded-md cursor-pointer transition ${formData.theme === 'LIGHT' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
                onClick={() => handleThemeChange('LIGHT')}
              >
                <div className="h-24 bg-white border border-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-800">
                  <span>Açık Tema</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="lightTheme"
                    name="theme"
                    checked={formData.theme === 'LIGHT'}
                    onChange={() => handleThemeChange('LIGHT')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="lightTheme" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Açık
                  </label>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-md cursor-pointer transition ${formData.theme === 'DARK' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
                onClick={() => handleThemeChange('DARK')}
              >
                <div className="h-24 bg-gray-900 border border-gray-700 rounded-md mb-2 flex items-center justify-center text-white">
                  <span>Koyu Tema</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="darkTheme"
                    name="theme"
                    checked={formData.theme === 'DARK'}
                    onChange={() => handleThemeChange('DARK')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="darkTheme" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Koyu
                  </label>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-md cursor-pointer transition ${formData.theme === 'SYSTEM' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600'}`}
                onClick={() => handleThemeChange('SYSTEM')}
              >
                <div className="h-24 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-md mb-2 flex items-center justify-center">
                  <span className="bg-white bg-opacity-70 px-2 py-1 rounded">Sistem Teması</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="systemTheme"
                    name="theme"
                    checked={formData.theme === 'SYSTEM'}
                    onChange={() => handleThemeChange('SYSTEM')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="systemTheme" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sistem
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium mb-4">Dil</h3>
            <div className="max-w-xs">
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleLanguageChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          
          {/* Content Preferences */}
          <div>
            <h3 className="text-lg font-medium mb-4">İçerik Tercihleri</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              İlgilendiğiniz içerik türlerini seçin. Bu tercihler, size gösterilen içerikleri kişiselleştirmemize yardımcı olacaktır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-phishing"
                  value="phishing"
                  checked={formData.contentPreferences.includes('phishing')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-phishing" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Oltalama (Phishing) Saldırıları
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-malware"
                  value="malware"
                  checked={formData.contentPreferences.includes('malware')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-malware" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zararlı Yazılımlar
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-social-engineering"
                  value="social-engineering"
                  checked={formData.contentPreferences.includes('social-engineering')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-social-engineering" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sosyal Mühendislik
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-password-security"
                  value="password-security"
                  checked={formData.contentPreferences.includes('password-security')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-password-security" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Şifre Güvenliği
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-data-privacy"
                  value="data-privacy"
                  checked={formData.contentPreferences.includes('data-privacy')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-data-privacy" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Veri Gizliliği
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pref-network-security"
                  value="network-security"
                  checked={formData.contentPreferences.includes('network-security')}
                  onChange={handleContentPreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pref-network-security" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ağ Güvenliği
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}