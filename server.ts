import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { 
  summarizeEmail, 
  generateReply, 
  extractTasksAndDeadlines, 
  chatWithAssistant, 
  assistCompose 
} from './server/geminiService';
import { 
  getAllReminders, 
  saveReminder, 
  updateReminder, 
  deleteReminder, 
  getAllDrafts, 
  saveDraft, 
  deleteDraft, 
  getPreferences, 
  savePreferences, 
  getFirebaseStatus 
} from './server/storageService';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with reasonable limits
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------
// API Endpoints: Health & Status
// -------------------------------------------------------------
app.get('/api/status', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const firebaseStatus = getFirebaseStatus();

  res.json({
    status: 'online',
    app: 'MailMind AI Backend',
    gemini: {
      configured: hasGeminiKey,
      model: 'gemini-3.8-flash',
    },
    database: {
      type: firebaseStatus.configured ? 'Firebase Firestore' : 'Persistent Storage (Server-backed)',
      firebase: firebaseStatus,
      remindersCount: getAllReminders().length,
      draftsCount: getAllDrafts().length,
    },
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// API Endpoints: AI Features (Gemini powered)
// -------------------------------------------------------------

// 1. AI Email Summarizer
app.post('/api/ai/summarize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, sender, body } = req.body;
    if (!body || typeof body !== 'string') {
      res.status(400).json({ error: 'Email content (body) is required.' });
      return;
    }

    const summary = await summarizeEmail(
      subject || 'No Subject',
      sender || 'Unknown Sender',
      body
    );

    res.json(summary);
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate AI email summary.',
      details: 'Please ensure GEMINI_API_KEY is configured in your project settings.'
    });
  }
});

// 2. AI Reply Generator
app.post('/api/ai/reply', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, sender, body, tone = 'professional' } = req.body;
    if (!body || typeof body !== 'string') {
      res.status(400).json({ error: 'Email content (body) is required.' });
      return;
    }

    const reply = await generateReply(
      subject || 'No Subject',
      sender || 'Colleague',
      body,
      tone
    );

    res.json({ reply });
  } catch (error: any) {
    console.error('Reply error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate AI reply.',
      details: 'Please ensure GEMINI_API_KEY is configured in your project settings.'
    });
  }
});

// 3. Task & Deadline Extraction
app.post('/api/ai/extract-tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, sender, body } = req.body;
    if (!body || typeof body !== 'string') {
      res.status(400).json({ error: 'Email content (body) is required.' });
      return;
    }

    const tasks = await extractTasksAndDeadlines(
      subject || 'No Subject',
      sender || 'Unknown Sender',
      body
    );

    res.json({ tasks });
  } catch (error: any) {
    console.error('Extract tasks error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to extract tasks and deadlines.',
      details: 'Please check your connection and GEMINI_API_KEY.'
    });
  }
});

// 4. AI Assistant Chat
app.post('/api/ai/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, history = [], emails = [], reminders = [] } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Chat query is required.' });
      return;
    }

    const result = await chatWithAssistant(query, history, emails, reminders);
    res.json(result);
  } catch (error: any) {
    console.error('Chat assistant error:', error);
    res.status(500).json({ 
      error: error.message || 'AI Assistant encountered an error processing your query.',
      details: 'Please check your connection and GEMINI_API_KEY.'
    });
  }
});

// 5. Compose Writing Assistant
app.post('/api/ai/compose-assist', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, draft, action = 'generate' } = req.body;
    const result = await assistCompose(prompt, draft, action);
    res.json(result);
  } catch (error: any) {
    console.error('Compose assist error:', error);
    res.status(500).json({ 
      error: error.message || 'AI Writing Assistant error.',
      details: 'Please check your connection and GEMINI_API_KEY.'
    });
  }
});

// -------------------------------------------------------------
// API Endpoints: Persistent Database (Reminders, Drafts, Prefs)
// -------------------------------------------------------------

// Reminders
app.get('/api/reminders', (req: Request, res: Response) => {
  res.json(getAllReminders());
});

app.post('/api/reminders', (req: Request, res: Response): void => {
  const { title, deadline, status, urgency, sender, relatedEmailSubject, relatedEmailId } = req.body;
  if (!title || !deadline) {
    res.status(400).json({ error: 'Title and deadline are required.' });
    return;
  }

  const newReminder = saveReminder({
    id: req.body.id || `rem-${Date.now()}`,
    title,
    deadline,
    status: status || 'upcoming',
    urgency: urgency || 'Important',
    sender: sender || 'Self',
    relatedEmailSubject: relatedEmailSubject || 'Manual entry',
    relatedEmailId: relatedEmailId || undefined,
    dateCreated: req.body.dateCreated || new Date().toISOString().split('T')[0],
  });

  res.status(201).json(newReminder);
});

app.put('/api/reminders/:id', (req: Request, res: Response): void => {
  const updated = updateReminder(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Reminder not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/reminders/:id', (req: Request, res: Response): void => {
  const success = deleteReminder(req.params.id);
  res.json({ success });
});

// Drafts
app.get('/api/drafts', (req: Request, res: Response) => {
  res.json(getAllDrafts());
});

app.post('/api/drafts', (req: Request, res: Response): void => {
  const { to, subject, body, id } = req.body;
  const draft = saveDraft({
    id: id || `draft-${Date.now()}`,
    to: to || '',
    subject: subject || '',
    body: body || '',
    lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  res.status(201).json(draft);
});

app.delete('/api/drafts/:id', (req: Request, res: Response): void => {
  const success = deleteDraft(req.params.id);
  res.json({ success });
});

// Preferences
app.get('/api/preferences', (req: Request, res: Response) => {
  res.json(getPreferences());
});

app.post('/api/preferences', (req: Request, res: Response) => {
  const updated = savePreferences(req.body);
  res.json(updated);
});

// -------------------------------------------------------------
// Vite Integration (Dev middleware / Prod static serving)
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MailMind AI Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
