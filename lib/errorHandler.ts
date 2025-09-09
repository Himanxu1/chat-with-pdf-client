import { toast } from "sonner";
import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status: boolean;
  error?: string;
}

/**
 * Extract error message from axios error
 */
export const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as { message?: string; error?: string };
    return data.message || data.error || "An error occurred";
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Extract status code from axios error
 */
export const extractStatusCode = (error: AxiosError): number => {
  return error.response?.status || 500;
};

/**
 * Handle different types of errors with appropriate toast messages
 */
export const handleApiError = (error: AxiosError): void => {
  const message = extractErrorMessage(error);
  const statusCode = extractStatusCode(error);

  // Handle different error types
  switch (statusCode) {
    case 400:
      toast.error("Invalid Request", {
        description: message,
        duration: 5000,
      });
      break;
    case 401:
      toast.error("Authentication Required", {
        description: "Please log in to continue",
        duration: 5000,
        action: {
          label: "Login",
          onClick: () => {
            // Redirect to login page
            window.location.href = "/login";
          },
        },
      });
      break;
    case 403:
      toast.error("Access Denied", {
        description: message,
        duration: 5000,
      });
      break;
    case 404:
      toast.error("Not Found", {
        description: message,
        duration: 5000,
      });
      break;
    case 409:
      toast.error("Conflict", {
        description: message,
        duration: 5000,
      });
      break;
    case 413:
      toast.error("File Too Large", {
        description: message,
        duration: 5000,
      });
      break;
    case 422:
      toast.error("Validation Error", {
        description: message,
        duration: 5000,
      });
      break;
    case 429:
      toast.error("Rate Limit Exceeded", {
        description: "Too many requests. Please try again later.",
        duration: 5000,
      });
      break;
    case 500:
      toast.error("Server Error", {
        description: "Something went wrong on our end. Please try again.",
        duration: 5000,
      });
      break;
    case 503:
      toast.error("Service Unavailable", {
        description:
          "The service is temporarily unavailable. Please try again later.",
        duration: 5000,
      });
      break;
    default:
      if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        toast.error("Network Error", {
          description: "Please check your internet connection and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description: message,
          duration: 5000,
        });
      }
  }
};

/**
 * Handle successful API responses
 */
export const handleApiSuccess = (
  message: string,
  description?: string
): void => {
  toast.success(message, {
    description,
    duration: 4000,
  });
};

/**
 * Handle API warnings
 */
export const handleApiWarning = (
  message: string,
  description?: string
): void => {
  toast.warning(message, {
    description,
    duration: 4000,
  });
};

/**
 * Handle API info messages
 */
export const handleApiInfo = (message: string, description?: string): void => {
  toast.info(message, {
    description,
    duration: 4000,
  });
};

/**
 * Create a standardized API error object
 */
export const createApiError = (error: AxiosError): ApiError => {
  const responseData = error.response?.data as { error?: string; details?: unknown };
  return {
    message: extractErrorMessage(error),
    statusCode: extractStatusCode(error),
    error: responseData?.error,
    details: responseData?.details,
  };
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && error.request;
};

/**
 * Check if error is a timeout
 */
export const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === "ECONNABORTED" || error.message.includes("timeout");
};

/**
 * Retry configuration for failed requests
 */
export const getRetryConfig = (retries: number = 3): {
  retries: number;
  retryDelay: (retryCount: number) => number;
  retryCondition: (error: AxiosError) => boolean;
} => {
  return {
    retries,
    retryDelay: (retryCount: number) => {
      return Math.min(1000 * Math.pow(2, retryCount), 30000);
    },
    retryCondition: (error: AxiosError) => {
      // Retry on network errors and 5xx status codes
      return isNetworkError(error) || (error.response?.status || 0) >= 500;
    },
  };
};
