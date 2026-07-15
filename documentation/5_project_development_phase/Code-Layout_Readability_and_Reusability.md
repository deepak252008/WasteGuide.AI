# Code Layout, Readability, and Reusability

We followed high standards of software engineering during implementation to guarantee the codebase remains readable, reusable, and easy to grade or extend:

## 1. Code Readability Standards
- **Python**: Conformed to PEP 8 standards. Created explicit imports, set logging templates rather than print statements, and added descriptive comments for complex regex/string parsing.
- **JavaScript/React**: Utilized ES6 import syntax, camelCase variable mapping, and separated layout styles from state logic.

---

## 2. Code Reusability & Componentization
To prevent code duplication, we isolated common UI elements into reusable React components inside `frontend/src/components/`:

- **CategoryChip.jsx**: Extracted color mapping definitions out of pages. It houses styling dictionaries for all 8 categories and serves as a single source of truth for color-coding waste.
- **ResultCard.jsx**: Accepts a structured `result` JSON payload and renders the analysis card. It can be embedded anywhere (Scanner page, history log drawer, dashboard cards).
- **Navbar.jsx**: A global navigation container that dynamically manages active links and detects Demo Mode badges without duplication.

---

## 3. Modular File Layout
We separated concerns by dividing backend routes into specific blueprints:
- `routes/waste.py`: Exclusively manages Prompt creation, Groq API calling, and fallback matching.
- `routes/history.py`: Exclusively manages database read/write queries and metrics mathematical calculations.
- `routes/centers.py`: Exclusively houses the static Hyderabad center database and geolocation filtering logic.
