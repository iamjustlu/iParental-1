import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    // In production, this would be your actual API URL
    this.baseURL = __DEV__ 
      ? 'http://localhost:3000/api' 
      : 'https://api.iparental.app/api';

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error adding auth token:', error);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const { response } = error;
        
        if (response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('auth_token');
          // You might want to redirect to login here
          // NavigationService.navigate('Auth');
        } else if (response?.status === 403) {
          // Forbidden - insufficient permissions
          console.warn('Insufficient permissions for this request');
        } else if (response?.status >= 500) {
          // Server error
          console.error('Server error:', response.status);
        } else if (!response) {
          // Network error
          console.error('Network error - check internet connection');
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  // File upload method
  async uploadFile<T = any>(
    url: string,
    file: FormData,
    config?: AxiosRequestConfig & {
      onUploadProgress?: (progressEvent: any) => void;
    }
  ): Promise<AxiosResponse<T>> {
    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.instance.post(url, file, uploadConfig);
  }

  // Set base URL (useful for switching environments)
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.instance.defaults.baseURL = baseURL;
  }

  // Get current base URL
  getBaseURL(): string {
    return this.baseURL;
  }

  // Add custom header
  setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }

  // Remove custom header
  removeHeader(key: string): void {
    delete this.instance.defaults.headers.common[key];
  }

  // Update timeout
  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }

  // Cancel all pending requests (useful for component unmount)
  cancelAllRequests(): void {
    // Implementation depends on your needs
    // You might want to keep track of ongoing requests and cancel them
  }
}

export const apiClient = new ApiClient();
