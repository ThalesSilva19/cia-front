'use client';

import { useState, useEffect, useCallback } from 'react';
import { seatService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export const useUserPreReserved = () => {
    const { isAuthenticated } = useAuth();
    const [preReservedSeats, setPreReservedSeats] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPreReservedSeats = useCallback(async () => {
        if (!isAuthenticated) {
            setPreReservedSeats([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const seats = await seatService.getUserPreReserved();
            const seatCodes = seats.map(seat => seat.code);

            setPreReservedSeats(seatCodes);

            // Salvar no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('cia-app-pre-reserved-seats', JSON.stringify(seatCodes));
            }
        } catch (err) {
            console.error('Erro ao buscar assentos pré-reservados:', err);
            setError('Erro ao carregar assentos pré-reservados');

            // Tentar carregar do localStorage em caso de erro
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('cia-app-pre-reserved-seats');
                if (saved) {
                    setPreReservedSeats(JSON.parse(saved));
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const addPreReservedSeat = (seatCode: string) => {
        setPreReservedSeats(prev => {
            if (!prev.includes(seatCode)) {
                const newSeats = [...prev, seatCode];
                // Salvar no localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('cia-app-pre-reserved-seats', JSON.stringify(newSeats));
                }
                return newSeats;
            }
            return prev;
        });
    };

    const removePreReservedSeat = (seatCode: string) => {
        setPreReservedSeats(prev => {
            const newSeats = prev.filter(code => code !== seatCode);
            // Salvar no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('cia-app-pre-reserved-seats', JSON.stringify(newSeats));
            }
            return newSeats;
        });
    };

    const clearPreReservedSeats = () => {
        setPreReservedSeats([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cia-app-pre-reserved-seats');
        }
    };

    const isSeatPreReserved = (seatCode: string) => {
        return preReservedSeats.includes(seatCode);
    };

    // Carregar do localStorage na inicialização
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cia-app-pre-reserved-seats');
            if (saved) {
                try {
                    setPreReservedSeats(JSON.parse(saved));
                } catch (err) {
                    console.error('Erro ao carregar assentos pré-reservados do localStorage:', err);
                }
            }
        }
    }, []);

    // Buscar assentos pré-reservados quando o usuário fizer login
    useEffect(() => {
        if (isAuthenticated) {
            fetchPreReservedSeats();
        } else {
            // Limpar quando não autenticado
            setPreReservedSeats([]);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cia-app-pre-reserved-seats');
            }
        }
    }, [isAuthenticated, fetchPreReservedSeats]);

    return {
        preReservedSeats,
        isLoading,
        error,
        fetchPreReservedSeats,
        addPreReservedSeat,
        removePreReservedSeat,
        clearPreReservedSeats,
        isSeatPreReserved
    };
};
