'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
}

const LoginForm = () => {
    const { login, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState<RegisterData>({
        full_name: '',
        email: '',
        phone_number: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Função para logout
    const handleLogout = () => {
        logout();
        setSuccess('Logout realizado com sucesso!');
        console.log('Token removido do localStorage');
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authService.login(loginData);

            setSuccess('Login realizado com sucesso! Redirecionando...');
            console.log('Login successful:', response);

            // Salvar o token no localStorage
            if (response.access_token) {
                login(response.access_token);
                console.log('Token salvo no localStorage');

                // Redirecionar para home após login bem-sucedido
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }

        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: { message?: string } } };
                if (error.response?.data?.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Erro desconhecido');
                }
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro desconhecido');
            }
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Preparar dados para envio - remover formatação do telefone
            const dataToSend = {
                ...registerData,
                phone_number: registerData.phone_number.replace(/\D/g, '') // Remove todos os caracteres não numéricos
            };

            const response = await authService.register(dataToSend);

            setSuccess('Conta criada com sucesso! Redirecionando...');
            console.log('Register successful:', response);

            // Salvar o token no localStorage
            if (response.access_token) {
                login(response.access_token);
                console.log('Token salvo no localStorage');

                // Redirecionar para home após cadastro bem-sucedido
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }

            // Limpar o formulário após sucesso
            setRegisterData({
                full_name: '',
                email: '',
                phone_number: '',
                password: ''
            });

        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response?: { data?: { message?: string } } };
                if (error.response?.data?.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Erro desconhecido');
                }
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro desconhecido');
            }
            console.error('Register error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPhone = (value: string) => {
        // Remove todos os caracteres não numéricos
        const numbers = value.replace(/\D/g, '');

        // Aplica a máscara (DD) 9XXXX-XXXX
        if (numbers.length <= 2) {
            return `(${numbers}`;
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setRegisterData(prev => ({ ...prev, phone_number: formatted }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bem-vindo
                    </h1>
                    <p className="text-gray-600">
                        Faça login ou crie uma conta para continuar
                    </p>
                    {isAuthenticated && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm">
                                ✅ Você está logado! Token salvo no localStorage.
                            </p>
                            <button
                                onClick={handleLogout}
                                className="mt-2 text-sm text-green-600 hover:text-green-500 underline"
                            >
                                Fazer logout
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">{success}</p>
                    </div>
                )}

                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === 'login'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === 'register'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Cadastrar
                    </button>
                </div>

                {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="login-email"
                                value={loginData.email}
                                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="login-password"
                                value={loginData.password}
                                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="Sua senha"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => router.push('/forgot-password')}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                )}

                {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="register-name"
                                value={registerData.full_name}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, full_name: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="register-email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                id="register-phone"
                                value={registerData.phone_number}
                                onChange={handlePhoneChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="(11) 99999-9999"
                                maxLength={15}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="register-password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-600">
                                Concordo com os <a href="#" className="text-blue-600 hover:text-blue-500">termos de uso</a> e <a href="#" className="text-blue-600 hover:text-blue-500">política de privacidade</a>
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {activeTab === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button
                            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                            className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
                        >
                            {activeTab === 'login' ? 'Criar conta' : 'Fazer login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
