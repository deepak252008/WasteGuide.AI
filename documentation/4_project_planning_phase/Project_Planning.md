# Project Planning

The project was planned and executed using an **Agile/Scrum** lifecycle over 5 structured Epics:

## 1. Project Epics and Milestone Timeline

```
[Epic 1: Scope & Arch] ──► [Epic 2: Core Spec] ──► [Epic 3: Backend dev] ──► [Epic 4: Frontend UI] ──► [Epic 5: Integration]
```

### Epic 1: Requirement Analysis & Setup
- **Tasks**: Confirming scope, setting up local directory trees, establishing python virtual environments (`python -m venv venv`), and configuring package templates (`requirements.txt`, package files).
- **Deliverables**: Folder layouts and configuration templates.

### Epic 2: Core Functionality Design
- **Tasks**: Scoping waste classification boundaries, drafting mock data maps for the 12 quick-select items, locating coordinate vectors for regional Hyderabad centers.
- **Deliverables**: DFD diagrams and feature checklists.

### Epic 3: Backend Development
- **Tasks**: Setting up Flask micro-routes under `routes/` blueprints, coding Groq prompt structures, writing JSON parser cleanup functions, and structuring Firestore database queries.
- **Deliverables**: `app.py`, route modules, and server env files.

### Epic 4: Frontend Development
- **Tasks**: Configuring Vite, writing Tailwind styles, developing components (`Navbar`, `CategoryChip`, `ResultCard`), building page states.
- **Deliverables**: Pages files and stylesheet adapters.

### Epic 5: Service Integration & Validation
- **Tasks**: Binding Axios fetch calls to Flask routes, testing Leaflet maps marker selections, plotting Chart.js canvas nodes, running python end-to-end endpoint tests.
- **Deliverables**: Fully built production folder and clean validation logs.
