import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  Send, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Edit3, 
  ListTodo, 
  CalendarPlus, 
  X,
  Download,
  FileText
} from 'lucide-react';
import { EmailItem, ReplyTone, AISummary, DetectedDeadline } from '../types';
import { generateSummaryForEmail, generateAIReply } from '../utils/aiAnalyzer';
import { 
  summarizeEmailWithBackend, 
  generateReplyWithBackend, 
  extractTasksWithBackend, 
  ExtractedTask 
} from '../utils/apiClient';

interface EmailViewerProps {
  email: EmailItem;
  onBack: () => void;
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string) => void;
  onConfirmDeadlineAsReminder: (deadline: DetectedDeadline, email: EmailItem) => void;
  onDismissDeadline: (deadlineId: string) => void;
  onUpdateEmailSummary: (emailId: string, summary: AISummary) => void;
  onDemoSendReply: (email: EmailItem, replyText: string) => void;
  showToast: (msg: string) => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  onBack,
  onToggleStar,
  onArchive,
  onDelete,
  onToggleRead,
  onConfirmDeadlineAsReminder,
  onDismissDeadline,
  onUpdateEmailSummary,
  onDemoSendReply,
  showToast
}) => {
  // Summarizer states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(email.summaryGenerated || false);
  const [summaryData, setSummaryData] = useState<AISummary | null>(email.summary || null);

  // Reply generator states
  const [showReplySection, setShowReplySection] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('professional');
  const [replyText, setReplyText] = useState(
    email.suggestedReplies ? email.suggestedReplies.professional : ''
  );
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Task & Deadline Extraction / Reminder Confirmation Modal states
  const [isExtractingTasks, setIsExtractingTasks] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [editingTask, setEditingTask] = useState<{
    title: string;
    deadline: string;
    urgency: 'Urgent' | 'Important' | 'Informational';
    context: string;
  }>({
    title: '',
    deadline: '',
    urgency: 'Important',
    context: ''
  });

  // Print & Export Preview Modal states
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printCopied, setPrintCopied] = useState(false);

  const handleTriggerPrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleExecuteBrowserPrint = () => {
    try {
      window.print();
    } catch (e) {
      showToast('Browser sandbox blocked native print. Use "Download Printable (.html)" to print cleanly!');
    }
  };

  const handleDownloadPrintableHTML = () => {
    const summaryHTML = summaryData ? `
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 18px; margin: 20px 0; font-size: 13px;">
        <h3 style="margin-top: 0; color: #0284c7; font-size: 14px;">✨ MailMind AI Synthesized Summary & Action Items</h3>
        <p><strong>Main Idea:</strong> ${summaryData.mainIdea}</p>
        ${summaryData.importantPoints && summaryData.importantPoints.length > 0 ? `
          <p style="margin-bottom: 4px;"><strong>Key Takeaways:</strong></p>
          <ul style="margin-top: 0; padding-left: 20px;">
            ${summaryData.importantPoints.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
          </ul>
        ` : ''}
        ${summaryData.tasks && summaryData.tasks.length > 0 ? `
          <p style="margin-bottom: 4px;"><strong>Action Items:</strong></p>
          <ul style="margin-top: 0; padding-left: 20px;">
            ${summaryData.tasks.map(t => `<li style="margin-bottom: 4px;">[ ] ${t}</li>`).join('')}
          </ul>
        ` : ''}
        ${summaryData.deadlines && summaryData.deadlines.length > 0 ? `
          <p style="color: #b91c1c; font-weight: bold; margin-top: 8px;">Deadlines: ${summaryData.deadlines.join(' • ')}</p>
        ` : ''}
      </div>
    ` : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MailMind AI — ${email.subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 40px auto;
      padding: 24px;
      background: #ffffff;
    }
    .print-bar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .meta-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #f1f5f9;
    }
    .meta-label {
      font-weight: bold;
      color: #64748b;
      width: 100px;
    }
    .body-box {
      white-space: pre-line;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      font-size: 14px;
      line-height: 1.7;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 30px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      .print-bar { display: none !important; }
      body { margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span style="font-size: 13px; color: #475569;">Ready to print or save as PDF:</span>
    <button class="print-btn" onclick="window.print()">🖨️ Click to Print or Save PDF</button>
  </div>
  <div class="header">
    <div>
      <h2 style="margin: 0; color: #0f172a;">MailMind AI — Email Document Archive</h2>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Stanford University Mailbox · Certified Document</div>
    </div>
    <span style="font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; border: 1px solid #cbd5e1; text-transform: uppercase;">
      ${email.priority} Priority
    </span>
  </div>
  <table class="meta-table">
    <tr><td class="meta-label">Subject:</td><td><strong>${email.subject}</strong></td></tr>
    <tr><td class="meta-label">From:</td><td>${email.sender} &lt;${email.senderEmail}&gt;</td></tr>
    <tr><td class="meta-label">To:</td><td>Alex Chen &lt;alex.chen@stanford.edu&gt;</td></tr>
    <tr><td class="meta-label">Date:</td><td>${email.receivedAt}</td></tr>
  </table>
  <div class="body-box">
${email.body}
  </div>
  ${summaryHTML}
  <div class="footer">
    <span>Archived by MailMind AI Productivity Platform</span>
    <span>Page 1 of 1</span>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Print-${email.subject.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Print-Ready HTML document downloaded! Open it to print cleanly or save as PDF.');
  };

  const handleDownloadPrintableText = () => {
    const summarySection = summaryData ? `
--------------------------------------------------------------------------------
AI SUMMARY (Synthesized by MailMind AI):
Main Idea:
${summaryData.mainIdea}

Key Takeaways:
${summaryData.importantPoints.map(p => `• ${p}`).join('\n')}

Action Items:
${summaryData.tasks && summaryData.tasks.length > 0 ? summaryData.tasks.map(t => `[ ] ${t}`).join('\n') : 'None'}

Deadlines Mentioned:
${summaryData.deadlines && summaryData.deadlines.length > 0 ? summaryData.deadlines.map(d => `! ${d}`).join('\n') : 'No hard deadlines'}
` : '';

    const content = `================================================================================
MAILMIND AI — SMART EMAIL ASSISTANT ARCHIVE
================================================================================
Subject:  ${email.subject}
From:     ${email.sender} <${email.senderEmail}>
Date:     ${email.receivedAt}
Priority: ${email.priority}
Folder:   ${email.folder.toUpperCase()}
================================================================================

EMAIL CONTENT:
${email.body}
${summarySection}
================================================================================
Generated for Alex Chen · Stanford University · MailMind AI
================================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Email-${email.subject.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Printable document downloaded successfully!');
  };

  const handleCopyPrintable = () => {
    const content = `Subject: ${email.subject}
From: ${email.sender} <${email.senderEmail}>
Date: ${email.receivedAt}

${email.body}

${summaryData ? `\n--- AI Summary ---\n${summaryData.mainIdea}` : ''}`;

    navigator.clipboard.writeText(content);
    setPrintCopied(true);
    showToast('Clean print text copied to clipboard!');
    setTimeout(() => setPrintCopied(false), 2000);
  };

  // Handle "Summarize Email with AI" click (calls Gemini backend)
  const handleSummarizeClick = async () => {
    setIsSummarizing(true);
    try {
      // Call backend Gemini AI
      const summary = await summarizeEmailWithBackend(email.subject, email.sender, email.body);
      setSummaryData(summary);
      setShowSummary(true);
      onUpdateEmailSummary(email.id, summary);
      showToast('Summarized with Google Gemini AI!');
    } catch (err: any) {
      console.warn('Backend summary error, using local fallback:', err);
      // Seamless local fallback if backend key not yet saved
      const fallbackSummary = generateSummaryForEmail(email);
      setSummaryData(fallbackSummary);
      setShowSummary(true);
      onUpdateEmailSummary(email.id, fallbackSummary);
      showToast('Summary generated (Offline fallback)');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle "Generate AI Reply" click (calls Gemini backend)
  const handleGenerateReplyClick = async (toneOverride?: ReplyTone) => {
    const tone = toneOverride || selectedTone;
    setIsGeneratingReply(true);
    setShowReplySection(true);

    try {
      const generated = await generateReplyWithBackend(email.subject, email.sender, email.body, tone);
      setReplyText(generated);
      showToast(`AI reply generated in ${tone} tone with Gemini!`);
    } catch (err: any) {
      console.warn('Backend reply error, using local fallback:', err);
      const fallback = generateAIReply(email, tone);
      setReplyText(fallback);
      showToast(`AI reply drafted in ${tone} tone`);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleToneChange = (newTone: ReplyTone) => {
    setSelectedTone(newTone);
    handleGenerateReplyClick(newTone);
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(replyText);
    setCopied(true);
    showToast('Reply copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      showToast('You can now edit the reply text directly.');
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onDemoSendReply(email, replyText);
    showToast('Demo Mode: Reply logged in Sent mailbox (no actual email sent)');
  };

  // Handle "Create Reminder / Extract Tasks" click (calls Gemini backend)
  const handleExtractTasksClick = async () => {
    setIsExtractingTasks(true);
    try {
      const tasks = await extractTasksWithBackend(email.subject, email.sender, email.body);
      setExtractedTasks(tasks);
      if (tasks.length > 0) {
        setEditingTask({
          title: tasks[0].title,
          deadline: tasks[0].deadline,
          urgency: tasks[0].urgency,
          context: tasks[0].context
        });
        setIsReminderModalOpen(true);
        showToast(`Gemini identified ${tasks.length} deadline${tasks.length > 1 ? 's' : ''}!`);
      } else {
        // If no explicit deadlines, prompt manual creation
        setEditingTask({
          title: `Follow up: ${email.subject}`,
          deadline: 'Within 48 hours',
          urgency: email.priority,
          context: `Action from ${email.sender}`
        });
        setIsReminderModalOpen(true);
        showToast('No hard deadline detected. You can set one manually.');
      }
    } catch (err: any) {
      console.warn('Backend extraction error:', err);
      setEditingTask({
        title: `Follow up: ${email.subject}`,
        deadline: 'Friday by 5:00 PM',
        urgency: email.priority,
        context: `Action from ${email.sender}`
      });
      setIsReminderModalOpen(true);
    } finally {
      setIsExtractingTasks(false);
    }
  };

  // Confirm edited reminder
  const handleConfirmEditedReminder = () => {
    if (!editingTask.title.trim() || !editingTask.deadline.trim()) {
      showToast('Please provide a title and deadline date');
      return;
    }

    const confirmedDeadline: DetectedDeadline = {
      id: `det-${Date.now()}`,
      title: editingTask.title,
      deadline: editingTask.deadline,
      context: editingTask.context || email.subject,
      confirmed: true
    };

    onConfirmDeadlineAsReminder(confirmedDeadline, email);
    setIsReminderModalOpen(false);
    showToast('Reminder confirmed and saved persistently!');
  };

  const priorityClasses = {
    Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    Important: 'bg-amber-50 text-amber-700 border-amber-200',
    Informational: 'bg-slate-100 text-slate-600 border-slate-200'
  }[email.priority];

  return (
    <div className="space-y-4">
      {/* Top Action Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inbox</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Save / Star Email button */}
          <button
            onClick={() => onToggleStar(email.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer text-xs font-semibold ${
              email.starred 
                ? 'text-amber-800 bg-amber-50 border border-amber-200 shadow-2xs' 
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50 border border-slate-200'
            }`}
            title={email.starred ? 'Saved to Saved Mails dashboard (click to un-save)' : 'Save to Saved Mails dashboard'}
          >
            <Star className={`w-3.5 h-3.5 ${email.starred ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>{email.starred ? 'Saved' : 'Save Email'}</span>
          </button>

          <button
            onClick={() => onToggleRead(email.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title={email.read ? 'Mark as unread' : 'Mark as read'}
          >
            {email.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onArchive(email.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Archive email"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(email.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Delete email"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Buttons in header */}
        <div className="flex items-center gap-2">
          {/* Create Reminder Button */}
          <button
            onClick={handleExtractTasksClick}
            disabled={isExtractingTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer disabled:opacity-50"
            title="Extract tasks and create a confirmed reminder with Gemini"
          >
            {isExtractingTasks ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            ) : (
              <CalendarPlus className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="hidden sm:inline">Create Reminder</span>
          </button>

          {/* Summarize button */}
          <button
            onClick={handleSummarizeClick}
            disabled={isSummarizing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition cursor-pointer disabled:opacity-50"
          >
            {isSummarizing ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            )}
            <span>{showSummary ? 'Regenerate Summary' : 'Summarize Email'}</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer text-xs font-semibold"
            title="Print or export email"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span className="hidden sm:inline">Print / Export</span>
          </button>
        </div>
      </div>

      {/* Detected Deadlines Banner with Confirmation */}
      {email.detectedDeadlines && email.detectedDeadlines.filter(d => !d.confirmed).map((det) => (
        <div 
          key={det.id}
          className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 animate-in slide-in-from-top-1"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 text-sm">{det.title}</span>
                <span className="bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  Detected Deadline
                </span>
              </div>
              <p className="text-amber-800 mt-0.5">
                <strong>Due:</strong> {det.deadline} — <em>{det.context}</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => onConfirmDeadlineAsReminder(det, email)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm as Reminder</span>
            </button>
            <button
              onClick={() => onDismissDeadline(det.id)}
              className="px-2.5 py-1.5 rounded-xl hover:bg-amber-100 text-amber-800 font-medium transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}

      {/* Email Subject, Metadata & Full Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
        {/* Sent Folder Banner if viewing a sent email */}
        {email.folder === 'sent' && (
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Send className="w-4 h-4 text-sky-600 shrink-0" />
              <span><strong>Sent Message:</strong> Dispatched from your MailMind account and logged to your Sent Emails Dashboard.</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Delivered</span>
            </span>
          </div>
        )}

        {/* Email Header */}
        <div className="pb-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {email.subject}
            </h1>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${priorityClasses}`}>
              {email.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500 flex-wrap">
            <img
              src={email.avatar}
              alt={email.sender}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900">{email.sender}</span>
                <span className="text-slate-400">&lt;{email.senderEmail}&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>to me</span>
                <span>•</span>
                <span>{email.receivedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Email Body */}
        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
          {email.body}
        </div>

        {/* Action bar inside email viewer: Summarize with AI & Generate AI Reply */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSummarizeClick}
            disabled={isSummarizing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-xs shadow-sky-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isSummarizing ? (
              <RotateCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-100" />
            )}
            <span>Summarize Email</span>
          </button>

          <button
            onClick={() => handleGenerateReplyClick()}
            disabled={isGeneratingReply}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition cursor-pointer disabled:opacity-50"
          >
            {isGeneratingReply ? (
              <RotateCw className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <Send className="w-4 h-4 text-sky-600" />
            )}
            <span>Generate AI Reply</span>
          </button>

          <button
            onClick={handleExtractTasksClick}
            disabled={isExtractingTasks}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 transition cursor-pointer disabled:opacity-50"
          >
            <CalendarPlus className="w-4 h-4 text-indigo-600" />
            <span>Create Reminder</span>
          </button>
        </div>
      </div>

      {/* AI Summary Card (Section 2: Main idea, important points, tasks, deadlines) */}
      {showSummary && summaryData && (
        <div className="bg-gradient-to-br from-sky-50/60 to-white rounded-2xl border border-sky-200/90 shadow-2xs p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shadow-sky-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">AI Email Summary</h3>
                <p className="text-[11px] text-sky-700 font-medium">Synthesized with Google Gemini AI</p>
              </div>
            </div>

            {summaryData.condensedPercentage && (
              <span className="text-[11px] font-bold text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full">
                Condensed {summaryData.condensedPercentage}% · Saved ~{summaryData.readingTimeSavedMinutes || 2.5}m
              </span>
            )}
          </div>

          {/* 1. Main Idea */}
          <div className="bg-white rounded-xl border border-sky-100 p-3.5 shadow-2xs">
            <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">
              Main Idea
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {summaryData.mainIdea}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2. Important Points */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                Important Points
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {summaryData.importantPoints.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Tasks That Need to be Completed */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-indigo-500" />
                Action Items / Tasks
              </h4>
              <div className="text-xs text-slate-700 space-y-1.5">
                {summaryData.tasks && summaryData.tasks.length > 0 ? (
                  summaryData.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-sm border border-slate-300 bg-slate-50 shrink-0 mt-0.5"></span>
                      <span className="leading-relaxed">{task}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No required actions identified in this email.</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Deadlines Mentioned */}
          {summaryData.deadlines && summaryData.deadlines.length > 0 && (
            <div className="bg-rose-50/50 rounded-xl border border-rose-200/80 p-3.5 shadow-2xs">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Deadlines Mentioned
              </h4>
              <div className="flex flex-wrap gap-2">
                {summaryData.deadlines.map((dl, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-rose-200 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{dl}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Reply Generator Section (Section 3: Tone selection, editable text box, Regenerate, Copy, Edit, Send Demo) */}
      {showReplySection && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">AI Reply Generator</h3>
                <p className="text-[11px] text-slate-500">Drafted with Google Gemini AI</p>
              </div>
            </div>

            {/* Tone Selector: Professional, Friendly, Formal */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Tone:</span>
              {(['professional', 'friendly', 'formal'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleToneChange(tone)}
                  className={`px-3 py-1 rounded-lg capitalize font-semibold transition cursor-pointer ${
                    selectedTone === tone
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Text Box */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={8}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition font-sans"
              placeholder="Your generated reply will appear here..."
            />
            {isGeneratingReply && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-2xs rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing response with Gemini...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Buttons: Regenerate, Copy Reply, Edit, Send */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-2">
              {/* Send Demo Button */}
              <button
                onClick={handleSendReply}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-xs shadow-sky-500/20 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send (Demo Mode)</span>
              </button>

              {/* Regenerate Button */}
              <button
                onClick={() => handleGenerateReplyClick()}
                disabled={isGeneratingReply}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isGeneratingReply ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              {/* Edit Button */}
              <button
                onClick={handleEditFocus}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Copy Reply Button */}
            <button
              onClick={handleCopyReply}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Reply</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reminder Confirmation & Editing Modal (Requirement 4: Confirm and edit before saving) */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Confirm & Edit Smart Reminder</h3>
              </div>
              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Gemini analyzed this email and identified the following milestone. You can edit the task details before saving to your persistent database.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deadline Date & Time * (Never fabricated by AI)
                </label>
                <input
                  type="text"
                  value={editingTask.deadline}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Urgency Level
                </label>
                <div className="flex gap-2">
                  {(['Urgent', 'Important', 'Informational'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEditingTask({ ...editingTask, urgency: lvl })}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                        editingTask.urgency === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Context / Notes
                </label>
                <textarea
                  rows={2}
                  value={editingTask.context}
                  onChange={(e) => setEditingTask({ ...editingTask, context: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(false)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEditedReminder}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer shadow-xs shadow-indigo-500/20"
              >
                Confirm & Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print & Export Preview Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Print & Export Document</h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Iframe Notice & Tip */}
            <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950">Printing inside Cloud Preview:</span>
                <span className="text-amber-800 ml-1">
                  Browser security restricts pop-up printer dialogs inside sandboxed iframes. Use <strong>"Download Print-Ready (.html)"</strong> below for a formatted document you can open and print anytime!
                </span>
              </div>
            </div>

            {/* Document Preview Area (Formatted like a physical paper sheet) */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-100/60">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 print-document font-sans text-xs sm:text-sm text-slate-800">
                {/* Letterhead */}
                <div className="pb-4 border-b-2 border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold tracking-tight text-slate-900">
                      MailMind AI — Email Document Archive
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Stanford University Student Mailbox · Certified Document
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 uppercase">
                    {email.priority}
                  </span>
                </div>

                {/* Metadata Table */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Subject</span>
                    <span className="font-bold text-slate-900">{email.subject}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Date Received</span>
                    <span className="text-slate-700">{email.receivedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">From</span>
                    <span className="text-slate-700">{email.sender} &lt;{email.senderEmail}&gt;</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">To</span>
                    <span className="text-slate-700">Alex Chen &lt;alex.chen@stanford.edu&gt;</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="py-2 space-y-2">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                    Message Body
                  </span>
                  <div className="whitespace-pre-line leading-relaxed text-slate-800 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                    {email.body}
                  </div>
                </div>

                {/* AI Summary section (if generated) */}
                {summaryData && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-sky-700 font-bold block text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-500" />
                      AI Synthesized Summary & Deadlines
                    </span>
                    <div className="bg-sky-50/60 p-3.5 rounded-lg border border-sky-100 text-xs space-y-2">
                      <p><strong>Main Idea:</strong> {summaryData.mainIdea}</p>
                      {summaryData.importantPoints && summaryData.importantPoints.length > 0 && (
                        <div>
                          <strong>Key Takeaways:</strong>
                          <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                            {summaryData.importantPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {summaryData.deadlines && summaryData.deadlines.length > 0 && (
                        <p className="text-rose-700"><strong>Deadlines:</strong> {summaryData.deadlines.join(' • ')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer signoff */}
                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
                  <span>Archived by MailMind AI Productivity Platform</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center flex-wrap gap-2">
                {/* Print-Ready HTML Download (Primary reliable option) */}
                <button
                  onClick={handleDownloadPrintableHTML}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs shadow-sky-500/25"
                  title="Download styled HTML document ready for clean printing and PDF export"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Print-Ready (.html)</span>
                </button>

                {/* Print Dialog Trigger */}
                <button
                  onClick={handleExecuteBrowserPrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  title="Trigger browser print (may be restricted inside sandboxed iframe)"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print via Browser</span>
                </button>

                {/* Download Text Document */}
                <button
                  onClick={handleDownloadPrintableText}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download .txt</span>
                </button>

                {/* Copy Formatted Text */}
                <button
                  onClick={handleCopyPrintable}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  {printCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
