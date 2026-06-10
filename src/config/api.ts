// API Configuration
// Fallback to localhost:5000 if VITE_API_URL is not set
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';
