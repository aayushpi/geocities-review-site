/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add rule for markdown files
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    });
    
    return config;
  },
}

module.exports = nextConfig
