import { GoogleGenAI, Type } from '@google/genai';

/**
 * Server-side Gemini AI service for MailMind AI
 * Uses the official @google/genai SDK with the recommended gemini-3.8-flash model.
 * All API keys remain strictly secure on the server side.
 */

// Initialize client according to gemini-api guidelines
const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

export interface EmailSummaryResult {
  headline: string;
  mainIdea: string;
  importantPoints: string[];
  tasks: string[];
  deadlines: string[];
  condensedPercentage: number;
  readingTimeSavedMinutes: number;
}

export interface ExtractedTaskResult {
  title: string;
  deadline: string;
  context: string;
  urgency: 'Urgent' | 'Important' | 'Informational';
}

export interface ComposeAssistResult {
  subject?: string;
  body: string;
}

/**
 * Summarize an email using Gemini AI
 */
export async function summarizeEmail(
  subject: string,
  sender: string,
  body: string
): Promise<EmailSummaryResult> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets.');
  }

  const prompt = `Analyze and summarize the following email carefully.
Sender: ${sender}
Subject: ${subject}

Email Content:
"""
${body}
"""

Provide a structured JSON object with the following fields:
1. "headline": A crisp 1-sentence headline capturing the central message.
2. "mainIdea": A clear 1-2 sentence paragraph explaining the primary directive or topic.
3. "importantPoints": An array of 3-5 concise bullet points of crucial facts or context.
4. "tasks": An array of actionable steps required from the recipient (empty array if purely informational).
5. "deadlines": An array of specific dates, times, or cutoff deadlines mentioned in the email. ONLY include real deadlines explicitly stated in the text.
6. "condensedPercentage": A number between 60 and 90 estimating the reading reduction percentage.
7. "readingTimeSavedMinutes": A number (e.g. 2.5) estimating reading time saved.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          mainIdea: { type: Type.STRING },
          importantPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          tasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          deadlines: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          condensedPercentage: { type: Type.NUMBER },
          readingTimeSavedMinutes: { type: Type.NUMBER },
        },
        required: ['headline', 'mainIdea', 'importantPoints', 'tasks', 'deadlines'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response received from Gemini AI');
  }

  return JSON.parse(text) as EmailSummaryResult;
}

/**
 * Generate a context-aware reply using Gemini AI in the chosen tone
 */
export async function generateReply(
  subject: string,
  sender: string,
  body: string,
  tone: 'professional' | 'friendly' | 'formal'
): Promise<string> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets.');
  }

  const toneGuidelines = {
    professional: 'polite, clear, constructive, and business-appropriate. Balanced and respectful.',
    friendly: 'warm, cordial, collegiate, and collaborative with enthusiasm.',
    formal: 'elevated, structured, deferential, and strictly professional appropriate for faculty deans or formal committees.'
  }[tone];

  const prompt = `You are Alex Chen, a university senior and operations lead.
Draft an email response to:
Sender: ${sender}
Subject: ${subject}

Original Email:
"""
${body}
"""

Tone requirement: ${tone} (${toneGuidelines}).
Guidelines:
- Directly address the points, questions, or deadlines raised in the original message.
- Include an appropriate greeting (e.g. "Dear Prof. Vance," or "Hi Jessica,") and signoff ("Best regards, Alex Chen").
- Output ONLY the email text ready to send. Do not include markdown codeblocks or meta commentary.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response received from Gemini AI for reply generation');
  }

  return text.trim();
}

/**
 * Extract tasks and explicit deadlines from an email using Gemini AI
 */
export async function extractTasksAndDeadlines(
  subject: string,
  sender: string,
  body: string
): Promise<ExtractedTaskResult[]> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets.');
  }

  const prompt = `Analyze this email and extract all actionable tasks and deadlines.
Sender: ${sender}
Subject: ${subject}

Email Content:
"""
${body}
"""

CRITICAL RULE: NEVER invent or hallucinate missing dates or deadlines. If a task mentions a specific date or cutoff time in the text, extract that exact date/time string. If no deadline date is mentioned, label the deadline as "No explicit deadline".

Output a JSON array of tasks where each item has:
- "title": Actionable task title (concise, e.g. "Submit Canvas Architecture PDF")
- "deadline": Specific date or deadline mentioned in the email text
- "context": Brief 1-sentence explanation of why it is needed
- "urgency": One of "Urgent", "Important", or "Informational"`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            deadline: { type: Type.STRING },
            context: { type: Type.STRING },
            urgency: {
              type: Type.STRING,
              enum: ['Urgent', 'Important', 'Informational'],
            },
          },
          required: ['title', 'deadline', 'context', 'urgency'],
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];

  return JSON.parse(text) as ExtractedTaskResult[];
}

