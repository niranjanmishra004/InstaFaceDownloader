document.addEventListener('DOMContentLoaded', function() {
  const platformSelect = document.getElementById('platform');
  const urlInput = document.getElementById('url');
  const qualitySelect = document.getElementById('quality');
  const downloadBtn = document.getElementById('downloadBtn');
  const messageDiv = document.getElementById('message');
  const container = document.querySelector('.container');

  updatePlatformStyle();
  setCurrentYear();

  platformSelect.addEventListener('change', updatePlatformStyle);
  downloadBtn.addEventListener('click', handleDownload);

  function updatePlatformStyle() {
    const platform = platformSelect.value;
    container.style.borderTop = `4px solid ${platform === 'facebook' ? '#4267B2' : '#E1306C'}`;
  }

  function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  async function handleDownload() {
    const platform = platformSelect.value;
    const url = urlInput.value.trim();
    const quality = qualitySelect.value;

    if (!validateInputs(platform, url)) return;

    try {
      showLoadingState(true);
      const videoData = await fetchVideoData(platform, url, quality);
      handleDownloadSuccess(videoData);
    } catch (error) {
      showMessage(error.message || 'Download failed. Please try again.', 'error');
    } finally {
      showLoadingState(false);
    }
  }

  function validateInputs(platform, url) {
    if (!url) {
      showMessage('Please enter a valid URL', 'error');
      return false;
    }

    if (platform === 'instagram' && !url.includes('instagram.com')) {
      showMessage('Please enter a valid Instagram URL', 'error');
      return false;
    }

    if (platform === 'facebook' && !url.includes('facebook.com')) {
      showMessage('Please enter a valid Facebook URL', 'error');
      return false;
    }

    return true;
  }

  async function fetchVideoData(platform, url, quality) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          const blob = new Blob([`Dummy ${platform} video content`], { type: 'video/mp4' });
          const objectUrl = URL.createObjectURL(blob);
          resolve({
            success: true,
            url: objectUrl
          });
        } else {
          reject(new Error('Video unavailable or URL invalid'));
        }
      }, 1500);
    });
  }

  function handleDownloadSuccess(videoData) {
    showMessage('Video ready for download!', 'success');

    const a = document.createElement('a');
    a.href = videoData.url;
    a.download = `video_${Date.now()}.mp4`;
    a.click();

    setTimeout(() => URL.revokeObjectURL(videoData.url), 100);
  }

  function showLoadingState(isLoading) {
    if (isLoading) {
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<div class="loading"></div> Processing...';
    } else {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<span id="btnText">Download Video</span> <i class="fas fa-download"></i>';
    }
  }

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
  }
});
