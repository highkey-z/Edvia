import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'https://edvia-c3ux-gwvifgezw-highkeys-projects.vercel.app/api'
    : '/api',
  timeout: 30000, // 30 second timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        throw new Error('API key not configured. Please check your server setup.');
      } else if (status === 402) {
        throw new Error('API quota exceeded. Please check your OpenAI account.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(data?.error || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

/**
 * Process text for simplification, vocabulary extraction, and summarization
 */
export const processText = async (data) => {
  try {
    const response = await api.post('/simplify', data);
    return response.data;
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
};

/**
 * Extract vocabulary from text only
 */
export const extractVocabulary = async (text) => {
  try {
    const response = await api.post('/text/vocabulary', { text });
    return response.data;
  } catch (error) {
    console.error('Error extracting vocabulary:', error);
    throw error;
  }
};

/**
 * Get supported languages for translation
 */
export const getSupportedLanguages = async () => {
  try {
    const response = await api.get('/translation/languages');
    return response.data;
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    throw error;
  }
};

/**
 * Translate text to another language
 */
export const translateText = async (data) => {
  try {
    const response = await api.post('/translation/translate', data);
    return response.data;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

/**
 * Check API health
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
