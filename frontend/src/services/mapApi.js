const BASE_URL = (() => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  if (typeof url !== 'string' || !url.startsWith('http')) {
    return 'http://localhost:5000';
  }
  return url.replace(/\/$/, '');
})();

/**
 * Get map locations (donors and receivers) for the landing page map.
 * @returns {Promise<{ donors: Array<{ lat: number, lng: number, displayName: string }>, receivers: Array<{ lat: number, lng: number, displayName: string }> }>}
 */
export const getMapLocations = async () => {
  const response = await fetch(`${BASE_URL}/api/map/locations`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load map locations');
  }
  return data;
};

/**
 * Get driving route waypoints between two points (for driver demo).
 * @param {number} startLat
 * @param {number} startLng
 * @param {number} endLat
 * @param {number} endLng
 * @returns {Promise<Array<{ latitude: number, longitude: number }>>}
 */
export const getRouteWaypoints = async (startLat, startLng, endLat, endLng) => {
  const params = new URLSearchParams({
    startLat: String(startLat),
    startLng: String(startLng),
    endLat: String(endLat),
    endLng: String(endLng),
  });
  const response = await fetch(`${BASE_URL}/api/map/route?${params}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success || !Array.isArray(data.waypoints)) {
    throw new Error(data.message || 'Failed to get route');
  }
  return data.waypoints;
};
