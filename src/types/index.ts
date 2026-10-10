export type PriorityLevel = 'Urgent' | 'Important' | 'Informational';

export type FolderType = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archived' | 'trash';

export type ReplyTone = 'professional' | 'friendly' | 'formal';

export interface ActionItem {
  id: string;
  task: string;
  deadline?: string;
  context?: string;
  completed: boolean;
}

export interface AISummary {
  mainIdea: string;
  importantPoints: string[];
  tasks: string[];
  deadlines: string[];
  headline?: string;
  condensedPercentage?: number;
  readingTimeSavedMinutes?: number;
}

export interface AIReply {
  subject: string;
  body: string;
  tone: ReplyTone;
}

export interface DetectedDeadline {
  id: string;
  title: string;
  deadline: string;
  context: string;
  confirmed: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  relatedEmailId?: string;
  relatedEmailSubject: string;
  sender: string;
  deadline: string;
  status: 'upcoming' | 'completed';
  urgency: PriorityLevel;
  dateCreated: string;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  avatar: string;
  subject: string;
  receivedAt: string;
  body: string;
  snippet: string;
  priority: PriorityLevel;
  read: boolean;
  starred: boolean;
  folder: FolderType;
  category: 'primary' | 'university' | 'career' | 'personal';
  summary?: AISummary;
  summaryGenerated: boolean;
  suggestedReplies?: Record<ReplyTone, string>;
  detectedDeadlines?: DetectedDeadline[];
}

export interface DraftEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  lastSaved: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  quickActions?: {
    label: string;
    targetTab?: string;
    emailId?: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}
