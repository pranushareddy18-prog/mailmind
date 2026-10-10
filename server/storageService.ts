import fs from 'fs';
import path from 'path';

export interface StoredReminder {
  id: string;
  title: string;
  relatedEmailId?: string;
  relatedEmailSubject: string;
  sender: string;
  deadline: string;
  status: 'upcoming' | 'completed';
  urgency: 'Urgent' | 'Important' | 'Informational';
  dateCreated: string;
}

export interface StoredDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  lastSaved: string;
}

export interface StoredPreferences {
  replyTone: 'professional' | 'friendly' | 'formal';
  autoSummarize: boolean;
}

interface DataStoreSchema {
  reminders: StoredReminder[];
  drafts: StoredDraft[];
  preferences: StoredPreferences;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA: DataStoreSchema = {
  reminders: [
    {
      id: 'rem-1',
      title: 'Submit 2-page Architecture PDF to Canvas',
      relatedEmailId: 'email-1',
      relatedEmailSubject: 'CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
      sender: 'Prof. David Vance',
      deadline: 'Tuesday, Oct 13 · 5:00 PM EST',
      status: 'upcoming',
      urgency: 'Urgent',
      dateCreated: '2026-10-09'
    },
    {
      id: 'rem-2',
      title: 'GitHub Code Freeze Cutoff for Capstone',
      relatedEmailId: 'email-1',
      relatedEmailSubject: 'CS Capstone Committee: Final Code Freeze & Live Demo Guidelines',
      sender: 'Prof. David Vance',
      deadline: 'Wednesday, Oct 14 · 11:59 PM EST',
      status: 'upcoming',
      urgency: 'Urgent',
      dateCreated: '2026-10-09'
    },
    {
      id: 'rem-3',
      title: 'Submit Google Interview Availability Form',
      relatedEmailId: 'email-2',
      relatedEmailSubject: 'Google University Programs: Software Engineering Intern Interview Invitation',
      sender: 'Jessica Martinez',
      deadline: 'Monday, Oct 19 · 12:00 PM PST',
      status: 'upcoming',
      urgency: 'Urgent',
      dateCreated: '2026-10-09'
    },
    {
      id: 'rem-4',
      title: 'Hackathon Final Submission & Video Due',
      relatedEmailId: 'email-4',
      relatedEmailSubject: 'Hackathon Project "MailMind" Sync & Weekend Hackroom Booking',
      sender: 'Maya Lin',
      deadline: 'Sunday · 3:00 PM',
      status: 'upcoming',
      urgency: 'Important',
      dateCreated: '2026-10-09'
    }
  ],
  drafts: [
    {
      id: 'draft-initial-1',
      to: 'david.vance@cs.stanford.edu',
      subject: 'Draft: CS Capstone Live Demo Staging Token Request',
      body: 'Dear Professor Vance,\n\nOur team is finalizing the demonstration dataset. Could you please provide 2 extra staging API tokens for our test runner?\n\nBest,\nAlex',
      lastSaved: 'Yesterday at 4:15 PM'
    }
  ],
  preferences: {
    replyTone: 'professional',
    autoSummarize: true
  }
};

function ensureStorage(): DataStoreSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading storage:', err);
    return INITIAL_DATA;
  }
}

function persistStorage(data: DataStoreSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing storage:', err);
  }
}

// Reminders API
export function getAllReminders(): StoredReminder[] {
  const store = ensureStorage();
  return store.reminders;
}

export function saveReminder(item: StoredReminder): StoredReminder {
  const store = ensureStorage();
  const existingIdx = store.reminders.findIndex(r => r.id === item.id);
  if (existingIdx >= 0) {
    store.reminders[existingIdx] = item;
  } else {
    store.reminders.unshift(item);
  }
  persistStorage(store);
  return item;
}

export function updateReminder(id: string, updates: Partial<StoredReminder>): StoredReminder | null {
  const store = ensureStorage();
  const index = store.reminders.findIndex(r => r.id === id);
  if (index === 0 || index > 0) {
    store.reminders[index] = { ...store.reminders[index], ...updates };
    persistStorage(store);
    return store.reminders[index];
  }
  return null;
}

export function deleteReminder(id: string): boolean {
  const store = ensureStorage();
  const initialLength = store.reminders.length;
  store.reminders = store.reminders.filter(r => r.id !== id);
  if (store.reminders.length !== initialLength) {
    persistStorage(store);
    return true;
  }
  return false;
}

// Drafts API
export function getAllDrafts(): StoredDraft[] {
  const store = ensureStorage();
  return store.drafts;
}

export function saveDraft(draft: StoredDraft): StoredDraft {
  const store = ensureStorage();
  const existingIdx = store.drafts.findIndex(d => d.id === draft.id);
  if (existingIdx >= 0) {
    store.drafts[existingIdx] = draft;
  } else {
    store.drafts.unshift(draft);
  }
  persistStorage(store);
  return draft;
}

export function deleteDraft(id: string): boolean {
  const store = ensureStorage();
  const initialLength = store.drafts.length;
  store.drafts = store.drafts.filter(d => d.id !== id);
  if (store.drafts.length !== initialLength) {
    persistStorage(store);
    return true;
  }
  return false;
}

// Preferences API
export function getPreferences(): StoredPreferences {
  const store = ensureStorage();
  return store.preferences;
}

export function savePreferences(prefs: Partial<StoredPreferences>): StoredPreferences {
  const store = ensureStorage();
  store.preferences = { ...store.preferences, ...prefs };
  persistStorage(store);
  return store.preferences;
}

// Firebase configuration status check
export function getFirebaseStatus(): {
  configured: boolean;
  configFilePresent: boolean;
  firestoreDatabaseId?: string;
  projectId?: string;
  instructions: string;
} {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  const exists = fs.existsSync(configPath);
  
  if (exists) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return {
        configured: true,
        configFilePresent: true,
        firestoreDatabaseId: config.firestoreDatabaseId || '(default)',
        projectId: config.projectId,
        instructions: 'Firebase Firestore is configured and provisioned.'
      };
    } catch (e) {
      // Fall through
    }
  }

  return {
    configured: false,
    configFilePresent: false,
    instructions: 'Firebase configuration is prepared in firebase-blueprint.json and firestore.rules. Persistent storage is currently operating in server-backed persistence mode.'
  };
}
