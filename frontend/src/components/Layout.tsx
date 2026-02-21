import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-gray-100 font-outfit selection:bg-pink-500/30">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] bg-pink-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] bg-orange-500/20 rounded-full blur-[150px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};
