'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { adminService, seatService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import AuthGuard from '@/components/AuthGuard';

interface SeatData {
    seat_code: string;
    buyer_name: string;
    is_half_price: boolean;
    status?: string;
    hash?: string;
}

export default function QRCodePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAdmin, isLoading: isAuthLoading, userInfo } = useAuth();
    const { showSuccess, showError } = useToast();

    const [seatData, setSeatData] = useState<SeatData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Bloquear acesso para não-admins
    useEffect(() => {
        if (isAuthLoading) return;
        if (!userInfo) return;
        if (!isAdmin()) {
            router.push('/');
        }
    }, [isAdmin, isAuthLoading, userInfo, router]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // O hash vem do path parameter [code]
                const hash = params.code as string;
                if (!hash) {
                    throw new Error('Hash não encontrado na URL');
                }

                // seat_code vem como query param
                const seatCodeParam = searchParams.get('seat_code');
                if (!seatCodeParam) {
                    throw new Error('Parâmetro seat_code é obrigatório na URL.');
                }
                const seatCode = decodeURIComponent(seatCodeParam);

                // Buscar informações do assento na API
                const info = await seatService.getSeatInfo(seatCode);

                // Validar status
                if (!info || !info.status_code) {
                    throw new Error('Dados do assento indisponíveis.');
                }
                if (info.status_code !== 'occupied') {
                    throw new Error(`Assento ${info.seat_code} não pode ser validado agora. Status atual: ${info.status_code}.`);
                }

                const seatInfo: SeatData = {
                    seat_code: info.seat_code,
                    buyer_name: info.user_name,
                    is_half_price: Boolean(info.is_half_price),
                    status: info.status_code,
                    hash: hash
                };

                setSeatData(seatInfo);
                setError(null);
            } catch (err) {
                console.error('Erro ao processar dados:', err);
                const message = err instanceof Error ? err.message : 'Erro ao carregar dados.';
                setError(message);
                setSeatData(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [params.code, searchParams]);

    // Determinar dados para exibição
    const displayData = seatData;

    const handleValidate = async () => {
        const dataToValidate = seatData && seatData.hash ? {
            hash_value: seatData.hash,
            seat_code: seatData.seat_code,
        } : null;

        if (!dataToValidate || !isAdmin()) {
            showError('Acesso Negado', 'Apenas administradores podem validar ingressos.');
            return;
        }

        setIsValidating(true);
        setError(null);

        try {
            await adminService.validateQRCode(dataToValidate);
            showSuccess('Ingresso Validado', 'O ingresso foi validado com sucesso!');

            // Redirecionar após sucesso
            setTimeout(() => {
                router.push('/admin');
            }, 1500);
        } catch (err: unknown) {
            console.error('Erro ao validar QR code:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data && typeof err.response.data.detail === 'string'
                    ? err.response.data.detail
                    : 'Erro ao validar ingresso. Tente novamente.');
            setError(errorMessage);
            showError('Erro ao Validar', errorMessage);
        } finally {
            setIsValidating(false);
        }
    };

    if (isLoading) {
        return (
            <AuthGuard requireAuth={true}>
                <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Processando dados...</p>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    if (error && !displayData) {
        return (
            <AuthGuard requireAuth={true}>
                <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados Inválidos</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/admin')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Voltar ao Painel
                        </button>
                    </div>
                </main>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard requireAuth={true}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Validação de Ingresso
                            </h1>
                            <p className="text-gray-600">Confirme os dados do ingresso antes de validar</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {displayData && (
                            <div className="space-y-6">
                                {displayData.buyer_name && (
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm text-gray-500 mb-1">Nome do Comprador</p>
                                        <p className="text-xl font-bold text-gray-900">{displayData.buyer_name}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Código do Assento</p>
                                        <p className="text-lg font-bold text-gray-900">{displayData.seat_code}</p>
                                    </div>

                                    {displayData.status && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${displayData.status === 'occupied'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {displayData.status === 'occupied' ? 'Ocupado' : displayData.status}
                                            </span>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Tipo de Ingresso</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {displayData.is_half_price ? 'Meia Entrada' : 'Inteira'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Preço</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(displayData.is_half_price ? 25 : 50)}
                                        </p>
                                    </div>
                                </div>

                                {displayData.hash && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-2">Hash de Verificação</p>
                                        <p className="text-xs font-mono text-gray-700 break-all">{displayData.hash}</p>
                                    </div>
                                )}

                                {!isAdmin() && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ Apenas administradores podem validar ingressos.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>

                                    {isAdmin() && (
                                        <button
                                            onClick={handleValidate}
                                            disabled={isValidating}
                                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                                        >
                                            {isValidating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Validando...
                                                </>
                                            ) : (
                                                'Validar Ingresso'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
