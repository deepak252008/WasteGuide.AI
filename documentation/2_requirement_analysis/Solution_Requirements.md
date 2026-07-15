# Solution Requirements

## 1. Functional Requirements (FR)

- **FR-1: Waste Scanner Input**: The application must provide a text input field and 12 quick-select chips (e.g., Plastic Bottle, Paint Can) to populate and trigger waste scans without page reloads.
- **FR-2: AI-Powered Classification**: The backend must process the item and return a structured JSON response specifying category (one of 8 standard categories), recyclability, hazard warning, 4-step instructions, and 3 eco-suggestions.
- **FR-3: Interactive Mapping**: A map page using Leaflet.js and OpenStreetMap must render color-coded pins based on facility type, showing address, contact hours, accepted wastes, and distance.
- **FR-4: History Management**: Scans must be auto-saved and retrievable on a History page sorted chronologically. Users must be able to search past entries in real-time.
- **FR-5: Analytics Visualization**: A telemetry dashboard must display total scans, recycle rate, and render three charts (doughnut, line, bar) from aggregated backend data.
- **FR-6: Demo Mode Fallback**: The app must detect missing Firebase configurations and provide a "LAUNCH DEMO MODE" bypass. The backend must support in-memory state persistence for evaluation.

---

## 2. Non-Functional Requirements (NFR)

- **NFR-1: Usability (Aesthetics)**: The user interface must employ a dark-green terminal-inspired civic aesthetic, leveraging customized color palettes and modern monospace typography.
- **NFR-2: Responsiveness**: Layouts must dynamically scale across Mobile (single column), Tablet (2-column grid), and Desktop (split screen panels).
- **NFR-3: Cost Efficiency**: Leaflet.js and OpenStreetMap must be configured to bypass expensive mapping APIs (like Google Maps API keys).
- **NFR-4: Error Resilience**: The backend must handle Groq API and Firestore communication failures gracefully, returning local mock rules rather than crashing.
