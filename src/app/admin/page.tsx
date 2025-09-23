'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import AdminPanel from '@/components/AdminPanel';
import AppHeader from '@/components/AppHeader';

export default function AdminPage() {
    return (
        <AuthGuard requireAuth={true}>
            <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
                <AppHeader
                    title="Painel Administrativo - Meraki"
                    subtitle="Gerencie reservas e aprovações de assentos do espetáculo"
                />
                <div className="p-6">
                    <AdminPanel />
                </div>
            </main>
        </AuthGuard>
    );
}
