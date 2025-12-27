const Database = require('better-sqlite3');
const db = new Database('inventory.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT,
    name TEXT,
    category TEXT,
    quantity INTEGER,
    reorderLevel INTEGER,
    unitPrice INTEGER,
    lastSold TEXT
  )
`).run();

module.exports = db;
