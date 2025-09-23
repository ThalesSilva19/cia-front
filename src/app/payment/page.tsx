'use client';

import PaymentForm from '@/components/PaymentForm';
import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';

export default function PaymentPage() {
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
            </main>
        </AuthGuard>
    );
}
