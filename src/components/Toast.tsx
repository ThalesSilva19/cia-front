'use client';

import { useEffect, useState } from 'react';

export interface ToastProps {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    useEffect(() => {
        // Animar entrada
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Auto-close após duration
        const autoCloseTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(autoCloseTimer);
        };
    }, [duration, handleClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-green-500 border-green-600',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'warning':
                return {
                    container: 'bg-yellow-500 border-yellow-600',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )
                };
            case 'error':
                return {
                    container: 'bg-red-500 border-red-600',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )
                };
            case 'info':
                return {
                    container: 'bg-blue-500 border-blue-600',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    container: 'bg-gray-500 border-gray-600',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        ${styles.container}
        border-l-4 shadow-lg rounded-lg
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {styles.icon}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                            {title}
                        </p>
                        {message && (
                            <p className="mt-1 text-sm text-white/90">
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="inline-flex text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md p-1"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Fechar</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/20 rounded-b-lg overflow-hidden">
                <div
                    className="h-full bg-white/40 transition-all ease-linear"
                    style={{
                        width: '100%',
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
};

export default Toast;
