# Project Executable Files

Below is the directory map of the critical files that control backend logic, compile layouts, and manage database records:

| File Path | Description | Languages / Tool |
| :--- | :--- | :--- |
| [backend/app.py](file:///d:/SWMAUG/backend/app.py) | Entry point of the server, registering blueprints and configuring CORS. | Python (Flask) |
| [backend/firebase_config.py](file:///d:/SWMAUG/backend/firebase_config.py) | Handshakes with Firebase Admin credentials or triggers in-memory fallback. | Python (Firebase SDK) |
| [backend/routes/waste.py](file:///d:/SWMAUG/backend/routes/waste.py) | Formulates LLM prompts, sanitizer buffers, and keyword rules database. | Python (Groq SDK) |
| [backend/routes/history.py](file:///d:/SWMAUG/backend/routes/history.py) | Handles DB logs write/read queries and aggregates statistics array structures. | Python (Firestore SDK) |
| [backend/routes/centers.py](file:///d:/SWMAUG/backend/routes/centers.py) | Houses geographical data arrays for Hyderabad centers and coordinates filters. | Python |
| [frontend/src/App.jsx](file:///d:/SWMAUG/frontend/src/App.jsx) | Handles layout wrapping and sets routing directories. | JavaScript (React Router) |
| [frontend/src/context/AuthContext.jsx](file:///d:/SWMAUG/frontend/src/context/AuthContext.jsx) | Manages authentication states and bypass switches. | JavaScript (React Context) |
| [frontend/src/api.js](file:///d:/SWMAUG/frontend/src/api.js) | Handles API requests and injects the authorization header. | JavaScript (Axios) |
| [frontend/src/index.css](file:///d:/SWMAUG/frontend/src/index.css) | Customizes dark green terminal styling variables. | CSS (Tailwind v4) |
| [frontend/src/pages/Home.jsx](file:///d:/SWMAUG/frontend/src/pages/Home.jsx) | Hosts search fields, status queues, and renders scan result cards. | JavaScript (React) |
| [frontend/src/pages/Map.jsx](file:///d:/SWMAUG/frontend/src/pages/Map.jsx) | Initializes Leaflet canvas map structures and binds list clicks to popups. | JavaScript (Leaflet API) |
| [frontend/src/pages/History.jsx](file:///d:/SWMAUG/frontend/src/pages/History.jsx) | Renders collapsible scan cards and processes text filters. | JavaScript (React) |
| [frontend/src/pages/Dashboard.jsx](file:///d:/SWMAUG/frontend/src/pages/Dashboard.jsx) | Renders summary metric cards and binds canvas nodes to Chart.js. | JavaScript (Chart.js) |
