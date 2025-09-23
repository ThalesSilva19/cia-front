'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastProps } from '@/components/Toast';

interface ToastContextType {
    showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
    showSuccess: (title: string, message?: string, duration?: number) => void;
    showWarning: (title: string, message?: string, duration?: number) => void;
    showError: (title: string, message?: string, duration?: number) => void;
    showInfo: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastProps = {
            ...toast,
            id,
            onClose: removeToast,
        };

        setToasts(prev => [...prev, newToast]);
    };

    const showSuccess = (title: string, message?: string, duration?: number) => {
        showToast({ type: 'success', title, message, duration });
    };

    const showWarning = (title: string, message?: string, duration?: number) => {
        showToast({ type: 'warning', title, message, duration });
    };

    const showError = (title: string, message?: string, duration?: number) => {
        showToast({ type: 'error', title, message, duration });
    };

    const showInfo = (title: string, message?: string, duration?: number) => {
        showToast({ type: 'info', title, message, duration });
    };

    return (
        <ToastContext.Provider value={{
            showToast,
            showSuccess,
            showWarning,
            showError,
            showInfo,
        }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
