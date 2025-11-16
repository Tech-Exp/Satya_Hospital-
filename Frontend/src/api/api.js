import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api/v1', // This will be proxied to backend
  withCredentials: true
});

export default api;
