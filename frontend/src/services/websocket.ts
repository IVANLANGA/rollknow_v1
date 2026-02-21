import { io, Socket } from 'socket.io-client';
import type { DiceRoll } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:9000';

class WebSocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    connect(sessionId: string) {
        if (this.socket) return;

        const token = localStorage.getItem('lti_token');

        // Note: Django Channels usually uses ws:// protocol directly, but socket.io client is asked for.
        // Ensure the backend logic matches. The user request says "Socket.io wrapper",
        // but the backend is "Django Channels". Typically Django Channels uses native WebSockets.
        // However, I will follow the instruction to use socket.io-client wrapper if that's what's requested,
        // BUT usually one keys off standard WS for Django. 
        // Given the ambiguity, I'll use standard WebSocket for generic Django Channels compatibility 
        // unless the "socket.io" instruction is strict.
        // 
        // Re-reading request: "src/services/websocket.ts - Socket.io wrapper for:"
        // This assumes the backend is running a socket.io server or compatible adapter.
        // If it's pure Django Channels, `socket.io-client` won't work natively without `django-socketio`.
        // I will use `socket.io-client` as explicitly requested, but add a fallback note.

        this.socket = io(WS_URL, {
            auth: { token },
            query: { session_id: sessionId },
            transports: ['websocket'], // Force websocket transport
        });

        this.socket.on('connect', () => {
            console.log('Connected to Roll Session');
            this.socket?.emit('join_session', { session_id: sessionId });
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Roll Session');
        });

        this.socket.on('dice_rolled', (data: DiceRoll) => {
            this.notify('dice_rolled', data);
        });

        this.socket.on('participant_update', (data: any) => {
            this.notify('participant_update', data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    rollDice() {
        if (this.socket) {
            this.socket.emit('roll_dice');
        }
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: string, callback: Function) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event) || [];
        this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }

    private notify(event: string, data: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(data));
    }
}

export const wsService = new WebSocketService();
