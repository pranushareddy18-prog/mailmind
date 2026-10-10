import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Check, 
  X,
  Mail,
  Filter,
  Sparkles
} from 'lucide-react';
import { ReminderItem, PriorityLevel, EmailItem, DetectedDeadline } from '../types';

interface RemindersViewProps {
  reminders: ReminderItem[];
  emails: EmailItem[];
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddManualReminder: (reminder: Omit<ReminderItem, 'id' | 'dateCreated'>) => void;
  onConfirmDetectedDeadline: (deadline: DetectedDeadline, email: EmailItem) => void;
  onDismissDetectedDeadline: (deadlineId: string) => void;
  onSelectEmail?: (emailId: string) => void;
  showToast: (msg: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  emails,
  onToggleComplete,
  onDeleteReminder,
  onAddManualReminder,
  onConfirmDetectedDeadline,
  onDismissDetectedDeadline,
  onSelectEmail,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for manual reminder
  const [title, setTitle] = useState('');
  const [relatedEmailSubject, setRelatedEmailSubject] = useState('');
  const [sender, setSender] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState<PriorityLevel>('Important');

  // Collect any unconfirmed detected deadlines from emails
  const pendingDetectedDeadlines: { deadline: DetectedDeadline; email: EmailItem }[] = [];
  emails.forEach(email => {
    if (email.detectedDeadlines) {
      email.detectedDeadlines.forEach(det => {
        if (!det.confirmed) {
          pendingDetectedDeadlines.push({ deadline: det, email });
        }
      });
    }
  });

  const handleCreateReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline.trim()) {
      showToast('Please enter both a task title and a deadline');
      return;
    }

    onAddManualReminder({
      title: title.trim(),
      relatedEmailSubject: relatedEmailSubject.trim() || 'Manual entry',
      sender: sender.trim() || 'Self',
      deadline: deadline.trim(),
      status: 'upcoming',
      urgency
    });

    setTitle('');
    setRelatedEmailSubject('');
    setSender('');
    setDeadline('');
    setUrgency('Important');
    setIsAddModalOpen(false);
    showToast('Reminder added successfully!');
  };

  const upcomingReminders = reminders.filter(r => r.status === 'upcoming');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Smart Reminders & Deadlines</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically extracted from course announcements, interview requests, and task emails.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-sky-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder Manually</span>
        </button>
      </div>

      {/* Pending Detected Deadlines Awaiting Confirmation Box */}
      {pendingDetectedDeadlines.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-xs sm:text-sm text-amber-950">
                Detected Deadlines Awaiting Confirmation ({pendingDetectedDeadlines.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              Confirm before saving as a reminder
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingDetectedDeadlines.map(({ deadline: det, email }) => (
              <div 
                key={det.id}
                className="bg-white rounded-xl border border-amber-200 p-3.5 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{det.title}</h4>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-semibold mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {det.deadline}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    From: {email.sender} ({email.subject})
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onConfirmDetectedDeadline(det, email)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Save</span>
                  </button>

                  <button
                    onClick={() => onDismissDetectedDeadline(det.id)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: Upcoming vs Completed */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Upcoming ({upcomingReminders.length})
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Completed ({completedReminders.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Saved locally in browser storage
          </span>
        </div>

        {/* Reminders List */}
        <div className="divide-y divide-slate-100">
          {activeTab === 'upcoming' && upcomingReminders.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">All caught up!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                You have no pending deadlines. You can add one manually or confirm detected deadlines from your emails.
              </p>
            </div>
          )}

          {activeTab === 'completed' && completedReminders.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-400">
              No completed reminders yet. Check off an upcoming task to see it here.
            </div>
          )}

          {(activeTab === 'upcoming' ? upcomingReminders : completedReminders).map((rem) => {
            const isCompleted = rem.status === 'completed';

            const urgencyColors = {
              Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
              Important: 'bg-amber-50 text-amber-700 border-amber-200',
              Informational: 'bg-slate-100 text-slate-600 border-slate-200'
            }[rem.urgency];

            return (
              <div
                key={rem.id}
                className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition ${
                  isCompleted ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Checkbox & Task details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleComplete(rem.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-sky-500 bg-white'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs sm:text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {rem.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgencyColors}`}>
                        {rem.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-rose-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {rem.deadline}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 flex items-center gap-1 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {rem.relatedEmailSubject}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">By {rem.sender}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {rem.relatedEmailId && onSelectEmail && (
                    <button
                      onClick={() => onSelectEmail(rem.relatedEmailId!)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-sky-50 transition hidden sm:inline cursor-pointer"
                    >
                      View Email
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Reminder Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Add Reminder Manually</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Submit CS Capstone Architecture PDF"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deadline Date & Time *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuesday, Oct 13 · 5:00 PM EST"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Related Email / Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS Capstone Committee"
                    value={relatedEmailSubject}
                    onChange={(e) => setRelatedEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sender / Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. David Vance"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
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
                      onClick={() => setUrgency(lvl)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                        urgency === lvl
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
