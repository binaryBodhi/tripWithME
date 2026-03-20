import React, { createContext, useContext, useState, useCallback } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast ${toast.type}`} onClick={() => removeToast(toast.id)}>
                        <div className="toast-content">
                            {toast.message}
                        </div>
                        <div 
                            className="toast-progress" 
                            style={{ animationDuration: `${toast.duration}ms` }}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
