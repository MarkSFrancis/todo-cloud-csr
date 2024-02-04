import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('Users', {
	id: integer('Id').primaryKey().notNull(),
	fullName: text('FullName').notNull(),
});
