import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'

// Module tipi
interface Module {
  title: string
  description: string
  duration: string
  level: string
  link: string
}

// Video tipi
interface Video {
  title: string
  description: string
  duration: string
  thumbnail: string
}

export default function TrainingModulesPage() {
  // Temel Seviye Eğitimler
  const basicModules: Module[] = [
    {
      title: 'Siber Güvenlik Temelleri',
      description: 'Siber güvenliğin temel kavramları, tehdit türleri ve kişisel güvenlik önlemleri',
      duration: '45 dakika',
      level: 'Temel',
      link: '/egitimler/temel-siber-guvenlik'
    },
    {
      title: 'Güçlü Şifre Oluşturma ve Yönetimi',
      description: 'Güvenli şifre oluşturma, şifre yöneticileri ve çok faktörlü kimlik doğrulama',
      duration: '30 dakika',
      level: 'Temel',
      link: '/egitimler/password-checker'
    },
    {
      title: 'E-posta Güvenliği',
      description: 'Oltalama (phishing) saldırılarını tanıma, e-posta filtreleme ve güvenli iletişim',
      duration: '40 dakika',
      level: 'Temel',
      link: '/egitimler/eposta-guvenligi'
    },
    {
      title: 'Sosyal Medya Güvenliği',
      description: 'Sosyal medya platformlarında güvenlik ayarları, gizlilik ve güvenli paylaşım',
      duration: '35 dakika',
      level: 'Temel',
      link: '/egitimler/sosyal-medya-guvenligi'
    },
    {
      title: 'Phishing Simülasyonu',
      description: 'Oltalama saldırılarını tespit etme ve gerçek/sahte e-postaları ayırt etme alıştırmaları',
      duration: '25 dakika',
      level: 'Temel',
      link: '/egitimler/phishing-simulasyonu'
    }
  ]

  // Orta Seviye Eğitimler
  const intermediateModules: Module[] = [
    {
      title: 'Sosyal Mühendislik Teknikleri',
      description: 'Sosyal mühendislik saldırılarını tanıma, savunma ve bilgi güvenliği farkındalığı',
      duration: '50 dakika',
      level: 'Orta',
      link: '/egitimler/sosyal-muhendislik'
    },
    {
      title: 'Zararlı Yazılım Tespiti ve Önleme',
      description: 'Virüs, trojan, fidye yazılımı gibi tehditleri tanıma ve korunma yöntemleri',
      duration: '45 dakika',
      level: 'Orta',
      link: '/egitimler/malware-detection'
    },
    {
      title: 'Ağ Güvenliği Temelleri',
      description: 'Wi-Fi güvenliği, VPN kullanımı ve güvenli uzaktan çalışma uygulamaları',
      duration: '55 dakika',
      level: 'Orta',
      link: '/egitimler/ag-guvenligi'
    },
    {
      title: 'Mobil Cihaz Güvenliği',
      description: 'Akıllı telefon ve tablet güvenliği, uygulama izinleri ve veri koruma',
      duration: '40 dakika',
      level: 'Orta',
      link: '/egitimler/mobil-guvenlik'
    }
  ]

  // İleri Seviye Eğitimler
  const advancedModules: Module[] = [
    {
      title: 'Veri Sızıntısı Önleme',
      description: 'Hassas verilerin korunması, sızıntı tespiti ve müdahale stratejileri',
      duration: '60 dakika',
      level: 'İleri',
      link: '/egitimler/data-leakage'
    },
    {
      title: 'Bulut Güvenliği',
      description: 'Bulut hizmetlerinde güvenlik, paylaşılan sorumluluk modeli ve güvenli yapılandırma',
      duration: '55 dakika',
      level: 'İleri',
      link: '/egitimler/bulut-guvenligi'
    },
    {
      title: 'Güvenlik Olayları ve Müdahale',
      description: 'Güvenlik ihlallerini tanıma, raporlama ve müdahale prosedürleri',
      duration: '65 dakika',
      level: 'İleri',
      link: '/egitimler/olay-mudahale'
    },
    {
      title: 'Mesleki Siber Güvenlik Uygulamaları',
      description: 'Sektöre özgü siber güvenlik gereksinimleri, standartlar ve en iyi uygulamalar',
      duration: '70 dakika',
      level: 'İleri',
      link: '/egitimler/mesleki-guvenlik'
    }
  ]

  // Öne çıkan video tabanlı eğitimler
  const featuredVideos: Video[] = [
    {
      title: 'Gerçek Hayatta Oltalama Senaryoları',
      description: 'Gerçek oltalama vakalarını inceleyen interaktif video senaryoları',
      duration: '15 dakika',
      thumbnail: 'https://placehold.co/300x180'
    },
    {
      title: 'Sosyal Mühendislik Savunma Taktikleri',
      description: 'Sosyal mühendislik saldırılarına karşı kendini koruma teknikleri',
      duration: '12 dakika',
      thumbnail: 'https://placehold.co/300x180'
    },
    {
      title: 'Fidye Yazılımı Saldırısı: Bir Vaka Analizi',
      description: 'Bir fidye yazılımı saldırısının anatomisi ve alınan dersler',
      duration: '18 dakika',
      thumbnail: 'https://placehold.co/300x180'
    }
  ]

  // Modül kartı bileşeni
  const ModuleCard = ({ module, isActive = false }: { module: Module, isActive?: boolean }) => (
    <Link href={module.link} className="block">
      <div className={`bg-gray-800 rounded-xl p-6 border ${isActive ? 'border-cyan-500' : 'border-gray-700'} hover:border-cyan-500 transition-all shadow-lg h-full`}>
        <div className="flex flex-col h-full">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{module.title}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                module.level === 'Temel' ? 'bg-green-900 text-green-300' :
                module.level === 'Orta' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {module.level}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{module.description}</p>
          </div>
          
          <div className="mt-auto flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {module.duration}
            </div>
            
            <div className={`text-sm ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
              {isActive ? 'Yeni İçerik' : 'Eğitimi Başlat'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )

  // Video kartı bileşeni
  const VideoCard = ({ video }: { video: Video }) => (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all shadow-lg">
      <div className="relative">
        <div className="aspect-video bg-gray-700">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-600 bg-opacity-80 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
        <p className="text-gray-300 text-sm">{video.description}</p>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      
      <main className="bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 bg-gray-900">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute -top-1/4 -right-1/4 h-96 w-96 rounded-full bg-cyan-600 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Siber Güvenlik</span>
                <span className="block text-cyan-400">Eğitim Modülleri</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
                Çeşitli zorluk seviyelerinde, pratik ve etkileyici siber güvenlik eğitimleri
              </p>
            </div>
          </div>
        </section>

        {/* Eğitim Modülleri */}
        <section className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Temel Eğitimler */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-green-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Temel Seviye Eğitimler</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {basicModules.map((module, index) => (
                  <ModuleCard 
                    key={index} 
                    module={module} 
                    isActive={index === 1 || index === 4} // Şifre modülü ve Phishing simülasyonu aktif
                  />
                ))}
              </div>
            </div>
            
            {/* Orta Seviye Eğitimler */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-yellow-900 flex items-center justify-center text-yellow-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Orta Seviye Eğitimler</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {intermediateModules.map((module, index) => (
                  <ModuleCard 
                    key={index} 
                    module={module} 
                    isActive={index === 0 || index === 1} // Sosyal mühendislik ve zararlı yazılım aktif
                  />
                ))}
              </div>
            </div>
            
            {/* İleri Seviye Eğitimler */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center text-red-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">İleri Seviye Eğitimler</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {advancedModules.map((module, index) => (
                  <ModuleCard 
                    key={index} 
                    module={module} 
                    isActive={index === 0} // Veri sızıntısı aktif
                  />
                ))}
              </div>
            </div>
            
            {/* Video Eğitimler */}
            <div>
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Video Eğitimler</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredVideos.map((video, index) => (
                  <VideoCard key={index} video={video} />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* İlerleme İstatistikleri */}
        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Eğitim İlerlemeniz</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Tamamlanan Eğitimler</h3>
                      <p className="text-gray-400 text-sm">Toplam 12 eğitimden</p>
                    </div>
                    <div className="text-3xl font-bold text-white">2</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: '16.7%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Alınan Rozetler</h3>
                      <p className="text-gray-400 text-sm">Toplam başarı sayısı</p>
                    </div>
                    <div className="text-3xl font-bold text-white">3</div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Haftalık Hedef</h3>
                      <p className="text-gray-400 text-sm">Tamamlanan / Hedef</p>
                    </div>
                    <div className="text-3xl font-bold text-white">1/3</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '33.3%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Sıradaki Öneri</h3>
                      <p className="text-gray-400 text-sm">Kişiselleştirilmiş öğrenme yolu</p>
                    </div>
                  </div>
                  <div className="flex items-center text-cyan-400 text-sm font-medium">
                    <span>Sosyal Mühendislik Teknikleri</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
} 