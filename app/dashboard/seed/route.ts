import { connectToDatabase } from "../../lib/connect-to-database";

const client = await connectToDatabase();

async function seedUsers() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
}

async function seedLinkedIps() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS linked_ips (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ip VARCHAR(255) NOT NULL
    );
  `);
}

export async function GET() {
  try {
    await client.query(`BEGIN`);
    await seedUsers();
    await seedLinkedIps();
    await client.query(`COMMIT`);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.query(`ROLLBACK`);
    return Response.json({ error }, { status: 500 });
  }
  finally {
    client.release(); // Release the client back to the pool
  }
}
