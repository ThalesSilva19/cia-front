'use client';

import { useSeatContext } from '@/contexts/SeatContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { reservationService } from '@/services/api';
import { useState } from 'react';

const PaymentButton = () => {
    const { selectedSeats, refreshPreReservedSeats } = useSeatContext();
    const router = useRouter();
    const { showWarning, showError } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentClick = async () => {
        if (selectedSeats.length === 0) {
            showWarning('Selecione um Assento', 'Por favor, selecione pelo menos um assento antes de prosseguir para o pagamento.');
            return;
        }

        setIsProcessing(true);

        try {
            // Fazer pré-reserva dos assentos antes de ir para o pagamento
            await reservationService.preReserve(selectedSeats);

            // Atualizar a lista de assentos pré-reservados
            refreshPreReservedSeats();

            // Navegar para a página de pagamento após pré-reserva bem-sucedida
            router.push('/payment');
        } catch (error) {
            console.error('Erro ao fazer pré-reserva:', error);
            showError('Erro na Pré-reserva', 'Não foi possível reservar os assentos. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-6 md:mt-8 text-center">
            <div className="mb-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                    Assentos Selecionados
                </h3>
                {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-1 md:gap-2 justify-center max-w-md mx-auto">
                        {selectedSeats.map((seat) => (
                            <span
                                key={seat}
                                className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                            >
                                {seat}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs md:text-sm">
                        Nenhum assento selecionado
                    </p>
                )}
            </div>

            <button
                onClick={handlePaymentClick}
                disabled={selectedSeats.length === 0 || isProcessing}
                className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${selectedSeats.length > 0 && !isProcessing
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Reservando...
                    </div>
                ) : selectedSeats.length > 0 ? (
                    `Prosseguir para Pagamento (${selectedSeats.length} assento${selectedSeats.length > 1 ? 's' : ''})`
                ) : (
                    'Selecione um assento para continuar'
                )}
            </button>
        </div>
    );
};

export default PaymentButton;
