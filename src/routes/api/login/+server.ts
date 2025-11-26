import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { username, password } = await request.json();

    // Mock authentication logic
    if (username === 'admin' && password === 'password') {
        return json({ success: true, message: 'Login successful' });
    } else {
        return json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
};
