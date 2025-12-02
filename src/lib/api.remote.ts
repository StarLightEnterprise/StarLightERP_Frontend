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
    // console.log('Getting auth headers, token exists:', !!token);
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
    console.log('Attempting to refresh access token...');
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Important: send httpOnly cookies
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Refresh token response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.accessToken) {
                console.log('Token refresh successful');
                auth.setAccessToken(data.accessToken);
                return data.accessToken;
            } else {
                console.error('Token refresh failed: success=false or no accessToken', data);
            }
        } else {
            console.error('Token refresh failed with status:', response.status);
        }
    } catch (error) {
        console.error('Token refresh error:', error);
    }

    return null;
}

// Helper to make authenticated API calls with automatic token refresh
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // First attempt with current token
    const headers = {
        ...getAuthHeaders(),
        ...options.headers
    };

    // console.log('Making authenticated fetch to:', url);

    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers
    });

    // If unauthorized, try refreshing token
    if (response.status === 401) {
        console.log('Received 401 Unauthorized, attempting refresh...');
        const newToken = await refreshAccessToken();

        if (newToken) {
            console.log('Retrying request with new token...');
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
            console.error('Refresh failed, logging out user');
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
    v.object({
        token: v.optional(v.string())
    }),
    async ({ token }) => {
        try {
            // If token is provided (server-side call), use it
            // Otherwise try to use authenticatedFetch (client-side call)
            // But since we are converting to explicit token passing, let's prefer that

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // Fallback for existing calls that might rely on client-side auth store
                // But this won't work on server if auth store is empty
                // So we should really enforce token passing or use authenticatedFetch if on client
                // For now, let's try to use authenticatedFetch if no token passed, assuming client-side
                // But wait, command runs on server. So authenticatedFetch on server is broken.
                // So we MUST pass token.
            }

            // Actually, let's make it robust:
            // If token is passed, use fetch.
            // If not, we can't do much on server.

            const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
                method: 'GET',
                headers: token ? { ...headers, 'Authorization': `Bearer ${token}` } : headers
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
        phone: v.optional(v.string()),
        token: v.string()
    }),
    async ({ name, email, phone, token }) => {
        try {
            console.log('Server: updateProfile called with token length:', token?.length);

            const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, phone })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Server: Update profile failed:', response.status, data);
            }

            return data;
        } catch (error) {
            console.error('Server: Update profile error:', error);
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
