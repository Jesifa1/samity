const fs = require('fs');
const path = require('path');
const db = require('./db');

const KEEP = 7; // keep only the newest 7 backups

async function backupDb(dir = 'backups') {
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(dir, `samity-${stamp}.db`);
  await db.backup(file);

  // delete older backups beyond the newest KEEP
  const old = fs.readdirSync(dir)
    .filter(f => /^samity-.*\.db$/.test(f))
    .sort()
    .reverse()
    .slice(KEEP);
  for (const f of old) fs.rmSync(path.join(dir, f));

  return file;
}

module.exports = { backupDb };

// Run directly: node backup.js
if (require.main === module) {
  backupDb()
    .then(f => console.log('Backup saved:', f))
    .catch(e => { console.error('Backup failed:', e.message); process.exit(1); });
}