'use client';

import { useSeatContext } from '@/contexts/SeatContext';
import { useRouter } from 'next/navigation';

const PaymentButton = () => {
    const { selectedSeats } = useSeatContext();
    const router = useRouter();

    const handlePaymentClick = () => {
        if (selectedSeats.length === 0) {
            alert('Por favor, selecione pelo menos um assento antes de prosseguir para o pagamento.');
            return;
        }

        // Navegar diretamente para a página de pagamento
        router.push('/payment');
    };

    return (
        <div className="mt-8 text-center">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Assentos Selecionados
                </h3>
                {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selectedSeats.map((seat) => (
                            <span
                                key={seat}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {seat}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Nenhum assento selecionado
                    </p>
                )}
            </div>

            <button
                onClick={handlePaymentClick}
                disabled={selectedSeats.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${selectedSeats.length > 0
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {selectedSeats.length > 0
                    ? `Prosseguir para Pagamento (${selectedSeats.length} assento${selectedSeats.length > 1 ? 's' : ''})`
                    : 'Selecione um assento para continuar'
                }
            </button>
        </div>
    );
};

export default PaymentButton;
