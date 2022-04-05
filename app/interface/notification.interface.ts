/**
 * @description holds notification interface
 */

export interface Notification {
  username: string;
  message: string;
  timestamp: number;
  read?: boolean;
}
