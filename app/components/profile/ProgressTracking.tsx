'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type ProgressTrackingProps = {
  userId: string | undefined;
};

type CourseProgress = {
  id: string;
  courseId: string;
  course: {
    title: string;
    level: string;
  };
  completedLessons: string[];
  startedAt: string;
  completedAt: string | null;
  lastAccessedAt: string;
  progressPercentage: number;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  earnedAt: string;
  showcased: boolean;
};

type Achievement = {
  totalPoints: number;
  level: number;
  streak: number;
  longestStreak: number;
  completedCourses: number;
  completedLessons: number;
  phishingScore: number | null;
  securityScore: number | null;
  weeklyGoal: number;
  weeklyProgress: number;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  progress: number;
};

export default function ProgressTracking({ userId }: ProgressTrackingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showcasedBadges, setShowcasedBadges] = useState<Badge[]>([]);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'badges' | 'stats' | 'challenges'>('badges');

  useEffect(() => {
    if (userId) {
      fetchUserProgress();
    }
  }, [userId]);

  const fetchUserProgress = async () => {
    try {
      setIsLoading(true);
      // Gerçek API çağrısı burada yapılacak
      // Şimdilik örnek veriler kullanıyoruz
      
      // Örnek kurs ilerlemeleri
      const mockCourseProgress: CourseProgress[] = [
        {
          id: '1',
          courseId: '101',
          course: {
            title: 'Siber Güvenlik Temelleri',
            level: 'BEGINNER'
          },
          completedLessons: ['1', '2', '3', '4'],
          startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: null,
          lastAccessedAt: new Date().toISOString(),
          progressPercentage: 40
        },
        {
          id: '2',
          courseId: '102',
          course: {
            title: 'Phishing Saldırılarını Tanıma',
            level: 'INTERMEDIATE'
          },
          completedLessons: ['1', '2', '3', '4', '5', '6', '7'],
          startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: null,
          lastAccessedAt: new Date().toISOString(),
          progressPercentage: 70
        },
      ];
      
      // Örnek rozetler
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Siber Kahraman',
          description: 'Temel siber güvenlik kursunu tamamladınız',
          imageUrl: '/badges/cyber-hero.svg',
          category: 'COURSE_COMPLETION',
          earnedAt: new Date().toISOString(),
          showcased: true
        },
        {
          id: '2',
          name: 'Phishing Avcısı',
          description: '10 phishing simülasyonunu başarıyla tamamladınız',
          imageUrl: '/badges/phishing-hunter.svg',
          category: 'PHISHING_MASTER',
          earnedAt: new Date().toISOString(),
          showcased: true
        },
        {
          id: '3',
          name: '7 Gün Streak',
          description: '7 gün üst üste platforma giriş yaptınız',
          imageUrl: '/badges/streak-7.svg',
          category: 'STREAK',
          earnedAt: new Date().toISOString(),
          showcased: false
        },
        {
          id: '4',
          name: 'Topluluk Yıldızı',
          description: 'Forumlarda 10 soruya yanıt verdiniz',
          imageUrl: '/badges/community-star.svg',
          category: 'COMMUNITY',
          earnedAt: new Date().toISOString(),
          showcased: false
        },
        {
          id: '5',
          name: 'Şifre Uzmanı',
          description: 'Güvenli şifre oluşturma eğitimini tamamladınız',
          imageUrl: '/badges/password-master.svg',
          category: 'SECURITY_AWARENESS',
          earnedAt: new Date().toISOString(),
          showcased: true
        },
      ];
      
      // Örnek başarılar
      const mockAchievement: Achievement = {
        totalPoints: 1250,
        level: 5,
        streak: 3,
        longestStreak: 14,
        completedCourses: 2,
        completedLessons: 23,
        phishingScore: 85.5,
        securityScore: 72.0,
        weeklyGoal: 120,
        weeklyProgress: 75
      };
      
      // Örnek meydan okumalar
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Siber Güvenlik Maratonu',
          description: '30 gün içinde 10 güvenlik eğitimini tamamlayın',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          progress: 40
        },
        {
          id: '2',
          title: 'Phishing Ustası',
          description: '20 phishing simülasyonunu %90 başarı ile tamamlayın',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          progress: 65
        },
      ];
      
      setCourseProgress(mockCourseProgress);
      setBadges(mockBadges);
      setShowcasedBadges(mockBadges.filter(badge => badge.showcased));
      setAchievement(mockAchievement);
      setChallenges(mockChallenges);
    } catch (error) {
      console.error('İlerleme bilgileri alınırken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowcase = async (badgeId: string) => {
    // Gerçek uygulamada API çağrısı yapılacak
    // Şimdilik sadece UI güncellemesi yapıyoruz
    setBadges(prevBadges => 
      prevBadges.map(badge => 
        badge.id === badgeId 
          ? { ...badge, showcased: !badge.showcased } 
          : badge
      )
    );
    
    // Öne çıkarılan rozetleri güncelle
    setShowcasedBadges(prevShowcased => {
      const badge = badges.find(b => b.id === badgeId);
      if (!badge) return prevShowcased;
      
      if (badge.showcased) {
        return prevShowcased.filter(b => b.id !== badgeId);
      } else {
        // Maksimum 3 rozet öne çıkarılabilir
        const newShowcased = [...prevShowcased, {...badge, showcased: true}];
        return newShowcased.slice(-3);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">İlerleme ve Başarılar</h2>
      
      {/* Seviye ve İlerleme Özeti */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {achievement?.level || 1}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold">Seviye {achievement?.level || 1}</h3>
              <p className="text-gray-600 dark:text-gray-300">{achievement?.totalPoints || 0} Puan</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-center">
              <div className="text-2xl font-bold">{achievement?.streak || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Günlük Seri</div>
            </div>
            <div className="mr-4 text-center">
              <div className="text-2xl font-bold">{achievement?.completedCourses || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Kurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{achievement?.completedLessons || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ders</div>
            </div>
          </div>
        </div>
        
        {/* Haftalık Hedef */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Haftalık Hedef</span>
            <span className="text-sm font-medium">{achievement?.weeklyProgress || 0}/{achievement?.weeklyGoal || 0} dk</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, ((achievement?.weeklyProgress || 0) / (achievement?.weeklyGoal || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Sekmeler */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Kurslar
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'badges' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Rozetler
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            İstatistikler
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'challenges' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Meydan Okumalar
          </button>
        </nav>
      </div>
      
      {/* Kurs İlerlemesi İçeriği */}
      {activeTab === 'courses' && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Kurs İlerlemesi</h3>
        
        {courseProgress.length > 0 ? (
          <div className="space-y-4">
            {courseProgress.map((progress) => (
              <div key={progress.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{progress.course.title}</h4>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    {progress.course.level === 'BEGINNER' ? 'Başlangıç' : 
                     progress.course.level === 'INTERMEDIATE' ? 'Orta Seviye' : 
                     progress.course.level === 'ADVANCED' ? 'İleri Seviye' : 'Uzman'}
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{progress.progressPercentage}% Tamamlandı</span>
                    <span>Başlangıç: {new Date(progress.startedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                
                {progress.completedAt && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Tamamlandı: {new Date(progress.completedAt).toLocaleDateString('tr-TR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Henüz hiçbir kursa başlamadınız.</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Kurslara Göz At
            </button>
          </div>
        )}
      </div>
      )}
      
      {/* Rozet İçeriği */}
      {activeTab === 'badges' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Öne Çıkan Rozetler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {showcasedBadges.length > 0 ? (
              showcasedBadges.map(badge => (
                <div key={badge.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-16 h-16 mb-2 relative">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      {/* Gerçek uygulamada Image komponenti ile rozet resmi gösterilecek */}
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">{badge.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">{badge.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-gray-500 dark:text-gray-400">
                Henüz öne çıkarılan rozet bulunmuyor. Rozetlerinizden en fazla 3 tanesini öne çıkarabilirsiniz.
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Tüm Rozetler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className="border dark:border-gray-700 rounded-lg p-4 flex items-start">
                <div className="w-12 h-12 mr-4 flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    {/* Gerçek uygulamada Image komponenti ile rozet resmi gösterilecek */}
                    <span className="text-xl">🏆</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{badge.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{badge.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}
                    </span>
                    <button 
                      onClick={() => toggleShowcase(badge.id)}
                      className={`text-xs px-2 py-1 rounded ${badge.showcased ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {badge.showcased ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* İstatistikler İçeriği */}
      {activeTab === 'stats' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Güvenlik Skorları */}
            <div className="border dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Güvenlik Skorları</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Phishing Farkındalığı</span>
                  <span>{achievement?.phishingScore || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${achievement?.phishingScore || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Genel Güvenlik Bilgisi</span>
                  <span>{achievement?.securityScore || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${achievement?.securityScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Öğrenme İstatistikleri */}
            <div className="border dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Öğrenme İstatistikleri</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{achievement?.completedCourses || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan Kurs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{achievement?.completedLessons || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan Ders</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{achievement?.longestStreak || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">En Uzun Seri</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold">{badges.length || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Kazanılan Rozet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Meydan Okumalar İçeriği */}
      {activeTab === 'challenges' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Aktif Meydan Okumalar</h3>
          
          {challenges.length > 0 ? (
            <div className="space-y-4">
              {challenges.map(challenge => (
                <div key={challenge.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-1">{challenge.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Bitiş: {new Date(challenge.endDate).toLocaleDateString('tr-TR')}</span>
                    <span>{challenge.progress}% Tamamlandı</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border dark:border-gray-700 rounded-lg">
              Şu anda aktif meydan okuma bulunmuyor. Yakında yeni meydan okumalar eklenecek!
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
              Tüm Meydan Okumaları Gör
            </button>
          </div>
        </div>
      )}
    </div>
  );
}