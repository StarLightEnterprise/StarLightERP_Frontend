export const login = async ({ username, password }: { username: string; password: string }) => {
    try {
        const response = await fetch('/api/proxy/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Network error during login' };
    }
};

export const register = async ({ username, password, email }: { username: string; password: string; email: string }) => {
    try {
        const response = await fetch('/api/proxy/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });
        return await response.json();
    } catch (error) {
        console.error('Register Error:', error);
        return { success: false, message: 'Network error during registration' };
    }
};

export const selectTenant = async ({ username, tenantId }: { username: string; tenantId: number }) => {
    try {
        const response = await fetch('/api/proxy/auth/select-tenant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, tenantId })
        });
        return await response.json();
    } catch (error) {
        console.error('Select Tenant Error:', error);
        return { success: false, message: 'Network error during tenant selection' };
    }
};
