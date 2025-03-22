
// Types for sensor data
export interface SensorReading {
  deviceId: string;
  timestamp: number;
  level: number;
  temperature?: number;
  pressure?: number;
  batteryLevel?: number;
}

export interface SensorDevice {
  id: string;
  name: string;
  type: 'wifi' | 'bluetooth' | 'zigbee' | 'cellular';
  lastSeen: number;
  batteryLevel?: number;
  isConnected: boolean;
}

// Mock functions to simulate sensor interactions
// These would be replaced with actual hardware API calls
export const connectToSensor = async (deviceId: string): Promise<boolean> => {
  console.log(`Attempting to connect to sensor: ${deviceId}`);
  // In a real implementation, this would use Web Bluetooth, 
  // WebUSB, or make API calls to a backend service
  
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return success (in real-world, this would depend on actual connection success)
  return true;
};

export const scanForSensors = async (): Promise<SensorDevice[]> => {
  console.log('Scanning for nearby sensors...');
  // In a real implementation, this would scan for Bluetooth devices,
  // query a backend API for available sensors, etc.
  
  // Simulate scan delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock devices (in real-world, this would be actual discovered devices)
  return [
    {
      id: 'sensor-001',
      name: 'Kitchen Cylinder',
      type: 'bluetooth',
      lastSeen: Date.now(),
      batteryLevel: 85,
      isConnected: false
    },
    {
      id: 'sensor-002',
      name: 'Outdoor Grill',
      type: 'wifi',
      lastSeen: Date.now() - 600000, // 10 minutes ago
      batteryLevel: 72,
      isConnected: false
    }
  ];
};

export const streamSensorData = (
  deviceId: string, 
  callback: (data: SensorReading) => void
): (() => void) => {
  console.log(`Starting data stream from sensor: ${deviceId}`);
  
  // Start interval to simulate incoming data
  const interval = setInterval(() => {
    // Generate simulated sensor reading
    const reading: SensorReading = {
      deviceId,
      timestamp: Date.now(),
      level: Math.max(5, Math.min(95, 35 + (Math.random() * 20 - 10))),
      temperature: 20 + Math.random() * 5,
      pressure: 15 + Math.random() * 2,
      batteryLevel: Math.floor(Math.random() * 100)
    };
    
    // Pass reading to callback
    callback(reading);
  }, 3000); // Every 3 seconds
  
  // Return cleanup function
  return () => {
    console.log(`Stopping data stream from sensor: ${deviceId}`);
    clearInterval(interval);
  };
};
