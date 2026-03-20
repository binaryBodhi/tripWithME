import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/NavBase.css";
import "../styles/TopNav.css";
import "../styles/Brand.css";

import Menu from "./Menu";
import { useTheme } from "../contexts/ThemeContext";

function TopNav({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    return (
        <nav className="navbar top">
            <div>
                <button
                    className="brand-logo"
                    onClick={() => navigate("/search")}
                >
                    TripWith<span className="brand-me">ME</span>
                </button>
            </div>


            <div className="menu-wrapper">
                <button
                    className="menu-button"
                    onClick={() => setOpen((prev) => !prev)}
                >
                ☰
                </button>
                <Menu open={open} onClose={() => setOpen(false)}>
                    <div className="menu-user">
                        <div className="avatar">{(user?.first_name || user?.name || "U")[0]}</div>
                        <div>{user?.first_name || user?.name || "User"}</div>
                    </div>

                    <div className="menu-theme-options">
                        <span className="theme-label">Theme</span>
                        <div className="theme-buttons">
                            <button 
                                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => setTheme('light')}
                            >
                                Light
                            </button>
                            <button 
                                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => setTheme('dark')}
                            >
                                Dark
                            </button>
                            <button 
                                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                                onClick={() => setTheme('system')}
                            >
                                System
                            </button>
                        </div>
                    </div>

                    <button 
                        className="menu-item"
                        onClick={() => {
                            setOpen(false);
                            navigate("/profile");
                        }}
                    >
                        Profile
                    </button>
                    
                    <button className="menu-item" onClick={onLogout}>
                        Logout
                    </button>
                </Menu>
            </div>
        </nav>
    );
}

export default TopNav;
