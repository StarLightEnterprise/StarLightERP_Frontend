import { command } from '$app/server';
import * as v from 'valibot';
import { auth } from '$lib/stores';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

// Backend API URL
const BACKEND_URL = 'http://localhost:8080';

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
    const token = get(auth).accessToken;
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// Helper to refresh access token
async function refreshAccessToken(): Promise<string | null> {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Important: send httpOnly cookies
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.accessToken) {
                auth.setAccessToken(data.accessToken);
                return data.accessToken;
            }
        }
    } catch (error) {
        console.error('Token refresh error:', error);
    }

    return null;
}

// Helper to make authenticated API calls with automatic token refresh
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // First attempt with current token
    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    });

    // If unauthorized, try refreshing token
    if (response.status === 401) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            // Retry with new token
            response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken}`,
                    ...options.headers
                }
            });
        } else {
            // Refresh failed, logout user
            auth.logout();
            if (typeof window !== 'undefined') {
                goto('/login');
            }
        }
    }

    return response;
}

export const login = command(
    v.object({
        username: v.string(),
        password: v.string()
    }),
    async ({ username, password }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include', // Important: receive httpOnly cookies
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
                credentials: 'include',
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

export const selectCustomer = command(
    v.object({
        username: v.string(),
        customerId: v.number()
    }),
    async ({ username, customerId }) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/select-customer`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, customerId })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Select customer error:', error);
            return {
                success: false,
                message: 'Unable to connect to server'
            };
        }
    }
);

export const logout = command(
    v.object({}),
    async () => {
        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/auth/revoke`, {
                method: 'POST'
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: true, // Still succeed locally
                message: 'Logged out (server unreachable)'
            };
        }
    }
);

export const getUserProfile = command(
    v.object({}),
    async () => {
        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/user/profile`, {
                method: 'GET'
            });

            return await response.json();
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                message: 'Unable to fetch profile'
            };
        }
    }
);

export const updateProfile = command(
    v.object({
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string())
    }),
    async ({ name, email, phone }) => {
        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/user/profile`, {
                method: 'PUT',
                body: JSON.stringify({ name, email, phone })
            });

            return await response.json();
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: 'Unable to update profile'
            };
        }
    }
);

export const resetPassword = command(
    v.object({
        currentPassword: v.string(),
        newPassword: v.string()
    }),
    async ({ currentPassword, newPassword }) => {
        try {
            const response = await authenticatedFetch(`${BACKEND_URL}/api/user/reset-password`, {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });

            return await response.json();
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: 'Unable to reset password'
            };
        }
    }
);
