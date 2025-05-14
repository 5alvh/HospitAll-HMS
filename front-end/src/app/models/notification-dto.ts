export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  seen: boolean;
  type: string;
  date: string; 
  userId: number;
}