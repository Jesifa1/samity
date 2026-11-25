const fs = require('fs');
fs.rmSync('samity.db', { force: true }); // age purono DB muche felo

const db = require('./db');
const { createLoan } = require('./loans');
const { receivePayment } = require('./payments');
const { overdue, loanSummary } = require('./queries');

// Member
db.prepare('INSERT INTO members (name, phone) VALUES (?,?)').run('Rahim', '01700000000');
const memberId = db.prepare('SELECT id FROM members').get().id;

// Loan 1: 10000 taka, 10% sud, 10 saptahik kisti
const loan1 = createLoan({
  memberId, principal: 10000, interestRate: 10,
  installments: 10, frequency: 'WEEKLY', startDate: '2026-11-01',
});

console.log('--- installment schedule (Loan 1) ---');
console.table(db.prepare(
  'SELECT seq, due_date, amount_due FROM installments WHERE loan_id=?').all(loan1));

console.log('--- Payment 1 & 2 ---');
console.log(receivePayment({ loanId: loan1, amount: 1100, date: '2026-11-08' }));
console.log(receivePayment({ loanId: loan1, amount: 1500, date: '2026-11-15' }));

console.log('--- Summary ---');
console.log(loanSummary(loan1));

console.log('--- Overdue (2026-12-01) ---');
console.table(overdue('2026-12-01'));

// Error case-gulo: shob-ta error dewa uchit
console.log('--- Error test ---');
for (const bad of [99999, -50, 0]) {
  try {
    receivePayment({ loanId: loan1, amount: bad, date: '2026-11-20' });
    console.log('FAIL: No error thrown, amount =', bad);
  } catch (e) {
    console.log(`OK  amount=${bad}  ->  ${e.message}`);
  }
}

// Loan 2: ek payment-e shesh, status CLOSED hoy ki na
const loan2 = createLoan({
  memberId, principal: 1000, interestRate: 10,
  installments: 2, frequency: 'WEEKLY', startDate: '2026-11-01',
});
receivePayment({ loanId: loan2, amount: 1100, date: '2026-11-02' });
console.log('--- Loan 2 (full payment) ---');
console.log(loanSummary(loan2));