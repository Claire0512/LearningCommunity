import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from './schema';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
});

(async () => {
  await client.connect();
})()

export const db = drizzle(client, { schema });;
