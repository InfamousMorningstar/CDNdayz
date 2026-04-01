"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import NewsEditor from '@/components/admin/NewsEditor';
import WipeEditor from '@/components/admin/WipeEditor';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [activeTab, setActiveTab] = useState<'news' | 'wipe'>('news');
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in by checking sessionStorage
        const token = sessionStorage.getItem('admin-token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleLogin = (token: string) => {
        sessionStorage.setItem('admin-token', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin-token');
        setIsAuthenticated(false);
    };

    if (isChecking) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-neutral-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">CDN Admin Panel</h1>
                    <p className="text-neutral-400">Manage HQ Feed messages and wipe information</p>
                </div>

                {!isAuthenticated ? (
                    <LoginForm onLogin={handleLogin} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-2 border-b border-neutral-700">
                                <button
                                    onClick={() => setActiveTab('news')}
                                    className={`px-4 py-2 font-semibold transition-colors ${
                                        activeTab === 'news'
                                            ? 'text-white border-b-2 border-blue-500'
                                            : 'text-neutral-400 hover:text-neutral-200'
                                    }`}
                                >
                                    HQ Feed Editor
                                </button>
                                <button
                                    onClick={() => setActiveTab('wipe')}
                                    className={`px-4 py-2 font-semibold transition-colors ${
                                        activeTab === 'wipe'
                                            ? 'text-white border-b-2 border-amber-500'
                                            : 'text-neutral-400 hover:text-neutral-200'
                                    }`}
                                >
                                    Wipe Dates Editor
                                </button>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="px-5 text-neutral-100 hover:bg-neutral-700"
                            >
                                Logout
                            </Button>
                        </div>

                        {activeTab === 'news' && (
                            <NewsEditor token={sessionStorage.getItem('admin-token') || ''} />
                        )}
                        {activeTab === 'wipe' && (
                            <WipeEditor token={sessionStorage.getItem('admin-token') || ''} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
