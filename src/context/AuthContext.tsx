import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (storedToken && storedRole) {
            setIsAuthenticated(true);
            setToken(storedToken);
            setRole(storedRole);
        }
    }, []);

    const login = (token: string, role: string) => {
        setIsAuthenticated(true);
        setToken(token);
        setRole(role);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

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