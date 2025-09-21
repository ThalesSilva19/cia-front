'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (isLoading || hasRedirected) return;

        if (requireAuth && !isAuthenticated) {
            // Se precisa de autenticação mas não está logado, vai para login
            setHasRedirected(true);
            router.push('/login');
        } else if (!requireAuth && isAuthenticated) {
            // Se não precisa de autenticação mas está logado, vai para home
            setHasRedirected(true);
            router.push('/');
        }
    }, [isAuthenticated, isLoading, requireAuth, router, hasRedirected]);

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return <LoadingSpinner message="Carregando..." />;
    }

    // Se precisa de auth e não está logado, não renderiza nada (vai redirecionar)
    if (requireAuth && !isAuthenticated) {
        return <LoadingSpinner message="Redirecionando..." />;
    }

    // Se não precisa de auth e está logado, não renderiza nada (vai redirecionar)
    if (!requireAuth && isAuthenticated) {
        return <LoadingSpinner message="Redirecionando..." />;
    }

    return <>{children}</>;
};

export default AuthGuard;
