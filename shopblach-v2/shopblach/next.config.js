/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  env: {
    SHOP_NAME: 'BLACH Gallery',
    SHOP_URL: 'https://shop.blachgallery.com',
  }
}

module.exports = nextConfig
