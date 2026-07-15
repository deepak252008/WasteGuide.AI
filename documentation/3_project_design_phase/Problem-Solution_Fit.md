# Problem-Solution Fit

The matrix below documents how our proposed solution matches the target user's direct pain points to specific software features:

| User Pain Point | Feature Solution | Value Created |
| :--- | :--- | :--- |
| **Improper segregation** (mixing plastics, food, metals due to confusion) | **AI-Powered Scanner** (`POST /api/analyze-waste`) | Users instantly receive the exact category, warnings, and recycling instructions for any named object. |
| **Leaching hazards** (tossing batteries, electronics in garbage) | **Dynamic Hazard Alerts** (`ResultCard` Warning Box) | Displays highly visible warning labels explaining the toxic footprint of the items. |
| **Depot navigation difficulty** (not knowing where local recycling centers are) | **Hyderabad Collection Map** (Leaflet + OpenStreetMap) | Maps nearby depots, automatically filtered by the scanned category, complete with coordinates, contact info, and distance in km. |
| **Lack of ecological incentives** (residents feel unmotivated) | **Telemetry Dashboard** (Chart.js dashboards) | Showcases statistics, trends, and category volumes to gamify habit building. |
| **High setup barriers** (evaluators unable or unwilling to configure Firebase/Groq keys) | **Demo Mode Fallback** (In-Memory structures + keyword rules) | A bypass login allows testing the entire app immediately in a local environment. |
