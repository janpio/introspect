/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.clerk.dev', 'avatars.githubusercontent.com', 'img.clerk.com']
  }
}

module.exports = nextConfig
