
// Calculate the estimated days the gas will last based on current level and usage rate
export const calculateDaysRemaining = (
  currentLevel: number,
  averageDailyUsage: number,
  tankCapacity: number = 100
): number => {
  if (averageDailyUsage <= 0) return 999; // Avoid division by zero or negative usage
  
  // Calculate days based on current level percentage
  const remainingGas = (currentLevel / 100) * tankCapacity;
  const daysRemaining = remainingGas / averageDailyUsage;
  
  return Math.max(0, Math.round(daysRemaining * 10) / 10); // Round to 1 decimal place
};

// Generate sample data for the usage history
export const generateUsageData = (days: number = 7): Array<{ date: string; usage: number }> => {
  const data: Array<{ date: string; usage: number }> = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Format date as "Mon DD"
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Generate a semi-random usage value between 10 and 35
    // This creates a somewhat realistic pattern with some randomness
    const baseUsage = 20; // Average usage
    const randomVariation = Math.sin(i * 0.5) * 10; // Sinusoidal variation
    const randomNoise = Math.random() * 5; // Random noise
    const usage = Math.max(10, Math.min(35, baseUsage + randomVariation + randomNoise));
    
    data.push({
      date: formattedDate,
      usage: Math.round(usage)
    });
  }
  
  return data;
};

// Get the average daily usage from the past data
export const calculateAverageDailyUsage = (data: Array<{ date: string; usage: number }>): number => {
  if (data.length === 0) return 0;
  
  const sum = data.reduce((total, item) => total + item.usage, 0);
  return Math.round((sum / data.length) * 10) / 10; // Round to 1 decimal place
};

// Get the status color based on the gas level
export const getStatusColor = (level: number): string => {
  if (level > 70) return '#34C759'; // Green
  if (level >= 40) return '#F8B84E'; // Yellow
  return '#ea384c'; // Red
};
