📘 README: AudioShield + Decryptor
🎧 AudioShield — Real-Time Transcription with Encryption
AudioShield is a lightweight browser extension that transcribes spoken audio in real time using the Web Speech API, then encrypts and stores the transcript securely using the JavaScript Crypto API. Designed for privacy-conscious users, it ensures that sensitive spoken content is protected from unauthorized access.

🚀 Features
• 	🎙️ Live Speech Recognition
Transcribes spoken words instantly using browser-native speech recognition.
• 	🔐 AES-GCM Encryption
Every transcript is encrypted before storage using secure cryptographic methods.
• 	📄 Continuous Line Transcription
Displays speech in a flowing paragraph format, with automatic breaks after long pauses.
• 	🕒 Pause Detection
Automatically inserts paragraph breaks after 3 seconds of silence.
• 	🧠 No Frameworks Required
Built with pure HTML, CSS, and JavaScript — no React, no Tailwind.
🧩 Decryptor Module
The Decryptor folder contains a standalone tool that allows users to decrypt previously encrypted transcripts using the same AES-GCM encryption scheme. This module ensures that only authorized users with the correct key can access the original speech content.
🔓 Features
• 	Secure Decryption
Uses AES-GCM to decrypt stored transcripts with a user-provided key.
• 	Simple Interface
Clean HTML/JS interface for pasting encrypted data and viewing decrypted output.
• 	Offline Capable
No server calls — all decryption happens locally in the browser.
📂 Folder Structure
decryptor/
├── index.html
├── decrypt.js
├── style.css
└── README.md  ← Optional: Decryptor-specific README

🛠️ Installation Guide
🔧 For AudioShield Extension
1. 	Clone the repository:

git clone https://github.com/albrash101/audioshield.git

2. 	Load the extension into Chrome:
       Open chrome/edge://extensions/ 
• 	Enable Developer Mode
• 	Click Load unpacked
• 	Select the audioshield  folder
🔓 For Decryptor Tool
1. 	Navigate to the decryptor folder.
2. 	Open index.html in your browser.
3. 	Paste your encrypted transcript and key.
4. 	Click Decryptor to view the original text.

📁 Project Structure
your-project/
├── audioshield/
│   ├── background.js
│   ├── manifest.json
│   ├── panel.html
│   ├── panel.js
│   ├── popup.html
│   └── popup.js
├── decryptor/
│   ├── index.html
│   ├── decrypt.js
│   ├── style.css
│   └── README.md
└── README.md  ← This file



📜 License
This project is licensed under the MIT License.
You are free to use, modify, and distribute this software with proper attribution.

👤 Author
ABDULLAHI
📍 Rangaza, Kano State, Nigeria
🔗 GitHub: @albrash101