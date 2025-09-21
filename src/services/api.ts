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
        const authRoutes = ['/login', '/register'];
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


export const reservationService = {
    async preReserve(seats: string[]): Promise<any> {
        const seatData: SeatReservation[] = seats.map(seat_code => ({
            seat_code,
            is_half_price: false // Por enquanto, assumindo que não há meia entrada na pré-reserva
        }));

        try {
            const response = await api.post('/seats/pre-reserve', seatData);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer pré-reserva:', error);
            throw error;
        }
    },

    async reserveSeats(seatData: SeatReservation[]): Promise<any> {
        try {
            const response = await api.post('/seats/reserve', seatData);
            return response.data;
        } catch (error) {
            console.error('Erro ao reservar assentos:', error);
            throw error;
        }
    },
};

export const authService = {
    async login(loginData: { email: string; password: string }): Promise<any> {
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
    }): Promise<any> {
        try {
            const response = await api.post('/register', registerData);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
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

    async approveSeat(seatCode: string): Promise<any> {
        try {
            const response = await api.post(`/admin/approve-seat?seat_code=${seatCode}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao aprovar assento:', error);
            throw error;
        }
    },

    async reproveSeat(seatCode: string): Promise<any> {
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
