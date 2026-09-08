import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        include: ['tests/Frontend/**/*.test.{js,jsx,ts,tsx}'],
        setupFiles: ['./tests/Frontend/setup.js'],
    },
});
