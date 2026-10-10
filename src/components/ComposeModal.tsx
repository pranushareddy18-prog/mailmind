import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Save, 
  Trash2, 
  Wand2, 
  Check, 
  RotateCw, 
  FileText,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { DraftEmail } from '../types';
import { generateAIDraftFromPrompt, improveDraftText } from '../utils/aiAnalyzer';
import { composeAssistWithBackend } from '../utils/apiClient';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (draft: DraftEmail) => void;
  onDemoSend: (email: { to: string; subject: string; body: string }) => void;
  initialDraft?: DraftEmail | null;
  showToast: (msg: string) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSaveDraft,
  onDemoSend,
  initialDraft,
  showToast
}) => {
  if (!isOpen) return null;

  const [to, setTo] = useState(initialDraft?.to || '');
  const [subject, setSubject] = useState(initialDraft?.subject || '');
  const [body, setBody] = useState(initialDraft?.body || '');
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Quick prompt presets for quick testing
  const promptPresets = [
    'Request 48hr extension on CS Capstone assignment',
    'Thank recruiter for software engineering interview',
    'Invite study team for weekend hackathon sync'
  ];

  const handleGenerateDraft = async (customPrompt?: string) => {
    const prompt = customPrompt || promptInput;
    if (!prompt.trim()) {
      showToast('Please type a prompt or topic for the draft');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await composeAssistWithBackend(prompt, undefined, 'generate');
      if (res.subject) setSubject(res.subject);
      setBody(res.body);
      setShowPromptGenerator(false);
      setPromptInput('');
      showToast('AI Draft generated with Gemini!');
    } catch (err: any) {
      console.warn('Backend draft error, using local fallback:', err);
      const generated = generateAIDraftFromPrompt(prompt);
      setSubject(generated.subject);
      setBody(generated.body);
      setShowPromptGenerator(false);
      setPromptInput('');
      showToast('AI Draft generated (Offline mode)');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveText = async (action: 'formal' | 'friendly' | 'shorten' | 'grammar') => {
    if (!body.trim()) {
      showToast('Please enter some text in the message body first');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await composeAssistWithBackend(undefined, body, action);
      setBody(res.body);
      showToast(`Message polished with Gemini (${action})!`);
    } catch (err: any) {
      console.warn('Backend assist error, using local fallback:', err);
      const improved = improveDraftText(body, action);
      setBody(improved);
      showToast(`Message updated with ${action} polish`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraftClick = () => {
    if (!to.trim() && !subject.trim() && !body.trim()) {
      showToast('Cannot save an empty draft');
      return;
    }

    const draftItem: DraftEmail = {
      id: initialDraft?.id || `draft-${Date.now()}`,
      to: to.trim() || 'No recipient',
      subject: subject.trim() || 'Untitled Draft',
      body: body.trim(),
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSaveDraft(draftItem);
    showToast('Draft saved persistently!');
    onClose();
  };

  const handleSendClick = () => {
    if (!to.trim()) {
      showToast('Please specify a recipient email');
      return;
    }
    if (!subject.trim() && !body.trim()) {
      showToast('Please enter a subject or message');
      return;
    }

    onDemoSend({ to, subject: subject || '(No Subject)', body });
    showToast('Demo Mode: Email logged to Sent mailbox. Real email sending will be enabled after Gmail integration.');
    onClose();
  };

  const handleDiscardClick = () => {
    setTo('');
    setSubject('');
    setBody('');
    onClose();
    showToast('Draft discarded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Compose New Email</h3>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={handleDiscardClick}
              className="p-1 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer"
              title="Close and discard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Quick Generator Drawer */}
        {showPromptGenerator && (
          <div className="p-4 bg-sky-50/80 border-b border-sky-100 space-y-3 animate-in slide-in-from-top-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-sky-600" />
                Generate Complete Draft with AI
              </span>
              <button
                onClick={() => setShowPromptGenerator(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Ask Prof. Vance for office hours tomorrow..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGenerateDraft();
                  }
                }}
                className="flex-1 px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                onClick={() => handleGenerateDraft()}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate</span>
              </button>
            </div>

            {/* Prompt presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-sky-700 font-semibold self-center mr-1">Presets:</span>
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGenerateDraft(preset)}
                  className="text-[10px] bg-white hover:bg-sky-100 text-sky-800 border border-sky-200/80 px-2 py-1 rounded-lg transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email Fields */}
        <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto">
          {/* To Field */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-400 w-14">To:</span>
            <input
              type="text"
              placeholder="recipient@university.edu"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-400 w-14">Subject:</span>
            <input
              type="text"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* AI Writing Assistant Toolbar */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Wand2 className="w-3.5 h-3.5 text-sky-500" />
                AI Assist:
              </span>

              <button
                onClick={() => setShowPromptGenerator(!showPromptGenerator)}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold transition cursor-pointer"
              >
                Generate Draft
              </button>

              <button
                onClick={() => handleImproveText('formal')}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                Formalize
              </button>

              <button
                onClick={() => handleImproveText('friendly')}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                Friendly
              </button>

              <button
                onClick={() => handleImproveText('shorten')}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                Shorten
              </button>

              <button
                onClick={() => handleImproveText('grammar')}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                Fix Grammar
              </button>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="pt-2">
            <textarea
              rows={11}
              placeholder="Type your message here, or use the AI Assist tools above to generate a draft..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-sans transition"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Send Demonstration Button */}
            <button
              onClick={handleSendClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-sky-500/20 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send (Demo)</span>
            </button>

            {/* Save Draft Button */}
            <button
              onClick={handleSaveDraftClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>

          {/* Discard Button */}
          <button
            onClick={handleDiscardClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
