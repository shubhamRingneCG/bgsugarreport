// Local storage utility for blood sugar readings

const STORAGE_KEY = 'bloodSugarReadings';

// Reading types with their labels
export const READING_TYPES = {
  EARLY_MORNING: 'Early Morning',
  BEFORE_BREAKFAST: 'Before Breakfast',
  PRE_LUNCH: 'Pre Lunch',
  POST_LUNCH: 'Post Prandial (2hrs after lunch)',
  EVENING: 'Evening',
  PRE_DINNER: 'Pre Dinner',
  POST_DINNER: 'Post Dinner (2hrs after)',
  THREE_AM: '3 AM'
};

// Get all readings from localStorage
export const getAllReadings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Save a new reading
export const saveReading = (reading) => {
  try {
    const readings = getAllReadings();
    const newReading = {
      ...reading,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    readings.push(newReading);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    return newReading;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
};

// Delete a reading
export const deleteReading = (id) => {
  try {
    const readings = getAllReadings();
    const filtered = readings.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw error;
  }
};

// Update a reading
export const updateReading = (id, updatedData) => {
  try {
    const readings = getAllReadings();
    const index = readings.findIndex(r => r.id === id);
    if (index !== -1) {
      readings[index] = { ...readings[index], ...updatedData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
      return readings[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    throw error;
  }
};

// Get readings for a specific date
export const getReadingsByDate = (date) => {
  const readings = getAllReadings();
  const targetDate = new Date(date).toDateString();
  return readings.filter(r => {
    const readingDate = new Date(r.date).toDateString();
    return readingDate === targetDate;
  });
};

// Get readings for a date range
export const getReadingsByDateRange = (startDate, endDate) => {
  const readings = getAllReadings();
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(23, 59, 59, 999);
  
  return readings.filter(r => {
    const readingDate = new Date(r.date).getTime();
    return readingDate >= start && readingDate <= end;
  });
};

// Clear all readings
export const clearAllReadings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    throw error;
  }
};
