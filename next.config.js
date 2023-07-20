/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "fs": false,
        "net": false,
        "tls": false,
      }
    }
    return config
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    backendUrl: "http://localhost:3000/erc20",
  },
}

module.exports = nextConfig