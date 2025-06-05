chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "handleDuplicate") {
    const toast = document.createElement('div');
    toast.innerHTML = `
      ⚠️ <strong>Duplicate file detected:</strong><br><code>${message.fileName}</code><br><br>
      <button id="keepFile">✅ Keep</button>
      <button id="deleteFile">🗑️ Delete</button>
    `;
    toast.style.position = "fixed";
    toast.style.top = "50%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.background = "#212121";
    toast.style.color = "#fff";
    toast.style.padding = "20px 30px";
    toast.style.fontSize = "16px";
    toast.style.borderRadius = "10px";
    toast.style.zIndex = "999999";
    toast.style.textAlign = "center";
    toast.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    toast.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(toast);

    // Button styles
    ["keepFile", "deleteFile"].forEach(id => {
      const btn = toast.querySelector(`#${id}`);
      btn.style.margin = "10px";
      btn.style.padding = "8px 16px";
      btn.style.border = "none";
      btn.style.borderRadius = "5px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "14px";
      btn.style.backgroundColor = id === "keepFile" ? "#4caf50" : "#f44336";
      btn.style.color = "#fff";
    });

    toast.style.transition = "opacity 0.3s";

    function removeToast() {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }

    toast.querySelector("#keepFile").onclick = () => {
      chrome.runtime.sendMessage(
        { action: "userChoice", choice: "keep", downloadId: message.downloadId },
        () => {
          removeToast();
        }
      );
    };

    toast.querySelector("#deleteFile").onclick = () => {
      chrome.runtime.sendMessage(
        { action: "userChoice", choice: "delete", downloadId: message.downloadId },
        () => {
          removeToast();  
        } 
      );
    };
  }
});
