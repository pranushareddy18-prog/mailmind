import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  Bell, 
  FileText, 
  ShieldCheck, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { ReplyTone } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  replyTone: ReplyTone;
  onChangeReplyTone: (tone: ReplyTone) => void;
  autoSummarize: boolean;
  onToggleAutoSummarize: () => void;
  remindersCount: number;
  completedRemindersCount: number;
  draftsCount: number;
  onNavigateToReminders: () => void;
  onNavigateToDrafts: () => void;
  showToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  replyTone,
  onChangeReplyTone,
  autoSummarize,
  onToggleAutoSummarize,
  remindersCount,
  completedRemindersCount,
  draftsCount,
  onNavigateToReminders,
  onNavigateToDrafts,
  showToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Saved Options & Preferences</h3>
              <p className="text-[11px] text-slate-500">Manage your AI configurations and persistent storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Saved AI Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI Writing & Summarization Options</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3 text-xs">
            {/* Tone selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Default AI Reply Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['professional', 'friendly', 'formal'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onChangeReplyTone(t);
                      showToast(`Saved default reply tone: ${t}`);
                    }}
                    className={`py-2 px-3 rounded-lg capitalize font-semibold transition cursor-pointer text-center ${
                      replyTone === t
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Pre-selected tone when you click "Generate AI Reply" in the email viewer.
              </p>
            </div>

            {/* Auto-summarize toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-expand AI Summaries</span>
                <span className="text-[10px] text-slate-500">Automatically display summary card when available</span>
              </div>
              <button
                onClick={() => {
                  onToggleAutoSummarize();
                  showToast(autoSummarize ? 'Auto-summarize disabled' : 'Auto-summarize enabled');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  autoSummarize ? 'bg-sky-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Saved Reminders & Deadlines Status */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-indigo-500" />
            <span>Saved Reminders & Tasks</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{remindersCount} Upcoming</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">{completedRemindersCount} Completed</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Saved in server database and synchronized locally
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigateToReminders();
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition cursor-pointer text-xs"
            >
              Open Reminders →
            </button>
          </div>
        </div>

        {/* Section 3: Saved Drafts Status */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Saved Drafts</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">{draftsCount} Saved Draft{draftsCount !== 1 ? 's' : ''}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Stored persistently in database
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigateToDrafts();
              }}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-lg border border-sky-200 transition cursor-pointer text-xs"
            >
              View Drafts →
            </button>
          </div>
        </div>

        {/* Section 4: System & Database Engine Info */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>AI Model Engine:</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Bot className="w-3 h-3 text-sky-600" /> Google Gemini 3.8 Flash (Active)
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Database Storage:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-500" /> Persistent Server-Backed Store
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Local Cache Sync:</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active across page reloads
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
