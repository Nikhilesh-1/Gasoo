
import { supabase, GasReadingRow } from '@/lib/supabase';

export interface GasReading {
  _id: string;
  level: number;
  timestamp: string;
}

// Transform a Supabase row to our GasReading interface
const transformReadingRow = (row: GasReadingRow): GasReading => ({
  _id: row.id.toString(),
  level: row.level,
  timestamp: row.created_at
});

// Mock data for development when Supabase is not properly configured
const mockReadings: GasReading[] = Array.from({ length: 10 }, (_, i) => ({
  _id: (i + 1).toString(),
  level: Math.floor(Math.random() * 80) + 20, // Random level between 20 and 100
  timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString() // Last n days
}));

export const getLatestReading = async (): Promise<GasReading | null> => {
  try {
    const { data, error } = await supabase
      .from('gas_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.warn('Using mock data for latest reading:', error.message);
      return mockReadings[0] || null;
    }

    return data ? transformReadingRow(data as GasReadingRow) : mockReadings[0] || null;
  } catch (error) {
    console.warn('Using mock data for latest reading due to error:', error);
    return mockReadings[0] || null;
  }
};

export const getReadings = async (): Promise<GasReading[]> => {
  try {
    const { data, error } = await supabase
      .from('gas_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.warn('Using mock data for readings:', error.message);
      return mockReadings;
    }

    return data && data.length > 0 
      ? data.map(row => transformReadingRow(row as GasReadingRow)) 
      : mockReadings;
  } catch (error) {
    console.warn('Using mock data for readings due to error:', error);
    return mockReadings;
  }
};

export const addReading = async (level: number): Promise<GasReading | null> => {
  try {
    const { data, error } = await supabase
      .from('gas_readings')
      .insert([{ level }])
      .select()
      .single();

    if (error) {
      console.warn('Using mock data for adding reading:', error.message);
      const mockReading: GasReading = {
        _id: (mockReadings.length + 1).toString(),
        level,
        timestamp: new Date().toISOString()
      };
      mockReadings.unshift(mockReading);
      return mockReading;
    }

    return data ? transformReadingRow(data as GasReadingRow) : null;
  } catch (error) {
    console.warn('Using mock data for adding reading due to error:', error);
    const mockReading: GasReading = {
      _id: (mockReadings.length + 1).toString(),
      level,
      timestamp: new Date().toISOString()
    };
    mockReadings.unshift(mockReading);
    return mockReading;
  }
};
