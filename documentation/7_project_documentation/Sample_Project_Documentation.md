# Sample Project Documentation

This document provides technical specifications and database schemas to assist administrators in deploying and extending the WasteGuide AI application:

## 1. Firestore Database Schema

The database uses two root collections that are automatically created by the backend:

### Collection 1: `users`
- **Path**: `users/{userId}`
- **Document Structure**:
  ```json
  {
    "name": "Kakarla Gnana Sathwick",
    "email": "sathwick@swm.gov.in",
    "account_info": "Resident user created at register stage"
  }
  ```

### Collection 2: `waste_logs`
- **Path**: `waste_logs/{logId}`
- **Document Structure**:
  ```json
  {
    "userId": "demo-user-123",
    "item": "Lithium Battery",
    "category": "Hazardous Waste",
    "is_recyclable": true,
    "is_hazardous": true,
    "is_reusable": false,
    "timestamp": "2026-07-15T22:10:32Z",
    "date": "2026-07-15",
    "result": {
       "item": "Lithium Battery",
       "category": "Hazardous Waste",
       "category_icon": "🔋",
       "is_recyclable": true,
       "is_hazardous": true,
       "is_reusable": false,
       "disposal_instructions": "Do not mix with domestic waste...",
       "recycling_steps": ["Step 1...", "Step 2...", "Step 3...", "Step 4..."],
       "hazard_warning": "Heavy metals may leak...",
       "eco_suggestions": ["Rechargeable batteries...", "Alternative tech..."],
       "accepted_at": ["Specialized Recycle Yards...", "Depots..."]
    }
  }
  ```

---

## 2. API Schema Specification

### Endpoint: `POST /api/analyze-waste`
- **Payload**: `{ "item": "Old Newspaper" }`
- **Response Envelopes**:
  ```json
  {
    "result": {
       "item": "Old Newspaper",
       "category": "Paper Waste",
       "category_icon": "📰",
       "is_recyclable": true,
       "is_hazardous": false,
       "is_reusable": true,
       "disposal_instructions": "Ensure paper is dry...",
       "recycling_steps": ["Flatten...", "Bind...", "Sort...", "Deposit..."],
       "hazard_warning": null,
       "eco_suggestions": ["Digital editions...", "Composting...", "Packing wraps..."],
       "accepted_at": ["Paper Recycling Plant", "Scrap Yard", "Bin..."]
    },
    "source": "groq"
  }
  ```
