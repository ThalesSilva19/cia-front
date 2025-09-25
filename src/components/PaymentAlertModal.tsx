'use client';

import { useState, useEffect } from 'react';

interface PaymentAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentAlertModal = ({ isOpen, onClose }: PaymentAlertModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Importante!
                    </h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-gray-700 leading-relaxed">
                            Para validar os ingressos é necessário inserir o comprovante de pagamento e clicar no botão de envio!
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                        Estou ciente disso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentAlertModal;
