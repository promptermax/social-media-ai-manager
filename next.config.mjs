/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    // Keep other experimental features here if you add any in the future.
    // For now, this section might become empty or be removed if no other experimental features are used.
  },
}

export default nextConfig
