/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'new-foodies.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

export default nextConfig