import type { Config } from 'drizzle-kit';

export default {
	schema: './src/db',
	out: './migrations',
} satisfies Config;
