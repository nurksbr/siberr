'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Direkt erişim kontrolü
if (typeof window !== 'undefined') {
  try {
    console.log('[Egitimlerim] Sayfa URL ile yükleniyor: ' + window.location.pathname);
    
    // Sayfa yüklenirken sorun olmaması için LocalStorage kontrolü
    const storedUser = localStorage.getItem('cyberly_user');
    if (!storedUser) {
      console.log('[Egitimlerim] Kullanıcı bulunamadı, giriş sayfasına yönlendiriliyor');
      // Router burada kullanamıyoruz çünkü henüz bileşen yüklenmedi
      // window.location.replace kullanmak yerine route değişikliği için yönlendirme yapacağız
      setTimeout(() => {
        window.location.href = '/giris?callbackUrl=/egitimlerim';
      }, 100);
    } else {
      console.log('[Egitimlerim] Kullanıcı bulundu, sayfa yükleniyor');
    }
  } catch (e) {
    console.error('[Egitimlerim] Hata:', e);
  }
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  category: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  videoUrl?: string; // Eğitim videosu URL'si
}

// Video playlist kursu
const videoCourse: Course = {
  id: 'video-course-1',
  title: 'Siber Güvenlik Eğitim Serisi',
  description: 'Kapsamlı siber güvenlik eğitim serisi. Temel kavramlardan ileri tekniklere kadar siber güvenlik konularını öğrenin.',
  progress: 30,
  imageUrl: 'https://placehold.co/600x400/111827/60A5FA?text=Siber+Güvenlik+Eğitimi',
  category: 'Video Eğitim Serisi',
  level: 'Başlangıç',
  videoUrl: 'https://youtube.com/playlist?list=PLGWmuqrfJZRtILSgqBaa7Ur1IegoQCrDU&si=cifoQL9s1hfHRH0v'
};

// Video ID listesi ve başlıkları
const videoItems = [
  { 
    id: 'L_boJQDwV8U', 
    title: 'Siber Güvenlik Temelleri',
    description: 'Temel kavramlar ve giriş düzeyi bilgiler',
    category: 'Temel Eğitim',
    progress: 75
  },
  { 
    id: 'nt0eQ1aKuGI', 
    title: 'Siber Güvenlik Nasıl Öğrenilir',
    description: 'Eğitim ve kariyer yol haritası',
    category: 'Kariyer Rehberi',
    progress: 30
  },
  { 
    id: 'yYJ6yQ-M7Ek', 
    title: 'Yazılım Güvenliği',
    description: 'Güvenli kod geliştirme prensipleri',
    category: 'Geliştirme',
    progress: 45
  },
  { 
    id: 'qRxeL5C2tU8', 
    title: 'Ağ Güvenliği',
    description: 'Ağ güvenliği prensipleri ve tehditler',
    category: 'Ağ Güvenliği',
    progress: 10
  },
  { 
    id: 'xR3UG6zMWU0', 
    title: 'Sosyal Mühendislik',
    description: 'Sosyal mühendislik saldırıları ve korunma yöntemleri',
    category: 'Tehdit Analizi',
    progress: 60
  },
];

// Video ID'lerini ayrı bir değişkende saklayalım
const videoIds = videoItems.map(item => item.id);

const dummyCourses: Course[] = [
  // Videoyu ilk sıraya ekle
  videoCourse,
  {
    id: 'course-1',
    title: 'Siber Güvenlik Temelleri',
    description: 'Siber güvenliğin temel kavramlarını ve ilkelerini öğrenin.',
    progress: 75,
    imageUrl: 'https://placehold.co/600x400/111827/60A5FA?text=Siber+Güvenlik+Temelleri',
    category: 'Temel Eğitim',
    level: 'Başlangıç'
  },
  {
    id: 'course-2',
    title: 'Sosyal Mühendislik Saldırıları',
    description: 'Sosyal mühendislik taktikleri ve bunlardan korunma yöntemleri.',
    progress: 30,
    imageUrl: 'https://placehold.co/600x400/111827/60A5FA?text=Sosyal+Mühendislik',
    category: 'Tehdit Analizi',
    level: 'Orta'
  },
  {
    id: 'course-3',
    title: 'Güçlü Şifre Politikaları',
    description: 'Kurumsal ve kişisel güçlü şifre politikaları oluşturma.',
    progress: 100,
    imageUrl: 'https://placehold.co/600x400/111827/60A5FA?text=Şifre+Politikaları',
    category: 'Güvenlik Uygulamaları',
    level: 'Başlangıç'
  },
  {
    id: 'course-4',
    title: 'Ağ Güvenliği',
    description: 'Ağ güvenliği temelleri ve saldırı tespit sistemleri.',
    progress: 0,
    imageUrl: 'https://placehold.co/600x400/111827/60A5FA?text=Ağ+Güvenliği',
    category: 'Ağ Güvenliği',
    level: 'İleri'
  },
];