/**
 * Intelligent Assistant Chat utilizing Gemini AI
 */
export async function chatWithAssistant(
  query: string,
  history: Array<{ sender: string; text: string }>,
  emails: any[],
  reminders: any[]
): Promise<{ answer: string; suggestions: string[] }> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets.');
  }

  // Build condensed mailbox summary to provide as grounded context
  const emailSummaries = emails.map((e, idx) => ({
    index: idx + 1,
    id: e.id,
    sender: e.sender,
    subject: e.subject,
    priority: e.priority,
    receivedAt: e.receivedAt,
    read: e.read,
    snippet: e.snippet || (e.body ? e.body.slice(0, 140) : ''),
    deadlines: e.detectedDeadlines ? e.detectedDeadlines.map((d: any) => `${d.title} (${d.deadline})`) : []
  }));

  const reminderSummaries = reminders.map((r, idx) => ({
    id: r.id,
    title: r.title,
    deadline: r.deadline,
    sender: r.sender,
    status: r.status,
    urgency: r.urgency
  }));

  const systemInstruction = `You are MailMind AI Assistant, a helpful assistant built into an email productivity application.
The user is Alex Chen, a CS Senior at Stanford.
You have access to the user's active sample mailbox and tracked deadlines:

Active Mailbox (${emailSummaries.length} emails):
${JSON.stringify(emailSummaries, null, 2)}

Active Tracked Deadlines & Reminders (${reminderSummaries.length} items):
${JSON.stringify(reminderSummaries, null, 2)}

Instructions:
1. Answer the user's inquiry accurately based ONLY on this provided email and deadline data.
2. If asked to summarize important emails, list the urgent/important emails with sender and key deadlines.
3. If asked about deadlines, cite the explicit deadlines from the emails or tracked reminders.
4. If asked which emails need a reply, identify emails with questions or urgent action requests.
5. If asked about unread emails, list the ones where read === false.
6. Format your answer with clean Markdown (bold headings, bullet points).
7. Do NOT claim access to a live external Google Workspace/Gmail account. Emphasize that you are analyzing their MailMind mailbox.
8. At the very end of your response, on a new line starting with "SUGGESTIONS:", provide 3 suggested short follow-up questions separated by a pipe symbol ("|").`;

  const conversation = [
    ...history.slice(-4).map(h => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`),
    `User: ${query}`
  ].join('\n\n');

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: conversation,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  const fullText = response.text || '';
  
  // Extract suggestions if provided
  let answer = fullText;
  let suggestions = [
    'What deadlines do I have this week?',
    'Summarize my important emails',
    'Which emails need a reply?'
  ];

  if (fullText.includes('SUGGESTIONS:')) {
    const parts = fullText.split('SUGGESTIONS:');
    answer = parts[0].trim();
    const suggestionsPart = parts[1].trim();
    const parsed = suggestionsPart.split('|').map(s => s.trim()).filter(Boolean);
    if (parsed.length > 0) {
      suggestions = parsed;
    }
  }

  return { answer, suggestions };
}

/**
 * AI Writing Assistant for email composition and polish
 */
export async function assistCompose(
  promptText?: string,
  existingDraft?: string,
  action: 'generate' | 'formal' | 'friendly' | 'shorten' | 'grammar' = 'generate'
): Promise<ComposeAssistResult> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets.');
  }

  if (action === 'generate') {
    const prompt = `Write a complete email draft based on this request: "${promptText}".
Sender: Alex Chen (Senior CS student / Project Operations)
Output a JSON object with:
- "subject": A concise, clear email subject line
- "body": Complete email body text with greeting and sign-off`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ['subject', 'body'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No draft generated');
    return JSON.parse(text) as ComposeAssistResult;
  }

  // Refine existing draft
  const actionPrompts = {
    formal: 'Rewrite this draft to be more formal, polished, and respectful for academic faculty or executive leadership.',
    friendly: 'Rewrite this draft to be friendly, approachable, warm, and collaborative.',
    shorten: 'Make this draft concise, crisp, and direct while preserving all essential details and requests.',
    grammar: 'Fix all grammar, spelling, punctuation, and phrasing issues while preserving the author voice.'
  }[action];

  const prompt = `${actionPrompts}

Draft text:
"""
${existingDraft}
"""

Output ONLY the improved draft text without meta explanations or quotation blocks.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return {
    body: (response.text || '').trim()
  };
}
