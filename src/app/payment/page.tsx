'use client';

import { useState, useEffect } from 'react';
import PaymentForm from '@/components/PaymentForm';
import PaymentAlertModal from '@/components/PaymentAlertModal';
import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';

export default function PaymentPage() {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Mostrar o modal quando entrar na tela de pagamento
        setShowAlert(true);
    }, []);

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <AuthGuard requireAuth={true}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Pagamento - Meraki"
                    subtitle="Finalize sua compra de ingressos para o espetáculo"
                />
                <div className="p-6">
                    <PaymentForm />
                </div>

                {/* Modal de Alerta */}
                <PaymentAlertModal
                    isOpen={showAlert}
                    onClose={handleCloseAlert}
                />
            </main>
        </AuthGuard>
    );
}
