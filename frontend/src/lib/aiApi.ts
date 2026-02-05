import api from './api';

export interface AiMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    emotion?: string;
    createdAt: string;
}

export interface AiSession {
    id: string;
    messages: AiMessage[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Send a message to the AI coach
 */
export async function sendChatMessage(message: string, sessionId?: string) {
    const response = await api.post<{
        sessionId: string;
        message: AiMessage;
    }>('/ai/chat', { message, sessionId });
    return response.data;
}

/**
 * Get session history
 */
export async function getSession(sessionId: string) {
    const response = await api.get<AiSession>(`/ai/session/${sessionId}`);
    return response.data;
}

/**
 * Get all user sessions
 */
export async function getSessions() {
    const response = await api.get<AiSession[]>('/ai/sessions');
    return response.data;
}
