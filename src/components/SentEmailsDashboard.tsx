import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Trash2, 
  Archive, 
  PenSquare, 
  ArrowUpRight, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Mail,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { EmailItem } from '../types';

interface SentEmailsDashboardProps {
  emails: EmailItem[];
  onSelectEmail: (email: EmailItem) => void;
  onOpenCompose: () => void;
  onDeleteEmail: (id: string, e: React.MouseEvent) => void;
  lastSubmittedId?: string | null;
  showToast: (msg: string) => void;
}

export const SentEmailsDashboard: React.FC<SentEmailsDashboardProps> = ({
  emails,
  onSelectEmail,
  onOpenCompose,
  onDeleteEmail,
  lastSubmittedId,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'replies' | 'direct' | 'important'>('all');
  const [selectedSentEmail, setSelectedSentEmail] = useState<EmailItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter sent emails
  const sentEmails = emails.filter(e => e.folder === 'sent');

  const filteredSentEmails = sentEmails.filter(e => {
    // Type filter
    if (filterType === 'replies' && !e.subject.toLowerCase().startsWith('re:')) return false;
    if (filterType === 'direct' && e.subject.toLowerCase().startsWith('re:')) return false;
    if (filterType === 'important' && e.priority !== 'Urgent' && e.priority !== 'Important') return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.subject.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q) ||
        e.senderEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyBody = (email: EmailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopiedId(email.id);
    showToast('Sent email copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const repliesCount = sentEmails.filter(e => e.subject.toLowerCase().startsWith('re:')).length;
  const directCount = sentEmails.length - repliesCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header & Summary Stats Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-sky-100 text-xs font-semibold mb-2.5 border border-white/20">
              <Send className="w-3.5 h-3.5 text-sky-200" />
              <span>Dedicated Sent Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sent Emails & Submissions
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 max-w-xl mt-1 leading-relaxed">
              Track all your dispatched replies, outbound correspondence, and AI-assisted drafts submitted from MailMind.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCompose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-800 text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <PenSquare className="w-4 h-4 text-sky-600" />
              <span>Compose New Email</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards inside Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-sky-200 font-medium block">Total Sent</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {sentEmails.length}
            </span>
            <span className="text-[10px] text-sky-200/80 mt-0.5 block">Logged in mailbox</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-sky-200 font-medium block">AI Replies Sent</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {repliesCount}
            </span>
            <span className="text-[10px] text-sky-200/80 mt-0.5 block">Synthesized responses</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-sky-200 font-medium block">Direct Composed</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {directCount}
            </span>
            <span className="text-[10px] text-sky-200/80 mt-0.5 block">Original messages</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-sky-200 font-medium block">Delivery Status</span>
            <span className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-1.5 leading-tight">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>100% Logged</span>
            </span>
            <span className="text-[10px] text-emerald-200/90 mt-0.5 block">Verified by Workspace</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sent emails by subject, recipient, body..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: `All (${sentEmails.length})` },
            { id: 'replies', label: `Replies (${repliesCount})` },
            { id: 'direct', label: `Direct (${directCount})` },
            { id: 'important', label: 'Important' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
                filterType === pill.id
                  ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sent Email List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-600" />
            <span>Dispatched Mailbox Log ({filteredSentEmails.length})</span>
          </div>
          <span>Updated after every submission</span>
        </div>

        {filteredSentEmails.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Sent Emails Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {search.trim() 
                ? 'No sent messages match your search filter.' 
                : 'When you compose an email or send an AI reply, it will automatically appear here on this dashboard.'}
            </p>
            <button
              onClick={onOpenCompose}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition shadow-sm cursor-pointer"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Compose Your First Email</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSentEmails.map((email) => {
              const isJustSubmitted = lastSubmittedId === email.id;
              const isReply = email.subject.toLowerCase().startsWith('re:');

              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`p-4 sm:p-5 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 cursor-pointer group ${
                    isJustSubmitted
                      ? 'bg-sky-50/70 border-l-4 border-sky-500 animate-in fade-in duration-300'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Sent icon badge */}
                    <div className="w-9 h-9 rounded-xl bg-sky-100/80 text-sky-700 border border-sky-200/60 flex items-center justify-center shrink-0 mt-0.5">
                      <Send className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status / Category tag */}
                        {isJustSubmitted && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Just Sent!</span>
                          </span>
                        )}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isReply ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-sky-50 text-sky-700 border border-sky-100'
                        }`}>
                          {isReply ? 'AI Reply' : 'Direct Message'}
                        </span>

                        <span className="text-xs font-bold text-slate-800 truncate">
                          {email.sender}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {email.receivedAt}
                        </span>

                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Delivered</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-sky-700 transition">
                        {email.subject}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-sans">
                        {email.snippet || email.body.slice(0, 140)}
                      </p>
                    </div>
                  </div>

                  {/* Actions on right */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => handleCopyBody(email, e)}
                      title="Copy Sent Body"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {copiedId === email.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmail(email);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => onDeleteEmail(email.id, e)}
                      title="Delete from sent mailbox"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
