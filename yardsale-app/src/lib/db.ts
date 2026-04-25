import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
    pool: Pool;
};

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
}

function normalizeSslMode(connectionString: string): string {
    try {
        const parsed = new URL(connectionString);
        const sslMode = parsed.searchParams.get("sslmode");

        if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
            parsed.searchParams.set("sslmode", "verify-full");
        }

        return parsed.toString();
    } catch {
        return connectionString;
    }
}

const normalizedDatabaseUrl = normalizeSslMode(process.env.DATABASE_URL);

const pool = globalForPrisma.pool || new Pool({
    connectionString: normalizedDatabaseUrl,
});

const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma || 
    new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
    globalForPrisma.pool = pool;
}