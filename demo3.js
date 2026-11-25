const db = require('./db');
const { queueReminders, processOutbox } = require('./outbox');
const { sendSms } = require('./sender');

(async () => {
  console.log('--- Run 1 ---');
  console.log('queued:', queueReminders('2026-12-01'));
  console.log('sent  :', await processOutbox(sendSms));

  console.log('\n--- Run 2 (ekoi din, dedupe check) ---');
  console.log('queued:', queueReminders('2026-12-01'));
  console.log('sent  :', await processOutbox(sendSms));

  console.log('\n--- Outbox ---');
  console.table(db.prepare(
    'SELECT id, kind, to_phone, status, attempts, dedupe_key FROM sms_outbox').all());
})();