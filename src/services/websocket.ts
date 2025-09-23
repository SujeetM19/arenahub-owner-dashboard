import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  private stompClient: any = null;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(token: string) {
    if (this.connected) return;

    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        console.log('WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        this.handleReconnect(token);
      }
    );
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
    }
  }

  private handleReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(token);
      }, 5000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribeToAttendance(callback: (message: any) => void) {
    if (this.stompClient && this.connected) {
      this.stompClient.subscribe('/topic/attendance', callback);
    }
  }

  subscribeToDashboard(callback: (message: any) => void) {
    if (this.stompClient && this.connected) {
      this.stompClient.subscribe('/topic/dashboard', callback);
    }
  }

  subscribeToNotifications(callback: (message: any) => void) {
    if (this.stompClient && this.connected) {
      this.stompClient.subscribe('/user/queue/notifications', callback);
    }
  }

  sendAttendance(memberId: number, qrCode: string, notes?: string) {
    if (this.stompClient && this.connected) {
      this.stompClient.send('/app/attendance/mark', {}, JSON.stringify({
        memberId,
        qrCode,
        notes: notes || ''
      }));
    }
  }

  requestDashboardStats() {
    if (this.stompClient && this.connected) {
      this.stompClient.send('/app/dashboard/stats', {}, JSON.stringify({}));
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export default new WebSocketService();
















