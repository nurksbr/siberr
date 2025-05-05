import Image from 'next/image'

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-cyan-600 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-purple-600 blur-3xl"></div>
        <div className="absolute h-96 w-96 -top-1/4 -left-1/4 rounded-full bg-blue-600 blur-3xl"></div>
      </div>
      
      {/* Kod akışı arka plan deseni */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900 via-gray-900 to-gray-900"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              <span className="block">Modern Yazılım</span>
              <span className="block text-cyan-400 text-glow">Geliştirme Ekibi</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Web, mobil ve kurumsal uygulamalar için güvenli, ölçeklenebilir ve kullanıcı odaklı yazılım çözümleri geliştiriyoruz. Modern teknolojilerle projelerinizi hayata geçiriyoruz.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a 
                href="#iletisim" 
                className="px-8 py-3 rounded-md bg-cyan-600 text-white font-medium text-center hover:bg-cyan-700 transition-colors duration-300 border-glow"
              >
                Bize Ulaşın
              </a>
              <a 
                href="/blog" 
                className="px-8 py-3 rounded-md bg-transparent border border-gray-600 text-white font-medium text-center hover:bg-gray-800 transition-colors duration-300 hover:border-cyan-500"
              >
                Çalışmalarımız
              </a>
            </div>
          </div>
          
          <div className="relative mt-12 md:mt-0">
            <div className="aspect-w-5 aspect-h-4 relative rounded-lg overflow-hidden shadow-2xl border border-gray-800 bg-gray-800 border-glow" style={{ zIndex: 1 }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/50 to-purple-900/50 mix-blend-multiply rounded-lg" style={{ zIndex: 1 }}></div>
              <div className="w-full h-full flex items-center justify-center bg-gray-800" style={{ zIndex: 1 }}>
                <div className="text-cyan-400 text-glow text-xl font-mono" style={{ zIndex: 1 }}>
                  &lt;/&gt; CYBERLY
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-36 h-36 bg-cyan-600 rounded-full blur-2xl opacity-40 z-0"></div>
            <div className="absolute -right-1 -bottom-1 w-24 h-24 bg-purple-600 rounded-full blur-2xl opacity-40 z-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero 