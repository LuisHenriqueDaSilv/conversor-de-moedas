require('dotenv/config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY
  }
}

module.exports = nextConfig
