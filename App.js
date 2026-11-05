import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as twilio from './twilioVerify';
import * as textbelt from './textbeltVerify';
import * as firebase from './firebaseVerify';

// Choose provider via .env: EXPO_PUBLIC_OTP_PROVIDER=firebase | twilio | textbelt
const providers = { twilio, textbelt, firebase };
const provider = providers[process.env.EXPO_PUBLIC_OTP_PROVIDER] || firebase;
const { sendOtp, checkOtp } = provider;

export default function App() {
  const [step, setStep] = useState('phone'); // phone | otp | result
  const [phone, setPhone] = useState('+92');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    setError('');
    if (!/^\+\d{10,15}$/.test(phone.trim())) {
      setError('Enter number in international format, e.g. +923001234567');
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone.trim());
      setStep('otp');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    if (code.length < 4) {
      setError('Enter the OTP you received');
      return;
    }
    setLoading(true);
    try {
      const approved = await checkOtp(phone.trim(), code.trim());
      setSuccess(approved);
      if (!approved) setError('Incorrect or expired OTP. Try again.');
      else setStep('result');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('phone'); setCode(''); setError(''); setSuccess(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={s.title}>Phone Verification</Text>

        {step === 'phone' && (
          <>
            <Text style={s.label}>Phone number</Text>
            <TextInput
              style={s.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+923001234567"
              autoFocus
            />
            <Button title="Send OTP" onPress={handleSend} loading={loading} />
          </>
        )}

        {step === 'otp' && (
          <>
            <Text style={s.label}>Enter the OTP sent to {phone}</Text>
            <TextInput
              style={[s.input, s.otp]}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="------"
              autoFocus
            />
            <Button title="Verify OTP" onPress={handleVerify} loading={loading} />
            <TouchableOpacity onPress={handleSend} disabled={loading}>
              <Text style={s.link}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset}>
              <Text style={s.link}>Change number</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'result' && (
          <View style={s.center}>
            <Text style={s.big}>{success ? '✅' : '❌'}</Text>
            <Text style={[s.msg, { color: success ? '#15803d' : '#b91c1c' }]}>
              {success ? 'Phone number verified successfully!' : 'Verification failed'}
            </Text>
            <Button title="Start over" onPress={reset} />
          </View>
        )}

        {!!error && step !== 'result' && <Text style={s.error}>{error}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Button({ title, onPress, loading }) {
  return (
    <TouchableOpacity style={s.btn} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{title}</Text>}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
  label: { fontSize: 15, color: '#334155', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1',
    borderRadius: 10, padding: 14, fontSize: 18, marginBottom: 16,
  },
  otp: { textAlign: 'center', letterSpacing: 8, fontSize: 24 },
  btn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16, fontSize: 15 },
  error: { color: '#b91c1c', marginTop: 16, textAlign: 'center' },
  center: { alignItems: 'center' },
  big: { fontSize: 64, marginBottom: 12 },
  msg: { fontSize: 20, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
});
