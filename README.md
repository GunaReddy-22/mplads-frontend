# 🏛️ MPLADS AI — Decision Support & Risk Intelligence Frontend

> **“We don’t replace eSAKSHI — we make eSAKSHI intelligent.”**

Frontend web application for **MPLADS AI** (AI-Powered Risk Intelligence & Decision Support Platform for MPLADS).

---

## 🛠️ Tech Stack
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism, Dark Government-Tech Theme
- **Icons**: Lucide Icons
- **Charts & Data Viz**: Recharts
- **GIS Mapping**: Leaflet.js, OpenStreetMap / Carto Dark Tiles
- **Deployment**: Vercel ready (with `vercel.json` SPA routing rewrites)

---

## 🚀 Quick Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## ⚙️ Environment Variables
Create a `.env` file or configure in Vercel:
```env
VITE_API_URL="https://<YOUR_BACKEND_URL>/api"
```
*(Defaults to `http://localhost:5000/api` for local development)*
