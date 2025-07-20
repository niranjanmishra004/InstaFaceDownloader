// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Optional: serve static files like index.html if needed

// Dummy download endpoint
app.post('/api/download', (req, res) => {
  const { platform, url, quality } = req.body;

  if (!platform || !url) {
    return res.status(400).json({ success: false, message: 'Missing platform or URL' });
  }

  // Simulate a video URL (normally you'd fetch the real one using youtube-dl or similar)
  const dummyVideoUrl = `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`;

  return res.json({
    success: true,
    videoUrl: dummyVideoUrl
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

