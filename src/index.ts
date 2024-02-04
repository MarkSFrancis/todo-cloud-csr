import { Hono } from 'hono';
import { db } from './db/client';
import { jwt } from './auth/jwt';

export type Env = {
	DB: D1Database;
	JWT_CLIENT_ID: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('/api/*', (c, next) => jwt({ clientIds: [c.env.JWT_CLIENT_ID] })(c, next));

app.get('/api/users', async (c) => {
	const results = await db(c.env.DB).query.users.findMany();

	return c.json(results);
});

app.all('*', (c) => {
	return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Todo Cloud CSR</title>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
	<style>body { font-family: sans-serif; }</style>
</head>
<body>
	<main>
		<h1>Hello world!</h1>
		<div id="g_id_onload"
         data-client_id="${c.env.JWT_CLIENT_ID}"
         data-callback="onSignIn">
    </div>
    <div class="g_id_signin" data-type="standard"></div>
		<button hx-get="/api/users" hx-trigger="click" hx-target="#users-display" hx-headers='js:{ "Authorization": getReqHeaders()}'>Fetch users</button>
		<output id="users-display"></output>
	</main>
	<script>
		function getReqHeaders() {
			const jwt = localStorage.getItem('jwt');
			return "Bearer " + jwt;
		}
		function onSignIn(googleUser) {
			console.info({ googleUser });
			if (!('credential' in googleUser)) throw new Error('Invalid credentials - missing JWT');

			localStorage.setItem('jwt', googleUser.credential);			
		}
	</script>
	<script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>
</body>
</html>
	`);
});

export default app;
