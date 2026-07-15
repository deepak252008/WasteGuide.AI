# Technology Stack

We selected a lightweight, highly compatible open-source stack that fulfills all project constraints without requiring expensive enterprise licenses:

## 1. Frontend Technologies

- **Vite + React.js**: Lightweight single-page application framework offering rapid hot-reloads and optimized roll-up builds.
- **Tailwind CSS v4**: Utility-first CSS compiling theme properties via modern CSS variables directly for lightning-fast styling.
- **React Router Dom**: Standard client-side routing provider supporting state-preserved page navigation.
- **Axios**: HTTP request client containing request/response interceptors to automate header injections.
- **Leaflet.js + OpenStreetMap**: Lightweight open-source mapping engine that displays customized regional directories without requiring premium Google Maps developer keys.
- **Chart.js + react-chartjs-2**: High-performance HTML5 canvas charting container.

---

## 2. Backend Technologies

- **Flask (Python)**: Flexible micro-framework managing routing tables and API schemas.
- **Flask-CORS**: Cross-origin policy config to enable requests from the frontend server (port 5173).
- **Groq SDK**: Python client to connect with Groq Cloud, running `llama-3.3-70b-versatile` at high speeds.
- **Firebase Admin SDK**: Official administrative library managing authentication, user details, and Firestore logs.
- **python-dotenv**: Environment variable loader to protect keys in local development.

---

## 3. Database & Services

- **Firebase Firestore**: Real-time cloud NoSQL document store.
- **Firebase Auth**: Secure client login and registration using Email/Password.
- **Demo Mode fallback**: In-memory list array caches on the server when database systems are unconfigured.
