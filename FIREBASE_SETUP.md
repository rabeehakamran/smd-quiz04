# Firebase setup
1. console.firebase.google.com -> Add project -> Build -> Authentication -> Get started -> Sign-in method -> Phone -> Enable.
2. Project settings -> Add app -> Android, package name: com.rabeeha.otpverification -> download google-services.json -> put in project root.
3. `npm install -g eas-cli`, `eas login`, `eas build:configure` (if asked), then
   `eas build --profile development --platform android`
4. Install the APK on your phone, then `npx expo start --dev-client` and open the app.
5. For SMS to real numbers: add SHA-1 + SHA-256 of the build (eas credentials -> Android -> keystore, or `eas credentials`) under Project settings -> your Android app -> Add fingerprint.
