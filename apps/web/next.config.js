/** @type {import('next').NextConfig} */
const nextConfig = {
  // jsdom은 __dirname 기반 CSS 파일 로드가 있어 번들링하면 경로 오류 발생
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
