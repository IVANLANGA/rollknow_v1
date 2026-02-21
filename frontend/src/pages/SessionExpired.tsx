import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SessionExpired = () => {
    return (
        <div className="min-h-screen bg-[#0E1125] flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center py-10">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Session Expired</h1>
                <p className="text-gray-400 mb-8">
                    Your learning session has timed out. Please return to your Learning Management System (LMS) and launch the tool again.
                </p>
                <Button onClick={() => window.close()} className="w-full">
                    Close Window
                </Button>
            </Card>
        </div>
    );
};
