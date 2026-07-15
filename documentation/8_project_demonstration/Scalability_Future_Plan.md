# Scalability & Future Plan

We planned WasteGuide AI with architectural extensions in mind to scale into a city-wide civic platform:

## 1. Feature Extensions

### Camera Image Uploads
- Integrate mobile camera APIs. Users take a photo of waste, sending the byte-stream to backend route decorators where a Vision model (like `llama-3.2-11b-vision-instruct`) performs object classification automatically.

### Gamified Discount Vouchers (Eco-Rewards)
- Integrate API connections to local hypermarket stores in Hyderabad. Scans convert to eco-points, generating discount coupons.

### Live Municipal Chat
- Build a real-time WebSocket channel connecting residents directly with local GHMC recycling agents.

---

## 2. Infrastructure Scalability

- **Database Sharding**: As our log collection document count grows, we will sharding Firestore collections by municipal zones (e.g., Jubilee Hills, Secunderabad, Gachibowli) to speed up querying.
- **Serverless Backend**: Transition the Flask backend to Google Cloud Run or AWS Lambda to dynamically scale instances to handle spikes in traffic during civic campaigns.
- **Edge Caching**: Add Cloudflare CDN layers in front of OpenStreetMap tile fetches to cache maps, reducing load times.
