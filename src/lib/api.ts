// Always use relative paths — works on any domain (localhost, Vercel, custom domains)
// without needing NEXT_PUBLIC_BASE_URL to be set.
const BASE_URL = '';

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
