// Firebase Phone Auth via @react-native-firebase (modular API, needs a dev build)
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';

let confirmation = null;

export async function sendOtp(phone) {
  try {
    confirmation = await signInWithPhoneNumber(getAuth(), phone);
  } catch (e) {
    throw new Error(e.message || 'Could not send OTP');
  }
}

export async function checkOtp(_phone, code) {
  if (!confirmation) throw new Error('Request an OTP first');
  try {
    await confirmation.confirm(code);
    return true;
  } catch (e) {
    if (e.code === 'auth/invalid-verification-code') return false;
    throw new Error(e.message || 'Verification failed');
  }
}