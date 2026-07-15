# Demonstration of Proposed Features

This document provides a structured walkthrough script to demonstrate the main features of WasteGuide AI to evaluators:

## 1. Feature Walkthrough Script

### Action 1: Portal Initialization
- **Action**: Load `http://localhost:5173`. Click the orange `LAUNCH DEMO MODE` button.
- **Narrative**: "We initiate the app in Demo Mode, which bypasses cloud auth constraints. All scan data will be stored in server memory for the session."
- **Verification**: User details header displays `USR: Demo Resident`, and a pulsing `DEMO MODE` badge lights up on the navigation bar.

### Action 2: AI Scanning & Classification
- **Action**: Type 'Old Charger' in the search bar and press Enter, or click the 'Old Charger' quick chip.
- **Narrative**: "We scan an item. Notice the status bar cycles: 'Scanning database...', 'Consulting Llama...', mimicking a command line sequence."
- **Verification**: The scanner renders a `ResultCard` indicating category `E-waste`, tags showing `RECYCLABLE` and `HAZARDOUS`, a warning box, and 4 recycling steps.

### Action 3: Depot Mapping Navigation
- **Action**: Click the `FIND HYDERABAD COLLECTION CENTERS` button at the bottom of the card.
- **Narrative**: "The scanner automatically passes the category to our Leaflet Map locator, filtering for regional depots that accept E-waste."
- **Verification**: The map updates center markers, focuses on coordinates, and opens detailed address logs on the left sidebar.

### Action 4: Logging & History Verification
- **Action**: Navigate to the `HISTORY` tab in the navbar.
- **Narrative**: "Every scan is auto-saved. Residents can review past scanned dates, and search item names in real-time."
- **Verification**: Searching 'Charger' filters items instantly. Click the row to expand step-by-step instructions.

### Action 5: Metrics Telemetry Verification
- **Action**: Navigate to the `DASHBOARD` tab in the navbar.
- **Narrative**: "The backend aggregates stats and serves them directly to Chart.js canvases to track recycling rates."
- **Verification**: Total Scans card displays `1`, and the doughnut, bar, and line trend graphs render data successfully.
