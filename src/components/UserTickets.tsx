'use client';

import { useState, useEffect } from 'react';
import { seatService, Seat } from '@/services/api';
import LogoutButton from './LogoutButton';
import Link from 'next/link';

const UserTickets = () => {
    const [tickets, setTickets] = useState<Seat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const userTickets = await seatService.getUserTickets();
                setTickets(userTickets);
            } catch (err) {
                console.error('Erro ao buscar ingressos:', err);
                setError('Erro ao carregar seus ingressos. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800';
            case 'occupied':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'reserved':
                return 'Em análise';
            case 'occupied':
                return 'Aprovado';
            default:
                return status;
        }
    };

    return (
        <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Nenhum ingresso encontrado
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Você ainda não possui ingressos reservados.
                        </p>
                        <Link
                            href="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Reservar Ingressos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Seus Ingressos ({tickets.length})
                            </h2>

                            <div className="grid gap-4">
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-xl">
                                                        {ticket.code}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                        Assento {ticket.code}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Reservado em {formatDate(ticket.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                                    {getStatusText(ticket.status)}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Última atualização: {formatDate(ticket.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTickets;
