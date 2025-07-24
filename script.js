// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Test server connection on page load with better diagnostics
window.addEventListener('load', function() {
  console.log('🔍 Testing server connection...');
  console.log('🌐 Current URL:', window.location.href);
  
  fetch('/api/status', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Server connection OK:', data);
      // Show success indicator
      const messageDiv = document.getElementById('message');
      messageDiv.innerHTML = '<div class="success">🟢 Server connected successfully</div>';
      setTimeout(() => {
        messageDiv.innerHTML = '';
      }, 3000);
    })
    .catch(error => {
      console.error('❌ Server connection failed:', error);
      console.error('❌ Error details:', error.message);
      
      const messageDiv = document.getElementById('message');
      let errorMessage = '❌ Server connection failed. ';
      
      if (error.message.includes('TypeError')) {
        errorMessage += 'The server might not be running or there might be a network issue.';
      } else if (error.message.includes('404')) {
        errorMessage += 'API endpoint not found. The server configuration might be incorrect.';
      } else if (error.message.includes('500')) {
        errorMessage += 'Internal server error. Please try again later.';
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      messageDiv.innerHTML = `<div class="error">${errorMessage}</div>`;
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
