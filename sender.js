// Sends SMS through an HTTP gateway if one is configured,
// otherwise it only prints the message to the console.
//
// Environment variables:
//   SMS_API_URL     the gateway's send endpoint
//   SMS_API_KEY     your API key
//   SMS_SENDER_ID   your approved sender id
//
// NOTE: parameter names differ between providers.
// Check your provider's documentation and adjust the lines marked below.

const API_URL = process.env.SMS_API_URL;
const API_KEY = process.env.SMS_API_KEY;
const SENDER_ID = process.env.SMS_SENDER_ID || '';

// 01XXXXXXXXX -> 8801XXXXXXXXX
const toIntl = phone => (phone.startsWith('01') ? '88' + phone : phone);

async function sendSms(to, text) {
  if (!API_URL || !API_KEY) {
    console.log(`[SMS not sent: no gateway configured -> ${to}] ${text}`);
    return;
  }

  const url = new URL(API_URL);
  url.searchParams.set('api_key', API_KEY);       // adjust to your provider
  url.searchParams.set('senderid', SENDER_ID);    // adjust to your provider
  url.searchParams.set('number', toIntl(to));     // adjust to your provider
  url.searchParams.set('message', text);          // adjust to your provider

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const body = await res.text();
  if (!res.ok) throw new Error(`SMS gateway HTTP ${res.status}: ${body.slice(0, 200)}`);
  console.log('SMS gateway response:', body.slice(0, 200));
}

module.exports = { sendSms };