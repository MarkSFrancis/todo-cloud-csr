import { Hono } from 'hono';
import { db } from './db/client';

export type Env = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/api/users', async (c) => {
	const results = await db(c.env.DB).query.users.findMany();

	return c.json(results);
});

app.all('*', (c) => {
	return c.text('Hello World!');
});

export default app;
