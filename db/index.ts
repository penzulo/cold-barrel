import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
	if (dbInstance) return dbInstance;

	// Use /tmp for serverless/lambda environment (Netlify/Vercel) or a custom path
	const dbPath = process.env.SQLITE_DB_PATH || "/tmp/cold-barrel.db";
	const sqlite = new DatabaseSync(dbPath);

	sqlite.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      pin TEXT NOT NULL,
      delivery_date TEXT NOT NULL,
      litres REAL NOT NULL,
      flavours TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

	dbInstance = drizzle(
		async (sql: string, params: unknown[], method: string) => {
			if (method === "all") {
				const rows = sqlite
					.prepare(sql)
					.all(...(params as (string | number | bigint | Buffer | null)[]));
				return {
					rows: rows.map((r) => Object.values(r as Record<string, unknown>)),
				};
			} else if (method === "get") {
				const row = sqlite
					.prepare(sql)
					.get(...(params as (string | number | bigint | Buffer | null)[]));
				return {
					rows: row ? Object.values(row as Record<string, unknown>) : [],
				};
			} else if (method === "run") {
				sqlite
					.prepare(sql)
					.run(...(params as (string | number | bigint | Buffer | null)[]));
				return { rows: [] };
			}
			return { rows: [] };
		},
		{ schema },
	);

	return dbInstance;
}
