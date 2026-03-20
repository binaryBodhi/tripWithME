import axios from 'axios';
import { getToken } from "./token.js"

const getBaseURL = () => {
    // 1. Check for Vite environment variable (recommended for production)
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // 2. Check URL query params for ?api=...
    const urlParams = new URLSearchParams(window.location.search);
    const apiParam = urlParams.get('api');
    if (apiParam) {
        localStorage.setItem('apiUrl', apiParam);
        return apiParam;
    }

    // 3. Check localStorage for a previously set URL
    const storedApi = localStorage.getItem('apiUrl');
    if (storedApi) return storedApi;

    // 4. Fallback to default local discovery
    return `http://${window.location.hostname}:8000`;
};

export const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true"
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});