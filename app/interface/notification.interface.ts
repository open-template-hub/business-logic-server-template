/**
 * @description holds notification interface
 */

export interface Notification {
  username: string;
  message: string;
  timestamp: number;
  sender: string;
  category: string;
  image?: string;
  read?: boolean;
}
