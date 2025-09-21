'use client';

interface QRCodeProps {
    value?: string;
    size?: number;
    className?: string;
}

const QRCode = ({ size = 256, className = "" }: QRCodeProps) => {
    return (
        <div className={`bg-gray-100 p-6 rounded-lg inline-block ${className}`}>
            <div
                className="bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <div className="text-center">
                    {/* QR Code SVG placeholder - substitua por um QR code real */}
                    <svg
                        className="mx-auto text-gray-400 mb-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{ width: size * 0.5, height: size * 0.5 }}
                    >
                        <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm-8 8h6v6H3v-6zm8 0h6v6h-6v-6zm2-8h2v2h-2V3zm0 4h2v2h-2V7zm4 0h2v2h-2V7zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                    </svg>
                    <p className="text-sm text-gray-500">QR Code PIX</p>
                    <p className="text-xs text-gray-400 mt-1">Escaneie com seu app de pagamento</p>
                </div>
            </div>
        </div>
    );
};

export default QRCode;
