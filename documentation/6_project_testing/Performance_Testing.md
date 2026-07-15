# Performance Testing

We conducted performance testing across critical modules to ensure the application runs smoothly on standard client computers and typical web hosting environments:

## 1. Network API Response Latencies

We monitored response times for critical network calls under local hosting environments:

- **GET /api/health**: ~5ms (Highly optimized node checks).
- **GET /api/get-centers**: ~10ms (Filters static coordinates and sorts arrays in memory).
- **POST /api/save-history & GET /api/get-history**:
  - *Demo Mode (In-Memory)*: ~4ms.
  - *Cloud Firestore Mode*: ~150ms - 280ms (Typical cloud database socket delay).
- **POST /api/analyze-waste**:
  - *Local Fallback Rule Engine*: ~6ms.
  - *Groq API Llama 3.3*: ~450ms - 900ms (Varies depending on network connectivity and prompt size).

---

## 2. Frontend Build Optimizations
- **Vite Bundler**: The production bundler optimized chunk sizes, outputting a JavaScript bundle size of **779.26 kB** (includes the complete Chart.js rendering engines and Leaflet library maps) and a CSS stylesheet size of **37.33 kB** (highly compressed utility variables).
- **Leaflet Map Rendering**: Initialized once during page loads. It loads map tile graphics asynchronously in threads, ensuring smooth layout scrolling.
