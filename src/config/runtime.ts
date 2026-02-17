type RuntimeConfig = {
  VITE_API_BASE_URL?: string;
  VITE_APP_NAME?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

const getRuntimeConfig = (key: keyof RuntimeConfig): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const value = window.__APP_CONFIG__?.[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};

const getBuildConfig = (key: keyof RuntimeConfig): string | undefined => {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};

export const getConfig = (key: keyof RuntimeConfig): string | undefined => {
  return getRuntimeConfig(key) ?? getBuildConfig(key);
};
