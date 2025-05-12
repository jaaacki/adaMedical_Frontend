import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only available in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to get a new token using the refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/users/refresh`,
            { refresh_token: refreshToken }
          );
          
          const { access_token } = response.data;
          
          // Save the new token
          localStorage.setItem('accessToken', access_token);
          
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Redirect to login page
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;