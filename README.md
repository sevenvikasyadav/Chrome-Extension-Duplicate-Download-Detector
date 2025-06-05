# 🔁 Duplicate File Download Detector – Chrome Extension

Checks if a file being downloaded already exists. Detects the duplicate if it was downloaded while this extension was running. Based on SHA256.

## 🚀 Features

- 🔍 Detects duplicate file downloads in real-time.
- 📂 Checks if a file being downloaded already exists (based on its content hash, works for any file type).
- 🧠 Remembers downloads during the session while the extension is active.
- 🔔 Warns the user upon duplicate detection (optional toast popup or system notification).

> 📌 Note: Only files downloaded while the extension is active are checked for duplication.

## 🧩 About `native_app/`

The `native_app/` folder contains a Python script and a manifest for the **Native Messaging host** that integrates with the Chrome extension to enable features that require deeper system access, such as:

- Accessing file system beyond browser limitations
- Advanced duplicate detection or auto-delete features

### ⚠️ Note:
- The native app requires **separate installation** on your system.
- It must be registered with your OS for Chrome’s Native Messaging to communicate with it.
- See [Google’s official Native Messaging docs](https://developer.chrome.com/docs/apps/nativeMessaging/) for setup details.

## 📦 Installation (For Testing / Local Use)

1. Clone or download this repository.
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer Mode**
   - Click **“Load unpacked”** and select the folder containing the extension files.
3. Set up and register the native app on your OS to enable native messaging features.

> Created with ❤️ to help users avoid clutter and redundant downloads.
