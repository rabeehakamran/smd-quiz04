// Twilio Verify REST API helpers.
// NOTE: credentials come from EXPO_PUBLIC_* env vars (see .env.example).
// Fine for a quiz/demo; in production call Twilio from your own backend.
const SID = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID;
const TOKEN = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN;
const SERVICE = process.env.EXPO_PUBLIC_TWILIO_VERIFY_SERVICE_SID;

const BASE = `https://verify.twilio.com/v2/Services/${SERVICE}`;
const authHeader = () => 'Basic ' + btoa(`${SID}:${TOKEN}`);

async function post(path, params) {
  if (!SID || !TOKEN || !SERVICE) {
    throw new Error('Twilio credentials missing. Check your .env file.');
  }
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Twilio request failed');
  return data;
}

export const sendOtp = (phone) => post('Verifications', { To: phone, Channel: 'sms' });

export const checkOtp = async (phone, code) => {
  const data = await post('VerificationCheck', { To: phone, Code: code });
  return data.status === 'approved';
};
