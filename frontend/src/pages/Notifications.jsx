import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import '../styles/Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAction = async (notificationId, tripId, userId, action) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, is_handled: true, is_read: true } : n
    ));

    try {
      const endpoint = action === 'accept' 
        ? `/trips/${tripId}/accept_join/${userId}` 
        : `/trips/${tripId}/reject_join/${userId}`;
      
      await api.post(endpoint);
      
      // Mark notification as handled on backend
      await api.patch(`/notifications/${notificationId}/handle`);
      
      showToast(action === 'accept' ? 'Trip request accepted!' : 'Trip request rejected.', 'success');
      // No need to fetch again immediately if optimistic update worked, but good for sync
      // fetchNotifications(); 
    } catch (err) {
      console.error(`Failed to ${action} join request`, err);
      showToast('Action failed', 'error');
      // Rollback on error
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic update
    const oldNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    try {
      await api.post('/notifications/mark-all-read');
      showToast('All notifications marked as read', 'success');
      // Re-fetch to ensure all state is in sync (e.g. handled status)
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
      // Rollback on error
      setNotifications(oldNotifications);
    }
  };

  const markAsRead = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));

    try {
      await api.patch(`/notifications/${id}/read`);
      // fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      // Rollback on error
      fetchNotifications();
    }
  };

  if (loading) return <div className="notifications-container"><p>Loading notifications...</p></div>;

  const hasPendingWork = notifications.some(n => !n.is_read || (n.type === 'join_request' && !n.is_handled));

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {notifications.length > 0 && hasPendingWork && (
          <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <p>No notifications yet. You're all caught up! 🛋️</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`notification-card ${!n.is_read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <span className="notification-title">{n.title}</span>
                <span className="notification-message">{n.message}</span>
                <span className="notification-time">
                  {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Actions are visible if not handled (for requests) or not read (for others) */}
              {((n.type === 'join_request' && !n.is_handled) || (n.type !== 'join_request' && !n.is_read)) && (
                <div className="notification-actions">
                  {n.type === 'join_request' ? (
                    <>
                      <button 
                        className="action-btn accept"
                        onClick={() => handleAction(n.id, n.trip_id, n.sender_id, 'accept')}
                      >
                        Accept
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleAction(n.id, n.trip_id, n.sender_id, 'reject')}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
