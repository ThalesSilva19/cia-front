'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUserPreReserved } from '@/hooks/useUserPreReserved';

interface SeatContextType {
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
    addSeat: (seatId: string) => void;
    removeSeat: (seatId: string) => void;
    toggleSeat: (seatId: string) => void;
    clearSeats: () => void;
    preReservedSeats: string[];
    isSeatPreReserved: (seatCode: string) => boolean;
    refreshPreReservedSeats: () => void;
}

const SeatContext = createContext<SeatContextType | undefined>(undefined);

export const SeatProvider = ({ children }: { children: ReactNode }) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>(() => {
        // Inicializar com dados do localStorage se disponível
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cia-app-selected-seats');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const {
        preReservedSeats,
        isLoading: preReservedLoading,
        error: preReservedError,
        fetchPreReservedSeats,
        isSeatPreReserved
    } = useUserPreReserved();

    const addSeat = (seatId: string) => {
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev : [...prev, seatId]
        );
    };

    const removeSeat = (seatId: string) => {
        setSelectedSeats(prev => prev.filter(id => id !== seatId));
    };

    const toggleSeat = (seatId: string) => {
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const clearSeats = () => {
        setSelectedSeats([]);
    };

    const refreshPreReservedSeats = () => {
        fetchPreReservedSeats();
    };

    // Salvar no localStorage sempre que os assentos mudarem
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cia-app-selected-seats', JSON.stringify(selectedSeats));
        }
    }, [selectedSeats]);

    return (
        <SeatContext.Provider value={{
            selectedSeats,
            setSelectedSeats,
            addSeat,
            removeSeat,
            toggleSeat,
            clearSeats,
            preReservedSeats,
            isSeatPreReserved,
            refreshPreReservedSeats
        }}>
            {children}
        </SeatContext.Provider>
    );
};

export const useSeatContext = () => {
    const context = useContext(SeatContext);
    if (context === undefined) {
        throw new Error('useSeatContext must be used within a SeatProvider');
    }
    return context;
};
