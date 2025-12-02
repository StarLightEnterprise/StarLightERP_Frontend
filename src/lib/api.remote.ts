import { command } from '$app/server';
import * as v from 'valibot';
import { auth } from '$lib/stores';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { BACKEND_URL } from '$lib/config';

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
    return response;
}

// Generic API call wrapper
async function apiCall(endpoint: string, method: string, body?: object, token?: string) {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            credentials: 'include',
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        // Use authenticatedFetch if no explicit token provided (client-side auto-auth)
        // Otherwise use standard fetch (server-side or explicit token)
        const fetchFn = token ? fetch : authenticatedFetch;

        const response = await fetchFn(`${BACKEND_URL}${endpoint}`, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return {
            success: false,
            message: 'Unable to connect to server'
        };
    }
}

export const login = command(
    v.object({
        username: v.string(),
        password: v.string()
    }),
    async ({ username, password }) => {
        return await apiCall('/api/auth/login', 'POST', { username, password });
    }
);

export const register = command(
    v.object({
        username: v.string(),
        password: v.string(),
        email: v.string()
    }),
    async ({ username, password, email }) => {
        return await apiCall('/api/auth/register', 'POST', { username, password, email });
    }
);

export const selectCustomer = command(
    v.object({
        username: v.string(),
        customerId: v.number()
    }),
    async ({ username, customerId }) => {
        return await apiCall('/api/auth/select-customer', 'POST', { username, customerId });
    }
);

export const logout = command(
    v.object({}),
    async () => {
        return await apiCall('/api/auth/revoke', 'POST');
    }
);

export const getUserProfile = command(
    v.object({
        token: v.optional(v.string())
    }),
    async ({ token }) => {
        return await apiCall('/api/user/profile', 'GET', undefined, token);
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
        return await apiCall('/api/user/profile', 'PUT', { name, email, phone }, token);
    }
);

export const resetPassword = command(
    v.object({
        currentPassword: v.string(),
        newPassword: v.string()
    }),
    async ({ currentPassword, newPassword }) => {
        return await apiCall('/api/user/reset-password', 'POST', { currentPassword, newPassword });
    }
);
