import { createContext, useContext, useState, useEffect } from "react";
import { setToken, clearToken, getToken } from "../services/token";
import { getCurrentUser } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Failed to fetch user", err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (getToken()) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token) => {
        setToken(token);
        setIsAuthenticated(true);
        fetchUser();
    };

    const logout = () => {
        clearToken();
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
