import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/api';
import '../styles/Profile.css';

function Profile() {
    const { user, login } = useAuth();
    const { showToast } = useToast();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user?.phone_number || '',
        gender: user?.gender || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Sync formData with user state when it changes (e.g. after update)
    React.useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/update_me', formData);
            // In a real app, you'd get the updated user back. 
            // For now, let's assume successful update and refresh.
            // We might need to update the token or just re-fetch user.
            // Since we don't have a separate fetchUser exposed nicely from context yet,
            // we'll at least update the local storage token or re-login if needed.
            // Actually, AuthContext should ideally handle this.
            
            showToast("Profile updated successfully!", "success");
            setIsEditing(false);
            // Refreshing the app state by calling login again to re-fetch user
            const token = localStorage.getItem('token');
            if (token) login(token);
        } catch (err) {
            console.error("Failed to update profile", err);
            showToast(err.response?.data?.detail || "Failed to update profile", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <button className="back-link" onClick={() => navigate('/search')}>
                    ← Back to Search
                </button>
                
                <div className="profile-header">
                    <h1>My Profile</h1>
                </div>

                <div className="profile-avatar-large">
                    {(user.first_name || 'U')[0]}
                </div>

                {!isEditing ? (
                    <div className="profile-view">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">First Name</span>
                                <span className="info-value">{user.first_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Last Name</span>
                                <span className="info-value">{user.last_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{user.phone_number || 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Age</span>
                                <span className="info-value">{user.age != null ? user.age : 'Not set'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Gender</span>
                                <span className="info-value" style={{ textTransform: 'capitalize' }}>{user.gender || 'Not set'}</span>
                            </div>
                        </div>
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="info-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    name="first_name"
                                    value={formData.first_name} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    name="last_name"
                                    value={formData.last_name} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input 
                                    name="phone_number"
                                    value={formData.phone_number} 
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;
