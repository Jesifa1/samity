const { receivePayment } = require('./payments');
const { overdue } = require('./queries');
const { paymentSms, reminderSms } = require('./sms');
const { makeReceipt } = require('./receipt');
const { queuePaymentSms, processOutbox } = require('./outbox');
const { sendSms } = require('./sender');

(async () => {
  // Notun ekta payment: Loan 1-e 1100
  const res = receivePayment({ loanId: 1, amount: 1100, date: '2026-11-22' });
  console.log('Payment:', res);

  // Payment SMS
  console.log('\n--- Payment SMS ---');
  console.log(paymentSms(res));

  // ...
queuePaymentSms(res);
await processOutbox(sendSms);

  // PDF receipt
  const file = await makeReceipt(res.txId);
  console.log('\nReceipt saved:', file);

  // Reminder SMS (bokeya shobar jonno)
  console.log('\n--- Reminder SMS ---');
  overdue('2026-12-01').forEach(row => console.log(reminderSms(row)));
})();