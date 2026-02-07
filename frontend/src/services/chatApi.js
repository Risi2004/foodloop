const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Send a chat message to the AI assistant (Gemini via backend).
 * @param {string} message - User message (required).
 * @param {Array<{ role: 'user'|'model', text: string }>} [history] - Optional conversation history (e.g. last 5–10 messages).
 * @param {string} [language='en'] - Language code: 'en' | 'ta' | 'si' for response language.
 * @returns {Promise<string>} The assistant reply text.
 */
export async function sendMessage(message, history = [], language = 'en') {
  const lang = ['en', 'ta', 'si'].includes(language) ? language : 'en';
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history, language: lang }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data.message || 'Failed to get a response. Please try again.';
    const error = new Error(typeof msg === 'string' ? msg : 'Chat request failed.');
    error.response = { data };
    throw error;
  }

  if (data.success && data.reply != null) {
    return String(data.reply);
  }

  throw new Error(data.message || 'No reply from assistant.');
}
