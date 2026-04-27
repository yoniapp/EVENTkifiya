# Eventix: Step-by-Step Developer Guide

Welcome to **Eventix**, a high-performance event ticketing platform built for speed, security, and seamless user experience. This guide will help you set up the project locally, understand the architecture, and contribute to the codebase.

---

## 🚀 The Tech Stack

Eventix is a full-stack application built with the following modern technologies:

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore + Firebase Authentication)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Payments**: [Chapa](https://chapa.co/) (Ethiopian Payment Gateway)
- **QR Engine**: [html5-qrcode](https://github.com/mebjas/html5-qrcode) & [qrcode.react](https://github.com/zpao/qrcode.react)

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Firebase project (for Auth and Firestore)
- A Chapa account (for payment keys)

---

## 📥 Setup Instructions

### 1. Download & Prepare
Clone the repository or download the source code:
```bash
# Clone the repository
git clone <your-repo-url>
cd eventix
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`. You will need to fill in your specific keys:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Chapa Keys
CHAPA_SECRET_KEY=CHAPUSE-your-secret-key  # Used in server.ts
VITE_CHAPA_PUBLIC_KEY=CHAPUBK-your-public-key  # Used for client-side popup
```

### 4. Initialize Firebase Admin (Optional but recommended for full server features)
Download your service account key from the Firebase Console and save it as `serviceAccountKey.json` in the root (ensure this is in your `.gitignore`).

---

## 💻 Running the App

### Development Mode
Runs the frontend and backend concurrently using `tsx`:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure: What does what?

| Folder/File | Purpose |
| :--- | :--- |
| `server.ts` | The entry point for the Express backend. Handles payment initializations and webhooks. |
| `src/main.tsx` | Frontend entry point. |
| `src/App.tsx` | Main routing logic and Layout wrapper. |
| `src/pages/` | Individual views (Home, Dashboard, EventDetails, CreateEvent, etc.). |
| `src/components/` | Reusable UI components (Navbar, ProtectedRoute, TicketCard, etc.). |
| `src/lib/` | Utility functions and client-side Firebase initialization. |
| `src/types.ts` | Shared TypeScript interfaces for Events, Users, and Bookings. |
| `index.html` | The HTML wrapper (includes the Chapa SDK script). |

---

## 🎨 Design Philosophy
Eventix uses a **Minimalist Brutalist** aesthetic:
- **Typography**: Heavy blacks, high contrast, tracking-tighter headlines.
- **Micro-interactions**: Subtle motion using `motion/react` for card hovers and page transitions.
- **Responsive**: Mobile-first design for scanning tickets at event gates.

---

## 📄 License
This project is open-source. Feel free to fork, modify, and use it for your own events!

**Eventix - Launch your next production with confidence.**
