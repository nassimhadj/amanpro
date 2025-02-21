import { API_URL } from '../config/api.config';

export const rdvService = {
  create: async (formData) => {
    try {
      console.log('Attempting to connect to:', API_URL); // Debug log
      
      const response = await fetch(`${API_URL}/rdv`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};