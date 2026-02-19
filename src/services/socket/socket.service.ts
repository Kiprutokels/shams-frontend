
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(import.meta.env.VITE_WS_URL);
    
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });
    
    this.socket.on('queueUpdate', (data) => {
      console.log('Queue updated:', data);
      // Dispatch to Redux store
    });
    
    this.socket.on('patientCalled', (data) => {
      console.log('Patient called:', data);
      // Show notification
    });
  }

  joinQueue(department: string) {
    this.socket?.emit('joinQueue', department);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();