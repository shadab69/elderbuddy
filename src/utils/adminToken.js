import axios from 'axios';

// The backend guards admin writes (and GET /api/leads + GET /api/orders)
// with an `x-admin-token` header that must match the server's ADMIN_TOKEN
// env var. The owner pastes that token once in the Admin Console; it is
// kept only in this browser's localStorage and attached to API calls by
// the axios interceptor below.
export const ADMIN_TOKEN_KEY = 'elder_admin_token';

export function getAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveAdminToken(token) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch (e) {}
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch (e) {}
}

let interceptorInstalled = false;

// Attach the stored token to every /api/ request made through the shared
// axios instance (AppContext fetches, Admin Console writes, uploads and
// email settings all use it). Public endpoints simply ignore the header.
export function installAdminTokenInterceptor() {
  if (interceptorInstalled) return;
  interceptorInstalled = true;
  axios.interceptors.request.use((config) => {
    const token = getAdminToken();
    if (token && config.url && config.url.includes('/api/')) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('x-admin-token', token);
      } else {
        config.headers = config.headers || {};
        config.headers['x-admin-token'] = token;
      }
    }
    return config;
  });
}
