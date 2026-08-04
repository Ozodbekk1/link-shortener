import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*.localtest.me", "localtest.me"],
}

export default nextConfig
