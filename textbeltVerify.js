// Textbelt OTP helpers (no signup needed: key "textbelt" = 1 free SMS/day).
// Put a paid key in EXPO_PUBLIC_TEXTBELT_KEY for more.
const KEY = process.env.EXPO_PUBLIC_TEXTBELT_KEY || 'textbelt';

export async function sendOtp(phone) {
  const res = await fetch('https://textbelt.com/otp/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      phone,
      userid: phone,
      key: KEY,
      message: 'Your verification code is $OTP',
      lifetime: '300',
      length: '6',
    }).toString(),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(
      data.error || 'Could not send OTP (free daily quota may be used up, or number unsupported).'
    );
  }
  return data;
}

export async function checkOtp(phone, code) {
  const url =
    'https://textbelt.com/otp/verify?' +
    new URLSearchParams({ otp: code, userid: phone, key: KEY }).toString();
  const res = await fetch(url);
  const data = await res.json();
  return data.success === true && data.isValidOtp === true;
}
