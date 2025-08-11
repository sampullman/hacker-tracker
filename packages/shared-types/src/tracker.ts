export interface Tracker {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  isActive: boolean;
  notificationEmail?: string;
  slackWebhook?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTrackerRequest {
  name: string;
  keywords: string[];
  notificationEmail?: string;
  slackWebhook?: string;
}