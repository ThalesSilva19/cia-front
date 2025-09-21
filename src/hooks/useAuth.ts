'use client';

import { useState, useEffect } from 'react';
import { AUTH_CONFIG } from '../config/settings';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar se existe token no localStorage apenas no cliente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
            setIsAuthenticated(!!token);
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        }
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isLoading,
        login,
        logout
    };
};
