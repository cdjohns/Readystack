/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is used so the Docker runtime image only needs the
  // traced server bundle, not the full monorepo or pnpm store. See ../../Dockerfile.
  output: "standalone",
  // Workspace packages ship TypeScript sources directly (no build step),
  // so Next needs to compile them as part of the app build.
  transpilePackages: ["@readystack/config", "@readystack/logger"],
};

module.exports = nextConfig;
