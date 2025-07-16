/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignores TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint warnings/errors
  },
};

module.exports = nextConfig;


