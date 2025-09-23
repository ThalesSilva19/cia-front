'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/api';
import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';

function ResetPasswordContent() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('Token de recuperação não encontrado. Solicite uma nova recuperação de senha.');
            return;
        }
        setToken(tokenParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Token de recuperação não encontrado.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authService.resetPassword(token, newPassword);
            setMessage(response.message);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail || 'Erro ao redefinir senha'
                : 'Erro ao redefinir senha';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (message) {
        return (
            <AuthGuard requireAuth={false}>
                <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                    <AppHeader
                        title="Senha Redefinida"
                        subtitle="Sua senha foi alterada com sucesso"
                    />
                    <div className="p-6">
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                            <div className="text-center">
                                <div className="mb-4">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Sucesso!
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {message}
                                </p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Fazer Login
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard requireAuth={false}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Redefinir Senha"
                    subtitle="Digite sua nova senha"
                />
                <div className="p-6">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                        {!token ? (
                            <div className="text-center">
                                <div className="mb-4">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Token Inválido
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {error}
                                </p>
                                <button
                                    onClick={() => router.push('/forgot-password')}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Solicitar Nova Recuperação
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nova Senha
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Nova Senha
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                        placeholder="Confirme sua nova senha"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push('/login')}
                                        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Redefinir Senha"
                    subtitle="Carregando..."
                />
                <div className="p-6">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Carregando...</p>
                        </div>
                    </div>
                </div>
            </main>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
