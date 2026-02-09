/**
 * Socket.IO client for real-time driver location.
 * Donor/receiver join a donation room and receive driver_location events.
 */

import { io } from 'socket.io-client';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

/**
 * Get or create the Socket.IO client. Connects with current auth token.
 * @returns {import('socket.io-client').Socket | null}
 */
export function getSocket() {
  const token = getToken();
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }
  if (socket?.connected) {
    return socket;
  }
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  socket = io(API_URL, {
    auth: { token },
    autoConnect: true,
  });
  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });
  return socket;
}

/**
 * Join a donation room to receive driver_location events. Call when opening tracking page.
 * @param {string} donationId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export function joinDonation(donationId) {
  const s = getSocket();
  if (!s?.connected) {
    return Promise.resolve({ success: false, message: 'Not connected' });
  }
  return new Promise((resolve) => {
    s.emit('join_donation', donationId, (res) => {
      resolve(res ?? { success: false });
    });
  });
}

/**
 * Leave a donation room. Call when leaving tracking page or changing donationId.
 * @param {string} donationId
 */
export function leaveDonation(donationId) {
  const s = getSocket();
  if (s?.connected && donationId) {
    s.emit('leave_donation', donationId);
  }
}

/**
 * Subscribe to driver_location for this socket. Returns unsubscribe function.
 * @param {(payload: { driverLocation: { latitude: number, longitude: number } }) => void} callback
 * @returns {() => void}
 */
export function onDriverLocation(callback) {
  const s = getSocket();
  if (!s) {
    return () => {};
  }
  s.on('driver_location', callback);
  return () => {
    s.off('driver_location', callback);
  };
}

/**
 * Subscribe to donation_created (donor posted). Call when on Find Food page; refetch available donations.
 * @param {(payload: { donationId: string }) => void} callback
 * @returns {() => void}
 */
export function onDonationCreated(callback) {
  const s = getSocket();
  if (!s) return () => {};
  s.on('donation_created', callback);
  return () => s.off('donation_created', callback);
}

/**
 * Subscribe to donation_claimed (receiver claimed). Call when on Delivery page; refetch available pickups.
 * @param {(payload: { donationId: string }) => void} callback
 * @returns {() => void}
 */
export function onDonationClaimed(callback) {
  const s = getSocket();
  if (!s) return () => {};
  s.on('donation_claimed', callback);
  return () => s.off('donation_claimed', callback);
}

/**
 * Subscribe to donation_in_transit (driver accepted). Call when on My Donation or My Claims; refetch list.
 * @param {(payload: { donationId: string }) => void} callback
 * @returns {() => void}
 */
export function onDonationInTransit(callback) {
  const s = getSocket();
  if (!s) return () => {};
  s.on('donation_in_transit', callback);
  return () => s.off('donation_in_transit', callback);
}
