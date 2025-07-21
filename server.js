const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 📂 Serve downloaded videos from "downloads" folder
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
app.use('/downloads', express.static(downloadsDir));

// ✅ Root check
app.get('/', (req, res) => {
  res.send('✅ InstaFaceDownloader is running with yt-dlp!');
});

// ✅ Video download endpoint
app.post('/api/download', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: 'Missing video URL' });
  }

  console.log(`📥 Download request received for: ${url}`);

  // Generate a unique filename
  const fileName = `video_${Date.now()}.mp4`;
  const filePath = path.join(downloadsDir, fileName);

  // yt-dlp command
  const command = `yt-dlp -o "${filePath}" -f best "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ yt-dlp error: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Download failed', error: error.message });
    }

    console.log(`✅ Download complete: ${fileName}`);
    return res.json({
      success: true,
      video: {
        url: `/downloads/${fileName}`,
      },
    });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});