'use client';

import { useState } from 'react';

type NotificationSettingsProps = {
  profileData: any;
  onUpdate: () => void;
};

export default function NotificationSettings({ profileData, onUpdate }: NotificationSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    emailNotifications: profileData?.notificationPrefs?.emailNotifications ?? true,
    smsNotifications: profileData?.notificationPrefs?.smsNotifications ?? false,
    securityAlerts: profileData?.notificationPrefs?.securityAlerts ?? true,
    newsUpdates: profileData?.notificationPrefs?.newsUpdates ?? true,
    courseUpdates: profileData?.notificationPrefs?.courseUpdates ?? true,
    marketingEmails: profileData?.notificationPrefs?.marketingEmails ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Bildirim tercihleri başarıyla güncellendi.' });
        onUpdate(); // Refresh profile data
      } else {
        setMessage({ type: 'error', text: data.error || 'Bildirim tercihleri güncellenirken bir hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      console.error('Bildirim tercihleri güncelleme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Bildirim Tercihleri</h2>
      </div>

      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium mb-4">Bildirim Kanalları</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta Bildirimleri
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SMS Bildirimleri
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium mb-4">Bildirim Türleri</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="securityAlerts"
                  name="securityAlerts"
                  checked={formData.securityAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="securityAlerts" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Güvenlik Uyarıları
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsUpdates"
                  name="newsUpdates"
                  checked={formData.newsUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsUpdates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Haber Güncellemeleri
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="courseUpdates"
                  name="courseUpdates"
                  checked={formData.courseUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="courseUpdates" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kurs Güncellemeleri
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingEmails"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="marketingEmails" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pazarlama E-postaları
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
            {isSubmitting ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}