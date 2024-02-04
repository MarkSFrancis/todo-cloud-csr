import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const db = (db: D1Database) =>
	drizzle(db, {
		schema,
	});
