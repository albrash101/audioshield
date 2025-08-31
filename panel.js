(() => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const exportBtn = document.getElementById('exportBtn');
  const setKeyBtn = document.getElementById('setKeyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const passwordInput = document.getElementById('password');
  const saltInput = document.getElementById('saltHex');
  const transcriptDiv = document.getElementById('transcript');
  const interimDiv = document.getElementById('interim');
  const statusDiv = document.getElementById('status');

  let recognition;
  let isListening = false;
  let transcripts = [];
  let cryptoKey = null;

  async function deriveKey(password, saltHex) {
    const saltBytes = hexToBytes(saltHex);
    const baseKey = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password),
      { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 128 },
      false, ["encrypt", "decrypt"]
    );
  }

  function hexToBytes(hex) {
    if (!hex || hex.length % 2 !== 0) return null;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  async function encryptText(text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      new TextEncoder().encode(text)
    );
    const encB64 = btoa(String.fromCharCode(...new Uint8Array(encBuf)));
    return {
      encrypted: encB64,
      ivHex: Array.from(iv).map(n => n.toString(16).padStart(2, '0')).join('')
    };
  }

  async function decryptText(encB64, ivHex) {
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(h => parseInt(h, 16)));
    const ct = new Uint8Array(atob(encB64).split("").map(ch => ch.charCodeAt(0)));
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ct);
    return new TextDecoder().decode(plainBuf);
  }

  setKeyBtn.onclick = async () => {
    const password = passwordInput.value.trim();
    const saltHex = saltInput.value.trim();
    if (!password || !saltHex || saltHex.length % 2 !== 0) {
      statusDiv.textContent = "❌ Invalid password or salt.";
      return;
    }
    try {
      cryptoKey = await deriveKey(password, saltHex);
      statusDiv.textContent = "✅ Encryption key set.";
    } catch (err) {
      console.error(err);
      statusDiv.textContent = "❌ Failed to derive key.";
    }
  };

  startBtn.onclick = () => {
    if (!cryptoKey) {
      statusDiv.textContent = "❌ Set encryption key first.";
      return;
    }

    
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      statusDiv.textContent = "🎙️ Listening...";
      interimDiv.textContent = '';
    };

recognition.interimResults = true;

let currentLine = document.createElement("p");
transcriptDiv.appendChild(currentLine);

recognition.onresult = async (event) => {
  let interimText = "";

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const result = event.results[i];
    const text = result[0].transcript.trim();

    if (result.isFinal) {
      try {
        const enc = await encryptText(text);
        transcripts.push({ ts: Date.now(), enc: enc.encrypted, ivHex: enc.ivHex });
        const decrypted = await decryptText(enc.encrypted, enc.ivHex);

        // Split final transcript into words and append each
        const words = decrypted.split(/\s+/);
        words.forEach(word => {
        let interimEl = document.getElementById("interim");
if (!interimEl) {
  interimEl = document.createElement("p");
  interimEl.id = "interim";
  interimEl.style.color = "#ccc"; // optional: light gray
  transcriptDiv.appendChild(interimEl);
}
interimEl.textContent = interimText;
  
        });

        // Reset current line
        currentLine = document.createElement("p");
        transcriptDiv.appendChild(currentLine);
      } catch (err) {
        console.error("Encryption failed", err);
        statusDiv.textContent = "❌ Encryption error.";
      }
    } else {
      // Show interim words in current line
      interimText = text;
      currentLine.textContent = interimText;
    }
  }
};


    recognition.onerror = (event) => {
      statusDiv.textContent = "❌ Error: " + event.error;
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
      else statusDiv.textContent = "Idle";
    };

    recognition.start();
    isListening = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  stopBtn.onclick = () => {
    if (recognition) recognition.stop();
    isListening = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusDiv.textContent = "Stopped.";
  };

  clearBtn.onclick = () => {
    transcriptDiv.textContent = '';
    interimDiv.textContent = '';
    transcripts = [];
    statusDiv.textContent = 'Transcript cleared.';
  };

  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(transcripts, null, 2)], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'AudioShield_transcripts_encrypted.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
})();
