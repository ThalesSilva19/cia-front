import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/settings';

// Usando configuração centralizada das variáveis de ambiente
const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar Bearer token automaticamente
api.interceptors.request.use(
    (config) => {
        // Rotas que não precisam de autenticação
        const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
        const isAuthRoute = authRoutes.some(route => config.url?.includes(route));

        // Se não for rota de auth, adicionar token
        if (!isAuthRoute && typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se receber 401 (Unauthorized), token pode ter expirado
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            // Remover token inválido
            localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);

            // Redirecionar para login se não estiver na página de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export interface SeatReservation {
    seat_code: string;
    is_half_price: boolean;
}

export interface Seat {
    id: number;
    user_id: number | null;
    code: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SeatInfo {
    code: string;
    is_half_price: boolean;
}

export interface UserReservation {
    user_name: string;
    seats: SeatInfo[];
}

export interface UserInfo {
    user_id: number;
    user_name: string;
    user_scopes: string[];
}


export const reservationService = {
    async preReserve(seats: string[]): Promise<{ message: string; reserved_seats: string[] }> {
        const seatData = seats.map(seat_code => ({
            seat_code
        }));

        try {
            const response = await api.post('/seats/pre-reserve', seatData);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer pré-reserva:', error);
            throw error;
        }
    },

    async reserveSeats(seatData: SeatReservation[], file?: File): Promise<{ message: string }> {
        try {
            // Criar FormData com dados dos assentos como JSON string
            const formData = new FormData();

            // Adicionar dados dos assentos como JSON string (nome do campo deve ser "request")
            formData.append('request', JSON.stringify(seatData));

            // Adicionar arquivo se fornecido
            if (file) {
                formData.append('file', file);
            }

            const response = await api.post('/seats/reserve', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao reservar assentos:', error);
            throw error;
        }
    },
};

export const authService = {
    async login(loginData: { email: string; password: string }): Promise<{ access_token: string; user: { id: number; email: string; full_name: string } }> {
        try {
            const response = await api.post('/login', loginData);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },

    async register(registerData: {
        full_name: string;
        email: string;
        phone_number: string;
        password: string;
    }): Promise<{ access_token: string; user: { id: number; email: string; full_name: string } }> {
        try {
            const response = await api.post('/register', registerData);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            throw error;
        }
    },

    async getMe(): Promise<UserInfo> {
        try {
            const response = await api.get('/me');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            throw error;
        }
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        try {
            const response = await api.post('/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error);
            throw error;
        }
    },

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        try {
            const response = await api.post('/reset-password', {
                token,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            throw error;
        }
    },
};

export const seatService = {
    async getSeats(): Promise<Seat[]> {
        try {
            const response = await api.get('/seats');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar assentos:', error);
            throw error;
        }
    },

    async getUserTickets(): Promise<Seat[]> {
        try {
            const response = await api.get('/seats/user');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar ingressos do usuário:', error);
            throw error;
        }
    },

    async getUserPreReserved(): Promise<Seat[]> {
        try {
            const response = await api.get('/seats/user/pre-reserved');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar assentos pré-reservados do usuário:', error);
            throw error;
        }
    },
};

export const adminService = {
    async getPendingSeats(): Promise<UserReservation[]> {
        try {
            const response = await api.get('/admin/pending-seats');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar assentos pendentes:', error);
            throw error;
        }
    },

    async approveSeat(seatCode: string): Promise<{ message: string }> {
        try {
            const response = await api.post(`/admin/approve-seat?seat_code=${seatCode}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao aprovar assento:', error);
            throw error;
        }
    },

    async reproveSeat(seatCode: string): Promise<{ message: string }> {
        try {
            const response = await api.post(`/admin/reprove-seat?seat_code=${seatCode}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao reprovar assento:', error);
            throw error;
        }
    },
};

export default api;
