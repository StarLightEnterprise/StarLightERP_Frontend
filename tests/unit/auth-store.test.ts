import { describe, it, expect, beforeEach } from 'vitest';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

describe('Auth Store', () => {
    beforeEach(() => {
        auth.logout();
    });

    it('should start unauthenticated', () => {
        const state = get(auth);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });

    it('should update state on login', () => {
        const user = {
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
            name: 'Test User'
        };
        auth.login(user, 'fake-token');
        const state = get(auth);
        expect(state.isAuthenticated).toBe(true);
        expect(state.accessToken).toBe('fake-token');
        expect(state.user?.name).toBe('Test User');
    });

    it('should clear state on logout', () => {
        const user = {
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        };
        auth.login(user, 'fake-token');
        auth.logout();
        const state = get(auth);
        expect(state.isAuthenticated).toBe(false);
        expect(state.accessToken).toBeNull();
    });
});
