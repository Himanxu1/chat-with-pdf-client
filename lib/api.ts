import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { handleApiError, ApiResponse } from "./errorHandler";

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Create axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001",
    timeout: 30000, // 30 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Add request timestamp for debugging
      config.metadata = { startTime: Date.now() };

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful requests in development
      if (process.env.NODE_ENV === "development") {
        const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
      }

      return response;
    },
    (error) => {
      // Log errors in development
      if (process.env.NODE_ENV === "development") {
        const duration = error.config?.metadata?.startTime 
          ? Date.now() - error.config.metadata.startTime 
          : 0;
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'NETWORK'} (${duration}ms)`, error);
      }

      // Handle 401 errors by clearing token and redirecting
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Only redirect if not already on login page
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // Handle API errors with toast notifications
      handleApiError(error);

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the main API instance
export const api = createApiInstance();

// API methods with error handling
export const apiMethods = {
  // GET request
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return (response.data.data || response.data) as T;
  },

  // POST request
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  },

  // PUT request
  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  },

  // PATCH request
  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  },

  // DELETE request
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return (response.data.data || response.data) as T;
  },

  // Upload file
  upload: async <T = unknown>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return (response.data.data || response.data) as T;
  },
};

// Export the raw axios instance for advanced usage
export default api;
