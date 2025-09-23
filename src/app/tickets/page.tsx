'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import UserTickets from '@/components/UserTickets';
import AppHeader from '@/components/AppHeader';

export default function TicketsPage() {
    return (
        <AuthGuard requireAuth={true}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Meus Ingressos - Meraki"
                    subtitle="Visualize e gerencie seus ingressos para o espetáculo"
                />
                <div className="p-6">
                    <UserTickets />
                </div>
            </main>
        </AuthGuard>
    );
}
