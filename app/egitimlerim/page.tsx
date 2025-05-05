'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  category: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
}

const dummyCourses: Course[] = [
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
          <h1 className="text-3xl font-bold text-white mb-8">Eğitimlerim</h1>
          
          {/* Aktif kurslar */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Aktif Kurslarım</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.filter(course => course.progress > 0 && course.progress < 100).map(course => (
                <div 
                  key={course.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 shadow-xl"
                >
                  <div className="h-48 relative">
                    <Image 
                      src={course.imageUrl} 
                      alt={course.title}
                      fill
                      style={{objectFit: 'cover'}}
                      className="w-full"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-600 text-xs text-white rounded-md">
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{course.category}</span>
                      <span className="text-xs font-semibold text-cyan-400">{course.progress}% Tamamlandı</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
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
              {dummyCourses.filter(course => course.progress === 0).map(course => (
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
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-xs text-white rounded-md">
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