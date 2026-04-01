"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type WipeDates = {
    nextWipeWindow: string;
    wipeCycleMonths: number;
    estimatedDaysUntilWipe: number;
    lastWipeDate: string;
    notes: string;
};

interface WipeEditorProps {
    token: string;
}

export default function WipeEditor({ token }: WipeEditorProps) {
    const [wipeDates, setWipeDates] = useState<WipeDates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Form fields
    const [nextWipeWindow, setNextWipeWindow] = useState('');
    const [wipeCycleMonths, setWipeCycleMonths] = useState('4');
    const [estimatedDaysUntilWipe, setEstimatedDaysUntilWipe] = useState('120');
    const [lastWipeDate, setLastWipeDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchWipeDates();
    }, []);

    const fetchWipeDates = async () => {
        try {
            const response = await fetch('/api/wipe-dates');
            const data = await response.json();
            setWipeDates(data);
            setNextWipeWindow(data.nextWipeWindow);
            setWipeCycleMonths(data.wipeCycleMonths);
            setEstimatedDaysUntilWipe(data.estimatedDaysUntilWipe);
            setLastWipeDate(data.lastWipeDate);
            setNotes(data.notes);
        } catch (err) {
            setErrorMsg('Failed to load wipe dates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveWipeDates = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nextWipeWindow.trim()) {
            setErrorMsg('Next wipe window cannot be empty');
            return;
        }

        const updatedWipeDates: WipeDates = {
            nextWipeWindow: nextWipeWindow.trim(),
            wipeCycleMonths: parseInt(wipeCycleMonths) || 4,
            estimatedDaysUntilWipe: parseInt(estimatedDaysUntilWipe) || 120,
            lastWipeDate: lastWipeDate.trim(),
            notes: notes.trim(),
        };

        await saveWipeDates(updatedWipeDates);
    };

    const saveWipeDates = async (updatedWipeDates: WipeDates) => {
        setIsSaving(true);
        setErrorMsg('');

        try {
            const response = await fetch('/api/wipe-dates', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedWipeDates),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || 'Failed to save wipe dates');
                return;
            }

            setWipeDates(updatedWipeDates);
            setSuccessMsg('Wipe dates updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-neutral-400">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Info Section */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold">Current Wipe Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-neutral-800/50 p-4 rounded border border-neutral-700">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Next Wipe Window</p>
                        <p className="text-sm font-semibold text-white">{nextWipeWindow}</p>
                    </div>
                    <div className="bg-neutral-800/50 p-4 rounded border border-neutral-700">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Estimated Days</p>
                        <p className="text-sm font-semibold text-white">{estimatedDaysUntilWipe} days</p>
                    </div>
                    <div className="bg-neutral-800/50 p-4 rounded border border-neutral-700">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Cycle Duration</p>
                        <p className="text-sm font-semibold text-white">{wipeCycleMonths} months</p>
                    </div>
                    <div className="bg-neutral-800/50 p-4 rounded border border-neutral-700">
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Last Wipe</p>
                        <p className="text-sm font-semibold text-white">{lastWipeDate}</p>
                    </div>
                </div>
            </div>

            {/* Editor Form */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-6">Update Wipe Dates</h3>

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-600">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSaveWipeDates} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Next Wipe Window<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., First Week of April 2026"
                            value={nextWipeWindow}
                            onChange={(e) => setNextWipeWindow(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Wipe Cycle (months)
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={wipeCycleMonths}
                            onChange={(e) => setWipeCycleMonths(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Estimated Days Until Wipe
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={estimatedDaysUntilWipe}
                            onChange={(e) => setEstimatedDaysUntilWipe(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Last Wipe Date
                        </label>
                        <input
                            type="date"
                            value={lastWipeDate}
                            onChange={(e) => setLastWipeDate(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Notes
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Subject to Change"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Wipe Dates'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
