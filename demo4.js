const fs = require('fs');
fs.rmSync('samity.db', { force: true });

const db = require('./db');
const { createLoan } = require('./loans');
const { assessFines, receiveFine } = require('./fines');

db.prepare('INSERT INTO members (name, phone) VALUES (?,?)').run('Karim', '01800000000');
const loan = createLoan({
  memberId: 1, principal: 5000, interestRate: 10,
  installments: 5, frequency: 'WEEKLY', startDate: '2026-10-01',
});

console.log('Fine run 1:', assessFines('2026-11-03'));
console.log('Fine run 2 (same day):', assessFines('2026-11-03'));

console.table(db.prepare(`
  SELECT i.seq, i.due_date, ROUND(SUM(f.amount),2) AS fine
  FROM fines f JOIN installments i ON i.id = f.installment_id
  GROUP BY i.id ORDER BY i.seq`).all());

console.log('Pay fine 150:', receiveFine({ loanId: loan, amount: 150, date: '2026-11-03' }));

try { receiveFine({ loanId: loan, amount: 999, date: '2026-11-03' }); }
catch (e) { console.log('OK overpay ->', e.message); }