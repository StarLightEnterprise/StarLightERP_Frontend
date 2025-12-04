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

export const selectCustomer = async ({ username, customerId }: { username: string; customerId: number }) => {
    try {
        const response = await fetch('/api/proxy/auth/select-customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, customerId })
        });
        return await response.json();
    } catch (error) {
        console.error('Select Customer Error:', error);
        return { success: false, message: 'Network error during customer selection' };
    }
};
