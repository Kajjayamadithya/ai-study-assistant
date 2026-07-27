import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
if (rawBaseUrl && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  rawBaseUrl = rawBaseUrl.replace(/\/+$/, '') + '/api';
}
const API_BASE_URL = rawBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

/**
 * Sends topic or notes to the express backend to generate study materials.
 */
export async function generateStudyMaterial(payload, signal) {
  try {
    const response = await apiClient.post('/generate', payload, { signal });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('AI returned an unexpected response structure.');
  } catch (error) {
    if (axios.isCancel(error)) {
      const cancelError = new Error('Request was cancelled.', { cause: error });
      cancelError.isCancelled = true;
      throw cancelError;
    }

    if (error.response && error.response.data) {
      const serverMessage = error.response.data.message || error.response.data.error;
      const apiError = new Error(serverMessage || 'Server returned an error.', { cause: error });
      apiError.status = error.response.status;
      apiError.isConfigRequired = error.response.data.isConfigRequired;
      throw apiError;
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Groq AI took too long to respond. Please retry.', { cause: error });
    }

    throw new Error(error.message || 'Unable to connect to backend server. Make sure server is running on port 5000.', { cause: error });
  }
}

/**
 * Fetches all saved study sets from MongoDB Atlas via backend API.
 */
export async function fetchStudyHistory() {
  try {
    const response = await apiClient.get('/history');
    return response.data?.history || [];
  } catch (error) {
    console.error('Failed to fetch study history:', error);
    return [];
  }
}

/**
 * Fetches a single study set by ID from MongoDB Atlas.
 */
export async function fetchStudySetById(id) {
  try {
    const response = await apiClient.get(`/history/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch study set ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a study set by ID from MongoDB Atlas.
 */
export async function deleteStudySetById(id) {
  try {
    const response = await apiClient.delete(`/history/${id}`);
    return response.data?.success || false;
  } catch (error) {
    console.error(`Failed to delete study set ${id}:`, error);
    return false;
  }
}

/**
 * Checks backend health status and MongoDB connection.
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'down', message: error.message };
  }
}
