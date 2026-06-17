"use client";

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
    onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Authentication failed');
                return;
            }

            // Login successful
            onLogin(data.token);
            setPassword('');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md bg-white/70 dark:bg-neutral-900/50 border border-gray-200/60 dark:border-white/[0.07] rounded-3xl backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_34px_-14px_rgba(0,0,0,0.24)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] p-8">
            <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Admin Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-neutral-800/60 border border-gray-200 dark:border-white/10 rounded-2xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 backdrop-blur-sm transition-all focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !password}
                    className="w-full"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    );
}
