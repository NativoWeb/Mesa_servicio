import { User } from './user';

export type MessageChannel = 'email' | 'sms' | 'both';
export type MessageStatus = 'draft' | 'sending' | 'sent';

export interface MassMessage {
  id: number;
  sender_id: number;
  subject: string;
  body: string;
  channel: MessageChannel;
  template_id: number | null;
  recipients_filter: Record<string, string> | null;
  recipients_count: number | null;
  status: MessageStatus;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: User;
}
