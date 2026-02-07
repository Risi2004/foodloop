const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch public landing page stats (donors, drivers, receivers, foodSavedKg, peopleFed, methaneSavedKg).
 * @returns {Promise<{ success: boolean, stats: Object }>}
 */
export const getPublicStats = async () => {
  const response = await fetch(`${API_URL}/api/public/stats`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch stats');
  }
  return data;
};
