# Solution Architecture

The software architecture follows a decoupled **Client-Server Single-Page Application (SPA)** model. The frontend browser code communicates with our custom Flask backend via REST APIs, acting as the sole integration gateway.

```
                  ┌──────────────────────────────────────────────┐
                  │            Client Browser (React)            │
                  │   (Leaflet.js client-side maps, Chart.js)    │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         │ HTTPS REST Requests
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Flask Backend (Python)            │
                  │        (Authentication & Route APIs)         │
                  └──────┬───────────────────────┬───────────────┘
                         │                       │
                         │ HTTPS API Calls       │ Firebase Admin SDK
                         ▼                       ▼
            ┌─────────────────────────┐     ┌─────────────────────────┐
            │        Groq Cloud       │     │    Firebase Cloud DB    │
            │ (Llama-3.3-70b-versatile)│     │  (Firestore, Auth APIs) │
            └─────────────────────────┘     └─────────────────────────┘
```

---

## Architectural Components

### 1. Presentation Layer (Vite + React.js Client)
- Responsible for all UI rendering, state management, and Leaflet map tile rendering.
- Prevents direct exposure of keys by never communicating directly with third-party servers (Groq, Firebase Admin).

### 2. Integration Layer (Flask API Gateway)
- Runs on port 5000. It coordinates incoming user actions, parses prompt envelopes, sanitizes output syntax, and handles local database simulation during failures.

### 3. AI & Data Layer
- **Groq Cloud API**: Serves classification results using `llama-3.3-70b-versatile`.
- **Firebase Firestore**: Stores user document metadata and scan logs.
- **In-memory cache**: Serves as a stateless local database fallback for testing.
