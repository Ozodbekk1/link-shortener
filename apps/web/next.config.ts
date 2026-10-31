import type { NextConfig } from "next"
import path from "node:path"

const isVercel = Boolean(process.env.VERCEL)

const nextConfig: NextConfig = {
  ...(isVercel
    ? {}
    : {
        turbopack: {
          root: path.resolve(process.cwd(), "../../"),
        },
      }),
  allowedDevOrigins: ["*.localtest.me", "localtest.me"],
  async rewrites() {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiUrl || !apiUrl.startsWith("http")) return []
    try {
      const origin = new URL(apiUrl).origin
      return [
        {
          source: "/api/:path*",
          destination: `${origin}/api/:path*`,
        },
        {
          source: "/redirect/:path*",
          destination: `${origin}/redirect/:path*`,
        },
        {
          source: "/docs",
          destination: `${origin}/docs`,
        },
        {
          source: "/docs/:path*",
          destination: `${origin}/docs/:path*`,
        },
      ]
    } catch {
      return []
    }
  },
}

export default nextConfig
