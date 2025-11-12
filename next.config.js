/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // option A: allow specific domain
    domains: ['res.cloudinary.com'],

    // option B (more flexible): allow remote patterns
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/**',
    //   },
    // ],
  },
  async rewrites() {
    return [
      { source: '/', destination: '/home' },
    ];
  },
}

module.exports = nextConfig