export default function CoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Kullanıcı kontrolü
    if (typeof window !== 'undefined') {
      const checkAuth = async () => {
        const storedUser = localStorage.getItem('cyberly_user');
        
        if (storedUser) {
          console.log('Eğitimlerim: Kullanıcı localStorage\'da bulundu');
          setIsAuthorized(true);
        } else if (!loading && !user) {
          console.log('Eğitimlerim: Kullanıcı giriş yapmamış, yönlendiriliyor');
          router.push('/giris?callbackUrl=' + encodeURIComponent('/egitimlerim'));
        } else if (user) {
          setIsAuthorized(true);
        }
      };
      
      checkAuth();
    }
  }, [user, loading, router]);

  // Kullanıcı giriş yapmamışsa veya SSR ise
  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  // Kullanıcı giriş yapmamışsa ve istemci tarafındayız
  if (!isAuthorized && mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
          <button
            onClick={() => router.push('/giris?callbackUrl=' + encodeURIComponent('/egitimlerim'))}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-900 min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-8">Eğitimlerim</h1>
          
          {/* Video Eğitim Serisi */}
          <section className="mb-12">            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoItems.map((video) => (
                <a 
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"  
                  className="block"
                >
                  {/* Kurs Kartı */}
                  <div className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 h-full flex flex-col relative group hover:border-cyan-700 transition-all duration-300">
                    {/* Üst kısım - Video Önizleme */}
                    <div className="relative pt-[60%]">
                      <img 
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-50"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h3 className="text-2xl font-bold text-cyan-400 mb-1">{video.title}</h3>
                      </div>
                    </div>
                    
                    {/* Alt kısım - Detaylar */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400">{video.category}</span>
                          <span className="text-xs font-semibold text-cyan-400">{video.progress}% Tamamlandı</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{video.description}</p>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                          <div 
                            className="bg-cyan-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
                            style={{ width: `${video.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors">
                        Kursa Devam Et
                      </button>
                    </div>
                  </div>
                </a>
              ))}
              
              {/* YouTube Oynatma Listesi Kartı */}
              <a 
                href={videoCourse.videoUrl}
                target="_blank"
                rel="noopener noreferrer"  
                className="block"
              >
                <div className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 h-full flex flex-col relative group hover:border-red-700 transition-all duration-300">
                  <div className="relative pt-[60%] bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <h3 className="text-2xl font-bold text-red-400 mb-1">Siber Güvenlik Eğitim Serisi</h3>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">YouTube Eğitim Serisi</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">Tüm siber güvenlik eğitim serisi. Temel kavramlardan ileri tekniklere kadar siber güvenlik konularını kapsayan kapsamlı YouTube oynatma listesi.</p>
                    </div>
                    
                    <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                      </svg>
                      Tüm Oynatma Listesini Görüntüle
                    </button>
                  </div>
                </div>
              </a>
            </div>
          </section>
          
          {/* Aktif kurslar */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Aktif Kurslarım</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.filter(course => course.id !== 'video-course-1' && course.progress > 0 && course.progress < 100).map((course, index) => (
                <div 
                  key={course.id}
                  className="bg-[#111827] rounded-lg overflow-hidden border border-gray-800 h-full flex flex-col relative group hover:border-cyan-700 transition-all duration-300"
                >
                  <div className="relative pt-[60%]">
                    <img 
                      src={course.imageUrl}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-1">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">{course.category}</span>
                        <span className="text-xs font-semibold text-cyan-400">{course.progress}% Tamamlandı</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors">
                      Kursa Devam Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Tamamlanan kurslar */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-green-400 mb-6">Tamamlanan Kurslar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.filter(course => course.progress === 100).map(course => (
                <div 
                  key={course.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 shadow-xl"
                >
                  <div className="h-48 relative">
                    <Image 
                      src={course.imageUrl} 
                      alt={course.title}
                      fill
                      style={{objectFit: 'cover'}}
                      className="w-full"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-green-900/30 flex items-center justify-center">
                      <div className="bg-green-600 text-white text-sm font-bold py-1 px-3 rounded-full transform rotate-12">
                        TAMAMLANDI
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{course.category}</span>
                      <span className="text-xs font-semibold text-green-400">100% Tamamlandı</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    
                    <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                      Sertifikayı Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Önerilen kurslar */}
          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-6">Önerilen Kurslar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.filter(course => course.progress === 0).map((course, index) => (
                <div 
                  key={course.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-xl"
                >
                  <div className="h-48 relative">
                    <Image 
                      src={course.imageUrl} 
                      alt={course.title}
                      fill
                      style={{objectFit: 'cover'}}
                      className="w-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 4}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-600 text-xs text-white rounded-md">
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{course.category}</span>
                      <span className="text-xs font-semibold text-purple-400">Yeni</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    
                    <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                      Kursa Başla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  )
} 