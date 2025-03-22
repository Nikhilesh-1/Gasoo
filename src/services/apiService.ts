
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface GasReading {
  _id: string;
  level: number;
  timestamp: string;
}

export const getLatestReading = async (): Promise<GasReading | null> => {
  try {
    const response = await axios.get(`${API_URL}/readings/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest gas reading:', error);
    return null;
  }
};

export const getReadings = async (): Promise<GasReading[]> => {
  try {
    const response = await axios.get(`${API_URL}/readings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gas readings:', error);
    return [];
  }
};

export const addReading = async (level: number): Promise<GasReading | null> => {
  try {
    const response = await axios.post(`${API_URL}/readings`, { level });
    return response.data;
  } catch (error) {
    console.error('Error adding gas reading:', error);
    return null;
  }
};
