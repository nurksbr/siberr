'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface NewsItem {
  title: string
  date: string
  category: string
  excerpt: string
  url: string
  source: string
  imageUrl?: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        // RSS feedlerden haberleri çek
        const feeds = [
          {
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.bleepingcomputer.com/feed/',
            source: 'BleepingComputer'
          },
          {
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.darkreading.com/rss.xml',
            source: 'Dark Reading'
          },
          {
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://krebsonsecurity.com/feed/',
            source: 'KrebsOnSecurity'
          },
          {
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://thehackernews.com/feed/',
            source: 'The Hacker News'
          }
        ]

        const allNews: NewsItem[] = []

        for (const feed of feeds) {
          try {
            const response = await fetch(feed.url)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            
            if (data.items) {
              const items = data.items.map((item: {
                title?: string;
                pubDate?: string;
                contentSnippet?: string;
                link?: string;
                thumbnail?: string;
                enclosure?: { link?: string };
                image?: { url?: string; link?: string };
                media?: { 
                  content?: { url?: string };
                  thumbnail?: { url?: string };
                };
                'media:content'?: { $: { url?: string } };
                'media:thumbnail'?: { $: { url?: string } };
                content?: string;
              }) => {
                // Resim URL'sini farklı alanlardan almayı dene
                let imageUrl = item.thumbnail || 
                             item.enclosure?.link || 
                             item.image?.url || 
                             item.image?.link ||
                             item.media?.content?.url ||
                             item.media?.thumbnail?.url ||
                             item['media:content']?.$.url ||
                             item['media:thumbnail']?.$.url;

                // Eğer resim URL'si yoksa, içerikten resim URL'si çıkarmayı dene
                if (!imageUrl && item.content) {
                  const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                  if (imgMatch) {
                    imageUrl = imgMatch[1];
                  }
                }

                // URL'yi düzelt (gerekirse)
                if (imageUrl) {
                  if (!imageUrl.startsWith('http')) {
                    imageUrl = `https:${imageUrl}`;
                  }
                  // URL'yi temizle ve güvenli hale getir
                  try {
                    const url = new URL(imageUrl);
                    imageUrl = url.toString();
                  } catch (e) {
                    imageUrl = undefined;
                  }
                }

                // Varsayılan resim URL'si - daha güvenilir ve önbelleğe alınmış resimler
                if (!imageUrl) {
                  const defaultImages = [
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop'
                  ];
                  imageUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
                }

                return {
                  title: item.title || '',
                  date: new Date(item.pubDate || '').toLocaleDateString('tr-TR'),
                  category: 'Siber Güvenlik',
                  excerpt: item.contentSnippet || item.title || '',
                  url: item.link || '',
                  source: feed.source,
                  imageUrl: imageUrl
                }
              })
              allNews.push(...items)
            }
          } catch (error) {
            console.error(`Error fetching ${feed.source}:`, error)
          }
        }

        if (allNews.length === 0) {
          throw new Error('Hiç haber bulunamadı.')
        }

        // Haberleri tarihe göre sırala
        allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        // İlk 5 haberi öne çıkan haberler olarak ayarla
        setFeaturedNews(allNews.slice(0, 5))
        setNews(allNews)
      } catch (error: unknown) {
        console.error('Error fetching news:', error)
        setError(error instanceof Error ? error.message : 'Haberler yüklenirken bir hata oluştu.')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Otomatik slider için useEffect
  useEffect(() => {
    if (featuredNews.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [featuredNews.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length)
  }

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute -top-1/4 -right-1/4 h-96 w-96 rounded-full bg-cyan-600 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Siber Güvenlik</span>
                <span className="block text-cyan-400">Haberleri</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
                Güncel siber güvenlik haberleri ve gelişmeleri.
              </p>
            </div>
          </div>
        </section>

        {/* Featured News Slider */}
        {!loading && !error && featuredNews.length > 0 && (
          <section className="py-12 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-8">Öne Çıkan Haberler</h2>
              <div className="relative h-[500px] rounded-xl overflow-hidden">
                {featuredNews.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <div className="relative h-full">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(_) => {
                              const target = _.target as HTMLImageElement;
                              const defaultImages = [
                                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop',
                                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
                                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop',
                                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
                                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop'
                              ];
                              target.src = defaultImages[Math.floor(Math.random() * defaultImages.length)];
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                          <div className="absolute bottom-0 p-8">
                            <span className="text-sm text-cyan-400 font-medium">{item.source}</span>
                            <h3 className="text-2xl font-bold text-white mt-2 line-clamp-2">{item.title}</h3>
                            <p className="text-gray-200 mt-3 line-clamp-2">{item.excerpt}</p>
                            <span className="text-sm text-gray-400 mt-4 block">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {featuredNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-cyan-400' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="mt-4">Haberler yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-center text-white">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
                >
                  Yeniden Dene
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-cyan-400">{item.source}</span>
                      <span className="text-sm text-gray-400">{item.date}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3">{item.title}</h2>
                    <p className="text-gray-300">{item.excerpt}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
} 