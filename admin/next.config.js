/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001',
        pathname: '/public',
      },
    ],
  },
  // Tailwind CSS와 PostCSS 플러그인 추가
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;