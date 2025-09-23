'use client';

import { useState, useEffect } from 'react';
import { AUTH_CONFIG } from '../config/settings';
import { authService, UserInfo } from '../services/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const fetchUserInfo = async () => {
        try {
            const userData = await authService.getMe();
            setUserInfo(userData);
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            setUserInfo(null);
        }
    };

    useEffect(() => {
        // Verificar se existe token no localStorage apenas no cliente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
            const hasToken = !!token;
            setIsAuthenticated(hasToken);

            // Se tem token, buscar informações do usuário
            if (hasToken) {
                fetchUserInfo();
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
        }
        setIsAuthenticated(true);
        fetchUserInfo();
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        }
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    const hasScope = (scope: string): boolean => {
        return userInfo?.user_scopes?.includes(scope) || false;
    };

    const isAdmin = (): boolean => {
        return hasScope('admin') || hasScope('administrator');
    };

    return {
        isAuthenticated,
        isLoading,
        userInfo,
        login,
        logout,
        hasScope,
        isAdmin
    };
};
