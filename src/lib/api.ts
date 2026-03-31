// Always use relative paths — works on any domain (localhost, Vercel, custom domains)
// without needing NEXT_PUBLIC_BASE_URL to be set.
const BASE_URL = '';

const handleFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  
  // Check for rotated token in headers
  const newToken = response.headers.get('X-New-Token');
  if (newToken && typeof window !== 'undefined') {
    localStorage.setItem('token', newToken);
  }
  
  return response;
};

export const apiClient = {
  post: (path: string, body: Record<string, unknown>) => {
    return handleFetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  get: (path: string) => {
    return handleFetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
