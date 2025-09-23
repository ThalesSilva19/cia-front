'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

const LogoutButton = () => {
    const { logout } = useAuth();
    const router = useRouter();
    const { showSuccess } = useToast();

    const handleLogout = () => {
        logout();
        showSuccess('Logout Realizado', 'Você foi desconectado com sucesso!');
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
