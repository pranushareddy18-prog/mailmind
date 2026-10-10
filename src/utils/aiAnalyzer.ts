import { EmailItem, ReminderItem, AISummary, ReplyTone } from '../types';

/**
 * MailMind AI Analyzer & Intelligence Engine
 * Handles mock AI processing, summarization, reply generation,
 * deadline extraction, and conversational assistant querying.
 * Structured cleanly for effortless future integration with Gemini API.
 */

export function generateSummaryForEmail(email: EmailItem): AISummary {
  // If email already has handcrafted high-quality summary, return it
  if (email.summary) {
    return email.summary;
  }

  // Fallback intelligent summary synthesis for custom/new emails
  const body = email.body || '';
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
  const words = body.split(/\s+/).length || 20;

  const mainIdea = `Overview of ${email.subject} from ${email.sender}: Discussion regarding key milestones and requested next steps.`;
  
  const importantPoints: string[] = [];
  const tasks: string[] = [];
  const deadlines: string[] = [];

  lines.forEach(line => {
    const lLower = line.toLowerCase();
    if (lLower.includes('deadline') || lLower.includes('before') || lLower.includes('by ') || lLower.includes('due') || lLower.includes('cutoff')) {
      deadlines.push(line);
    } else if (lLower.includes('please') || lLower.includes('must') || lLower.includes('submit') || lLower.includes('review') || lLower.includes('verify')) {
      tasks.push(line.replace(/^(please|ensure|you must)\s+/i, ''));
    } else if (line.length > 30 && importantPoints.length < 3) {
      importantPoints.push(line);
    }
  });

  if (importantPoints.length === 0) {
    importantPoints.push(
      `Primary directive regarding ${email.subject}`,
      'Review attached documentation or referenced links',
      'Coordinate with relevant stakeholders ahead of next checkpoint'
    );
  }

  if (tasks.length === 0) {
    tasks.push(
      'Review message content and confirm timeline alignment',
      'Follow up with sender if any blockers arise'
    );
  }

  if (deadlines.length === 0) {
    deadlines.push('Standard response requested within 24-48 business hours');
  }

  return {
    headline: `AI Summary: ${email.subject}`,
    mainIdea,
    importantPoints: importantPoints.slice(0, 4),
    tasks: tasks.slice(0, 4),
    deadlines: deadlines.slice(0, 3),
    condensedPercentage: Math.min(85, Math.max(60, Math.round(((words - 35) / words) * 100))),
    readingTimeSavedMinutes: +(words / 150).toFixed(1)
  };
}

export function generateAIReply(email: EmailItem, tone: ReplyTone): string {
  // Check predefined reply
  if (email.suggestedReplies && email.suggestedReplies[tone]) {
    return email.suggestedReplies[tone];
  }

  const senderFirstName = email.sender.split(' ')[0] || 'there';

  if (tone === 'friendly') {
    return `Hi ${senderFirstName}!

Thanks so much for reaching out and sharing this update about "${email.subject}".

I've reviewed everything you mentioned and I'm totally aligned. I'll make sure to follow up on the next steps as soon as possible. Let me know if there's anything else you need from my end!

Best,
Alex`;
  }

  if (tone === 'formal') {
    return `Dear ${email.sender},

I acknowledge receipt of your correspondence regarding "${email.subject}".

Please be advised that I have reviewed the stipulations outlined in your message and have initiated the requisite procedures to ensure full compliance with the stated timeline.

Should any further documentation be required, please do not hesitate to contact me.

Respectfully yours,
Alex Chen`;
  }

  // Professional default
  return `Dear ${email.sender},

Thank you for your email regarding "${email.subject}".

I have reviewed the details and noted the milestones and requirements you specified. Everything is clear on my end, and I am actively coordinating to ensure all action items are completed in a timely manner.

I will keep you updated on our progress. Please let me know if you need any additional information in the meantime.

Best regards,
Alex Chen`;
}

