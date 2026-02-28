import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tech-news-aggregator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
