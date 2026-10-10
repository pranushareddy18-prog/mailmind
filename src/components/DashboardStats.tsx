import React from 'react';
import { 
  Mail, 
  MailCheck, 
  CalendarClock, 
  Sparkles, 
  Send, 
  Bookmark, 
  Star 
} from 'lucide-react';

interface DashboardStatsProps {
  totalEmails: number;
  unreadEmails: number;
  upcomingReminders: number;
  summariesGenerated: number;
  sentEmailsCount?: number;
  savedEmailsCount?: number;
  onFilterUnread?: () => void;
  onOpenReminders?: () => void;
  onOpenSent?: () => void;
  onOpenSaved?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalEmails,
  unreadEmails,
  upcomingReminders,
  summariesGenerated,
  sentEmailsCount = 0,
  savedEmailsCount = 0,
  onFilterUnread,
  onOpenReminders,
  onOpenSent,
  onOpenSaved
}) => {
  const stats = [
    {
      label: 'Inbox Emails',
      value: totalEmails,
      icon: Mail,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      description: 'Active messages'
    },
    {
      label: 'Unread',
      value: unreadEmails,
      icon: MailCheck,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      description: unreadEmails > 0 ? 'Requires review' : 'Inbox zero',
      onClick: onFilterUnread,
      clickable: true
    },
    {
      label: 'Sent Emails',
      value: sentEmailsCount,
      icon: Send,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      description: 'Dispatched log',
      onClick: onOpenSent,
      clickable: true
    },
    {
      label: 'Saved Mails',
      value: savedEmailsCount,
      icon: Bookmark,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Bookmarked mails',
      onClick: onOpenSaved,
      clickable: true
    },
    {
      label: 'Reminders',
      value: upcomingReminders,
      icon: CalendarClock,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      description: 'Tracked deadlines',
      onClick: onOpenReminders,
      clickable: true
    },
    {
      label: 'AI Summaries',
      value: summariesGenerated,
      icon: Sparkles,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      description: 'Saved reading time'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            onClick={stat.clickable && stat.onClick ? stat.onClick : undefined}
            className={`bg-white rounded-2xl border ${stat.borderColor} p-3.5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between ${
              stat.clickable ? 'cursor-pointer hover:border-sky-400 hover:scale-[1.01]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 truncate mr-1">{stat.label}</span>
              <div className={`w-7 h-7 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
