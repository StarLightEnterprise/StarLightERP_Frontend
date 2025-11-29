import { command } from '$app/server';
import * as v from 'valibot';

// This file defines remote functions that run on the server.
// They are imported by the client and called like normal functions.

// Backend API URL
const BACKEND_URL = 'http://localhost:8080';

export const login = command(
    v.object({
        username: v.string(),
        password: v.string()
    }),
    async ({ username, password }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Unable to connect to server'
            };
        }
    }
);

export const register = command(
    v.object({
        username: v.string(),
        password: v.string(),
        email: v.string()
    }),
    async ({ username, password, email }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Unable to connect to server'
            };
        }
    }
);
