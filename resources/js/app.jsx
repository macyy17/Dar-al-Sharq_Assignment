import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-gray-900">
            <div className="text-center">
                <h1 className="text-3xl font-semibold">Laravel 12 + React</h1>
                <p className="mt-2 text-gray-600">Project setup is ready.</p>
            </div>
        </main>
    );
}

createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
