import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
            <div className="mx-auto max-w-5xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dar Al Sharq CMS</p>
                <h1 className="mt-2 text-3xl font-bold">CMS workspace foundation</h1>
            </div>
        </main>
    );
}

createRoot(document.getElementById('app')).render(<App />);
