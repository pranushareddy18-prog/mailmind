import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Bookmark, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  FileText, 
  ChevronRight, 
  Trash2, 
  Archive, 
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Tag
} from 'lucide-react';
import { EmailItem } from '../types';

interface SavedEmailsDashboardProps {
  emails: EmailItem[];
  onSelectEmail: (email: EmailItem) => void;
  onToggleStar: (id: string, e?: React.MouseEvent) => void;
  onArchiveEmail: (id: string, e?: React.MouseEvent) => void;
  onDeleteEmail: (id: string, e?: React.MouseEvent) => void;
  showToast: (msg: string) => void;
}

export const SavedEmailsDashboard: React.FC<SavedEmailsDashboardProps> = ({
  emails,
  onSelectEmail,
  onToggleStar,
  onArchiveEmail,
  onDeleteEmail,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'university' | 'career' | 'personal'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Urgent' | 'Important'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter all saved / starred emails across mailboxes
  const savedEmails = emails.filter(e => e.starred && e.folder !== 'trash');

  const filteredSavedEmails = savedEmails.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && e.priority !== priorityFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.subject.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q) ||
        (e.summary?.mainIdea && e.summary.mainIdea.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const urgentCount = savedEmails.filter(e => e.priority === 'Urgent').length;
  const withDeadlinesCount = savedEmails.filter(e => e.detectedDeadlines && e.detectedDeadlines.length > 0).length;
  const withSummariesCount = savedEmails.filter(e => e.summaryGenerated).length;

  const handleCopySummary = (email: EmailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (email.summary) {
      const text = `AI SUMMARY: ${email.summary.headline || email.summary.mainIdea}\n\nKey Points:\n${email.summary.importantPoints.map(p => `• ${p}`).join('\n')}`;
      navigator.clipboard.writeText(text);
      setCopiedId(email.id);
      showToast('Saved email summary copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      navigator.clipboard.writeText(`${email.subject}\n\n${email.snippet}`);
      setCopiedId(email.id);
      showToast('Email preview copied!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header & Summary Stats Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-amber-100 text-xs font-semibold mb-2.5 border border-white/20">
              <Bookmark className="w-3.5 h-3.5 text-amber-200" />
              <span>Dedicated Saved Mails Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Saved & Starred Emails
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl mt-1 leading-relaxed">
              Quick access to bookmarked messages, critical project guidelines, deadlines, and AI-synthesized reference documents.
            </p>
          </div>
        </div>

        {/* 4 Metric Cards inside Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-amber-200 font-medium block">Total Saved</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {savedEmails.length}
            </span>
            <span className="text-[10px] text-amber-200/80 mt-0.5 block">Bookmarked mails</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-amber-200 font-medium block">Urgent Priority</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {urgentCount}
            </span>
            <span className="text-[10px] text-amber-200/80 mt-0.5 block">Immediate attention</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-amber-200 font-medium block">With Deadlines</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {withDeadlinesCount}
            </span>
            <span className="text-[10px] text-amber-200/80 mt-0.5 block">Tracked reminders</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-amber-200 font-medium block">AI Summarized</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block leading-tight">
              {withSummariesCount}
            </span>
            <span className="text-[10px] text-amber-200/80 mt-0.5 block">Key points extracted</span>
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
            placeholder="Search saved emails by subject, sender, key points..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        {/* Category & Priority Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: `All (${savedEmails.length})` },
            { id: 'university', label: 'University' },
            { id: 'career', label: 'Career' },
            { id: 'personal', label: 'Personal' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setCategoryFilter(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
                categoryFilter === pill.id
                  ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Saved Emails Cards List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Saved Reference Collection ({filteredSavedEmails.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">Click star anytime to un-save</span>
        </div>

        {filteredSavedEmails.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Saved Emails</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {search.trim()
                ? 'No saved emails match your search query.'
                : 'Click the star icon or "Save Email" button on any email in your inbox to pin it to this dashboard for quick access.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSavedEmails.map((email) => {
              const priorityStyles = {
                Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
                Important: 'bg-amber-50 text-amber-700 border-amber-200',
                Informational: 'bg-slate-100 text-slate-600 border-slate-200'
              }[email.priority];

              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Star / Unsave button */}
                    <button
                      onClick={(e) => onToggleStar(email.id, e)}
                      title="Click to un-save"
                      className="mt-1 p-1 text-amber-400 hover:text-amber-600 transition cursor-pointer shrink-0"
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </button>

                    <img
                      src={email.avatar}
                      alt={email.sender}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 hidden sm:block"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {email.sender}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          &lt;{email.senderEmail}&gt;
                        </span>
                        <span className="text-[11px] text-slate-400">
                          · {email.receivedAt}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded border uppercase ${priorityStyles}`}>
                          {email.priority}
                        </span>

                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded capitalize">
                          {email.category}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-amber-700 transition">
                        {email.subject}
                      </h4>

                      {/* AI Summary Highlight if available */}
                      {email.summary ? (
                        <div className="mt-1.5 p-2 rounded-xl bg-amber-50/50 border border-amber-100/80 text-xs text-amber-950 font-medium leading-relaxed">
                          <span className="font-bold text-amber-800 mr-1.5 inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Summary:
                          </span>
                          {email.summary.headline || email.summary.mainIdea}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {email.snippet}
                        </p>
                      )}

                      {/* Deadlines Tag if detected */}
                      {email.detectedDeadlines && email.detectedDeadlines.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          {email.detectedDeadlines.map((dl) => (
                            <span
                              key={dl.id}
                              className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                            >
                              <Clock className="w-2.5 h-2.5 text-rose-500" />
                              <span>{dl.deadline}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions on right */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => handleCopySummary(email, e)}
                      title="Copy Summary / Preview"
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
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition cursor-pointer"
                    >
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => onDeleteEmail(email.id, e)}
                      title="Delete saved email"
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
