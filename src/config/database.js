const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const configuredPath = process.env.DATABASE_PATH || "./database/attendance.db";
const databasePath = path.resolve(process.cwd(), configuredPath);
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    qr_token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL UNIQUE,
    checked_in_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
  );
`);

module.exports = db;
