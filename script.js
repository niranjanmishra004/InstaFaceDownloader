document.getElementById('downloadBtn').addEventListener('click', async () => {
  const platform = document.getElementById('platform').value;
  const url = document.getElementById('url').value;
  const quality = document.getElementById('quality').value;

  if (!url) {
    alert('Please enter a valid URL');
    return;
  }

  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://instafacedownloader.onrender.com";

  try {
    const response = await fetch(`${API_BASE}/api/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ platform, url, quality })
    });

    const data = await response.json();

    if (data.success && data.videoUrl) {
      const downloadLink = document.getElementById('downloadLink');
      downloadLink.href = data.videoUrl;
      downloadLink.style.display = 'inline-block';
    } else {
      alert(data.message || 'Failed to fetch video');
    }
  } catch (error) {
    console.error(error);
    alert('Error while downloading video. Please try again.');
  }
});