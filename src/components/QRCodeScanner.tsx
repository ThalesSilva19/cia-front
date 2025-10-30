'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (data: string) => void;
}

const QRCodeScanner = ({ isOpen, onClose, onScanSuccess }: QRCodeScannerProps) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const scanQRCode = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code && code.data) {
                console.log('QR Code detectado:', code.data);
                onScanSuccess(code.data);
                if (video.srcObject) {
                    const stream = video.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                    video.srcObject = null;
                }
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        } catch (err) {
            console.error('Erro ao processar QR code:', err);
        }
    }, [onScanSuccess]);

    const startScanning = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            scanQRCode();
        }, 500);
    }, [scanQRCode]);

    const initCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Usar câmera traseira
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setHasPermission(true);
                setError(null);
                startScanning();
            }
        } catch (err) {
            console.error('Erro ao acessar câmera:', err);
            setHasPermission(false);
            setError('Não foi possível acessar a câmera. Por favor, permita o acesso à câmera nas configurações.');
        }
    }, [startScanning]);

    useEffect(() => {
        if (isOpen) {
            initCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isOpen, initCamera, stopCamera]);

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Scanner de QR Code
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {hasPermission === null && !error && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Acessando câmera...</p>
                    </div>
                )}

                {hasPermission && (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg border-2 border-gray-300"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500"></div>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Posicione o QR code dentro da área destacada
                </p>
            </div>
        </div>
    );
};

export default QRCodeScanner;
