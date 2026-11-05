# OTP Phone Verification (React Native / Expo + Twilio Verify)

Enter phone number -> receive SMS OTP -> enter OTP -> success/failure message.

## Run
1. `npm install`
2. `cp .env.example .env` and fill in your Twilio Account SID, Auth Token, Verify Service SID
3. `npx expo start` and open in Expo Go (scan QR)

Trial Twilio accounts can only SMS *verified* numbers (add yours under Twilio Console -> Verified Caller IDs).
