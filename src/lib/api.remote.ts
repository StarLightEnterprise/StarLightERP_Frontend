import { command } from '$app/server';
import * as v from 'valibot';

// This file defines remote functions that run on the server.
// They are imported by the client and called like normal functions.

export const login = command(
    v.object({
        username: v.string(),
        password: v.string()
    }),
    async ({ username, password }) => {
        // In a real app, this might query the DB directly.
        // Here we proxy to our own API route to satisfy the requirements.
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        return data;
    }
);
