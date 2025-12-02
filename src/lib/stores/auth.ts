import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
    username: string;
    email: string;
    role: string;
    name?: string;
    phone?: string;
    customerId?: number;
    customerName?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
}

function createAuthStore() {
    const storedUser = browser && localStorage.getItem('user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    const { subscribe, set, update } = writable<AuthState>({
        user: initialUser,
        isAuthenticated: !!initialUser,
        accessToken: null
    });

    return {
        subscribe,
        login: (user: User, accessToken: string) => {
            if (browser) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            set({
                user,
                isAuthenticated: true,
                accessToken
            });
        },
        logout: () => {
            if (browser) {
                localStorage.removeItem('user');
            }
            set({
                user: null,
                isAuthenticated: false,
                accessToken: null
            });
        },
        updateUser: (updates: Partial<User>) => {
            update((state) => {
                if (state.user) {
                    const updatedUser = { ...state.user, ...updates };
                    if (browser) {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                    return {
                        ...state,
                        user: updatedUser
                    };
                }
                return state;
            });
        },
        setAccessToken: (token: string) => {
            update((state) => ({
                ...state,
                accessToken: token
            }));
        },
        getToken: () => {
            return get({ subscribe }).accessToken;
        }
    };
}

export const auth = createAuthStore();
