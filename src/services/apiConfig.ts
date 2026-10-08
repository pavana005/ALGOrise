/**
 * API Configuration Helper
 * Resolves API endpoints against VITE_API_BASE_URL (if configured) or defaults to relative paths for same-origin proxying.
 */
export const getApiUrl = (endpoint: string): string => {
  const base = (import.meta.env?.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
