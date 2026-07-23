import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

let prisma;

try {
  if (process.env.VERCEL) {
    const srcDb = path.join(process.cwd(), "prisma", "dev.db");
    const tmpDb = "/tmp/dev.db";
    if (fs.existsSync(srcDb) && !fs.existsSync(tmpDb)) {
      try {
        fs.copyFileSync(srcDb, tmpDb);
        process.env.DATABASE_URL = "file:/tmp/dev.db";
      } catch (e) {
        console.error("Failed to copy dev.db to /tmp:", e);
      }
    } else if (fs.existsSync(tmpDb)) {
      process.env.DATABASE_URL = "file:/tmp/dev.db";
    }
  }
  prisma = new PrismaClient({ log: ["error"] });
} catch (e) {
  console.error("PrismaClient initialization error:", e);
  prisma = new PrismaClient();
}

export default prisma;
