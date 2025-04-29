const isDev = process.env.NODE_ENV === 'development';

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: isDev,
});

const nextConfig = withPWA({
    experimental: {},
});

module.exports = nextConfig;