export function generateAIDraftFromPrompt(prompt: string, tone: ReplyTone = 'professional'): { subject: string; body: string } {
  const pLower = prompt.toLowerCase();

  if (pLower.includes('extension') || pLower.includes('assignment') || pLower.includes('homework')) {
    return {
      subject: 'Request for Brief Extension: CS Project Milestone',
      body: `Dear Professor,

I hope you are having a productive week.

I am writing to respectfully request a brief 48-hour extension on the upcoming project milestone. Due to an unexpected hardware compilation bottleneck in our test cluster, our team needs additional time to properly validate our benchmark test cases.

We have already completed the primary implementation and system architecture document. The additional time will allow us to deliver a robust, fully-tested submission that meets the course standards.

Thank you very much for your understanding and consideration.

Sincerely,
Alex Chen
Student ID: 08492104`
    };
  }

  if (pLower.includes('interview') || pLower.includes('thank') || pLower.includes('recruiter')) {
    return {
      subject: 'Thank You — Software Engineering Technical Interview',
      body: `Hi Jessica,

Thank you so much for taking the time to speak with me today about the Software Engineering Internship position at Google.

I truly enjoyed our discussion regarding large-scale distributed consensus and the problem-solving challenge. The opportunity to contribute to systems that impact millions of developers daily is very inspiring to me.

Please let me know if you need any supplementary code samples or transcripts from my side. I look forward to hearing about the next steps.

Best regards,
Alex Chen`
    };
  }

  if (pLower.includes('meeting') || pLower.includes('sync') || pLower.includes('coffee')) {
    return {
      subject: 'Quick Coffee Chat / Project Alignment Sync',
      body: `Hi there,

Hope you're having a great week!

I would love to set up a quick 20-minute sync sometime this week to discuss our collaboration roadmap and align on upcoming sprint deliverables.

Would you have some availability this Thursday afternoon around 2:00 PM or Friday morning at 10:30 AM? Let me know what time works best for you.

Best,
Alex`
    };
  }

  // Generic draft
  return {
    subject: prompt.slice(0, 45) ? `Follow-up: ${prompt.slice(0, 40)}` : 'Project Update & Follow-up',
    body: `Hello,

I hope this message finds you well.

I am reaching out regarding our discussion on: "${prompt}".

I have reviewed the requirements and wanted to share a quick update on our progress. Everything is proceeding according to our timeline, and we look forward to finalizing the next phase together.

Please let me know if you have any questions or feedback.

Best regards,
Alex Chen`
  };
}

export function improveDraftText(text: string, action: 'formal' | 'friendly' | 'shorten' | 'grammar'): string {
  if (!text.trim()) {
    return 'Please enter some text in the message body first.';
  }

  switch (action) {
    case 'formal':
      return `Dear Colleague,\n\nI am writing to convey the following communication regarding our ongoing collaboration:\n\n${text.trim()}\n\nThank you for your continued attention to this matter. Please let me know should you require further clarification.\n\nRespectfully,\nAlex Chen`;
    case 'friendly':
      return `Hey there!\n\nHope your week is going great! Just wanted to quickly share this with you:\n\n${text.trim()}\n\nLet me know what you think, and catch you soon!\n\nCheers,\nAlex`;
    case 'shorten':
      const lines = text.split('\n').filter(Boolean);
      return `Summary points:\n${lines.map(l => `• ${l.replace(/^[-*•]\s*/, '')}`).slice(0, 3).join('\n')}\n\nPlease let me know your thoughts.\n\nBest,\nAlex`;
    case 'grammar':
      return text
        .replace(/\bi\b/g, 'I')
        .replace(/\bteh\b/g, 'the')
        .replace(/\bdont\b/g, "don't")
        .replace(/\bcant\b/g, "can't")
        .trim();
  }
}

export interface AssistantResponse {
  answer: string;
  suggestions: string[];
  quickAction?: {
    type: 'open_email' | 'open_reminders' | 'filter_unread' | 'compose';
    label: string;
    targetId?: string;
  };
}

