import { AISummary, ReplyTone, ReminderItem, DraftEmail } from '../types';

/**
 * MailMind AI Client API Gateway
 * Communicates with the Express backend which interfaces with Google Gemini AI.
 * Handles API errors gracefully and transparently.
 */

export interface BackendStatus {
  status: string;
  app: string;
  gemini: {
    configured: boolean;
    model: string;
  };
  database: {
    type: string;
    firebase: {
      configured: boolean;
      instructions: string;
    };
    remindersCount: number;
    draftsCount: number;
  };
}

export async function fetchBackendStatus(): Promise<BackendStatus | null> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend status check:', err);
    return null;
  }
}

/**
 * Summarize email via Gemini Backend
 */
export async function summarizeEmailWithBackend(
  subject: string,
  sender: string,
  body: string
): Promise<AISummary> {
  const response = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, sender, body }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Generate AI Reply via Gemini Backend
 */
export async function generateReplyWithBackend(
  subject: string,
  sender: string,
  body: string,
  tone: ReplyTone
): Promise<string> {
  const response = await fetch('/api/ai/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, sender, body, tone }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}

/**
 * Extract Tasks and Deadlines via Gemini Backend
 */
export interface ExtractedTask {
  title: string;
  deadline: string;
  context: string;
  urgency: 'Urgent' | 'Important' | 'Informational';
}

export async function extractTasksWithBackend(
  subject: string,
  sender: string,
  body: string
): Promise<ExtractedTask[]> {
  const response = await fetch('/api/ai/extract-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, sender, body }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.tasks || [];
}

/**
 * Chat with AI Assistant via Gemini Backend
 */
export async function chatAssistantWithBackend(
  query: string,
  history: Array<{ sender: string; text: string }>,
  emails: any[],
  reminders: any[]
): Promise<{ answer: string; suggestions: string[] }> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history, emails, reminders }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Compose Writing Assistant via Gemini Backend
 */
export async function composeAssistWithBackend(
  prompt?: string,
  draft?: string,
  action: 'generate' | 'formal' | 'friendly' | 'shorten' | 'grammar' = 'generate'
): Promise<{ subject?: string; body: string }> {
  const response = await fetch('/api/ai/compose-assist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, draft, action }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return await response.json();
}

// -------------------------------------------------------------
// Database Endpoints (Reminders & Drafts)
// -------------------------------------------------------------

export async function getRemindersFromBackend(): Promise<ReminderItem[]> {
  try {
    const res = await fetch('/api/reminders');
    if (!res.ok) throw new Error('Failed to fetch reminders');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for reminders:', err);
    return [];
  }
}

export async function saveReminderToBackend(reminder: ReminderItem): Promise<ReminderItem> {
  const res = await fetch('/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reminder),
  });
  if (!res.ok) throw new Error('Failed to save reminder');
  return await res.json();
}

export async function updateReminderInBackend(id: string, updates: Partial<ReminderItem>): Promise<ReminderItem> {
  const res = await fetch(`/api/reminders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update reminder');
  return await res.json();
}

export async function deleteReminderFromBackend(id: string): Promise<boolean> {
  const res = await fetch(`/api/reminders/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success;
}

export async function getDraftsFromBackend(): Promise<DraftEmail[]> {
  try {
    const res = await fetch('/api/drafts');
    if (!res.ok) throw new Error('Failed to fetch drafts');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for drafts:', err);
    return [];
  }
}

export async function saveDraftToBackend(draft: DraftEmail): Promise<DraftEmail> {
  const res = await fetch('/api/drafts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error('Failed to save draft');
  return await res.json();
}

export async function deleteDraftFromBackend(id: string): Promise<boolean> {
  const res = await fetch(`/api/drafts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success;
}
