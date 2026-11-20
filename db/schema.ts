import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const enquiries = sqliteTable('enquiries', {
  id: text().primaryKey(),
  name: text().notNull(),
  phone: text().notNull(),
  location: text().notNull(),
  pin: text().notNull(),
  deliveryDate: text('delivery_date').notNull(),
  litres: real().notNull(),
  flavours: text({ mode: 'json' }).$type<string[]>().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});
