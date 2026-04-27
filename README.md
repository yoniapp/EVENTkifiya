# Eventix: Premium Event Ticketing System

![Eventix Banner](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=400)

## 🎯 The Vision
**Eventix** is a high-performance, mobile-first event ticketing ecosystem designed for the modern era. It combines a brutalist, minimalist aesthetic with industrial-grade reliability. The goal is simple: to provide a seamless bridge between event creators and fans, ensuring that "getting in" is as smooth as the event itself.

Whether it's a concert, a tech summit, or an underground gallery opening, Eventix handles the complex logistics of identity, payment, and access control so you can focus on the production.

---

## 🚀 Key Features

### 💎 For Attendees
- **Secure Vault**: Access your tickets anywhere, anytime. No more digging through emails.
- **Biometric-Ready Login**: Instant access via Google OAuth.
- **Fast Checkout**: Integrated with Chapa for secure, local ETB payments.
- **Dynamic QR Access**: Unique encrypted tickets that evolve with the event status.

### 🛠 For Organizers
- **Production Dashboard**: Track revenue, ticket sales, and platform health in real-time.
- **Asset Launchpad**: Create multi-tier event listings (Regular, VIP, Early Bird).
- **Gate Validation**: A high-speed, browser-based QR scanner for instant entry control.
- **Revenue Analytics**: Visual breakdown of platform performance.

### 🛡 For Admins
- **Full Spectrum Visibility**: Monitor all events and platform metrics.
- **System Integrity**: Built-in protection against ticket duplication and fraud.

---

## 📂 Project Structure: The Blueprint

Here is a deep dive into the engine room of Eventix:

### 🌍 Root Configuration
- **`server.ts`**: The backbone. A Node.js/Express server that acts as the bridge for Chapa Payment APIs, Webhooks, and serves the Vite production build.
- **`firebase-blueprint.json`**: The Source of Truth for the data model. Defines the structure of Events, Users, and Bookings.
- **`firestore.rules`**: The security layers. Hardened rules that ensure only owners can edit events and users can only view their own tickets.
- **`index.html`**: The UI entry point, optimized for SEO and pre-loading the Chapa Payment SDK.
- **`vite.config.ts`**: High-performance build configuration for React.

### ⚛️ Frontend (`/src`)
- **`App.tsx`**: The nervous system. Manages routing, global state, and authentication synchronization.
- **`pages/`**:
  - `Home.tsx`: The landing experience.
  - `Dashboard.tsx`: Personal command center for users and organizers.
  - `EventDetails.tsx`: The high-conversion sales page with integrated Chapa Popup.
  - `CreateEvent.tsx`: Wizard for launching new productions.
  - `ValidateTicket.tsx`: Real-time QR scanning engine.
  - `Tickets.tsx`: The digital vault for attendees.
- **`components/`**:
  - `Navbar.tsx`: High-contrast navigation.
  - `TicketCard.tsx`: Reusable component for ticket visualization.
  - `ProtectedRoute.tsx`: Auth guard for securing sensitive views.
- **`lib/`**:
  - `firebase.ts`: Initialization and service export for the Firebase SDK.
  - `utils.ts`: Global helpers for styling and data formatting.
- **`types.ts`**: Collective definitions for the entire application, ensuring strict type safety.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 + Vite |
| **Backend** | Express (Node.js) |
| **Database** | Firebase Firestore (NoSQL) |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Styling** | Tailwind CSS 4 (Utility-first) |
| **Animation** | Motion (Fluid transitions) |
| **QR Scanning** | Html5-QRCode (Browser-based) |
| **Payments** | Chapa (Ethopian Gateway) |

---

## 🔐 Security Framework
Eventix implements a **Zero-Trust** security model:
1. **Relational Sync**: Sub-collections (like bookings) are validated against parent documents (events).
2. **Identity Poisoning Guard**: Strict ID validation to prevent resource injection attacks.
3. **Action-Based Updates**: Only specific fields can be updated during certain actions (e.g., scanning a ticket only updates `isUsed`).
4. **Server-Side Validation**: All payments are verified via secret keys on the backend before tickets are minted.

---

## 📦 Local Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Follow the details in `.env.example`. You will need Firebase credentials and Chapa API keys.

3. **Development Command**:
   ```bash
   npm run dev
   ```

4. **Production Command**:
   ```bash
   npm run build
   npm start
   ```

---

## 🤝 Open Source & Contributions
Eventix is built on the belief that access should be open. We welcome contributions that improve the security, performance, or accessibility of the platform.

---

## 👨‍💻 Author
**Yonas Muluegeta**
- 📧 Email: [yoniwin.yw@gmail.com](mailto:yoniwin.yw@gmail.com)
- 📱 Phone: [+251 939 680 725](tel:+251939680725)

**Eventix: Launch your next production with confidence.**
