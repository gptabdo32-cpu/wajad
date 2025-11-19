// frontend/src/hooks/useAuth.js
import { useState, useContext, createContext } from 'react';

// إنشاء سياق المصادقة
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth يجب أن يكون داخل AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // دالة التسجيل
    const register = async (email, password, username) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'فشل التسجيل');
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // دالة تسجيل الدخول
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'فشل تسجيل الدخول');
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.session.access_token);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // دالة تسجيل الخروج
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await fetch('/api/v1/auth/logout', { method: 'GET' });
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // استعادة جلسة المستخدم من localStorage
    const restoreSession = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        restoreSession,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
