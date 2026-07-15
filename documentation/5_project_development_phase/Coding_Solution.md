# Coding & Solution

The final software implementation is structured as follows:

## 1. Key Source Code Directory Structure

```text
WASTEGUIDE/
├── backend/
│   ├── routes/
│   │   ├── centers.py         # Static Hyderabad geolocations & search logic
│   │   ├── history.py         # DB CRUD & telemetry calculations
│   │   └── waste.py           # Groq prompt compilation & local fallback matching
│   ├── app.py                 # Flask server initialization & CORS mapping
│   └── firebase_config.py     # Firebase configuration gate with Demo Mode switch
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable presentation layout tags
│   │   ├── context/
│   │   │   └── AuthContext.jsx# React context bridging Auth SDK with Demo mode
│   │   ├── pages/             # Route-specific views
│   │   │   ├── Home.jsx       # Waste scanner search and result cards
│   │   │   ├── Map.jsx        # Leaflet geolocator maps
│   │   │   ├── History.jsx    # Searchable list logs
│   │   │   └── Dashboard.jsx  # Chart.js analytics graphs
│   │   ├── api.js             # Axios client containing token injection
│   │   ├── App.jsx            # SPA routing table
│   │   └── index.css          # Tailwind CSS v4 directives & scrollbars
```

---

## 2. Core Implementation Solutions

- **Clean Parsing**: The backend contains a robust JSON sanitizer that strips markdown fences (e.g. ` ```json `) from Groq's raw text response before running `json.loads`.
- **Axios request interceptors**: An automated interceptor checks `sessionStorage` for a logged-in user session and attaches their UID under the `x-user-id` header to verify records without writing custom middleware on every endpoint.
- **V4 Theme Compiler**: Tailwind CSS v4 allows us to configure tokens natively inside `src/index.css` via `@theme`, completely removing config file parsing steps.
