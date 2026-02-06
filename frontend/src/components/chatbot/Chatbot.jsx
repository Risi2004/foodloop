import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import chatbotIcon from '../../assets/chatbot/chatbot.svg';
import chatbotIcon2 from '../../assets/chatbot/chatbot2.svg';
import sendIcon from "../../assets/chatbot/send.svg";
import { sendMessage } from '../../services/chatApi';
import { getUser, isAuthenticated } from '../../utils/auth';

const WELCOME_MESSAGE_GUEST = 'Welcome to our FoodLoop AI. How can I help you?';
const LOADING_PLACEHOLDER = '__loading__';
const MAX_HISTORY_MESSAGES = 10;

function getDisplayName(user) {
  if (!user) return '';
  if (user.role === 'Donor') {
    return user.donorType === 'Business' ? (user.businessName || user.email || '') : (user.username || user.email || '');
  }
  if (user.role === 'Receiver') return user.receiverName || user.email || '';
  if (user.role === 'Driver') return user.driverName || user.email || '';
  return user.email || '';
}

function getWelcomeMessage() {
  if (!isAuthenticated()) return WELCOME_MESSAGE_GUEST;
  const user = getUser();
  const name = getDisplayName(user);
  if (!name || !name.trim()) return WELCOME_MESSAGE_GUEST;
  return `Hi ${name.trim()}! Welcome to FoodLoop AI. How can I help you?`;
}

/** Remove markdown asterisks so **bold** and *italic* show as plain text */
function stripMarkdown(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
}

function buildHistory(messages) {
  const withoutPlaceholder = messages.filter((m) => m.text !== LOADING_PLACEHOLDER);
  const last = withoutPlaceholder.slice(-MAX_HISTORY_MESSAGES);
  return last.map((m) => ({
    role: m.fromBot ? 'model' : 'user',
    text: m.text,
  }));
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(() => [{ text: getWelcomeMessage(), fromBot: true }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages]);

  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue('');
    const userMessage = { text: trimmed, fromBot: false };
    setMessages((prev) => [...prev, userMessage, { text: LOADING_PLACEHOLDER, fromBot: true }]);
    setIsLoading(true);
    const history = buildHistory(messages);
    try {
      const reply = await sendMessage(trimmed, history);
      setMessages((prev) =>
        prev.map((m) =>
          m.text === LOADING_PLACEHOLDER ? { text: reply, fromBot: true } : m
        )
      );
    } catch (err) {
      const errorText = err.message || 'Sorry, I couldn\'t get a response. Please try again.';
      setMessages((prev) =>
        prev.map((m) =>
          m.text === LOADING_PLACEHOLDER ? { text: errorText, fromBot: true } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating chatbot icon - always visible */}
      <button
        type="button"
        className="chatbot__trigger"
        onClick={handleToggle}
        aria-label="Open chatbot"
      >
        <img src={chatbotIcon} alt="Chat bot" />
      </button>

      {/* Pop-out chat window */}
      {isOpen && (
        <div className="chatbot__popout">
          <header className="chatbot__header">
            <img src={chatbotIcon2} alt="Chatbot-Icon" className="chatbot__header__icon" />
            <span className="chatbot__header__title">FoodLoop AI Chat Bot</span>
            <button
              type="button"
              className="chatbot__header__close"
              onClick={handleClose}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </header>

          <div className="chatbot__body">
            <div className="chatbot__messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chatbot__message ${msg.fromBot ? 'chatbot__message--bot' : 'chatbot__message--user'}`}
                >
                  {msg.text === LOADING_PLACEHOLDER ? '...' : (msg.fromBot ? stripMarkdown(msg.text) : msg.text)}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot__input__wrap" onSubmit={handleSubmit}>
              <input
                type="text"
                className="chatbot__input"
                placeholder="Type here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                aria-label="Type your message"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chatbot__send"
                aria-label="Send message"
                disabled={isLoading}
              >
                <span className="chatbot__send__arrow"><img src={sendIcon} alt="Send-Icon" /></span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
