// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Test server connection on page load
window.addEventListener('load', function() {
  fetch('/api/status')
    .then(response => response.json())
    .then(data => {
      console.log('✅ Server connection OK:', data);
    })
    .catch(error => {
      console.error('❌ Server connection failed:', error);
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = '<div class="error">⚠️ Server connection issue. Please refresh the page or check if the server is running.</div>';
    });
});

// Download button event listener
document.getElementById("downloadBtn").addEventListener("click", function () {
  const platform = document.getElementById("platform").value;
  const url = document.getElementById("url").value;
  const quality = document.getElementById("quality").value;
  const messageDiv = document.getElementById("message");
  const btnText = document.getElementById("btnText");

  if (!url) {
    messageDiv.innerHTML = '<div class="error">❗ Please enter a video URL</div>';
    return;
  }

  // Validate URL format
  if (!isValidUrl(url)) {
    messageDiv.innerHTML = '<div class="error">❗ Please enter a valid URL</div>';
    return;
  }

  // Show loading state
  btnText.textContent = "Processing...";
  this.disabled = true;
  messageDiv.innerHTML = '<div class="loading">🔄 Processing your request...</div>';

  // Call local server
  fetch("/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ platform, url, quality })
  })
    .then(response => {
      // Check if response is ok, but still parse JSON for error details
      return response.json().then(data => ({ data, ok: response.ok }));
    })
    .then(({ data, ok }) => {
      if (ok && data.success && data.video) {
        messageDiv.innerHTML = '<div class="success">✅ Video processed successfully! Download will start shortly.</div>';
        
        // Create download link and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = data.video.url;
        downloadLink.download = 'video.mp4';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
      } else {
        // Show specific error message from server
        const errorMessage = data.message || 'Unknown error occurred';
        messageDiv.innerHTML = '<div class="error">❌ ' + errorMessage + '</div>';
      }
    })
    .catch(error => {
      console.error("Network Error:", error);
      messageDiv.innerHTML = '<div class="error">❌ Network connection failed. Please check your internet and try again.</div>';
    })
    .finally(() => {
      // Reset button state
      btnText.textContent = "Download Video";
      this.disabled = false;
    });
});

// URL validation function
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.hostname.includes('instagram.com') || url.hostname.includes('facebook.com') || url.hostname.includes('fb.watch');
  } catch (_) {
    return false;
  }
}

// Clear message when URL input changes
document.getElementById("url").addEventListener("input", function() {
  const messageDiv = document.getElementById("message");
  if (messageDiv.innerHTML) {
    messageDiv.innerHTML = '';
  }
});
