"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import NewsEditor from '@/components/admin/NewsEditor';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
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
                    <p className="text-neutral-400">Manage HQ Feed messages</p>
                </div>

                {!isAuthenticated ? (
                    <LoginForm onLogin={handleLogin} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">HQ Feed Editor</h2>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                        <NewsEditor token={sessionStorage.getItem('admin-token') || ''} />
                    </>
                )}
            </div>
        </div>
    );
}
