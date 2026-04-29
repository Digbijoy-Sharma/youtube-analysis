# YouTube Competitor Intelligence Platform

A production-grade competitive intelligence suite for YouTube creators and agencies. Built for the 2026 content landscape, featuring deep engagement audits, SEO intelligence, and pre-upload optimization.

## 🚀 Key Modules

- **Video Analytics**: Deep-dive into any video's retention potential, SEO score, and metadata quality.
- **Channel MRI**: Audit competitor upload frequency, engagement trends, and content gaps.
- **SEO Intelligence**: Real-time keyword analysis and description optimization.
- **Pre-Upload Optimizer**: A final 30-point verification checklist and viral title generator.
- **Comment Intelligence**: Semantic analysis of viewer questions and sentiment.
- **Compare Module**: Side-by-side performance benchmarking for up to 5 competitors.
- **Watchlist**: Persistent surveillance of high-value creator channels.

## 🛠 Tech Stack

- **Frontend**: React 18+, Vite, TypeScript
- **Styling**: Tailwind CSS (Mobile-first, dark mode native)
- **Animations**: Motion (framer-motion)
- **State Management**: Zustand with persistent storage
- **Icons**: Lucide React
- **Charts**: Recharts & D3
- **API**: YouTube Data API v3 (Node.js backend proxy)

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file or provide via AI Studio Settings:
   ```env
   # No server-side keys required if using client-side rotation, 
   # but recommended for production proxying.
   ```

3. **API Keys**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "YouTube Data API v3"
   - Create an API Key
   - Add the key in the app's **System Config** (Settings) page.

## 📈 Quota Guide

The platform uses a "Multi-Node" rotation system to manage the 10,000 unit daily YouTube API limit efficiently.
- **Video Audit**: ~1-5 units
- **Channel MRI**: ~5-10 units
- **Search Scans**: ~100 units
- **Comment Analysis**: ~1-2 units per 100 comments

## 🌐 Deployment

The app is optimized for **Cloud Run** and **Vercel** deployment. 
- Ensure `NODE_ENV=production`
- Port `3000` is the default for AI Studio environment.

## 🔒 Security

- **Node Failover**: Automatic switching between active API keys.
- **GCM Encryption**: Local state encryption for sensitive API keys.
- **Privacy**: No user data is stored on remote servers; all surveillance logs are local-first.

---
*Built with precision for the modern creator economy.*
