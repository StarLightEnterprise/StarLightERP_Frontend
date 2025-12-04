import { json } from '@sveltejs/kit';
import { BACKEND_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/auth/select-customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy Select Customer Error:', error);
        return json({
            success: false,
            message: 'Internal Server Error during customer selection proxy'
        }, { status: 500 });
    }
};
