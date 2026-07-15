# WasteGuide AI

Sustainable Waste Management Assistant Using Generative AI. A full-stack civic application designed for urban residents of Hyderabad to identify waste items, obtain disposal guidance, locate nearby collection centers, and track recycling metrics.

## Key Features

1. **AI Waste Classification**: Scan waste items to classify them into standard categories. Uses a local static database fallback by default, and `llama-3.3-70b-versatile` via Groq API when configured.
2. **Disposal Protocols**: Step-by-step recycling processes, hazard warning sheets, and alternative reuse suggestion lists.
3. **Interactive Collection Map**: View nearby centers with color-coded markers based on facility type, powered by Leaflet.js and OpenStreetMap.
4. **Scan History log**: Trace past scans collapsibly with search filtering.
5. **Metrics Telemetry Dashboard**: Aggregate statistics (Total Scans, Recycle Rate) and charts (doughnut, line, bar) powered by Chart.js.

---

## Local Deployment Instructions

### Prerequisite Checklist
- **Python**: v3.9 or higher (with pip)
- **Node.js**: v18 or higher (with npm)

---

### Step 1: Run Flask Backend (Terminal 1)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate the virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install backend packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python app.py
   ```
   *The Flask backend will start running on **http://localhost:5000**. Verify it is running by visiting [http://localhost:5000/api/health](http://localhost:5000/api/health) which should return `{"status": "ok"}`.*

---

### Step 2: Run React Frontend (Terminal 2)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The Vite frontend will start running on **http://localhost:5173**. Open this URL in your web browser.*

---

## Demo Mode Fallback

If Firebase is not configured, both the frontend and backend automatically run in **Demo Mode**:
- Clicking **LAUNCH DEMO MODE** on the login page bypasses auth constraints.
- Scan history records are stored in Flask backend memory for the current session.
- AI scanning falls back to a smart, local rules-based engine if `GROQ_API_KEY` is not present in `backend/.env`.
