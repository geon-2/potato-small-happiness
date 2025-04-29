const isDev = process.env.NODE_ENV === 'development';

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDev, // 개발 중에는 PWA 끄기!
});

const nextConfig = withPWA({
    // 기타 설정 추가 가능
});

module.exports = nextConfig;
