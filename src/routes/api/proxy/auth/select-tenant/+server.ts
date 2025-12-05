import { json } from '@sveltejs/kit';
import { BACKEND_URL } from '$lib/config';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, fetch }) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/select-tenant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...request.headers
            },
            body: JSON.stringify(await request.json())
        });

        return json(await response.json());
    } catch (error) {
        console.error('Proxy Select Tenant Error:', error);
        return json({
            success: false,
            message: 'Internal Server Error during tenant selection proxy'
        }, { status: 500 });
    }
};
