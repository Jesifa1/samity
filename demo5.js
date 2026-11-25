const fs = require('fs');
fs.rmSync('samity.db', { force: true });

const db = require('./db');
const { createLoan } = require('./loans');
const { receivePayment } = require('./payments');
const { monthlyCollection, trialBalance } = require('./reports');

db.prepare('INSERT INTO members (name, phone) VALUES (?,?)').run('Karim', '01800000000');
const loan = createLoan({
  memberId: 1, principal: 5000, interestRate: 10,
  installments: 5, frequency: 'WEEKLY', startDate: '2026-10-01',
});

receivePayment({ loanId: loan, amount: 1100, date: '2026-10-10' });
receivePayment({ loanId: loan, amount: 550, date: '2026-11-03' });

console.log('--- October ---');
console.log(monthlyCollection('2026-10'));
console.log('--- November ---');
console.log(monthlyCollection('2026-11'));
console.log('--- December (empty) ---');
console.log(monthlyCollection('2026-12').totals);
console.log('--- Trial balance ---');
const tb = trialBalance();
console.table(tb.rows);
console.log(tb.totals, 'balanced:', tb.balanced);