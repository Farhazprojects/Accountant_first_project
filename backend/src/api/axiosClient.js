import axios from 'axios';

// Create a custom Axios instance
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach the token to every outgoing request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('af_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch errors globally
axiosClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    // Handle Network Errors (No response from server)
    if (!error.response) {
      console.error('[Network Error]: Server is unreachable or down.');
      alert('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - Token expired or invalid
        console.warn('[401 Unauthorized]: Session expired. Logging out.');
        localStorage.removeItem('af_token');
        localStorage.removeItem('af_user');
        // Force redirect to login (bypassing React Router for a hard reset)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;

      case 403:
        // Forbidden - Role lacks permission
        console.warn('[403 Forbidden]:', data.error);
        alert('Access Denied: You do not have permission to perform this action.');
        break;

      case 404:
        // Not Found
        console.warn('[404 Not Found]:', data.error);
        break;

      case 500:
        // Internal Server Error
        console.error('[500 Server Error]:', data.error);
        alert('An unexpected server error occurred. Our team has been notified.');
        break;

      default:
        console.warn(`[API Error ${status}]:`, data.error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;