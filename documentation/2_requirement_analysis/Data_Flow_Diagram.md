# Data Flow Diagram (DFD)

The data flow diagram below details the transfer of information between the user interface, backend server processes, Groq AI, and the Firebase Firestore database:

```
[User Interface (React)]
       │
       │ 1. POST /api/analyze-waste { item: "Battery" }
       ▼
[Flask Route: waste.py] ───────► 2. Groq Prompt ───────► [Groq Llama 3.3]
       │                                                      │
       │ 4. Return Guide JSON                                 │ 3. Return Raw JSON
       ▲ ◄────────────────────────────────────────────────────┘
       │
       │ 5. Render ResultCard
       ▼
[User Interface (React)]
       │
       │ 6. POST /api/save-history { result: {...} }
       ▼
[Flask Route: history.py] ─────► 7. Write Log ────────► [Firebase Firestore / Memory]
       │                                                            │
       │ 9. Return History JSON / Stats JSON                        │ 8. Stream Docs
       ▲ ◄──────────────────────────────────────────────────────────┘
       │
       │ 10. Render Charts / List
       ▼
[User Interface (React)]
```

---

## Data Processes Description

1. **Analysis Process**: User types item -> React app posts search string to `/api/analyze-waste` -> Flask Backend routes it to Groq API (or falls back to local JSON guides) -> Backend returns sanitized JSON with classification and steps to the React client.
2. **Persistence Process**: React client auto-saves successful scans to `/api/save-history` -> Backend writes log data (user metadata, category flags, timestamp) to Firebase Firestore (or server-side session dictionary if running in Demo Mode).
3. **Telemetry Aggregator**: React client mounts dashboard -> requests `/api/dashboard-data` -> Backend queries history logs -> computes aggregate rates and categories -> returns statistics package directly to react-chartjs-2 containers.
