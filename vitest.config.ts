import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/unit/**/*.test.ts'],
        setupFiles: ['./tests/setup.ts']
    },
    resolve: {
        alias: {
            '$lib': '/src/lib',
            '$app/environment': '/tests/mocks/app-environment.ts',
            '$app/stores': '/tests/mocks/app-stores.ts'
        }
    }
});
