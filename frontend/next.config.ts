import type { NextConfig } from "next";

// En dev se reenvia /api al backend local. En produccion Nginx atiende /api
// antes de llegar a Next, asi que solo se activa si API_PROXY_TARGET esta definido.
const apiProxyTarget =
  process.env.API_PROXY_TARGET ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:8001");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
