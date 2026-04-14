"use client";

import { FormEvent, useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type SourceLink = {
  title: string;
  url: string;
  path: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceLink[];
};

const DEFAULT_WELCOME =
  "Welcome to CDN AI Concierge. I'm powered by ChatGPT-5.4 mini and only answer from CDN website content. If it is not on the site, I'll tell you directly.";

export function WebsiteSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: DEFAULT_WELCOME
    }
  ]);

  const canSend = useMemo(() => input.trim().length >= 2 && !isLoading, [input, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((previous) => [...previous, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const payload = (await response.json()) as {
        answer?: string;
        error?: string;
        sources?: SourceLink[];
      };

      if (!response.ok) {
        const fallback = payload.error || "I couldn't find that on the website.";
        setMessages((previous) => [...previous, { role: 'assistant', content: fallback }]);
        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: payload.answer || "I couldn't find that on the website.",
          sources: payload.sources || []
        }
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: 'Chat is temporarily unavailable. Please try again in a moment.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-[80] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="w-[min(92vw,360px)] rounded-2xl border border-white/10 bg-black/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">CDN AI Concierge</p>
              <p className="text-xs text-neutral-400">Powered by ChatGPT-5.4 mini · Website-only answers with sources</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-neutral-300 hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[52vh] overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className="space-y-2">
                <div
                  className={[
                    'rounded-xl px-3 py-2 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-red-500/20 border border-red-500/30 text-red-50 ml-5'
                      : 'bg-white/5 border border-white/10 text-neutral-100 mr-3'
                  ].join(' ')}
                >
                  {message.content}
                </div>
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="px-1">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">Sources</p>
                    <ul className="space-y-1">
                      {message.sources.map((source) => (
                        <li key={`${source.url}-${source.title}`}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-red-300 hover:text-red-200 underline underline-offset-2"
                          >
                            {source.title} ({source.path})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <p className="text-xs text-neutral-400 px-1">Checking website content...</p>}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about status, wipes, errors, join..."
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-500"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-black/75 px-4 py-2.5 text-sm font-medium text-red-100 shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:bg-black/90"
        >
          <MessageCircle size={16} />
          CDN AI Concierge
        </button>
      )}
    </div>
  );
}
