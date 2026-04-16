import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { apiConfig, DEFAULT_HEADERS } from '../config/settings';
import logger from './logger';

export class APIClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = apiConfig.baseUrl, timeout = apiConfig.timeout) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: DEFAULT_HEADERS,
    });

    logger.info(`APIClient initialized with baseURL: ${baseURL}`);
  }

  async get<T = any>(endpoint: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      logger.info(`GET ${endpoint}`);
      const response = await this.axiosInstance.get<T>(endpoint, config);
      logger.info(`Response Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`GET request failed for ${endpoint}: ${error}`);
      throw error;
    }
  }

  async post<T = any>(endpoint: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    try {
      logger.info(`POST ${endpoint}`);
      logger.debug(`Payload: ${JSON.stringify(data)}`);
      const response = await this.axiosInstance.post<T>(endpoint, data, config);
      logger.info(`Response Status: ${response.status}`);
      return response;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);
      logger.error(`POST request failed for ${endpoint}: ${errorMessage}`);
      throw error;
    }
  }

  async put<T = any>(endpoint: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    try {
      logger.info(`PUT ${endpoint}`);
      logger.debug(`Payload: ${JSON.stringify(data)}`);
      const response = await this.axiosInstance.put<T>(endpoint, data, config);
      logger.info(`Response Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`PUT request failed for ${endpoint}: ${error}`);
      throw error;
    }
  }

  async delete<T = any>(endpoint: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      logger.info(`DELETE ${endpoint}`);
      const response = await this.axiosInstance.delete<T>(endpoint, config);
      logger.info(`Response Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`DELETE request failed for ${endpoint}: ${error}`);
      throw error;
    }
  }

  setAuthHeader(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthHeader(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  private getErrorMessage(error: any): string {
    if (error.response) {
      // Server responded with error status
      return `Status ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // Request made but no response
      return `No response received - ${error.message}`;
    } else if (error.code) {
      // Network error
      return `${error.code} - ${error.message}`;
    } else {
      return error.message || 'Unknown error';
    }
  }
}

export default new APIClient();
