import React, { useState } from "react";
import "./AdminNotification.css";

const AdminNotification = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "NEW UPDATE",
      message: "Every driver can earn Bedge",
      date: "Oct 24, 2023",
      status: "ACTIVE",
    },
    {
      id: 2,
      title: "NEW UPDATE",
      message: "Every driver can earn Bedge",
      date: "Oct 24, 2023",
      status: "ACTIVE",
    },
    {
      id: 3,
      title: "NEW UPDATE",
      message: "Every driver can earn Bedge",
      date: "Oct 24, 2023",
      status: "ACTIVE",
    },
  ]);

  const formatDate = (date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleSendNotification = () => {
    if (notificationMessage.trim() === "") {
      return; // Don't send empty notifications
    }

    const newNotification = {
      id: notifications.length + 1,
      title: "NEW UPDATE",
      message: notificationMessage.trim(),
      date: formatDate(new Date()),
      status: "ACTIVE",
    };

    setNotifications([newNotification, ...notifications]); // Add new notification at the top
    setNotificationMessage(""); // Clear the textarea
  };

  const handleDeactivate = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, status: "INACTIVE" } : notif
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <div className="frame-197">
      <div className="mange">
        <div className="user-management">Notification Management</div>
        <div className="manage-verify-and">
          Manage and monitor all notifications from one central dashboard.
        </div>
      </div>
      <div className="frame-107">
        <div className="recent-donations">Active notifications</div>
      </div>
      <div className="frame-106">
        <div className="frame-108">
          <div className="recent-donations2">MESSAGE</div>
          <div className="recent-donations2">DATE</div>
          <div className="recent-donations2">STATUS</div>
          <div className="recent-donations2">ACTION</div>
        </div>
        {notifications.map((notification, index) => {
          const className = index % 3 === 0 ? "frame-109" : index % 3 === 1 ? "frame-110" : "frame-111";
          return (
            <div key={notification.id} className={className}>
              <div className="frame-203">
                <div className="recent-donations3">{notification.title}</div>
                <div className="recent-donations3">{notification.message}</div>
              </div>
              <div className="recent-donations4">{notification.date}</div>
              <div className="frame-204">
                <div className="verified">
                  <div className="dot"></div>
                  <div className="verified2">{notification.status}</div>
                </div>
              </div>
              <div className="frame-205">
                <div className="frame-208">
                  <div
                    className="deactivate"
                    onClick={() => handleDeactivate(notification.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Deactivate
                  </div>
                  <img
                    className="cancel"
                    src="/src/assets/Cancel.svg"
                    alt="Cancel"
                    onClick={() => handleDelete(notification.id)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="enter">
        <div className="frame-206">
          <div className="frame-1072">
            <div className="recent-donations5">SEND NOTIFICATION</div>
          </div>
          <div className="search">
            <textarea
              className="change-your-password-for-security-purpose"
              placeholder="Enter your notification message here..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          </div>
          <div className="frame-210">
            <div className="frame-2082" onClick={handleSendNotification} style={{ cursor: "pointer" }}>
              <div className="send">SEND</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;


