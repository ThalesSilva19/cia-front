'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
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
