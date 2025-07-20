// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Use dynamic port for production (e.g. Render)
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.static('public')); // Optional: serve static frontend if needed

// ✅ Test endpoint (optional for debug)
app.get('/', (req, res) => {
  res.send('✅ InstaFaceDownloader Backend is running!');
});

// ✅ Download endpoint
app.post('/api/download', (req, res) => {
  const { platform, url, quality } = req.body;

  // Basic validation
  if (!platform || !url) {
    return res.status(400).json({
      success: false,
      message: 'Missing platform or URL',
    });
  }

  console.log(`📥 Download request received:\nPlatform: ${platform}\nURL: ${url}\nQuality: ${quality}`);

  // ⚠️ In real version: Fetch actual video URL using yt-dlp, puppeteer, etc.
  const dummyVideoUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

  return res.json({
    success: true,
    videoUrl: dummyVideoUrl,
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
