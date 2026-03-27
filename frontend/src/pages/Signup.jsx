import { useState } from "react";
import { createUser, loginUser } from "../services/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

import "../styles/AuthForms.css"
import "../styles/Brand.css"

function Signup() {
    const navigate = useNavigate();
    const { login: loginContext } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone_number, setPhoneNumber] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email format.", "error");
            return;
        }
        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        if (!phone_number.trim()) {
            showToast("Phone number is required.", "error");
            return;
        }

        try {
            await createUser({ email, password, first_name, last_name, phone_number });
            
            // Auto login after signup
            const loginRes = await loginUser({ email, password });
            localStorage.setItem('token', loginRes.data.token);
            await loginContext(loginRes.data.token);
            
            navigate('/additional-details');
        } catch (err) {
            const message = err.response?.data?.detail || "Signup failed. Please try again.";
            showToast(message, "error");
        }
    };

    return (
    <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Join TripWith<span className="brand-me">ME</span></h1>
            <input value={first_name} placeholder="Enter your first name" onChange={(e) => setFirstName(e.target.value)} required />
            <input value={last_name} placeholder="Enter your last name" onChange={(e) => setLastName(e.target.value)} required />
            <input value={phone_number} placeholder="Enter your phone number (e.g. +12345678)" onChange={(e) => setPhoneNumber(e.target.value)} required />
            <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <button type="submit">Signup</button>
            <p>Have an account? <Link to="/login">Log In</Link></p>
        </form>
        
    </div>
    );
}

export default Signup;
