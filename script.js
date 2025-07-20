const API_BASE_URL = "https://instafacedownloader.onrender.com";

document.getElementById("download-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const platform = document.getElementById("platform").value;
  const url = document.getElementById("video-url").value;
  const quality = document.getElementById("video-quality").value;

  const statusDiv = document.getElementById("status");
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

    if (data.success) {
      statusDiv.innerHTML = `<a href="${data.videoUrl}" target="_blank" download>Click here to download your video</a>`;
    } else {
      statusDiv.innerText = "Error: " + data.message;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statusDiv.innerText = "❌ Error while downloading the video. Please try again later.";
  }
});