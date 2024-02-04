import { db } from './db/client';

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === '/api/users') {
			const results = await db(env.DB).query.users.findMany();

			return Response.json(results);
		}

		return new Response('Hello World!');
	},
};
