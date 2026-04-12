🔐 AudioShield – Secure Speech-to-Text Browser Extension
📘 Overview

AudioShield is a browser-based extension developed to enhance the security, privacy, and accessibility of speech-to-text systems used in e-learning environments.

It is specifically designed to support hearing-impaired learners by providing:

🎧 Real-time transcription
🔒 Secure encryption of transcripts
🔓 Integrated decryption (within the same extension)
🧠 Context-aware annotation using Nigerian English academic terms

Unlike conventional ASR tools, AudioShield ensures that transcripts are encrypted immediately after generation, preventing unauthorized access and protecting sensitive academic data.

🚀 Key Features
Real-Time Audio Transcription
PBKDF2 + AES-GCM Encryption
Built-in Decryptor (No Separate Tool)
Local Processing (No Cloud Dependency)
Dictionary-Based Annotation
Secure Export (.docx format)
🧭 Installation (Microsoft Edge)
Open Microsoft Edge

Go to:

edge://extensions/
Enable Developer Mode
Click Load unpacked
Select your project folder containing:
manifest.json
background.js
panel.html
panel.js
popup.html
popup.js
crypto.js (if included)
Click Select Folder

✅ The AudioShield icon will appear in the browser toolbar.

🎧 Usage Guide
🔹 1. Open AudioShield
Click the extension icon
Launch the main panel
🔹 2. Enter Credentials

Provide:

Password
Salt (Hex value)

⚠️ These must match during encryption and decryption.

🔹 3. Transcription
Click Start Listening
Audio will be converted to text in real time
Click Stop Listening when done
🔹 4. Encrypt & Export
Click Export Encrypted Transcript
Output will be:
Encrypted
Saved as .docx
Stored in Downloads
🔓 5. Decrypting (Integrated)
Navigate to Decryptor section
Upload encrypted file
Enter:
Password
Salt
Click Decrypt

✅ Transcript will be restored and displayed.

🔑 Retrieving Salt (Hex)
Right-click extension → Inspect
Go to Application tab

Navigate to:

Storage → Local Storage
Select extension origin
Locate:
salt
saltHex

📌 Store it securely.

🗂️ Project Structure
AudioShield/
├── manifest.json        → Extension configuration and permissions
├── background.js        → Background event handling and lifecycle control
├── popup.html           → Lightweight popup interface
├── popup.js             → Popup interaction logic
├── panel.html           → Main interface (Transcription + Decryption)
├── panel.js             → Core system controller (UI + workflow logic)
├── audio.js             → Audio capture and microphone handling module
├── crypto.js            → Encryption and decryption logic (PBKDF2, AES-GCM)
├── dictionary.js        → Nigerian English annotation logic
├── styles.css           → UI styling
├── semgrep.yml          → Static analysis security rules (Semgrep)
├── LICENSE              → Project license
├── README.md            → Project documentation
└── .gitignore           → Git ignored files configuration
🔐 Security Design
PBKDF2 Key Derivation
AES-GCM Encryption
Random IV Generation
Client-side Processing Only
⚙️ Requirements
Microsoft Edge / Chromium browser
Microphone access
Developer mode enabled
⚠️ Important Notes
🔐 Password + Salt are required for decryption
❌ No recovery if credentials are lost
💾 Always back up encrypted files
📚 Research Context

This system was developed as part of a study on:
Securing assistive speech-to-text technologies for hearing-impaired students in e-learning environments.

👨‍💻 Author
AudioShield Project

Securing assistive speech-to-text technologies for hearing-impaired students in e-learning environments.
