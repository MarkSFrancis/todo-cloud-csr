import { Context, MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verifyJwt } from './jwk';

const BEARER_PREFIX = 'Bearer ';

export function jwt(options: { clientIds: string[] }): MiddlewareHandler {
	return async function jwt(ctx, next) {
		const credentials = ctx.req.header('Authorization');
		let token;
		if (credentials && credentials.startsWith(BEARER_PREFIX)) {
			token = credentials.substring(BEARER_PREFIX.length);
		}

		if (!token) {
			throw new HTTPException(401, {
				res: unauthorizedResponse({
					ctx,
					error: 'invalid_request',
					errDescription: 'no bearer token included in request',
				}),
			});
		}

		let payload;
		let msg = '';
		try {
			payload = await verifyJwt(token, options.clientIds);
		} catch (e) {
			msg = `${e}`;
		}
		if (!payload) {
			throw new HTTPException(401, {
				res: unauthorizedResponse({
					ctx,
					error: 'invalid_token',
					statusText: msg,
					errDescription: 'token verification failure',
				}),
			});
		}

		ctx.set('jwtPayload', payload);

		await next();
	};
}

/**
 * @see https://github.com/honojs/hono/blob/f44c7055e077c457b309bf037922d932f7ea380c/src/middleware/jwt/index.ts#L82
 */
function unauthorizedResponse(opts: { ctx: Context; error: string; errDescription: string; statusText?: string }) {
	return new Response('Unauthorized', {
		status: 401,
		statusText: opts.statusText,
		headers: {
			'WWW-Authenticate': `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`,
		},
	});
}
