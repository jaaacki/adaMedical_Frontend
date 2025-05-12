import axios from 'axios';

// Create an Axios instance with direct backend config for debugging
const debugApiClient = axios.create({
  // Try connecting directly to the backend to diagnose the issue
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor to log requests
debugApiClient.interceptors.request.use(
  (config) => {
    console.log('Debug API request:', config.method, config.url);
    return config;
  },
  (error) => {
    console.error('Debug API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses
debugApiClient.interceptors.response.use(
  (response) => {
    console.log('Debug API response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Debug API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Create an Axios instance with relative URLs for standard app use
const apiClient = axios.create({
  // Use relative URLs that will be proxied by Next.js rewrites
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add a request interceptor to attach the token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only available in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', config.url);
      } else {
        console.log('No token available for request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log error details
    console.error('API Error:', error.message, error.response?.status, error.config?.url);
    
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('Attempting to refresh token...');
        // Try to get a new token using the refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/users/refresh`,
            { refresh_token: refreshToken }
          );
          
          console.log('Token refresh response:', response.data);
          
          if (response.data.access_token) {
            // Save the new token
            localStorage.setItem('accessToken', response.data.access_token);
            
            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            
            console.log('Token refreshed, retrying original request');
            
            // Retry the original request
            return apiClient(originalRequest);
          } else {
            console.error('Token refresh response did not contain access_token');
          }
        } else {
          console.log('No refresh token available');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Redirect to login page with the current path for redirect after login
          const currentPath = window.location.pathname;
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility function to debug backend connectivity
export const debugBackendConnection = async () => {
  try {
    console.log('Testing direct connection to backend...');
    const response = await debugApiClient.get('/health');
    console.log('Backend is reachable!', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    return false;
  }
};

// Export both clients for different use cases
export { debugApiClient };
export default apiClient;