console.log("Download watcher loaded");

chrome.runtime.onInstalled.addListener(() => {
    chrome.notifications.create({
        type: "basic",
        title: "Test Popup",
        message: "Extension is working!",
        iconUrl: "icon.png"
    });
});

chrome.downloads.onChanged.addListener(function (delta) {
  if (delta.state && delta.state.current === "complete") {
    chrome.downloads.search({ id: delta.id }, function (results) {
      if (results && results.length > 0) {
        const download = results[0];
        const port = chrome.runtime.connectNative("com.vikas.filechecker2");
        port.postMessage({ path: download.filename });

        port.onMessage.addListener((response) => {
          if (response.isDuplicate) {
            // Inject toast script into current tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              if (tabs.length > 0) {
                chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  files: ["toast.js"],
                }, () => {
                  // After toast loads, pass download ID to toast
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: "handleDuplicate",
                    downloadId: download.id,
                    fileName: download.filename,
                  });
                });
              }
            });
          }
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "userChoice" && request.downloadId) {
    if (request.choice === "delete") {
      setTimeout(() => {
        chrome.downloads.removeFile(request.downloadId, () => {
          chrome.downloads.erase({ id: request.downloadId });
        });
      }, 1000); // wait to ensure file is written
    }
    sendResponse({ status: "acknowledged" });
  }
});
