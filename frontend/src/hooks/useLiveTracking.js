import { useState, useEffect, useRef } from 'react';
import { getDonationTracking } from '../services/donationApi';

/**
 * Custom hook for live tracking of driver location
 * Polls the tracking API at regular intervals to get updated driver location
 * 
 * @param {string} donationId - Donation ID to track
 * @param {Object} options - Options for polling
 * @param {number} options.interval - Polling interval in milliseconds (default: 5000)
 * @param {boolean} options.enabled - Whether polling is enabled (default: true)
 * @returns {Object} Tracking data and state
 */
const useLiveTracking = (donationId, options = {}) => {
  const { interval = 5000, enabled = true } = options;
  
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // Fetch tracking data
  const fetchTrackingData = async () => {
    if (!donationId || !enabled) {
      return;
    }

    try {
      const response = await getDonationTracking(donationId);
      
      if (response.success && response.tracking) {
        const data = response.tracking;
        
        if (isMountedRef.current) {
          setTrackingData(data);
          setDriverLocation(data.driver?.location || null);
          setError(null);
          
          // Stop polling if donation is delivered
          if (data.donation.status === 'delivered') {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      }
    } catch (err) {
      console.error('[useLiveTracking] Error fetching tracking data:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch tracking data');
        // Don't stop polling on error, just log it
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    if (donationId && enabled) {
      setLoading(true);
      fetchTrackingData();
    } else {
      setLoading(false);
    }
  }, [donationId, enabled]);

  // Set up polling interval
  useEffect(() => {
    if (!donationId || !enabled) {
      return;
    }

    // Don't start polling if donation is already delivered
    if (trackingData && trackingData.donation?.status === 'delivered') {
      return;
    }

    // Start polling
    intervalRef.current = setInterval(() => {
      fetchTrackingData();
    }, interval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [donationId, enabled, interval, trackingData?.donation?.status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    trackingData,
    driverLocation,
    loading,
    error,
    refetch: fetchTrackingData,
  };
};

export default useLiveTracking;
