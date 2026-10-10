import React, { useState } from 'react';
import { 
  Star, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Filter,
  Inbox as InboxIcon
} from 'lucide-react';
import { EmailItem, PriorityLevel, FolderType } from '../types';

interface InboxListViewProps {
  emails: EmailItem[];
  selectedFolder: FolderType;
  categoryFilter: 'all' | 'unread' | 'important' | 'starred';
  setCategoryFilter: (filter: 'all' | 'unread' | 'important' | 'starred') => void;
  onSelectEmail: (email: EmailItem) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onArchiveEmail: (id: string, e: React.MouseEvent) => void;
  onDeleteEmail: (id: string, e: React.MouseEvent) => void;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onBulkMarkRead?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export const InboxListView: React.FC<InboxListViewProps> = ({
  emails,
  selectedFolder,
  categoryFilter,
  setCategoryFilter,
  onSelectEmail,
  onToggleStar,
  onArchiveEmail,
  onDeleteEmail,
  onToggleRead,
  onBulkMarkRead,
  onBulkDelete
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter based on selected category pill
  const filteredEmails = emails.filter(email => {
    if (categoryFilter === 'unread') return !email.read;
    if (categoryFilter === 'important') return email.priority === 'Urgent' || email.priority === 'Important';
    if (categoryFilter === 'starred') return email.starred;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredEmails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map(e => e.id));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const folderTitleMap: Record<FolderType, string> = {
    inbox: 'Inbox',
    starred: 'Starred Emails',
    sent: 'Sent Messages',
    drafts: 'Drafts',
    archived: 'Archived Emails',
    trash: 'Trash'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Category Pills & Bulk Action Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Filter Pills (Only show on Inbox or general mail view) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'unread', 'important', 'starred'] as const).map((filter) => {
            const isActive = categoryFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setCategoryFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
            title={selectedIds.length === filteredEmails.length && filteredEmails.length > 0 ? 'Deselect all' : 'Select all'}
          >
            {selectedIds.length > 0 && selectedIds.length === filteredEmails.length ? (
              <CheckSquare className="w-4 h-4 text-sky-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden md:inline">Select All</span>
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-xl text-sky-800 animate-in fade-in duration-150">
              <span className="font-bold text-[11px]">{selectedIds.length} selected</span>
              <div className="h-3 w-px bg-sky-200 mx-1"></div>
              {onBulkMarkRead && (
                <button
                  onClick={() => {
                    onBulkMarkRead(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="px-2 py-0.5 hover:bg-sky-200/60 rounded text-[11px] font-semibold cursor-pointer"
                >
                  Mark as Read
                </button>
              )}
              {onBulkDelete && (
                <button
                  onClick={() => {
                    onBulkDelete(selectedIds);
                    setSelectedIds([]);
                  }}
                  className="px-2 py-0.5 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-semibold cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          <span className="text-[11px] text-slate-400 font-medium ml-auto sm:ml-0">
            {filteredEmails.length} {filteredEmails.length === 1 ? 'email' : 'emails'}
          </span>
        </div>
      </div>

      {/* Email List Rows */}
      <div className="divide-y divide-slate-100">
        {filteredEmails.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <InboxIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No emails in {categoryFilter !== 'all' ? categoryFilter : selectedFolder}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Your inbox is organized and clean. Check other categories or folders in the sidebar.
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isChecked = selectedIds.includes(email.id);

            const priorityBadgeClasses = {
              Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
              Important: 'bg-amber-50 text-amber-700 border-amber-200',
              Informational: 'bg-slate-100 text-slate-600 border-slate-200'
            }[email.priority];

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`group p-3.5 sm:p-4 transition cursor-pointer flex items-start sm:items-center gap-3 sm:gap-3.5 relative ${
                  !email.read ? 'bg-sky-50/35 hover:bg-sky-50/70 font-medium' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Checkbox & Star */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-0">
                  <button
                    onClick={(e) => handleToggleSelectOne(email.id, e)}
                    className="text-slate-300 hover:text-slate-600 transition cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => onToggleStar(email.id, e)}
                    className={`transition cursor-pointer ${
                      email.starred
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 hover:text-amber-400'
                    }`}
                    title={email.starred ? 'Starred' : 'Not starred'}
                  >
                    <Star className={`w-4 h-4 ${email.starred ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Sender Avatar */}
                <img
                  src={email.avatar}
                  alt={email.sender}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 hidden sm:block"
                />

                {/* Email Core Content (Sender, Subject, Snippet) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Unread blue dot indicator */}
                      {!email.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" title="Unread email"></span>
                      )}
                      <span className={`text-xs truncate ${!email.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                        {email.sender}
                      </span>
                    </div>

                    {/* Date / Time */}
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {email.receivedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <h4 className={`text-xs truncate ${!email.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                      {email.subject}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                    {email.snippet}
                  </p>

                  {/* Metadata Tags / AI Chips */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
                    {/* Priority badge */}
                    <span className={`font-semibold px-2 py-0.5 rounded-full border ${priorityBadgeClasses}`}>
                      {email.priority}
                    </span>

                    {/* AI Summarized indicator */}
                    {email.summaryGenerated && (
                      <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        AI Summarized
                      </span>
                    )}

                    {/* Detected Deadlines Indicator */}
                    {email.detectedDeadlines && email.detectedDeadlines.length > 0 && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-rose-500" />
                        {email.detectedDeadlines[0].deadline}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Action Buttons */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="hidden group-hover:flex items-center gap-1 text-slate-400 shrink-0 pl-2 bg-white/90 sm:bg-transparent rounded-lg py-1"
                >
                  <button
                    onClick={(e) => onToggleRead(email.id, e)}
                    className="p-1.5 rounded-lg hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                    title={email.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {email.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={(e) => onArchiveEmail(email.id, e)}
                    className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => onDeleteEmail(email.id, e)}
                    className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 self-center shrink-0 hidden sm:block group-hover:hidden" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
