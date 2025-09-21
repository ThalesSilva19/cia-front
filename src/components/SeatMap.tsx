'use client';

import { useSeatContext } from '@/contexts/SeatContext';
import { Seat } from '@/services/api';
import { useMemo, useCallback, memo } from 'react';

interface SeatMapProps {
    seats: Seat[];
}

const rowLetters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"
];

const SeatMap = memo(({ seats }: SeatMapProps) => {
    const { selectedSeats, toggleSeat } = useSeatContext();

    // Memoizar o mapa dos assentos para evitar recriação a cada render
    const seatMap = useMemo(() => {
        const map = new Map<string, Seat>();
        seats.forEach(seat => {
            map.set(seat.code, seat);
        });
        return map;
    }, [seats]);

    // Memoizar funções para evitar recriação a cada render
    const getSeatStatus = useCallback((seat: Seat | undefined) => {
        if (!seat) return 'available';
        return seat.status;
    }, []);

    const isSeatAvailable = useCallback((seat: Seat | undefined) => {
        return getSeatStatus(seat) === 'available';
    }, [getSeatStatus]);

    const isSeatOccupied = useCallback((seat: Seat | undefined) => {
        const status = getSeatStatus(seat);
        return status === 'reserved' || status === 'occupied';
    }, [getSeatStatus]);

    const handleSeatClick = useCallback((seatId: string) => {
        const seat = seatMap.get(seatId);
        // Só permite clicar se o assento estiver disponível
        if (seat && seat.status === 'available') {
            toggleSeat(seatId);
        }
    }, [seatMap, toggleSeat]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="mb-4 w-full flex justify-center">
                <div
                    className="bg-gray-800 text-white text-center rounded font-bold text-lg shadow"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem"
                    }}
                >
                    PALCO
                </div>
            </div>

            {/* Legenda */}
            <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded opacity-60"></div>
                    <span className="text-gray-600">Reservado/Ocupado</span>
                </div>
            </div>
            <div className="w-full grid gap-1 items-center" style={{ gridTemplateColumns: 'repeat(40, 1fr)', gridTemplateRows: 'repeat(8, auto) 8px repeat(10, auto)' }}>
                {useMemo(() => Array.from({ length: 19 }).map((_, rowIdx) => {
                    if (rowIdx === 8) {
                        return (
                            Array.from({ length: 40 }).map((_, colIdx) => (
                                <div key={`empty-row-gap-${colIdx}`} />
                            ))
                        );
                    }
                    const seatRowIdx = rowIdx > 8 ? rowIdx - 1 : rowIdx;
                    return Array.from({ length: 40 }).map((_, colIdx) => {
                        const isCentralBlackCell =
                            (seatRowIdx === 17 && colIdx >= 15 && colIdx <= 24) ||
                            (seatRowIdx === 16 && colIdx >= 17 && colIdx <= 22);

                        if (isCentralBlackCell) {
                            return (
                                <div
                                    key={`black-${seatRowIdx}-${colIdx}`}
                                    className="w-7 h-7 bg-gray-800"
                                />
                            );
                        }

                        if ([8, 9, 30, 31].includes(colIdx)) {
                            return <div key={`empty-${seatRowIdx}-${colIdx}`} />;
                        }
                        let emptyBefore = [8, 9, 30, 31].filter(i => i < colIdx).length;
                        if (seatRowIdx === 16) {
                            if (colIdx > 16) {
                                emptyBefore += Math.min(colIdx - 16, 6);
                            }
                        }
                        if (seatRowIdx === 17) {
                            if (colIdx > 14) {
                                emptyBefore += Math.min(colIdx - 14, 10);
                            }
                        }

                        const seatNumber = colIdx + 1 - emptyBefore;
                        const rowLetter = rowLetters[seatRowIdx] || String.fromCharCode(65 + seatRowIdx);

                        const seatId = `${rowLetter}${seatNumber}`;
                        const seat = seatMap.get(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        // const isAvailable = isSeatAvailable(seat); // Removido - não utilizado
                        const isOccupied = isSeatOccupied(seat);
                        const seatStatus = getSeatStatus(seat);

                        // Defina o tipo do botão
                        let seatType: "selected" | "default" | "occupied" = "default";
                        if (isOccupied) seatType = "occupied";
                        if (isSelected) seatType = "selected";

                        // Classes CSS baseadas no status
                        let buttonClasses = "w-7 h-7 text-xs font-bold transition-colors duration-150 flex items-center justify-center rounded";

                        if (seatType === "selected") {
                            buttonClasses += " bg-blue-500 text-white hover:bg-blue-600";
                        } else if (seatType === "occupied") {
                            // reserved e occupied ficam vermelhos
                            buttonClasses += " bg-red-400 text-white cursor-not-allowed opacity-60";
                        } else {
                            // available fica cinza
                            buttonClasses += " bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700";
                        }

                        return (
                            <button
                                key={`seat-${seatId}`}
                                type="button"
                                className={buttonClasses}
                                onClick={() => handleSeatClick(seatId)}
                                disabled={isOccupied}
                                style={{ minWidth: "1.75rem", minHeight: "1.75rem" }}
                                title={
                                    isOccupied
                                        ? `Assento ${seatId} - ${seatStatus === 'reserved' ? 'Reservado' : 'Ocupado'}`
                                        : `Assento ${seatId} disponível`
                                }
                            >
                                <span className="px-0.5 whitespace-nowrap">{rowLetter}{seatNumber}</span>
                            </button>
                        );
                    });
                }), [seatMap, selectedSeats, getSeatStatus, isSeatOccupied, handleSeatClick])}
            </div>
        </div>
    );
});

SeatMap.displayName = 'SeatMap';

export default SeatMap;
