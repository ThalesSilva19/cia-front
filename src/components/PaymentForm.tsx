'use client';

import { useState } from 'react';
import { useSeatContext } from '@/contexts/SeatContext';
import { reservationService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { PAYMENT_CONFIG } from '@/config/settings';
import Image from 'next/image';

interface SelectedSeat {
    id: string;
    row: string;
    number: number;
    price: number;
    isHalfPrice: boolean;
}

const PaymentForm = () => {
    const { selectedSeats: selectedSeatIds, clearSeats } = useSeatContext();
    const router = useRouter();
    const { showError } = useToast();

    // Converter IDs dos assentos para objetos com preços
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>(() => {
        return selectedSeatIds.map(seatId => {
            const row = seatId.charAt(0);
            const number = parseInt(seatId.slice(1));
            return {
                id: seatId,
                row,
                number,
                price: 50, // Preço padrão (inteira)
                isHalfPrice: false
            };
        });
    });

    // Debug: Mostrar assentos selecionados no console
    console.log('Assentos selecionados na página de pagamento:', selectedSeatIds);
    console.log('Assentos convertidos:', selectedSeats);

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleHalfPriceToggle = (seatId: string) => {
        setSelectedSeats(prev =>
            prev.map(seat =>
                seat.id === seatId
                    ? { ...seat, isHalfPrice: !seat.isHalfPrice }
                    : seat
            )
        );
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
        }
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => {
            // Preços fixos: R$ 50,00 inteira e R$ 25,00 meia
            const price = seat.isHalfPrice ? 25 : 50;
            return total + price;
        }, 0);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Preparar dados dos assentos com informações de meia entrada
            const seatData = selectedSeats.map(seat => ({
                seat_code: seat.id,
                is_half_price: seat.isHalfPrice
            }));

            // Fazer reserva definitiva dos assentos com arquivo de comprovante
            await reservationService.reserveSeats(seatData, paymentProof || undefined);

            // Simular processamento adicional
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Limpar assentos após pagamento bem-sucedido
            clearSeats();

            // Redirecionar para página de sucesso
            router.push('/payment/success');
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            showError('Erro no Pagamento', 'Não foi possível processar o pagamento. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Finalizar Pagamento
                    </h1>
                    <p className="text-lg text-gray-600">
                        Revise seus ingressos e complete o pagamento
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Seat Selection */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Ingressos Selecionados
                        </h2>

                        <div className="space-y-4">
                            {selectedSeats.map((seat) => (
                                <div key={seat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {seat.row}{seat.number}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        Assento {seat.row}{seat.number}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Fileira {seat.row}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                R$ {(seat.isHalfPrice ? 25 : 50).toFixed(2)}
                                            </div>
                                            {seat.isHalfPrice && (
                                                <div className="text-sm text-green-600 font-medium">
                                                    Meia Entrada
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={seat.isHalfPrice}
                                                onChange={() => handleHalfPriceToggle(seat.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Meia entrada (estudante, idoso, PCD)
                                            </span>
                                        </label>

                                        <button
                                            onClick={() => setSelectedSeats(prev => prev.filter(s => s.id !== seat.id))}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>Total:</span>
                                <span>R$ {calculateTotal().toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedSeats.filter(s => s.isHalfPrice).length} meia entrada(s)
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Payment */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Pagamento PIX
                        </h2>

                        <div className="space-y-6">
                            {/* QR Code */}
                            <div className="text-center">
                                <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                                    <Image
                                        src="/qr_code.jpg"
                                        alt="QR Code PIX"
                                        width={256}
                                        height={256}
                                        className="rounded-lg"
                                        onError={(e) => {
                                            console.error('Erro ao carregar imagem QR Code:', e);
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Escaneie o QR Code com seu app de pagamento
                                </p>
                            </div>

                            {/* PIX Copia e Cola */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">PIX Copia e Cola:</h3>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-600 font-mono break-all">
                                        {PAYMENT_CONFIG.PIX_CODE || 'PIX_CODE não encontrado'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(PAYMENT_CONFIG.PIX_CODE);
                                        // Aqui você pode adicionar um toast de sucesso se quiser
                                    }}
                                    className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Copiar Código PIX
                                </button>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">Como pagar:</h3>
                                <ol className="text-sm text-blue-800 space-y-1">
                                    <li>1. Abra seu app de pagamento (PIX)</li>
                                    <li>2. Escaneie o QR Code acima OU copie o código PIX</li>
                                    <li>3. Confirme o valor: <strong>R$ {calculateTotal().toFixed(2)}</strong></li>
                                    <li>4. Complete o pagamento</li>
                                    <li>5. Faça upload do comprovante abaixo</li>
                                </ol>
                            </div>

                            {/* Payment Proof Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comprovante de Pagamento
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {paymentProof ? (
                                            <div className="text-green-600">
                                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm font-medium text-green-600">
                                                    {paymentProof.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Clique para alterar
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                        <span>Fazer upload</span>
                                                        <input
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileUpload}
                                                            accept="image/*,.pdf"
                                                        />
                                                    </label>
                                                    <p className="pl-1">ou arraste e solte</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, PDF até 10MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                />
                                <label className="ml-2 text-sm text-gray-600">
                                    Concordo com os <a href="#" className="text-blue-600 hover:text-blue-500">termos e condições</a> e <a href="#" className="text-blue-600 hover:text-blue-500">política de cancelamento</a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || selectedSeats.length === 0 || !paymentProof}
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </div>
                                ) : (
                                    `Confirmar Pagamento - R$ ${calculateTotal().toFixed(2)}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
