'use client';

import { useState, useEffect } from 'react';
import { adminService, UserReservation } from '@/services/api';
import LogoutButton from './LogoutButton';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

const AdminPanel = () => {
    const [pendingReservations, setPendingReservations] = useState<UserReservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingSeats, setProcessingSeats] = useState<Set<string>>(new Set());
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        const fetchPendingReservations = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const reservations = await adminService.getPendingSeats();
                setPendingReservations(reservations);
            } catch (err) {
                console.error('Erro ao buscar reservas pendentes:', err);
                setError('Erro ao carregar reservas pendentes. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingReservations();
    }, []);

    const handleApprove = async (seatCode: string) => {
        try {
            setProcessingSeats(prev => new Set(prev).add(seatCode));
            await adminService.approveSeat(seatCode);

            // Remover o assento de todas as reservas
            setPendingReservations(prev =>
                prev.map(reservation => ({
                    ...reservation,
                    seats: reservation.seats.filter(seat => seat.code !== seatCode)
                })).filter(reservation => reservation.seats.length > 0)
            );

            showSuccess('Assento Aprovado', `Assento ${seatCode} foi aprovado com sucesso!`);
        } catch (err) {
            console.error('Erro ao aprovar assento:', err);
            showError('Erro ao Aprovar', 'Não foi possível aprovar o assento. Tente novamente.');
        } finally {
            setProcessingSeats(prev => {
                const newSet = new Set(prev);
                newSet.delete(seatCode);
                return newSet;
            });
        }
    };

    const handleReprove = async (seatCode: string) => {
        try {
            setProcessingSeats(prev => new Set(prev).add(seatCode));
            await adminService.reproveSeat(seatCode);

            // Remover o assento de todas as reservas
            setPendingReservations(prev =>
                prev.map(reservation => ({
                    ...reservation,
                    seats: reservation.seats.filter(seat => seat.code !== seatCode)
                })).filter(reservation => reservation.seats.length > 0)
            );

            showSuccess('Assento Reprovado', `Assento ${seatCode} foi reprovado com sucesso!`);
        } catch (err) {
            console.error('Erro ao reprovar assento:', err);
            showError('Erro ao Reprovar', 'Não foi possível reprovar o assento. Tente novamente.');
        } finally {
            setProcessingSeats(prev => {
                const newSet = new Set(prev);
                newSet.delete(seatCode);
                return newSet;
            });
        }
    };

    // Removido formatDate não utilizado

    const calculateTotalPrice = (seats: { is_half_price: boolean }[]) => {
        return seats.reduce((total, seat) => {
            // Preços fixos: R$ 50,00 inteira e R$ 25,00 meia
            const price = seat.is_half_price ? 25 : 50;
            return total + price;
        }, 0);
    };

    const formatPrice = (price: number) => {
        // Verificar se o preço é válido
        const validPrice = isNaN(price) ? 0 : price;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(validPrice);
    };

    const refreshData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const reservations = await adminService.getPendingSeats();
            setPendingReservations(reservations);
        } catch (err) {
            console.error('Erro ao atualizar dados:', err);
            setError('Erro ao atualizar dados. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="h-screen flex flex-col">
                <header className="text-center py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div></div>
                        <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm tracking-tight">
                            Painel Administrativo
                        </h1>
                        <div className="flex space-x-4">
                            <Link
                                href="/"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Voltar
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                    <p className="text-lg text-gray-500">
                        Gerencie assentos pendentes de aprovação
                    </p>
                </header>

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={refreshData}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : pendingReservations.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Nenhum assento pendente
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Todos os assentos reservados foram processados.
                                </p>
                                <button
                                    onClick={refreshData}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Atualizar
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Reservas Pendentes ({pendingReservations.length})
                                    </h2>
                                    <button
                                        onClick={refreshData}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Atualizar
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {pendingReservations.map((reservation) => (
                                        <div key={reservation.user_name} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {reservation.user_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {reservation.seats.length} assento{reservation.seats.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {formatPrice(calculateTotalPrice(reservation.seats))}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Valor total
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {reservation.seats.map((seat) => (
                                                    <div key={seat.code} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                    <span className="text-blue-600 font-bold text-sm">
                                                                        {seat.code}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {seat.code}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {seat.is_half_price ? 'Meia entrada' : 'Inteira'}
                                                                    </div>
                                                                    <div className="text-xs font-medium text-green-600">
                                                                        {formatPrice(seat.is_half_price ? 25 : 50)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleApprove(seat.code)}
                                                                disabled={processingSeats.has(seat.code)}
                                                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                {processingSeats.has(seat.code) ? 'Processando...' : 'Aprovar'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReprove(seat.code)}
                                                                disabled={processingSeats.has(seat.code)}
                                                                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                {processingSeats.has(seat.code) ? 'Processando...' : 'Reprovar'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminPanel;
