/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: "http://localhost:3000/erc20",
    },
    images: {
        domains: [
            "cloudflare-ipfs.com",
            "assets.coingecko.com",
            "raw.githubusercontent.com",
            "s2.coinmarketcap.com",
            "ethereum-optimism.github.io",
            "arbitrum.foundation",
        ], // Add your image domains here
        // remotePatterns: [
        //   {
        //     protocol: 'https',
        //     hostname: '**',
        //     port: '',
        //     pathname: '**',
        //   },
        // ],
    },
};

module.exports = nextConfig;
