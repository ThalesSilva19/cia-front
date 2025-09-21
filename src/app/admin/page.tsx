'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
    return (
        <AuthGuard requireAuth={true}>
            <AdminPanel />
        </AuthGuard>
    );
}
