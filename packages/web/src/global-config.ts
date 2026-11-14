import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  siteUrl: string;
  isStaticExport: boolean;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Keel',
  appVersion: packageJson.version,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8082',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT || 'false'),
};
