/**
 * MailMind AI — Smart Email Assistant
 * Modern, responsive AI-powered email productivity platform
 * Clean white background with light blue accents, Gmail-like ergonomics,
 * and AI summarization, reply generation, reminders, and assistant.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { InboxListView } from './components/InboxListView';
import { SentEmailsDashboard } from './components/SentEmailsDashboard';
import { SavedEmailsDashboard } from './components/SavedEmailsDashboard';
import { EmailViewer } from './components/EmailViewer';
import { RemindersView } from './components/RemindersView';
import { AIAssistantView } from './components/AIAssistantView';
import { ComposeModal } from './components/ComposeModal';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_EMAILS, INITIAL_REMINDERS } from './data/mockEmails';
import { 
  EmailItem, 
  ReminderItem, 
  DraftEmail, 
  FolderType, 
  AISummary, 
  DetectedDeadline,
  User,
  ReplyTone
} from './types';
import { 
  Sparkles, 
  FileText, 
  Trash2, 
  RotateCcw, 
  PenSquare, 
  Check, 
  Archive, 
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import { 
  fetchBackendStatus, 
  getRemindersFromBackend, 
  saveReminderToBackend, 
  updateReminderInBackend, 
  deleteReminderFromBackend,
  getDraftsFromBackend,
  saveDraftToBackend,
  deleteDraftFromBackend,
  BackendStatus
} from './utils/apiClient';

const CURRENT_USER: User = {
  id: 'user-alex',
  name: 'Alex Chen',
  email: 'alex.chen@stanford.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  role: 'CS Senior · Stanford University'
};

export default function App() {
  // 1. Emails state with local storage fallback
  const [emails, setEmails] = useState<EmailItem[]>(() => {
    try {
      const saved = localStorage.getItem('mailmind_emails_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If previous cache lacked sent items from INITIAL_EMAILS, merge them
          const hasSent = parsed.some((e: EmailItem) => e.folder === 'sent');
          if (!hasSent) {
            const initialSent = INITIAL_EMAILS.filter(e => e.folder === 'sent');
            return [...parsed, ...initialSent];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMAILS;
  });

  // 2. Reminders state with local storage fallback
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('mailmind_reminders_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REMINDERS;
  });

  // 3. Drafts state with local storage fallback
  const [drafts, setDrafts] = useState<DraftEmail[]>(() => {
    try {
      const saved = localStorage.getItem('mailmind_drafts_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'draft-initial-1',
        to: 'david.vance@cs.stanford.edu',
        subject: 'Draft: CS Capstone Live Demo Staging Token Request',
        body: 'Dear Professor Vance,\n\nOur team is finalizing the demonstration dataset. Could you please provide 2 extra staging API tokens for our test runner?\n\nBest,\nAlex',
        lastSaved: 'Yesterday at 4:15 PM'
      }
    ];
  });

  // Persist state to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('mailmind_emails_v2', JSON.stringify(emails));
    } catch (e) {
      console.error(e);
    }
  }, [emails]);

  useEffect(() => {
    try {
      localStorage.setItem('mailmind_reminders_v2', JSON.stringify(reminders));
    } catch (e) {
      console.error(e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('mailmind_drafts_v2', JSON.stringify(drafts));
    } catch (e) {
      console.error(e);
    }
  }, [drafts]);

  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'unread' | 'important' | 'starred'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [editingDraft, setEditingDraft] = useState<DraftEmail | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [defaultReplyTone, setDefaultReplyTone] = useState<ReplyTone>(() => {
    try {
      const saved = localStorage.getItem('mailmind_reply_tone');
      if (saved) return saved as ReplyTone;
    } catch (e) {
      console.error(e);
    }
    return 'professional';
  });
  const [autoSummarize, setAutoSummarize] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mailmind_auto_summarize');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mailmind_reply_tone', defaultReplyTone);
    } catch (e) {
      console.error(e);
    }
  }, [defaultReplyTone]);

  useEffect(() => {
    try {
      localStorage.setItem('mailmind_auto_summarize', JSON.stringify(autoSummarize));
    } catch (e) {
      console.error(e);
    }
  }, [autoSummarize]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  // Sync with full-stack backend on initial mount
  useEffect(() => {
    fetchBackendStatus().then(status => {
      if (status) {
        setBackendStatus(status);
      }
    });

    getRemindersFromBackend().then(remoteReminders => {
      if (remoteReminders && remoteReminders.length > 0) {
        setReminders(remoteReminders);
      }
    });

    getDraftsFromBackend().then(remoteDrafts => {
      if (remoteDrafts && remoteDrafts.length > 0) {
        setDrafts(remoteDrafts);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Metrics calculations for dashboard statistics
  const unreadCount = useMemo(() => {
    return emails.filter(e => !e.read && e.folder === 'inbox').length;
  }, [emails]);

  const starredCount = useMemo(() => {
    return emails.filter(e => e.starred && e.folder !== 'trash').length;
  }, [emails]);

  const sentCount = useMemo(() => {
    return emails.filter(e => e.folder === 'sent').length;
  }, [emails]);

  const upcomingRemindersCount = useMemo(() => {
    return reminders.filter(r => r.status === 'upcoming').length;
  }, [reminders]);

  const summariesGeneratedCount = useMemo(() => {
    return emails.filter(e => e.summaryGenerated).length;
  }, [emails]);

  // Filtered emails based on search and current folder view
  const currentFolderEmails = useMemo(() => {
    let result = emails;

    if (['starred', 'saved'].includes(currentView)) {
      result = result.filter(e => e.starred && e.folder !== 'trash');
    } else if (['inbox', 'sent', 'archived', 'trash'].includes(currentView)) {
      result = result.filter(e => e.folder === currentView);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        e =>
          e.subject.toLowerCase().includes(q) ||
          e.sender.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.snippet.toLowerCase().includes(q)
      );
    }

    return result;
  }, [emails, currentView, searchQuery]);

  // Handlers for email interactions
  const handleSelectEmail = (email: EmailItem) => {
    setSelectedEmail(email);
    // Mark as read immediately upon opening
    if (!email.read) {
      setEmails(prev =>
        prev.map(e => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
  };

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev =>
      prev.map(item => (item.id === id ? { ...item, starred: !item.starred } : item))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
    showToast('Updated starred status');
  };

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev =>
      prev.map(item => (item.id === id ? { ...item, read: !item.read } : item))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(prev => prev ? { ...prev, read: !prev.read } : null);
    }
    showToast('Updated read status');
  };

  const handleArchiveEmail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev =>
      prev.map(item => (item.id === id ? { ...item, folder: 'archived' } : item))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    showToast('Email moved to Archived');
  };

  const handleDeleteEmail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev =>
      prev.map(item => (item.id === id ? { ...item, folder: 'trash' } : item))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    showToast('Email moved to Trash');
  };

  const handleRestoreFromTrash = (id: string) => {
    setEmails(prev =>
      prev.map(item => (item.id === id ? { ...item, folder: 'inbox' } : item))
    );
    showToast('Email restored to Inbox');
  };

  const handlePermanentDelete = (id: string) => {
    setEmails(prev => prev.filter(item => item.id !== id));
    showToast('Email permanently deleted');
  };

  const handleEmptyTrash = () => {
    setEmails(prev => prev.filter(item => item.folder !== 'trash'));
    showToast('Trash emptied');
  };

  // Bulk actions
  const handleBulkMarkRead = (ids: string[]) => {
    setEmails(prev =>
      prev.map(e => (ids.includes(e.id) ? { ...e, read: true } : e))
    );
    showToast(`Marked ${ids.length} emails as read`);
  };

  const handleBulkDelete = (ids: string[]) => {
    setEmails(prev =>
      prev.map(e => (ids.includes(e.id) ? { ...e, folder: 'trash' } : e))
    );
    showToast(`Moved ${ids.length} emails to Trash`);
  };

  // Deadline confirmation workflow (Section 5 requirement: Ask user to confirm detected deadline)
  const handleConfirmDeadlineAsReminder = (deadline: DetectedDeadline, email: EmailItem) => {
    // 1. Mark as confirmed in email state
    setEmails(prev =>
      prev.map(e => {
        if (e.id === email.id && e.detectedDeadlines) {
          return {
            ...e,
            detectedDeadlines: e.detectedDeadlines.map(d =>
              d.id === deadline.id ? { ...d, confirmed: true } : d
            )
          };
        }
        return e;
      })
    );

    if (selectedEmail && selectedEmail.id === email.id && selectedEmail.detectedDeadlines) {
      setSelectedEmail({
        ...selectedEmail,
        detectedDeadlines: selectedEmail.detectedDeadlines.map(d =>
          d.id === deadline.id ? { ...d, confirmed: true } : d
        )
      });
    }

    // 2. Add to reminders list
    const newReminder: ReminderItem = {
      id: `rem-confirmed-${Date.now()}`,
      title: deadline.title,
      relatedEmailId: email.id,
      relatedEmailSubject: email.subject,
      sender: email.sender,
      deadline: deadline.deadline,
      status: 'upcoming',
      urgency: email.priority,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setReminders(prev => [newReminder, ...prev]);
    saveReminderToBackend(newReminder).catch(err => console.warn('Backend save reminder:', err));
    showToast('Deadline confirmed & saved to database!');
  };

  const handleDismissDeadline = (deadlineId: string) => {
    setEmails(prev =>
      prev.map(e => {
        if (e.detectedDeadlines) {
          return {
            ...e,
            detectedDeadlines: e.detectedDeadlines.filter(d => d.id !== deadlineId)
          };
        }
        return e;
      })
    );
    if (selectedEmail && selectedEmail.detectedDeadlines) {
      setSelectedEmail({
        ...selectedEmail,
        detectedDeadlines: selectedEmail.detectedDeadlines.filter(d => d.id !== deadlineId)
      });
    }
    showToast('Detected deadline dismissed');
  };

  // AI Summary generation update
  const handleUpdateEmailSummary = (emailId: string, summary: AISummary) => {
    setEmails(prev =>
      prev.map(e => (e.id === emailId ? { ...e, summary, summaryGenerated: true } : e))
    );
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, summary, summaryGenerated: true } : null);
    }
  };

  // Demo send reply
  const handleDemoSendReply = (email: EmailItem, replyText: string) => {
    const newId = `sent-${Date.now()}`;
    const sentEmail: EmailItem = {
      id: newId,
      sender: 'Alex Chen (You)',
      senderEmail: CURRENT_USER.email,
      avatar: CURRENT_USER.avatar,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      receivedAt: 'Just now',
      snippet: replyText.slice(0, 100) + '...',
      body: replyText,
      priority: email.priority,
      read: true,
      starred: false,
      folder: 'sent',
      category: email.category,
      summaryGenerated: false
    };

    setEmails(prev => [sentEmail, ...prev]);
    setLastSubmittedId(newId);
    setSelectedEmail(null);
    setCurrentView('sent');
    showToast('Reply submitted! Logged to Sent Emails Dashboard.');
  };

  // Manual reminder handling
  const handleAddManualReminder = (reminderData: Omit<ReminderItem, 'id' | 'dateCreated'>) => {
    const newRem: ReminderItem = {
      ...reminderData,
      id: `rem-manual-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setReminders(prev => [newRem, ...prev]);
    saveReminderToBackend(newRem).catch(err => console.warn('Backend save reminder:', err));
    showToast('Reminder saved to persistent database!');
  };

  const handleToggleReminderComplete = (id: string) => {
    const existing = reminders.find(r => r.id === id);
    const updatedStatus = existing?.status === 'upcoming' ? 'completed' : 'upcoming';

    setReminders(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: updatedStatus }
          : r
      )
    );
    updateReminderInBackend(id, { status: updatedStatus }).catch(err => console.warn('Backend update reminder:', err));
    showToast(`Reminder marked as ${updatedStatus}`);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    deleteReminderFromBackend(id).catch(err => console.warn('Backend delete reminder:', err));
    showToast('Reminder deleted from database');
  };

  // Compose & Drafts Handling
  const handleSaveDraft = (draft: DraftEmail) => {
    setDrafts(prev => {
      const existing = prev.findIndex(d => d.id === draft.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = draft;
        return updated;
      }
      return [draft, ...prev];
    });
    saveDraftToBackend(draft).catch(err => console.warn('Backend save draft:', err));
  };

  const handleDeleteDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    deleteDraftFromBackend(draftId).catch(err => console.warn('Backend delete draft:', err));
    showToast('Draft deleted from database');
  };

  const handleDemoSendNewEmail = ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    const newId = `sent-${Date.now()}`;
    const newSentEmail: EmailItem = {
      id: newId,
      sender: 'Alex Chen (You)',
      senderEmail: CURRENT_USER.email,
      avatar: CURRENT_USER.avatar,
      subject,
      receivedAt: 'Just now',
      snippet: body.slice(0, 100) + '...',
      body,
      priority: 'Informational',
      read: true,
      starred: false,
      folder: 'sent',
      category: 'primary',
      summaryGenerated: false
    };

    setEmails(prev => [newSentEmail, ...prev]);
    setLastSubmittedId(newId);
    setSelectedEmail(null);
    setCurrentView('sent');
    showToast('Email submitted! Logged to Sent Emails Dashboard.');
  };

  return (
    <div className="flex h-screen bg-slate-50/70 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setSelectedEmail(null);
        }}
        unreadCount={unreadCount}
        starredCount={starredCount}
        sentCount={sentCount}
        draftsCount={drafts.length}
        upcomingRemindersCount={upcomingRemindersCount}
        onOpenCompose={() => {
          setEditingDraft(null);
          setIsComposeOpen(true);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        backendOnline={Boolean(backendStatus)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          upcomingReminders={reminders.filter(r => r.status === 'upcoming')}
          user={CURRENT_USER}
          onOpenReminders={() => {
            setCurrentView('reminders');
            setSelectedEmail(null);
          }}
          onSelectReminderEmail={(emailId) => {
            const found = emails.find(e => e.id === emailId);
            if (found) {
              handleSelectEmail(found);
            }
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Dashboard Statistics Widget (available on top of mail views) */}
            {!selectedEmail && ['inbox', 'starred', 'saved', 'sent', 'archived'].includes(currentView) && (
              <DashboardStats
                totalEmails={emails.filter(e => e.folder !== 'trash').length}
                unreadEmails={unreadCount}
                upcomingReminders={upcomingRemindersCount}
                summariesGenerated={summariesGeneratedCount}
                sentEmailsCount={sentCount}
                savedEmailsCount={starredCount}
                onFilterUnread={() => {
                  setCurrentView('inbox');
                  setCategoryFilter('unread');
                }}
                onOpenReminders={() => {
                  setCurrentView('reminders');
                  setSelectedEmail(null);
                }}
                onOpenSent={() => {
                  setCurrentView('sent');
                  setSelectedEmail(null);
                }}
                onOpenSaved={() => {
                  setCurrentView('saved');
                  setSelectedEmail(null);
                }}
              />
            )}

            {/* View 1: Reading Selected Email */}
            {selectedEmail ? (
              <EmailViewer
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onToggleStar={handleToggleStar}
                onArchive={handleArchiveEmail}
                onDelete={handleDeleteEmail}
                onToggleRead={handleToggleRead}
                onConfirmDeadlineAsReminder={handleConfirmDeadlineAsReminder}
                onDismissDeadline={handleDismissDeadline}
                onUpdateEmailSummary={handleUpdateEmailSummary}
                onDemoSendReply={handleDemoSendReply}
                showToast={showToast}
              />
            ) : (
              <>
                {/* View 2: Sent Emails Dedicated Dashboard */}
                {currentView === 'sent' && (
                  <SentEmailsDashboard
                    emails={emails}
                    onSelectEmail={handleSelectEmail}
                    onOpenCompose={() => {
                      setEditingDraft(null);
                      setIsComposeOpen(true);
                    }}
                    onDeleteEmail={handleDeleteEmail}
                    lastSubmittedId={lastSubmittedId}
                    showToast={showToast}
                  />
                )}

                {/* View 3: Saved & Starred Emails Dedicated Dashboard */}
                {['saved', 'starred'].includes(currentView) && (
                  <SavedEmailsDashboard
                    emails={emails}
                    onSelectEmail={handleSelectEmail}
                    onToggleStar={handleToggleStar}
                    onArchiveEmail={handleArchiveEmail}
                    onDeleteEmail={handleDeleteEmail}
                    showToast={showToast}
                  />
                )}

                {/* View 4: Inbox & Archived Mailbox List */}
                {['inbox', 'archived'].includes(currentView) && (
                  <InboxListView
                    emails={currentFolderEmails}
                    selectedFolder={currentView as FolderType}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    onSelectEmail={handleSelectEmail}
                    onToggleStar={handleToggleStar}
                    onArchiveEmail={handleArchiveEmail}
                    onDeleteEmail={handleDeleteEmail}
                    onToggleRead={handleToggleRead}
                    onBulkMarkRead={handleBulkMarkRead}
                    onBulkDelete={handleBulkDelete}
                  />
                )}

                {/* View 3: Drafts Folder */}
                {currentView === 'drafts' && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <h3 className="font-bold text-sm text-slate-900">Saved Drafts</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{drafts.length} Drafts</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {drafts.length === 0 ? (
                        <div className="py-16 text-center">
                          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">No saved drafts</p>
                          <p className="text-xs text-slate-400 mt-0.5">Click Compose to write and save drafts locally.</p>
                        </div>
                      ) : (
                        drafts.map((draft) => (
                          <div
                            key={draft.id}
                            className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-4"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                  Draft
                                </span>
                                <span className="text-xs font-semibold text-slate-800">
                                  To: {draft.to || 'No recipient'}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                                {draft.subject || '(No Subject)'}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {draft.body || '(Empty body)'}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                Last saved: {draft.lastSaved}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingDraft(draft);
                                  setIsComposeOpen(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition cursor-pointer"
                              >
                                <PenSquare className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteDraft(draft.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete draft"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* View 4: Trash Folder */}
                {currentView === 'trash' && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <h3 className="font-bold text-sm text-slate-900">Trash Mailbox</h3>
                      </div>
                      {currentFolderEmails.length > 0 && (
                        <button
                          onClick={handleEmptyTrash}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          Empty Trash
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100">
                      {currentFolderEmails.length === 0 ? (
                        <div className="py-16 text-center text-xs text-slate-400">
                          Trash is currently empty.
                        </div>
                      ) : (
                        currentFolderEmails.map((email) => (
                          <div
                            key={email.id}
                            className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-4"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{email.sender}</span>
                                <span className="text-[11px] text-slate-400">&lt;{email.senderEmail}&gt;</span>
                              </div>
                              <h4 className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                                {email.subject}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{email.snippet}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleRestoreFromTrash(email.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                                title="Restore to inbox"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>

                              <button
                                onClick={() => handlePermanentDelete(email.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* View 5: Smart Reminders Page */}
                {currentView === 'reminders' && (
                  <RemindersView
                    reminders={reminders}
                    emails={emails}
                    onToggleComplete={handleToggleReminderComplete}
                    onDeleteReminder={handleDeleteReminder}
                    onAddManualReminder={handleAddManualReminder}
                    onConfirmDetectedDeadline={handleConfirmDeadlineAsReminder}
                    onDismissDetectedDeadline={handleDismissDeadline}
                    onSelectEmail={(emailId) => {
                      const found = emails.find(e => e.id === emailId);
                      if (found) handleSelectEmail(found);
                    }}
                    showToast={showToast}
                  />
                )}

                {/* View 6: AI Assistant Chat Page */}
                {currentView === 'assistant' && (
                  <AIAssistantView
                    emails={emails}
                    reminders={reminders}
                    onOpenEmail={(emailId) => {
                      const found = emails.find(e => e.id === emailId);
                      if (found) handleSelectEmail(found);
                    }}
                    onOpenReminders={() => {
                      setCurrentView('reminders');
                      setSelectedEmail(null);
                    }}
                    onFilterUnread={() => {
                      setCurrentView('inbox');
                      setCategoryFilter('unread');
                      setSelectedEmail(null);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Compose Email Modal Window */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false);
          setEditingDraft(null);
        }}
        onSaveDraft={handleSaveDraft}
        onDemoSend={handleDemoSendNewEmail}
        initialDraft={editingDraft}
        showToast={showToast}
      />

      {/* Settings & Saved Options Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        replyTone={defaultReplyTone}
        onChangeReplyTone={setDefaultReplyTone}
        autoSummarize={autoSummarize}
        onToggleAutoSummarize={() => setAutoSummarize(!autoSummarize)}
        remindersCount={upcomingRemindersCount}
        completedRemindersCount={reminders.filter(r => r.status === 'completed').length}
        draftsCount={drafts.length}
        onNavigateToReminders={() => {
          setCurrentView('reminders');
          setSelectedEmail(null);
        }}
        onNavigateToDrafts={() => {
          setCurrentView('drafts');
          setSelectedEmail(null);
        }}
        showToast={showToast}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
