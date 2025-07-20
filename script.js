const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API Endpoint
app.post('/api/download', async (req, res) => {
  const { platform, url } = req.body;
  
  try {
    let videoUrl;
    if (platform === 'instagram') {
      videoUrl = await getInstagramVideo(url);
    } else if (platform === 'facebook') {
      videoUrl = await getFacebookVideo(url);
    } else {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Stream the video directly
    const response = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${platform}_video.mp4"`);
    response.data.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Instagram Downloader
async function getInstagramVideo(url) {
  const postId = url.split('/')[4];
  const apiUrl = `https://www.instagram.com/p/${postId}/?__a=1`;
  
  const response = await axios.get(apiUrl);
  if (!response.data.graphql.shortcode_media.is_video) {
    throw new Error('This post contains no video');
  }
  return response.data.graphql.shortcode_media.video_url;
}

// Facebook Downloader
async function getFacebookVideo(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const videoUrl = $('meta[property="og:video"]').attr('content');
  
  if (!videoUrl) {
    throw new Error('Could not extract video URL');
  }
  return videoUrl;
}

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Auto-open browser (development only)
  if (process.env.NODE_ENV !== 'production') {
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`);
  }
});
