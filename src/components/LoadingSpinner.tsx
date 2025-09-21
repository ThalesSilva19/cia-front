'use client';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner = ({ message = "Carregando..." }: LoadingSpinnerProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
