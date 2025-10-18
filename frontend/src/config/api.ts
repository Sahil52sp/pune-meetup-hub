// API Configuration
// This file centralizes the backend URL configuration

export const API_CONFIG = {
  // Use environment variable if set, otherwise use preview URL
  baseURL: import.meta.env.VITE_BACKEND_URL || 
    import.meta.env.REACT_APP_BACKEND_URL || 
    'https://techconnect-15.preview.emergentagent.com',
  
  // Timeout for API requests (in milliseconds)
  timeout: 30000,
  
  // Whether to include credentials (cookies) in requests
  withCredentials: true,
};

// Helper function to get the full API URL
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_CONFIG.baseURL}/${cleanPath}`;
};

// Export the base URL for backward compatibility
export const backendUrl = API_CONFIG.baseURL;

