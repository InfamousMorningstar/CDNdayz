"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type NewsItem = {
    id: string | number;
    type: 'alert' | 'event' | 'info' | 'update';
    message: string;
    date?: string;
};

interface NewsEditorProps {
    token: string;
}

const MAX_MESSAGE_LENGTH = 200;

function formatCurrentDate(): string {
    const now = new Date();
    const time = now.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return time;
}

const EXAMPLE_MESSAGE: NewsItem = {
    id: 'example',
    type: 'info',
    message: 'Welcome to CDN DayZ. Check out our new server rules.',
    date: 'Example Format',
};

export default function NewsEditor({ token }: NewsEditorProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'info' | 'alert' | 'event' | 'update'>('info');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news-ticker');
            const data = await response.json();
            setNews(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorMsg('Failed to load news');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setErrorMsg('Message cannot be empty');
            return;
        }

        const currentDate = formatCurrentDate();

        const newItem: NewsItem = {
            id: Date.now(),
            type,
            message: message.trim(),
            date: currentDate,
        };

        const updatedNews = [...news, newItem];
        await saveNews(updatedNews);

        if (!errorMsg) {
            setMessage('');
            setType('info');
            setSuccessMsg('News item added successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const handleDeleteNews = async (id: string | number) => {
        const updatedNews = news.filter((item) => item.id !== id);
        await saveNews(updatedNews);
    };

    const saveNews = async (updatedNews: NewsItem[]) => {
        setIsSaving(true);
        setErrorMsg('');

        try {
            const response = await fetch('/api/news-ticker', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedNews),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || 'Failed to save news');
                return;
            }

            setNews(updatedNews);
        } catch (err) {
            setErrorMsg('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'alert': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'event': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'update': return 'bg-green-500/10 text-green-600 border-green-500/20';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        }
    };

    if (isLoading) {
        return <div className="text-neutral-400">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Example Section */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Example Format</h3>
                </div>
                <div className="bg-neutral-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTypeColor(EXAMPLE_MESSAGE.type)}`}>
                                    {EXAMPLE_MESSAGE.type}
                                </span>
                                {EXAMPLE_MESSAGE.date && (
                                    <span className="text-xs text-neutral-400">{EXAMPLE_MESSAGE.date}</span>
                                )}
                            </div>
                            <p className="text-neutral-300">{EXAMPLE_MESSAGE.message}</p>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                    ✓ Message is clear and concise • ✓ Type matches the content • ✓ Date will auto-populate when posted
                </p>
            </div>

            {/* Add News Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Add News Item</h3>

                {successMsg && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAddNews} className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Message</label>
                            <span className={`text-xs ${message.length > MAX_MESSAGE_LENGTH ? 'text-red-400' : 'text-neutral-500'}`}>
                                {message.length}/{MAX_MESSAGE_LENGTH}
                            </span>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                                    setMessage(e.target.value);
                                }
                            }}
                            placeholder="Enter news message... (max 200 characters)"
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-blue-500"
                        >
                            <option value="info">ℹ️ Info</option>
                            <option value="alert">⚠️ Alert</option>
                            <option value="event">📅 Event</option>
                            <option value="update">📢 Update</option>
                        </select>
                        <p className="text-xs text-neutral-500 mt-2">Note: Date will auto-populate with current time when posted</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSaving || !message.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white font-medium"
                    >
                        {isSaving ? 'Saving...' : 'Add News Item'}
                    </Button>
                </form>
            </div>

            {/* News List */}
            <div className="space-y-3">
                <h3 className="text-xl font-semibold">Current Feed ({news.length} items)</h3>
                {news.length === 0 ? (
                    <p className="text-neutral-500">No news items yet</p>
                ) : (
                    news.map((item) => (
                        <div
                            key={item.id}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-start justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTypeColor(item.type)}`}>
                                        {item.type}
                                    </span>
                                    {item.date && (
                                        <span className="text-xs text-neutral-500">{item.date}</span>
                                    )}
                                </div>
                                <p className="text-neutral-100 break-words">{item.message}</p>
                            </div>
                            <Button
                                onClick={() => handleDeleteNews(item.id)}
                                disabled={isSaving}
                                variant="ghost"
                                size="icon"
                                className="mt-1 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 flex-shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
