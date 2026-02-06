const express = require('express');
const router = express.Router();
const { AI_SERVICE_URL, AI_SERVICE_TIMEOUT } = require('../config/env');

router.use(express.json());

/**
 * POST /api/chat
 * Proxy chat message to AI service (Gemini).
 * Body: { message: string, history?: [{ role: "user"|"model", text: string }] }
 * Response: { success: true, reply: string } or { success: false, message: string }
 */
router.post('/', async (req, res) => {
  try {
    if (!AI_SERVICE_URL) {
      return res.status(503).json({
        success: false,
        message: 'Chat service is not configured.',
      });
    }

    const { message, history } = req.body || {};
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, AI_SERVICE_TIMEOUT || 60000);

    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: trimmedMessage,
        history: Array.isArray(history) ? history : undefined,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = data.message || data.detail?.message || data.detail || `Chat failed (${response.status})`;
      return res.status(response.status >= 400 ? response.status : 500).json({
        success: false,
        message: typeof msg === 'string' ? msg : 'Chat request failed.',
      });
    }

    const reply = data.reply != null ? String(data.reply) : 'No response from assistant.';
    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        message: 'Chat request timed out. Please try again.',
      });
    }
    console.error('[Chat] Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Chat request failed.',
    });
  }
});

module.exports = router;
