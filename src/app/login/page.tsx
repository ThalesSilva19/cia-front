'use client';

import LoginForm from '@/components/LoginForm';
import AuthGuard from '@/components/AuthGuard';
import AppHeader from '@/components/AppHeader';

export default function LoginPage() {
    return (
        <AuthGuard requireAuth={false}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Meraki - O respiro das telas"
                    subtitle="Entre ou cadastre-se para reservar seu assento"
                />
                <div className="p-6">
                    <LoginForm />
                </div>
            </main>
        </AuthGuard>
    );
}
