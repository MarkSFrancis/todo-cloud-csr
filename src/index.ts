import { Hono } from 'hono';
import { db } from './db/client';
import { jwt } from 'hono/jwt';

export type Env = {
	DB: D1Database;
	JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('/api/*', (c, next) => {
	const auth = jwt({
		secret: c.env.JWT_SECRET,
	});

	return auth(c, next);
});

app.get('/api/users', async (c) => {
	const results = await db(c.env.DB).query.users.findMany();

	return c.json(results);
});

app.all('*', (c) => {
	return c.text('Hello World!');
});

export default app;
