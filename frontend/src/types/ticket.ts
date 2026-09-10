import { User } from './user';

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'escalated' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Attachment {
  id: number;
  ticket_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  created_at: string;
}

export interface TicketEvent {
  id: number;
  ticket_id: number;
  user_id: number;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
  user?: User;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  requester_id: number;
  assigned_to: number | null;
  campus: string;
  location: string;
  escalated_to: number | null;
  escalation_reason: string | null;
  sla_deadline: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  requester?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  events?: TicketEvent[];
}
