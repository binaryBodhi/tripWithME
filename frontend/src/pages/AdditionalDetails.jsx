import { useState } from "react";
import { updateUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

import "../styles/AuthForms.css";
import "../styles/Brand.css";

function AdditionalDetails() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dob || !gender) {
            showToast("Please fill in all details.", "error");
            return;
        }

        try {
            await updateUser({ dob: new Date(dob).toISOString(), gender });
            showToast("Profile completed successfully!", "success");
            navigate("/search");
        } catch (err) {
            console.error("Failed to update additional details", err);
            const message = err.response?.data?.detail || "Failed to update profile.";
            showToast(message, "error");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Almost There!</h1>
                <p style={{marginBottom: "20px", color: "var(--text-secondary)"}}>Let's complete your profile</p>
                <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px", marginBottom: "15px"}}>
                    <label style={{alignSelf: "flex-start", fontSize: "14px", fontWeight: "600", marginLeft: "4px"}}>Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
                
                <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px", marginBottom: "20px"}}>
                    <label style={{alignSelf: "flex-start", fontSize: "14px", fontWeight: "600", marginLeft: "4px"}}>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required style={{padding: "16px", borderRadius: "12px", border: "1px solid var(--border-light)", fontSize: "14px", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none"}}>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>

                <button type="submit">Complete Setup</button>
            </form>
        </div>
    );
}

export default AdditionalDetails;
