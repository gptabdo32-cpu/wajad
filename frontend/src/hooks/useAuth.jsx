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

            // لا نستخدم localStorage بعد الآن
            setUser(data.user);
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

            // لا نستخدم localStorage بعد الآن. يتم تخزين الرموز في كوكيز HTTP-Only
            setUser(data.user);
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
            // يجب أن نرسل الكوكيز مع الطلب
            await fetch('/api/v1/auth/logout', { 
                method: 'GET',
                credentials: 'include' // لإرسال الكوكيز
            });
            setUser(null);
            // لا نستخدم localStorage بعد الآن
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // استعادة جلسة المستخدم (تعتمد على التحقق من صحة الكوكيز في الخادم)
    // في تطبيق حقيقي، يجب أن يكون هناك مسار /api/v1/auth/me للتحقق من الجلسة
    const restoreSession = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/auth/me', {
                method: 'GET',
                credentials: 'include' // لإرسال الكوكيز
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.profile);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to restore session:", err);
            setUser(null);
        } finally {
            setLoading(false);
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
