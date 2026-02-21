import axios from 'axios';
import type { StudentProfile, Challenge, ChallengeSubmission, RollSession } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lti_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle session expiry
            window.location.href = '/session-expired';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    exchangeToken: async (ltiToken: string) => {
        const response = await api.post('/api/auth/token/', { token: ltiToken });
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get<StudentProfile>('/api/auth/me/');
        return response.data;
    },
};

export const gamificationService = {
    getProfile: async () => {
        const response = await api.get<StudentProfile>('/api/gamification/profile/');
        return response.data;
    },
    getChallenges: async (filters?: any) => {
        const response = await api.get<Challenge[]>('/api/gamification/challenges/', { params: filters });
        return response.data;
    },
    getChallengeById: async (id: string) => {
        const response = await api.get<Challenge>(`/api/gamification/challenges/${id}/`);
        return response.data;
    },
    acceptChallenge: async (id: string) => {
        const response = await api.post(`/api/gamification/challenges/${id}/accept/`);
        return response.data;
    },
    getSubmissions: async () => {
        const response = await api.get<ChallengeSubmission[]>('/api/gamification/submissions/');
        return response.data;
    },
    submitChallenge: async (id: string, data: FormData) => {
        const response = await api.post(`/api/gamification/submissions/${id}/submit/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    getSessions: async () => {
        const response = await api.get<RollSession[]>('/api/gamification/sessions/');
        return response.data;
    },
};

export default api;
