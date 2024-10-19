import { MongoClient, Db } from "mongodb";
import { config } from "./config";

let db: Db;

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(config.mongoUri);
    db = client.db(config.dbName);
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
