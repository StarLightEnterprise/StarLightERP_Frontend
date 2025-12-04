import { json } from '@sveltejs/kit';
import { BACKEND_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        // Forward the status code and data
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy Login Error:', error);
        return json({
            success: false,
            message: 'Internal Server Error during login proxy'
        }, { status: 500 });
    }
};
