import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_DEV_BASE_URL: process.env.NEXT_PUBLIC_DEV_BASE_URL,
    },
}

export default nextConfig 