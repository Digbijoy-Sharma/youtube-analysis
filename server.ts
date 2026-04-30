import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { YouTubeService } from './server/services/youtubeService.js';
import { errorHandler } from './server/middleware/errorHandler.js';

dotenv.config();

// Fix for UNABLE_TO_GET_ISSUER_CERT_LOCALLY in this environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post("/api/video/analyze", async (req, res, next) => {
  try {
    const { videoUrl, apiKey } = req.body;
    const service = new YouTubeService([apiKey || process.env.GEMINI_API_KEY || '']);
    
    // Robust regex for ID extraction
    const videoIdMatch = videoUrl.match(/(?:v=|\/|be\/)([\w-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : videoUrl;
    
    if (!videoId || videoId.length !== 11) throw new Error('Invalid YouTube Video ID or URL');

    const analysis = await service.analyzeVideo(videoId);
    res.json(analysis);
  } catch (error: any) {
    next(error);
  }
});

app.post("/api/channel/analyze", async (req, res, next) => {
  try {
    const { channelId, apiKey } = req.body;
    const service = new YouTubeService([apiKey || process.env.GEMINI_API_KEY || '']);
    const analysis = await service.analyzeChannel(channelId);
    res.json(analysis);
  } catch (error: any) {
    next(error);
  }
});

app.post("/api/channel/videos", async (req, res, next) => {
  try {
    const { channelId, apiKey, maxResults } = req.body;
    const service = new YouTubeService([apiKey || process.env.GEMINI_API_KEY || '']);
    const videos = await service.fetchChannelVideos(channelId, maxResults || 50);
    res.json(videos);
  } catch (error: any) {
    next(error);
  }
});

app.post("/api/video/comments", async (req, res, next) => {
  try {
    const { videoId, apiKey, maxResults } = req.body;
    const service = new YouTubeService([apiKey || process.env.GEMINI_API_KEY || '']);
    const comments = await service.fetchComments(videoId, maxResults || 100);
    res.json(comments);
  } catch (error: any) {
    next(error);
  }
});

app.post("/api/keywords/search", async (req, res, next) => {
  try {
    const { query, apiKey } = req.body;
    const service = new YouTubeService([apiKey || process.env.GEMINI_API_KEY || '']);
    const results = await service.searchKeywords(query);
    res.json(results);
  } catch (error: any) {
    next(error);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
