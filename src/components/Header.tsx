import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  User as UserIcon,
  X,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { ReminderItem, User } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleMobileSidebar: () => void;
  upcomingReminders: ReminderItem[];
  user: User;
  onOpenReminders: () => void;
  onSelectReminderEmail?: (emailId: string) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onToggleMobileSidebar,
  upcomingReminders,
  user,
  onOpenReminders,
  onSelectReminderEmail,
  onOpenSettings
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search emails by sender, subject, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition cursor-pointer relative ${
              showNotifications 
                ? 'bg-sky-50 border-sky-300 text-sky-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Notifications & Upcoming Deadlines"
          >
            <Bell className="w-4 h-4" />
            {upcomingReminders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <h4 className="font-bold text-xs text-slate-900">Upcoming Deadlines & Alerts</h4>
                </div>
                <span className="text-[10px] font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                  {upcomingReminders.length} Active
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-2">
                {upcomingReminders.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No pending deadlines or notifications.
                  </div>
                ) : (
                  upcomingReminders.map((rem) => (
                    <div 
                      key={rem.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (rem.relatedEmailId && onSelectReminderEmail) {
                          onSelectReminderEmail(rem.relatedEmailId);
                        } else {
                          onOpenReminders();
                        }
                      }}
                      className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {rem.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                          {rem.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="text-sky-600 font-medium">{rem.deadline}</span>
                        <span>•</span>
                        <span className="truncate">{rem.sender}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenReminders();
                  }}
                  className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                >
                  View all reminders →
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-300"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">{user.role}</p>
            </div>
          </button>

          {/* Profile Modal Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-400"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{user.name}</h4>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="py-3 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Account Type:</span>
                  <span className="font-medium text-slate-700">Student Demonstration</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">AI Privacy Mode:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active (Local Storage)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Model Engine:</span>
                  <span className="font-medium text-slate-700">MailMind Synthesizer v2</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      onOpenSettings();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
                      Saved Options & Preferences
                    </span>
                    <span className="text-[10px] bg-sky-200/60 text-sky-800 px-1.5 py-0.5 rounded font-bold">
                      Open
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full py-1 text-center text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
