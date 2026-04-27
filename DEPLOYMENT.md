# Deployment Guide: Eventix

Because Eventix uses a **Full-Stack (Express + React)** architecture, your deployment strategy depends on which hosting provider you choose.

---

## 1. Your Firebase Configuration (Netlify Ready)
Copy these key-value pairs into your hosting provider's environment variables dashboard:

```text
VITE_FIREBASE_API_KEY=AIzaSyCVQs_xOH9v8-P6nEiyiCQ8Js-7gqq4qg8
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0317283914.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0317283914
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0317283914.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=512709778550
VITE_FIREBASE_APP_ID=1:512709778550:web:442823c61a52cbb6bc1357
VITE_FIREBASE_FIRESTORE_DATABASE_ID=ai-studio-3cfba27b-9a52-4185-a7ec-44a65fb45c3f
VITE_CHAPA_PUBLIC_KEY=YOUR_CHAPA_PUBLIC_KEY
CHAPA_SECRET_KEY=YOUR_CHAPA_SECRET_KEY
```

---

## 2. Enabling Google Login for Production
For the "Login with Google" button to work on your deployed site:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Go to **Authentication** > **Settings** > **Authorized domains**.
3. Add your production domain (e.g., `eventix-app.netlify.app`).

---

## 3. Option A: Render or Railway (Recommended for Full-Stack)
These platforms run your `server.ts` as a long-running process, which allows Chapa Webhooks and server-side payment initialization to work correctly.

1. **Connect GitHub**: Point to your repository.
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Ports**: Ensure the platform uses port `3000`.

---

## 4. Option B: Netlify (Frontend Focus)
Netlify is great for the UI. Since the app is built with Vite, follow these exact settings:

1. **Build Settings**:
   - `Build command`: `npm run build`
   - `Publish directory`: `dist`
2. **Environment Variables**:
   You **MUST** add these in Netlify (Site settings > Environment variables):
   - `VITE_FIREBASE_API_KEY`: (Your key)
   - `VITE_FIREBASE_AUTH_DOMAIN`: (Your domain)
   - `VITE_FIREBASE_PROJECT_ID`: (Your project ID)
   - `VITE_FIREBASE_STORAGE_BUCKET`: (Your bucket)
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: (Your sender ID)
   - `VITE_FIREBASE_APP_ID`: (Your app ID)
   - `VITE_CHAPA_PUBLIC_KEY`: (Your Chapa Public Key)
3. **Backend Requirement**: 
   The `server.ts` file handles the payment initialization and secret key logic. Standard Netlify hosting does NOT run this file. 
   - To make payments work on Netlify, you would need to move the logic from `server.ts` (specifically the `/api/v1/payments/initialize` endpoint) into **Netlify Functions**.
   - Alternatively, host the backend (the `server.ts` part) on a service like **Render** or **Railway** and point your frontend to it.
4. **SPA Redirection**: 
   I've created `public/_redirects`. This ensures that when you refresh the page or navigate directly to a sub-page (like `/dashboard`), Netlify serves `index.html` and let React Router handle the routing.

---

## 4. Option C: Google Cloud Run (AI Studio Default)
This app is currently configured for Cloud Run. To deploy it there yourself:
1. Ensure your `package.json` "start" script is set to `node server.ts`.
2. Use a `Dockerfile` to build and serve the app.

---

## 5. Firebase Console Link
Your project can be managed here:
[https://console.firebase.google.com/project/gen-lang-client-0317283914](https://console.firebase.google.com/project/gen-lang-client-0317283914)

---

**Yonas, your app is now ready for the world! Remember to keep your Secret Keys private.**
