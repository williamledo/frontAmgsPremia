import { apiUrl } from '@/config/api';

const extractDriveFileId = (url: string): string | null => {
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/i);
  const driveIdParamMatch = url.match(/[?&]id=([^&]+)/i);
  const driveUcMatch = url.match(/drive\.usercontent\.google\.com\/download\?[^#]*\bid=([^&]+)/i);
  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([^=?/]+)/i);
  return driveFileMatch?.[1] ?? driveIdParamMatch?.[1] ?? driveUcMatch?.[1] ?? lh3Match?.[1] ?? null;
};

const unique = (urls: string[]) => Array.from(new Set(urls.filter(Boolean)));

export const resolveImageFallbackUrls = (url: string): string[] => {
  if (!url) return [];
  const trimmed = url.trim();
  const fileId = extractDriveFileId(trimmed);

  if (!fileId) return [];

  const id = encodeURIComponent(fileId);
  const proxy = (target: string) =>
    apiUrl(`/api/campanhas/imagem-proxy?url=${encodeURIComponent(target)}`);

  const directUrls = [
    `https://lh3.googleusercontent.com/d/${id}=w2000`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
    `https://drive.usercontent.google.com/download?id=${id}&export=view`,
    `https://drive.google.com/uc?export=view&id=${id}`,
    trimmed,
  ];

  return unique([
    ...directUrls.map(proxy),
    ...directUrls,
  ]);
};

export const resolveImageUrl = (url: string): string => {
  if (!url) return url;
  const fallbacks = resolveImageFallbackUrls(url);
  return fallbacks[0] ?? url.trim();
};
