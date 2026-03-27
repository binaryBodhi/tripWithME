import { useState } from "react";
import { loginUser } from "../services/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

import '../styles/AuthForms.css';
import '../styles/Brand.css';


function Login() {
    const navigate = useNavigate();
    const { login: loginContext } = useAuth(); 
    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

        try {
            const res = await loginUser({ email, password });
            localStorage.setItem('token', res.data.token);
            await loginContext(res.data.token);
            navigate("/search");
        } catch (err){
            const message = err.response?.data?.detail || "Login failed. Please check your credentials.";
            showToast(message, "error");
            setPassword(""); // Clear password on failure
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Log In to TripWith<span className="brand-me">ME</span></h1>
                <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
                <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
}

export default Login;
