'use client';

import { useState } from 'react';

interface QRValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrData: string | null;
    onValidate: (qrCodeString: string) => Promise<void>;
}

const QRValidationModal = ({ isOpen, onClose, qrData, onValidate }: QRValidationModalProps) => {
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !qrData) return null;

    const parseQRData = () => {
        try {
            return JSON.parse(qrData);
        } catch {
            return null;
        }
    };

    const parsedData = parseQRData();

    const handleValidate = async () => {
        setIsValidating(true);
        setError(null);

        try {
            await onValidate(qrData);
            // Fechar modal após sucesso
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao validar ingresso';
            setError(errorMessage);
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Informações do QR Code
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isValidating}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {parsedData ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                Dados do Ingresso
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Assento:</span>
                                    <span className="font-medium text-gray-900">{parsedData.seat_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${parsedData.status === 'occupied' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {parsedData.status === 'occupied' ? 'Ocupado' : parsedData.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tipo:</span>
                                    <span className="font-medium text-gray-900">
                                        {parsedData.is_half_price ? 'Meia Entrada' : 'Inteira'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Hash:</span>
                                    <span className="font-mono text-xs text-gray-500">{parsedData.hash}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Dados Brutos (JSON)
                            </h3>
                            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                                {JSON.stringify(parsedData, null, 2)}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <h3 className="font-semibold text-yellow-900 mb-2">
                            Dados Não Estruturados
                        </h3>
                        <p className="text-sm text-gray-600 break-all">{qrData}</p>
                    </div>
                )}

                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={isValidating}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleValidate}
                        disabled={isValidating}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isValidating ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Validando...
                            </span>
                        ) : (
                            'Validar Ingresso'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRValidationModal;

