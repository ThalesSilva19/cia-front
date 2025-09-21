'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import UserTickets from '@/components/UserTickets';

export default function TicketsPage() {
    return (
        <AuthGuard requireAuth={true}>
            <UserTickets />
        </AuthGuard>
    );
}
