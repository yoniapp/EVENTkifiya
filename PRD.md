# Product Requirements Document (PRD): Eventix

## 1. Product Vision
**Eventix** is a premium, streamlined event management and ticketing platform designed to bridge the gap between event organizers and attendees. It focuses on clean aesthetics, secure transactions via the Chapa platform, and instant mobile-based ticket validation.

---

## 2. Target Audience
- **Organizers**: Artists, concert promoters, and event managers who need a reliable brand-first platform to sell tickets.
- **Attendees**: Fans and event-goers looking for a friction-less mobile booking experience.
- **Admins**: System managers overseeing platform health and security.

---

## 3. Core Features

### 3.1 Authentication & Profile
- **Google OAuth**: Fast, secure login via Firebase.
- **Role-Based Access**: Automatic distinction between `USER`, `ORGANIZER`, and `ADMIN`.
- **Digital Vault**: A dedicated section for users to store and view their purchased tickets.

### 3.2 Event Discovery & Management
- **Minimalist Homepage**: Featured events with high-impact visuals.
- **Real-time Availability**: Automatic "Sold Out" status indicators.
- **Production Asset Creation**: Organizers can launch events with multiple ticket tiers (Regular, VIP, etc.).

### 3.3 Secure Payment Pipeline
- **Chapa Integration**: Support for ETB payments using the Chapa Inline Popup for a seamless checkout flow.
- **Webhook Handling**: Server-side verification of payment status before ticket issuance.
- **Automated Issuance**: Digital tickets are generated and stored in the user's account immediately after successful payment.

### 3.4 On-Site Validation
- **QR Code Generation**: Unique encrypted identifiers for every ticket.
- **Mobile Scanner**: In-app QR scanner for organizers to validate attendee entry in real-time.
- **Status Tracking**: Prevents double-entry by marking tickets as "Used" upon scan.

---

## 4. Technical Requirements
- **Performance**: Mobile-first architecture with sub-2 second load times.
- **Security**: 
    - Firebase Security Rules for data isolation.
    - Server-side payment validation to prevent request tampering.
- **Real-time**: Firestore listeners for live updates on ticket availability and scanned status.

---

## 5. Success Metrics
- **Conversion Rate**: Percentage of users who complete the Chapa checkout flow.
- **Validation Speed**: Average time taken to scan and verify a ticket at an event gate.
- **User Growth**: Number of organizers registered and events launched.

---

## 6. Future Roadmap
- **AI Analytics**: Predictive insights on event turnout.
- **Social Integration**: Ability to share "Going" status and invite friends.
- **Multi-currency Support**: Expanding beyond ETB for international events.

---

**Eventix: The New Standard for Digital Access.**
