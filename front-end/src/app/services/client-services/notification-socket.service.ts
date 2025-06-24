import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { LocalStorageManagerService } from '../auth/local-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  private stompClient!: Client;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  constructor(
    private localS: LocalStorageManagerService
  ) { }

  connect(): void {
    const token = this.localS.getToken();

    if (!token) {
      toast.error('Authentication token not found', {
        description: 'Please log in again to receive notifications',
        duration: 6000,
        position: 'top-center'
      });
      return;
    }
    
    if (this.connectionStatus === 'connected' || this.connectionStatus === 'connecting') {
      return;
    }
    
    this.connectWithQueryParam(token);
  }

  private connectWithQueryParam(token: string): void {
    this.connectionStatus = 'connecting';

    // Show connecting toast
    const connectingToast = toast.loading('Connecting to notification service...', {
      position: 'top-center',
      duration: 10000
    });

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token)}`),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
    });

    this.stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket connected successfully');
      this.connectionStatus = 'connected';
      
      toast.dismiss(connectingToast);
      toast.success('Notifications connected', {
        description: 'You will now receive real-time notifications',
        duration: 3000,
        position: 'top-center'
      });
      
      this.subscribeToChannels();
    };

    this.stompClient.onStompError = (frame) => {
      this.connectionStatus = 'disconnected';
      
      toast.dismiss(connectingToast);
      toast.error('Connection failed', {
        description: 'Failed to connect to notification service. Retrying...',
        duration: 6000,
        position: 'top-center',
        action: {
          label: 'Retry',
          onClick: () => this.connect()
        }
      });
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('❌ WebSocket error:', event);
      this.connectionStatus = 'disconnected';
      
      toast.dismiss(connectingToast);
      toast.error('Network error', {
        description: 'Please check your internet connection',
        duration: 5000,
        position: 'top-center'
      });
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('🔌 WebSocket disconnected');
      this.connectionStatus = 'disconnected';
      
      toast.info('Notifications disconnected', {
        description: 'Real-time notifications are no longer active',
        duration: 4000,
        position: 'top-center'
      });
    };

    this.stompClient.activate();
  }

  private subscribeToChannels(): void {
    if (!this.stompClient?.connected) return;

    this.stompClient.subscribe('/user/queue/notifications', (message: Message) => {
      this.handleNotification(message);
    });

    this.stompClient.subscribe('/topic/test', (message: Message) => {
      toast.success('Test Message', {
        description: message.body,
        duration: 4000,
        position: 'top-center',
        action: {
          label: 'Dismiss',
          onClick: () => {}
        }
      });
    });
  }

  private handleNotification(message: Message): void {
    try {
      const notification = JSON.parse(message.body);
      
      const notificationType = notification.type || 'info';
      const title = notification.title || 'New Notification';
      const description = notification.message || message.body;
      
      switch (notificationType.toLowerCase()) {
        case 'success':
          toast.success(title, {
            description,
            duration: 5000,
            position: 'top-center'
          });
          break;
          
        case 'error':
          toast.error(title, {
            description,
            duration: 7000,
            position: 'top-center',
            action: {
              label: 'Retry',
              onClick: () => {
                console.log('Retry clicked for error notification');
              }
            }
          });
          break;
          
        case 'warning':
          toast.warning(title, {
            description,
            duration: 6000,
            position: 'top-center'
          });
          break;
          
        default:
          toast.info(title, {
            description,
            duration: 5000,
            position: 'top-center'
          });
      }
      
    } catch (e) {
      console.warn('Failed to parse notification JSON:', e);
      
      toast.info('New Notification', {
        description: message.body,
        duration: 5000,
        position: 'top-center'
      });
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('🔌 Disconnecting WebSocket...');
      this.stompClient.deactivate();
      this.connectionStatus = 'disconnected';
    }
  }

  // Public utility methods for manual notifications
  public showSuccess(title: string, description?: string): void {
    toast.success(title, {
      description,
      duration: 4000,
      position: 'top-center'
    });
  }

  public showError(title: string, description?: string, actionLabel?: string, actionCallback?: () => void): void {
    const config: any = {
      description,
      duration: 6000,
      position: 'top-center'
    };
    
    if (actionLabel && actionCallback) {
      config.action = {
        label: actionLabel,
        onClick: actionCallback
      };
    }
    
    toast.error(title, config);
  }

  public showInfo(title: string, description?: string): void {
    toast.info(title, {
      description,
      duration: 5000,
      position: 'top-center'
    });
  }

  public showWarning(title: string, description?: string): void {
    toast.warning(title, {
      description,
      duration: 6000,
      position: 'top-center'
    });
  }

  public showLoading(title: string, description?: string): string | number {
    return toast.loading(title, {
      description,
      position: 'top-center'
    });
  }

  public dismissToast(toastId: string): void {
    toast.dismiss(toastId);
  }

  public dismissAll(): void {
    toast.dismiss();
  }

  // Get connection status
  public getConnectionStatus(): string {
    return this.connectionStatus;
  }

  // Custom notification with promise (useful for async operations)
  public showPromise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): void {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      position: 'top-center'
    });
  }
}