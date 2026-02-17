import { getConfig } from '@/config/runtime';

const rawApiBaseUrl = getConfig('VITE_API_BASE_URL') || '';
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const apiUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
