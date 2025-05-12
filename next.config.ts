import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // output: 'export', // Outputs a Single-Page Application (SPA)
    distDir: 'build', // Changes the build output directory to `build`
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_DEV_BASE_URL: process.env.NEXT_PUBLIC_DEV_BASE_URL,
    },
}

export default nextConfig 