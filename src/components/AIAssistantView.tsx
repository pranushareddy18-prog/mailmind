import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Mail, 
  ExternalLink,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { EmailItem, ReminderItem, AssistantMessage } from '../types';
import { processAssistantChat } from '../utils/aiAnalyzer';
import { chatAssistantWithBackend } from '../utils/apiClient';

interface AIAssistantViewProps {
  emails: EmailItem[];
  reminders: ReminderItem[];
  onOpenEmail: (emailId: string) => void;
  onOpenReminders: () => void;
  onFilterUnread: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  emails,
  reminders,
  onOpenEmail,
  onOpenReminders,
  onFilterUnread
}) => {
  const suggestedPrompts = [
    'Summarize my important emails.',
    'What deadlines do I have this week?',
    'Which emails need a reply?',
    'Show my unread emails.',
    'List the tasks mentioned in my emails.'
  ];

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello Alex! I am your **MailMind AI Assistant**.\n\nI have parsed your inbox, college announcements, and deadline calendar. How can I assist you with your emails today?`,
      timestamp: 'Just now',
      suggestions: suggestedPrompts.slice(0, 3)
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      // Build history for Gemini
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const backendRes = await chatAssistantWithBackend(query, history, emails, reminders);

      const aiMsg: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: backendRes.answer,
        timestamp: 'Just now',
        suggestions: backendRes.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Backend chat error, using local fallback:', err);
      // Seamless local analysis fallback
      const response = processAssistantChat(query, emails, reminders);

      const aiMsg: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: 'Just now',
        suggestions: response.suggestions,
        quickActions: response.quickAction ? [
          {
            label: response.quickAction.label,
            targetTab: response.quickAction.type,
            emailId: response.quickAction.targetId
          }
        ] : undefined
      };

      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickActionClick = (action: { label: string; targetTab?: string; emailId?: string }) => {
    if (action.targetTab === 'open_email' && action.emailId) {
      onOpenEmail(action.emailId);
    } else if (action.targetTab === 'open_reminders') {
      onOpenReminders();
    } else if (action.targetTab === 'filter_unread') {
      onFilterUnread();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'assistant',
        text: `Conversation reset. Feel free to ask about your deadlines, inbox priority, or task summaries!`,
        timestamp: 'Just now',
        suggestions: suggestedPrompts
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 via-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs shadow-sky-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">MailMind AI Assistant</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Online & Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Ask questions about your emails, tasks, and upcoming deadlines</p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Pills Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Suggestions:
        </span>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-xl text-xs font-medium bg-white text-slate-700 hover:text-sky-700 hover:border-sky-300 border border-slate-200 shadow-2xs whitespace-nowrap transition cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser ? 'bg-slate-800 text-white' : 'bg-sky-500 text-white shadow-xs shadow-sky-500/20'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser 
                  ? 'bg-sky-500 text-white rounded-tr-none' 
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none shadow-2xs'
              }`}>
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Quick Action Button within Message */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-2">
                    {msg.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickActionClick(action)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline follow-up suggestions */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-[11px] font-semibold text-sky-700 bg-white hover:bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 transition cursor-pointer"
                      >
                        {s} →
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-slate-600 font-medium">MailMind is analyzing emails...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            placeholder="Ask anything about your emails, professors, deadlines..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs shadow-sky-500/20"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Demonstration mode: Responses synthesized locally from active email cache. Structured for Gemini API integration.
        </p>
      </div>
    </div>
  );
};
