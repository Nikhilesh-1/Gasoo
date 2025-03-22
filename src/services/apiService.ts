
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

export const getLatestReading = async (): Promise<GasReading | null> => {
  try {
    const { data, error } = await supabase
      .from('gas_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest gas reading:', error);
      return null;
    }

    return data ? transformReadingRow(data as GasReadingRow) : null;
  } catch (error) {
    console.error('Error fetching latest gas reading:', error);
    return null;
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
      console.error('Error fetching gas readings:', error);
      return [];
    }

    return data ? data.map(row => transformReadingRow(row as GasReadingRow)) : [];
  } catch (error) {
    console.error('Error fetching gas readings:', error);
    return [];
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
      console.error('Error adding gas reading:', error);
      return null;
    }

    return data ? transformReadingRow(data as GasReadingRow) : null;
  } catch (error) {
    console.error('Error adding gas reading:', error);
    return null;
  }
};
