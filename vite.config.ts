import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		https: {
			key: fs.readFileSync('./certs/starlighterp.key'),
			cert: fs.readFileSync('./certs/starlighterp.crt')
		},
		proxy: {}
	}
});
