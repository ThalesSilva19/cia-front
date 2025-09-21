'use client';

import QRCodeLib from 'qrcode'; // Você precisará instalar: npm install qrcode @types/qrcode
import { useEffect, useRef } from 'react';

interface QRCodeRealProps {
    value: string;
    size?: number;
    className?: string;
}

const QRCodeReal = ({ value, size = 256, className = "" }: QRCodeRealProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeLib.toCanvas(canvasRef.current, value, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('Erro ao gerar QR Code:', error);
                }
            });
        }
    }, [value, size]);

    return (
        <div className={`bg-gray-100 p-6 rounded-lg inline-block ${className}`}>
            <div
                className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
                style={{ width: size + 20, height: size + 20 }}
            >
                <canvas ref={canvasRef} />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">QR Code PIX</p>
            <p className="text-xs text-gray-400 mt-1 text-center">Escaneie com seu app de pagamento</p>
        </div>
    );
};

export default QRCodeReal;
