import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    const login = (token: string, role: string) => {
        setIsAuthenticated(true);
        setToken(token);
        setRole(role);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        resetTimeout();
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            logout();
        }, 900000); // 15 minutos de inactividad
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
        const handleUserActivity = () => resetTimeout();

        events.forEach((event) => {
            window.addEventListener(event, handleUserActivity);
        });

        resetTimeout();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleUserActivity);
            });
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};