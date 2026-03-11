/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows reading yaml files from the content directory
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
    });
    return config;
  },
};

export default nextConfig;
