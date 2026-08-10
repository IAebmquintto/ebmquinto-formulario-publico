import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessário para o build multi-stage do Dockerfile (copia .next/standalone).
  output: "standalone",
};

export default nextConfig;
