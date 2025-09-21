'use client';

import { useSeatContext } from '@/contexts/SeatContext';

const SeatDebugger = () => {
    const { selectedSeats, clearSeats } = useSeatContext();

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
            <h3 className="font-bold text-sm mb-2">Debug: Assentos Selecionados</h3>
            <div className="text-xs space-y-1">
                <p><strong>Total:</strong> {selectedSeats.length}</p>
                <p><strong>IDs:</strong> {selectedSeats.join(', ') || 'Nenhum'}</p>
                <div className="mt-2">
                    <button
                        onClick={clearSeats}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        Limpar Todos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatDebugger;
