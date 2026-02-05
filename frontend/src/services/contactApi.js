import { getAuthHeaders } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submit contact form (public; optional token to associate userId)
 */
export const submitContactMessage = async ({ name, email, contactNo, subject, message }) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = typeof localStorage !== 'undefined' && localStorage.getItem('foodloop_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: name?.trim(),
      email: email?.trim(),
      contactNo: contactNo?.trim() || undefined,
      subject: subject?.trim() || undefined,
      message: message?.trim(),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to send message');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Get all contact messages (admin only)
 */
export const getContactMessages = async () => {
  const response = await fetch(`${API_URL}/api/admin/messages`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to fetch messages');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Reply to a contact message (admin only); reply is sent by email to the user
 */
export const replyToMessage = async (messageId, reply) => {
  const response = await fetch(`${API_URL}/api/admin/messages/${messageId}/reply`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reply: reply?.trim() }),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to send reply');
    err.response = { data };
    throw err;
  }
  return data;
};
