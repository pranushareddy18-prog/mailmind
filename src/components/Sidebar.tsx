import React from 'react';
import { 
  Inbox, 
  Star, 
  Bookmark,
  Send, 
  FileText, 
  Archive, 
  Trash2, 
  Bot, 
  CalendarClock, 
  PenSquare, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { FolderType } from '../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  unreadCount: number;
  starredCount: number;
  sentCount?: number;
  draftsCount: number;
  upcomingRemindersCount: number;
  onOpenCompose: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  backendOnline?: boolean;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  unreadCount,
  starredCount,
  sentCount = 0,
  draftsCount,
  upcomingRemindersCount,
  onOpenCompose,
  isMobileOpen,
  onCloseMobile,
  backendOnline = true,
  onOpenSettings
}) => {
  const mailFolders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount, badgeColor: 'bg-sky-500 text-white' },
    { id: 'saved', label: 'Saved Mails', icon: Bookmark, count: starredCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'sent', label: 'Sent Emails', icon: Send, count: sentCount > 0 ? sentCount : null, badgeColor: 'bg-sky-100 text-sky-800' },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: draftsCount > 0 ? draftsCount : null, badgeColor: 'bg-slate-200 text-slate-700' },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const aiTools = [
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Smart', badgeColor: 'bg-sky-100 text-sky-700 font-semibold' },
    { id: 'reminders', label: 'Smart Reminders', icon: CalendarClock, count: upcomingRemindersCount, badgeColor: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-40
        w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between
        transition-transform duration-200 ease-in-out select-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Brand Header */}
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 tracking-tight text-base leading-none">
                  MailMind <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Smart Email Assistant</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Compose Button */}
          <div className="p-4 pb-2">
            <button
              onClick={() => {
                onOpenCompose();
                onCloseMobile();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer group"
            >
              <PenSquare className="w-4 h-4 transition-transform group-hover:rotate-6" />
              <span>Compose Email</span>
            </button>
          </div>

          {/* Navigation Folder List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
            {/* Core Folders */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mailboxes
              </div>
              <div className="space-y-0.5 mt-1">
                {mailFolders.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Productivity Section */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>AI Productivity</span>
                <Sparkles className="w-3 h-3 text-sky-500" />
              </div>
              <div className="space-y-0.5 mt-1">
                {aiTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = currentView === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectView(tool.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{tool.label}</span>
                      </div>
                      {tool.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      )}
                      {typeof tool.count === 'number' && tool.count > 0 && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                          {tool.count}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    onOpenSettings?.();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>Saved Options</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                    Prefs
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  Backend: {backendOnline ? 'Gemini 3.8 Flash' : 'Offline'}
                </span>
                <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded">API v2</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Secure server-side AI processing with persistent database storage.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
