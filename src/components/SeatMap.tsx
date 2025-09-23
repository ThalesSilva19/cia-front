'use client';

import { useSeatContext } from '@/contexts/SeatContext';
import { Seat } from '@/services/api';
import { useMemo, useCallback, memo, useState, useEffect } from 'react';

interface SeatMapProps {
    seats: Seat[];
}

const rowLetters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"
];

const SeatMap = memo(({ seats }: SeatMapProps) => {
    const { selectedSeats, toggleSeat, isSeatPreReserved } = useSeatContext();
    const [zoom, setZoom] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    // Detectar se é mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset zoom e posição em mobile
    useEffect(() => {
        if (isMobile) {
            setZoom(0.6);
            setTranslate({ x: 0, y: 0 });
        } else {
            setZoom(1);
            setTranslate({ x: 0, y: 0 });
        }
    }, [isMobile]);

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

    const isSeatOccupied = useCallback((seat: Seat | undefined) => {
        if (!seat) return false;
        const status = getSeatStatus(seat);

        // Se o assento está pré-reservado pelo usuário atual, não considerá-lo ocupado
        if (status === 'pre-reserved' && isSeatPreReserved(seat.code)) {
            return false;
        }

        return status === 'reserved' || status === 'occupied' || status === 'pre-reserved';
    }, [getSeatStatus, isSeatPreReserved]);

    const handleSeatClick = useCallback((seatId: string) => {
        console.log('Seat clicked:', seatId); // Debug log
        const seat = seatMap.get(seatId);
        console.log('Seat found:', seat); // Debug log

        // Permite clicar se o assento estiver disponível ou pré-reservado pelo usuário
        if (seat && (seat.status === 'available' || (seat.status === 'pre-reserved' && isSeatPreReserved(seat.code)))) {
            console.log('Toggling seat:', seatId); // Debug log
            toggleSeat(seatId);
        } else {
            console.log('Seat not clickable:', seatId, 'Status:', seat?.status, 'IsPreReserved:', seat ? isSeatPreReserved(seat.code) : false);
        }
    }, [seatMap, toggleSeat, isSeatPreReserved]);

    // Funções de zoom
    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.2, 2));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.2, 0.4));
    }, []);

    const resetZoom = useCallback(() => {
        setZoom(isMobile ? 0.6 : 1);
        setTranslate({ x: 0, y: 0 });
    }, [isMobile]);

    // Funções de drag
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }, [translate]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            setTranslate({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Funções de touch para mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - translate.x, y: touch.clientY - translate.y });
    }, [translate]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (isDragging) {
            const touch = e.touches[0];
            setTranslate({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Controles de Zoom - apenas para mobile */}
            {isMobile && (
                <div className="mb-4 flex items-center gap-3 bg-white rounded-xl shadow-xl p-3 border border-gray-200">
                    <button
                        onClick={handleZoomOut}
                        className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                        title="Diminuir zoom"
                    >
                        −
                    </button>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold min-w-[70px] text-center border border-blue-200">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                        title="Aumentar zoom"
                    >
                        +
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Resetar zoom e posição"
                    >
                        Reset
                    </button>
                </div>
            )}

            {/* Instruções */}
            {isMobile && (
                <div className="mb-4 text-center text-sm text-gray-600 max-w-md">
                    <p className="mb-2">
                        Toque e arraste para navegar • Use zoom para selecionar assentos
                    </p>
                </div>
            )}

            {/* Container do Mapa com Scroll */}
            <div
                className="w-full h-[60vh] md:h-[70vh] overflow-hidden border-2 border-gray-200 rounded-lg bg-gray-50 relative"
                onMouseDown={isMobile ? handleMouseDown : undefined}
                onMouseMove={isMobile ? handleMouseMove : undefined}
                onMouseUp={isMobile ? handleMouseUp : undefined}
                onMouseLeave={isMobile ? handleMouseUp : undefined}
                onTouchStart={isMobile ? handleTouchStart : undefined}
                onTouchMove={isMobile ? handleTouchMove : undefined}
                onTouchEnd={isMobile ? handleTouchEnd : undefined}
                style={isMobile ? { cursor: isDragging ? 'grabbing' : 'grab' } : {}}
            >
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{
                        transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Palco */}
                    <div className="mb-4 flex justify-center">
                        <div
                            className="bg-gray-800 text-white text-center rounded font-bold shadow"
                            style={{
                                width: "1640px", // 40 colunas * 40px + 39 gaps * 1px
                                minHeight: isMobile ? "40px" : "60px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isMobile ? "1rem" : "1.4rem"
                            }}
                        >
                            PALCO
                        </div>
                    </div>

                    {/* Legenda */}
                    <div className="mb-4 flex flex-wrap justify-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-200 rounded"></div>
                            <span className="text-gray-600">Disponível</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-gray-600">Selecionado</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-400 rounded opacity-60"></div>
                            <span className="text-gray-600">Reservado</span>
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
                                    const blackSize = isMobile ? "w-4 h-4" : "w-5 h-5";
                                    return (
                                        <div
                                            key={`black-${seatRowIdx}-${colIdx}`}
                                            className={`${blackSize} bg-gray-800`}
                                            style={{
                                                minWidth: isMobile ? "1rem" : "1.25rem",
                                                minHeight: isMobile ? "1rem" : "1.25rem"
                                            }}
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
                                const isOccupied = isSeatOccupied(seat);
                                const seatStatus = getSeatStatus(seat);

                                // Defina o tipo do botão
                                let seatType: "selected" | "default" | "occupied" | "pre-reserved" = "default";
                                if (isOccupied) {
                                    if (seatStatus === 'pre-reserved' && isSeatPreReserved(seatId)) {
                                        // Se é pré-reservado pelo usuário atual, tratá-lo como disponível
                                        seatType = "default";
                                    } else if (seatStatus === 'pre-reserved') {
                                        seatType = "pre-reserved";
                                    } else {
                                        seatType = "occupied";
                                    }
                                }
                                if (isSelected) seatType = "selected";

                                // Classes CSS baseadas no status
                                const seatSize = isMobile ? "w-4 h-4" : "w-5 h-5";
                                const textSize = isMobile ? "text-[8px]" : "text-xs";
                                let buttonClasses = `${seatSize} ${textSize} font-bold transition-colors duration-150 flex items-center justify-center rounded`;

                                if (seatType === "selected") {
                                    buttonClasses += " bg-blue-500 text-white hover:bg-blue-600";
                                } else if (seatType === "occupied") {
                                    // reserved e occupied ficam vermelhos
                                    buttonClasses += " bg-red-400 text-white cursor-not-allowed opacity-60";
                                } else if (seatType === "pre-reserved") {
                                    // pre-reserved fica laranja
                                    buttonClasses += " bg-orange-400 text-white cursor-not-allowed opacity-60";
                                } else {
                                    // available fica cinza (incluindo pré-reservados do usuário)
                                    buttonClasses += " bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700";
                                }

                                return (
                                    <button
                                        key={`seat-${seatId}`}
                                        type="button"
                                        className={buttonClasses}
                                        onClick={() => handleSeatClick(seatId)}
                                        disabled={isOccupied}
                                        style={{
                                            minWidth: isMobile ? "1rem" : "1.25rem",
                                            minHeight: isMobile ? "1rem" : "1.25rem"
                                        }}
                                        title={
                                            isOccupied
                                                ? `Assento ${seatId} - ${seatStatus === 'reserved' ? 'Reservado' : seatStatus === 'pre-reserved' ? 'Pré-reservado' : 'Ocupado'}`
                                                : `Assento ${seatId} disponível${seatStatus === 'pre-reserved' && isSeatPreReserved(seatId) ? ' (pré-reservado por você)' : ''}`
                                        }
                                    >
                                        <span className="px-0.5 whitespace-nowrap">{rowLetter}{seatNumber}</span>
                                    </button>
                                );
                            });
                        }), [seatMap, selectedSeats, getSeatStatus, isSeatOccupied, handleSeatClick, isMobile, isSeatPreReserved])}
                    </div>
                </div>
            </div>
        </div>
    );
});

SeatMap.displayName = 'SeatMap';

export default SeatMap;
