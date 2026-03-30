// Use relative path if BASE_URL is localhost or empty to avoid CORS issues on Vercel
const envUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
const BASE_URL = (envUrl.includes('localhost') && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) 
  ? '' 
  : envUrl;

export const apiClient = {
  post: (path: string, body: Record<string, unknown>) => {
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  get: (path: string) => {
    return fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
