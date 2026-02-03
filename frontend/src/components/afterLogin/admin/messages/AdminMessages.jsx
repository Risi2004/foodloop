import { useState } from "react";
import "./AdminMessages.css";

const AdminMessages = () => {
  const [messages] = useState([
    { id: 1, username: "@MASTERJD", message: "TELL ABOuT YOUR SERVICE", time: "2 mins ago" },
    { id: 2, username: "@jhon", message: "TELL ABOuT YOUR SERVICE", time: "2 mins ago" },
    { id: 3, username: "@JD", message: "TELL ABOuT YOUR SERVICE", time: "2 mins ago" },
  ]);

  const [selectedMessages, setSelectedMessages] = useState([2]); // Message 2 is selected by default
  const [replies, setReplies] = useState({}); // Store replies by message ID
  const [replyText, setReplyText] = useState("");

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessages.length > 0) {
      const newReply = {
        id: Date.now(),
        message: replyText.trim(),
        time: "just now",
      };

      // Add reply to all selected messages
      setReplies((prev) => {
        const updatedReplies = { ...prev };
        selectedMessages.forEach((messageId) => {
          if (!updatedReplies[messageId]) {
            updatedReplies[messageId] = [];
          }
          updatedReplies[messageId].push(newReply);
        });
        return updatedReplies;
      });

      setReplyText("");
    }
  };

  const getSelectedUsernames = () => {
    if (selectedMessages.length === 0) {
      return "Select a message to reply";
    }
    return selectedMessages
      .map((id) => {
        const msg = messages.find((m) => m.id === id);
        return msg ? msg.username : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const getFrameClass = (index) => {
    if (index === 0) return "frame-211";
    if (index === 1) return "frame-2122";
    return "frame-213";
  };

  return (
    <div className="frame-197">
      <div className="mange">
        <div className="user-management">Message Management</div>
        <div className="manage-verify-and">
          Centralized control for all incoming and outgoing messages
        </div>
      </div>
      <div className="body">
        <div className="today">Today</div>
        {messages.map((msg, index) => {
          const isSelected = selectedMessages.includes(msg.id);
          const messageReplies = replies[msg.id] || [];

          return (
            <div key={msg.id} className={getFrameClass(index)}>
              <div className="msg">
                <div className="time">
                  <div className="new-food-item-listed">{msg.username}</div>
                  <div className="_2-mins-ago">{msg.time}</div>
                </div>
                <div className="fresh-produce-15-kg">{msg.message}</div>
                {/* Display replies inside the same message div */}
                {messageReplies.length > 0 && (
                  <div className="replies-container">
                    {messageReplies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div className="time">
                          <div className="new-food-item-listed">Admin</div>
                          <div className="_2-mins-ago">{reply.time}</div>
                        </div>
                        <div className="fresh-produce-15-kg">{reply.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={isSelected ? "frame-2123" : "frame-212"}
                onClick={() => toggleMessageSelection(msg.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <img className="tick-box" src="/src/assets/check_circle.svg" alt="tick" />
                )}
              </div>
            </div>
          );
        })}
        <div className="today">Earlier</div>
      </div>
      <div className="enter">
        <div className="frame-206">
          <div className="frame-107">
            <div className="recent-donations">REPLAY</div>
          </div>
          <div className="search">
            <div className="john">{getSelectedUsernames()}</div>
          </div>
          <div className="search2">
            <textarea
              className="change-your-password-for-security-purpose"
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
          </div>
          <div className="frame-210">
            <div className="frame-208" onClick={handleSendReply} style={{ cursor: "pointer" }}>
              <div className="send">SEND</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;

