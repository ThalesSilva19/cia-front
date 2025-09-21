/**
 * Configurações da aplicação
 * 
 * Este arquivo centraliza todas as configurações da aplicação,
 * incluindo variáveis de ambiente e constantes.
 */

// Configurações da API
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
} as const;

// Configurações da aplicação
export const APP_CONFIG = {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'CIA App',
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

// Configurações de autenticação
export const AUTH_CONFIG = {
    TOKEN_KEY: process.env.NEXT_PUBLIC_TOKEN_KEY || 'cia-app-token',
    TOKEN_EXPIRY: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY || '86400000'), // 24 horas em ms
} as const;

// Configurações de pagamento (se necessário)
export const PAYMENT_CONFIG = {
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
    PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
} as const;

// Configurações de desenvolvimento
export const DEV_CONFIG = {
    DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
    LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
} as const;

// Validação de configurações obrigatórias
export const validateConfig = () => {
    const requiredEnvVars = [
        'NEXT_PUBLIC_API_BASE_URL',
    ];

    const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
        console.warn(
            `⚠️  Variáveis de ambiente ausentes: ${missingVars.join(', ')}`
        );
        console.warn('Usando valores padrão. Verifique o arquivo .env');
    }
};

// Executar validação em desenvolvimento
if (process.env.NODE_ENV === 'development') {
    validateConfig();
}