export function processAssistantChat(
  query: string,
  emails: EmailItem[],
  reminders: ReminderItem[]
): AssistantResponse {
  const q = query.toLowerCase();

  // 1. "Summarize my important emails"
  if (q.includes('important') || q.includes('summarize important') || q.includes('summary of important')) {
    const importantEmails = emails.filter(e => (e.priority === 'Urgent' || e.priority === 'Important') && e.folder === 'inbox');
    
    let answer = `Here is a summary of your **${importantEmails.length} important and urgent emails**:\n\n`;
    importantEmails.forEach((email, i) => {
      answer += `**${i + 1}. ${email.sender}** — *"${email.subject}"*\n`;
      answer += `• **Priority:** ${email.priority} (${email.receivedAt})\n`;
      answer += `• **Key takeaway:** ${email.summary?.mainIdea || email.snippet}\n`;
      if (email.detectedDeadlines && email.detectedDeadlines.length > 0) {
        answer += `• **Deadline:** ${email.detectedDeadlines[0].deadline}\n`;
      }
      answer += `\n`;
    });

    answer += `Would you like me to draft a reply to any of these, or add their deadlines to your Reminders?`;

    return {
      answer,
      suggestions: [
        'What deadlines do I have this week?',
        'Which emails need a reply?',
        'Show my unread emails'
      ],
      quickAction: {
        type: 'open_email',
        label: `View Top Urgent Email (${importantEmails[0]?.sender || 'Inbox'})`,
        targetId: importantEmails[0]?.id
      }
    };
  }

  // 2. "What deadlines do I have this week?"
  if (q.includes('deadline') || q.includes('due') || q.includes('this week') || q.includes('calendar')) {
    const upcomingReminders = reminders.filter(r => r.status === 'upcoming');
    
    let answer = `You currently have **${upcomingReminders.length} upcoming deadlines and time-sensitive milestones**:\n\n`;
    upcomingReminders.forEach((r, i) => {
      answer += `**${i + 1}. ${r.title}**\n`;
      answer += `• **Due Date:** ${r.deadline}\n`;
      answer += `• **Source:** ${r.sender} (*${r.relatedEmailSubject}*)\n`;
      answer += `• **Urgency:** ${r.urgency}\n\n`;
    });

    answer += `You can manage or mark these as completed on the **Smart Reminders** page.`;

    return {
      answer,
      suggestions: [
        'List the tasks mentioned in my emails',
        'Which emails need a reply?',
        'Summarize my important emails'
      ],
      quickAction: {
        type: 'open_reminders',
        label: 'Open Smart Reminders Page'
      }
    };
  }

  // 3. "Which emails need a reply?"
  if (q.includes('reply') || q.includes('respond') || q.includes('need a reply') || q.includes('pending')) {
    const pendingEmails = emails.filter(e => e.folder === 'inbox' && (e.priority === 'Urgent' || e.priority === 'Important'));
    
    let answer = `Based on your inbox, **${pendingEmails.length} emails require an active response**:\n\n`;
    pendingEmails.forEach((email, i) => {
      answer += `**${i + 1}. ${email.sender}** — *"${email.subject}"*\n`;
      answer += `• Reason: Action requested regarding ${email.summary?.tasks[0] || 'deliverable'}\n`;
      answer += `• Recommended tone: ${email.category === 'personal' ? 'Friendly' : 'Professional'}\n\n`;
    });

    answer += `You can open any email and click **Generate AI Reply** to draft an instant response!`;

    return {
      answer,
      suggestions: [
        'Summarize my important emails',
        'What deadlines do I have this week?',
        'Show my unread emails'
      ],
      quickAction: {
        type: 'open_email',
        label: `Draft Reply to ${pendingEmails[0]?.sender}`,
        targetId: pendingEmails[0]?.id
      }
    };
  }

  // 4. "Show my unread emails."
  if (q.includes('unread') || q.includes('new email')) {
    const unreadEmails = emails.filter(e => !e.read && e.folder === 'inbox');
    
    if (unreadEmails.length === 0) {
      return {
        answer: `Great news! You have **0 unread emails**. Your inbox is up to date! 🎉`,
        suggestions: [
          'What deadlines do I have this week?',
          'List the tasks mentioned in my emails',
          'Summarize my important emails'
        ]
      };
    }

    let answer = `You have **${unreadEmails.length} unread email${unreadEmails.length > 1 ? 's' : ''}** in your Inbox:\n\n`;
    unreadEmails.forEach((e, i) => {
      answer += `**${i + 1}. ${e.sender}** (${e.receivedAt})\n`;
      answer += `• **Subject:** ${e.subject}\n`;
      answer += `• **Priority:** ${e.priority}\n`;
      answer += `• **Snippet:** "${e.snippet}"\n\n`;
    });

    return {
      answer,
      suggestions: [
        'Summarize my important emails',
        'What deadlines do I have this week?',
        'Which emails need a reply?'
      ],
      quickAction: {
        type: 'filter_unread',
        label: 'Filter Inbox by Unread'
      }
    };
  }

  // 5. "List the tasks mentioned in my emails."
  if (q.includes('task') || q.includes('action item') || q.includes('to do') || q.includes('todo')) {
    let allTasks: { task: string; emailSubject: string; sender: string }[] = [];
    emails.forEach(e => {
      if (e.summary?.tasks) {
        e.summary.tasks.forEach(t => {
          allTasks.push({ task: t, emailSubject: e.subject, sender: e.sender });
        });
      }
    });

    let answer = `Here are the extracted **action items & tasks** found across your inbox:\n\n`;
    allTasks.slice(0, 7).forEach((item, i) => {
      answer += `**${i + 1}. [ ] ${item.task}**\n`;
      answer += `   *From: ${item.sender} ("${item.emailSubject}")*\n`;
    });

    answer += `\nTotal tasks identified: **${allTasks.length}**. Would you like to turn any of these into a tracked reminder?`;

    return {
      answer,
      suggestions: [
        'What deadlines do I have this week?',
        'Summarize my important emails',
        'Which emails need a reply?'
      ],
      quickAction: {
        type: 'open_reminders',
        label: 'View All Deadlines & Reminders'
      }
    };
  }

  // Default intelligent assistant response
  return {
    answer: `I analyzed your mailbox containing **${emails.length} total messages** and **${reminders.filter(r => r.status === 'upcoming').length} upcoming deadlines**.\n\nI can help you:\n• Summarize complex professor and departmental emails\n• Generate customized replies with Professional, Friendly, or Formal tone\n• Track assignment and interview deadlines with reminders\n• Draft new emails with the AI Writing Assistant\n\nWhat would you like to explore?`,
    suggestions: [
      'Summarize my important emails',
      'What deadlines do I have this week?',
      'Which emails need a reply?',
      'Show my unread emails'
    ]
  };
}
