import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = readFileSync(path.join(__dirname, 'package.json'), 'utf-8');
const { version } = JSON.parse(packageJson);

/** @type {import('next').NextConfig} */

const isStaticExport = 'false';

const nextConfig = {
  // Gate builds run alongside the dev server, and both default to `.next`;
  // the dev server rewrites it mid-build, which fails prerendering with
  // random "Cannot find module" errors. Setting NEXT_BUILD_DIR points a
  // verification build at its own directory; unset, everything stays as before.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
    NEXT_PUBLIC_APP_VERSION: version,
  },
  modularizeImports: {
    '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' },
    '@mui/material': { transform: '@mui/material/{{member}}' },
    '@mui/lab': { transform: '@mui/lab/{{member}}' },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    // Do NOT override devtool in dev (avoids Next warning/perf hit)
    return config;
  },
  ...(isStaticExport === 'true' && { output: 'export' }),
};

export default nextConfig;
