const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Example dummy API
app.post('/api/download', async (req, res) => {
  const { platform, url } = req.body;

  // You can later replace this part with real scraping/downloader code
  if (!url || !platform) {
    return res.status(400).json({ success: false, message: 'Missing URL or platform' });
  }

  // Simulated success response
  return res.json({
    success: true,
    videoUrl: `https://example.com/downloads/dummy_${platform}.mp4`,
    message: 'Simulated download link',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
