import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.NODE_ENV === "production"
    ? "/data/police_data.db"
    : path.join(process.cwd(), "../data/police_data.db");

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      db = new Database(DB_PATH, { readonly: true });

      const result = db
        .prepare("SELECT COUNT(*) as count FROM stop_search")
        .get() as { count: number };
      console.log(
        `Database connected successfully. Total records: ${result.count}`
      );
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
