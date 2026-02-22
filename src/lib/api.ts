const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

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
