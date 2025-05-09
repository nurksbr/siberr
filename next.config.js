/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Next.js 15+ sürümünde appDir artık varsayılan olarak etkinleştirilmiştir
}

module.exports = nextConfig 