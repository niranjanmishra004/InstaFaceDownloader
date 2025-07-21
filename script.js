const API_BASE_URL = "https://instafacedownloader.onrender.com";

document.getElementById("downloadBtn").addEventListener("click", async function () {
  const platform = document.getElementById("platform").value;
  const url = document.getElementById("url").value;
  const quality = document.getElementById("quality").value;
  const statusDiv = document.getElementById("message");

  statusDiv.innerText = "Processing...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, url, quality }),
    });

    const data = await response.json();

    if (data.success && data.video && data.video.url) {
      const videoUrl = data.video.url;

      // Auto trigger download
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      statusDiv.innerHTML = `<span style="color:green;">✅ Video is downloading...</span>`;
    } else {
      statusDiv.innerText = "❌ Error: " + (data.message || "Invalid response from server");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statusDiv.innerText = "❌ Error while downloading the video. Please try again later.";
  }
});
