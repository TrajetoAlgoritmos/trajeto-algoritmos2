import axios from 'axios';
import { getCookie } from 'cookies-next';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
console.log(process.env.NEXT_PUBLIC_API_URL);

api.interceptors.request.use((request) => {
  try {
    const tokenCookieData = getCookie('token');
    const tokenData = tokenCookieData ? JSON.parse(tokenCookieData) : '';
    if (!tokenData) return request;
    request.headers.Authorization = `Bearer ${tokenData.token}`;
    return request;
  } catch {
    return request;
  }
});

export default api;
