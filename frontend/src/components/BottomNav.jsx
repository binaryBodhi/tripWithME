import React, { useState, useEffect } from "react";
import "../styles/NavBase.css";
import "../styles/BottomNav.css";

import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const isActive = (path) => location.pathname === path;

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [location.pathname]);

    return (
        <nav className="navbar bottom">
            <button
                className={isActive("/previous") ? "active" : ""}
                onClick={() => navigate("/previous")}
            >
            Previous Trips
            </button>
            
            <button
                className={isActive("/search") ? "active" : ""}
                onClick={() => navigate("/search")}
            >
            TripWithME
            </button>

            <button
                className={`${isActive("/notifications") ? "active" : ""} notification-btn`}
                onClick={() => navigate("/notifications")}
            >
                Notifications
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
        </nav>
    );
}

export default BottomNav;
