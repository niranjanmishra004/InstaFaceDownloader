document.getElementById("downloadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const platform = document.getElementById("platform").value;
  const url = document.getElementById("urlInput").value;
  const quality = "best"; // Can be made dynamic if needed

  if (!url) {
    alert("❗Please enter a URL");
    return;
  }

  // 🟢 Use your Render backend link here!
  fetch("https://instafacedownloader.onrender.com/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ platform, url, quality })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.videoUrl) {
        const downloadBtn = document.getElementById("downloadBtn");
        downloadBtn.href = data.videoUrl;
        downloadBtn.style.display = "inline-block";
        downloadBtn.innerText = "⬇️ Download Video";
      } else {
        alert("❌ Failed to fetch video: " + (data.message || "Unknown error"));
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("❌ An error occurred while processing the request.");
    });
});
