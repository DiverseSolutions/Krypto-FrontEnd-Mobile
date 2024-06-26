const nextTranslate = require('next-translate')
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const settings = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  images: {
    domains: [
      'https://krypto-cms.s3.ap-northeast-2.amazonaws.com', 
      'directus-admin.ap-south-1.linodeobjects.com', 
      'files.krypto.mn', 
      'cms.krypto.mn',
      'cdn.krypto.mn',
      's3.ap-east-1.amazonaws.com',
      'cloudfront.krypto.mn',
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    API_URL: process.env.API_URL || "",
    STATIC_HOST: process.env.STATIC_HOST || ""
  }
}

module.exports = nextTranslate(process.env.NODE_ENV === 'development' ? settings : withPWA(settings));