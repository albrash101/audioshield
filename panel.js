import { CryptoUtils } from "./crypto.js";
import { AudioUtils } from "./audio.js";
import { NigerianDictionary } from "./dictionary.js";

const tabs = {
  transcribe: document.getElementById("tab-transcribe"),
  decrypt: document.getElementById("tab-decrypt")
};

const tabPanels = {
  transcribe: document.getElementById("panel-transcribe"),
  decrypt: document.getElementById("panel-decrypt")
};

const txPasswordInput = document.getElementById("tx-password");
const txSetKeyButton = document.getElementById("tx-set-key");
const txSaltInput = document.getElementById("tx-salt");
const txCopySaltButton = document.getElementById("tx-copy-salt");
const txStartButton = document.getElementById("tx-start");
const txStopButton = document.getElementById("tx-stop");
const txStatus = document.getElementById("tx-status");
const txTranscriptEl = document.getElementById("tx-transcript");
const txClearButton = document.getElementById("tx-clear");
const txExportEncryptedButton = document.getElementById("tx-export-encrypted");
const txHighSensitivity = document.getElementById("tx-high-sensitivity");

const decPasswordInput = document.getElementById("dec-password");
const decSaltInput = document.getElementById("dec-salt");
const decLoadFileButton = document.getElementById("dec-load-file");
const decDecryptButton = document.getElementById("dec-decrypt");
const decClearButton = document.getElementById("dec-clear");
const decStatus = document.getElementById("dec-status");
const decTranscriptEl = document.getElementById("dec-transcript");
const decExportRtfButton = document.getElementById("dec-export-rtf");
const decExportEncryptedButton = document.getElementById("dec-export-encrypted");
let exportCounter = 1;
const hiddenFileInput = document.getElementById("hidden-file-input");

let currentTranscript = "";
let lastFinalizedTranscript = "";
let hasKeyForTranscription = false;
let loadedEncryptedFile = null;
let decryptedPlaintext = "";

function setStatus(element, message) {
  if (element) {
    element.textContent = message || "";
  }
}

function switchTab(target) {
  const key = target === "decrypt" ? "decrypt" : "transcribe";
  ["transcribe", "decrypt"].forEach((name) => {
    const tab = tabs[name];
    const panel = tabPanels[name];
    const isActive = name === key;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.tabIndex = isActive ? 0 : -1;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "true");
    }
  });
}

function handleTabKeydown(event) {
  const order = ["transcribe", "decrypt"];
  const currentIndex = order.indexOf(event.target.id === "tab-decrypt" ? "decrypt" : "transcribe");
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % order.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + order.length) % order.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = order.length - 1;
  } else {
    return;
  }
  event.preventDefault();
  const nextName = order[nextIndex];
  const nextTab = nextName === "decrypt" ? tabs.decrypt : tabs.transcribe;
  switchTab(nextName);
  nextTab.focus();
}

async function handleSetEncryptionKey() {
  const password = txPasswordInput.value || "";
  if (!password) {
    setStatus(txStatus, "Enter a password before deriving a key.");
    return;
  }
  const saltHex = CryptoUtils.generateRandomSaltHex();
  txSaltInput.value = saltHex;
  hasKeyForTranscription = true;
  setStatus(txStatus, "Encryption key ready. You can start listening.");
}

async function handleStartListening() {
  if (!hasKeyForTranscription) {
    setStatus(txStatus, "Set the encryption key before starting transcription.");
    return;
  }
  if (!AudioUtils.getSpeechRecognitionConstructor()) {
    setStatus(txStatus, "Speech recognition is unavailable in this browser.");
    return;
  }
  AudioUtils.setSensitivityMode(!!(txHighSensitivity && txHighSensitivity.checked));
  txStartButton.disabled = true;
  txStopButton.disabled = false;
  setStatus(txStatus, "Requesting microphone access and starting listening...");
  try {
    await AudioUtils.startListening((partialText, event) => {
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal) {
        lastFinalizedTranscript += partialText;
        currentTranscript = lastFinalizedTranscript;
        txTranscriptEl.textContent = currentTranscript;
      } else {
        // Show live interim words appended after stable finalized prefix
        currentTranscript = lastFinalizedTranscript + partialText;
        txTranscriptEl.textContent = currentTranscript;
      }
      if (currentTranscript.trim().length > 0) {
        txExportEncryptedButton.disabled = false;
      }
    }, (status, detail) => {
      if (status === "listening") {
        setStatus(txStatus, "Listening... speak clearly near the microphone.");
      } else if (status === "listening-no-stt") {
        setStatus(txStatus, "Microphone active but speech recognition unsupported.");
      } else if (status === "audio-start") {
        setStatus(txStatus, "Audio stream started.");
      } else if (status === "sound-start") {
        setStatus(txStatus, "Sound detected.");
      } else if (status === "speech-start") {
        setStatus(txStatus, "Speech detected.");
      } else if (status === "sound-end") {
        setStatus(txStatus, "Sound paused...");
      } else if (status === "speech-end") {
        setStatus(txStatus, "Speech paused...");
      } else if (status === "recovering") {
        setStatus(txStatus, "Recovering from noise or pause...");
      } else if (status === "error") {
        setStatus(txStatus, detail || "Speech recognition error.");
      } else if (status === "stopped") {
        txStartButton.disabled = false;
        txStopButton.disabled = true;
      }
    });
  } catch (e) {
    setStatus(txStatus, "Unable to start listening. Check microphone permissions.");
    txStartButton.disabled = false;
    txStopButton.disabled = true;
  }
}

function handleStopListening() {
  AudioUtils.stopListening();
  txStartButton.disabled = false;
  txStopButton.disabled = true;
  setStatus(txStatus, "Listening stopped.");
}

function clearSensitiveTranscriptionState() {
  currentTranscript = "";
  lastFinalizedTranscript = "";
  hasKeyForTranscription = false;
  if (txPasswordInput.value) {
    txPasswordInput.value = "";
  }
  if (txSaltInput.value) {
    txSaltInput.value = "";
  }
}

function handleClearTranscription() {
  AudioUtils.stopListening();
  clearSensitiveTranscriptionState();
  txTranscriptEl.textContent = "";
  setStatus(txStatus, "");
  txStartButton.disabled = false;
  txStopButton.disabled = true;
  txExportEncryptedButton.disabled = true;
}

async function handleExportEncryptedTranscript() {
  if (!currentTranscript || !currentTranscript.trim()) {
    setStatus(txStatus, "Nothing to encrypt yet.");
    return;
  }
  const password = txPasswordInput.value || "";
  const saltHexExisting = txSaltInput.value || "";
  if (!password) {
    setStatus(txStatus, "Enter the password used for this transcript.");
    return;
  }
  setStatus(txStatus, "Encrypting transcript...");
  try {
    const { blob, saltHex } = await CryptoUtils.encryptTextToJsonBlob(currentTranscript, password, saltHexExisting);
    txSaltInput.value = saltHex;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    anchor.download = `audioshield-${timestamp}.audioshield`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setStatus(txStatus, "Encrypted transcript exported.");
  } catch (e) {
    setStatus(txStatus, "Encryption failed. Try again.");
  }
}

function handleCopySalt() {
  const value = txSaltInput.value || "";
  if (!value) {
    return;
  }
  navigator.clipboard.writeText(value).then(() => {
    setStatus(txStatus, "Salt copied to clipboard.");
  }).catch(() => {
    setStatus(txStatus, "Unable to copy salt.");
  });
}

function clearDecryptionState() {
  decryptedPlaintext = "";
  loadedEncryptedFile = null;
  decTranscriptEl.innerHTML = "";
  setStatus(decStatus, "");
  if (decExportRtfButton) decExportRtfButton.disabled = true;
  if (decExportEncryptedButton) decExportEncryptedButton.disabled = true;
}

function handleClearDecryptor() {
  clearDecryptionState();
  decPasswordInput.value = "";
  decSaltInput.value = "";
  if (hiddenFileInput) {
    hiddenFileInput.value = "";
  }
}

function openFilePicker() {
  if (!hiddenFileInput) {
    return;
  }
  hiddenFileInput.click();
}

function handleFileChosen(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }
  loadedEncryptedFile = file;
  setStatus(decStatus, `Loaded file: ${file.name}`);
  decExportEncryptedButton.disabled = false;
}

function applyBasicPunctuation(text) {
  let normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  normalized = normalized.replace(/([a-z0-9])\s+([A-Z])/g, "$1. $2");
  if (!/[.!?]$/.test(normalized)) {
    normalized += ".";
  }
  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const paragraphs = [];
  let buffer = [];
  let charCount = 0;
  sentences.forEach((sentence, index) => {
    buffer.push(sentence);
    charCount += sentence.length;
    // Create paragraphs of 3-5 sentences or ~400+ chars, whichever comes first
    const endOfGroup = buffer.length >= 4 || charCount >= 400 || index === sentences.length - 1;
    if (endOfGroup) {
      paragraphs.push(buffer.join(" "));
      buffer = [];
      charCount = 0;
    }
  });
  return paragraphs.join("\n\n");
}

function capitalizeSentences(text) {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
}

function highlightNigerianTerms(htmlText) {
  const entries = NigerianDictionary && NigerianDictionary.entries ? NigerianDictionary.entries : null;
  const dict = entries ? Object.keys(entries) : (NigerianDictionary && Array.isArray(NigerianDictionary.terms) ? NigerianDictionary.terms : []);
  if (!dict.length) {
    return htmlText;
  }
  let result = htmlText;
  dict.forEach((term) => {
    if (!term || typeof term !== "string") {
      return;
    }
    const meaning = entries ? entries[term] : "";
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b(${escaped})\\b`, "gi");
    result = result.replace(pattern, (match) => {
      const annotated = `<span class="highlight-term">${match}</span>${meaning ? ` (${meaning})` : ""}`;
      return annotated;
    });
  });
  return result;
}

function decorateTranscriptForExport(text) {
  const entries = NigerianDictionary && NigerianDictionary.entries ? NigerianDictionary.entries : null;
  const dict = entries ? Object.keys(entries) : (NigerianDictionary && Array.isArray(NigerianDictionary.terms) ? NigerianDictionary.terms : []);
  if (!dict.length) {
    return text;
  }
  let result = text;
  dict.forEach((term) => {
    if (!term || typeof term !== "string") {
      return;
    }
    const meaning = entries ? entries[term] : "";
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b(${escaped})\\b`, "gi");
    result = result.replace(pattern, (match) => {
      const annotated = `**${match}**${meaning ? ` (${meaning})` : ""}`;
      return annotated;
    });
  });
  return result;
}

async function handleDecryptTranscript() {
  if (!loadedEncryptedFile) {
    setStatus(decStatus, "Load an encrypted transcript file first.");
    return;
  }
  const password = decPasswordInput.value || "";
  if (!password) {
    setStatus(decStatus, "Enter the password used at encryption time.");
    return;
  }
  const saltHex = decSaltInput.value || "";
  setStatus(decStatus, "Decrypting transcript...");
  try {
    const result = await CryptoUtils.decryptJsonFileToText(loadedEncryptedFile, password, saltHex);
    decryptedPlaintext = result.plaintext;
    if (!decSaltInput.value && result.saltHex) {
      decSaltInput.value = result.saltHex;
    }
    const withPunctuation = applyBasicPunctuation(decryptedPlaintext);
    const capitalized = capitalizeSentences(withPunctuation);
    const dateHeader = new Date().toLocaleString();
    const decorated = highlightNigerianTerms(capitalized);
    const html = `<div class="dec-date">${dateHeader}</div><p>${decorated.replace(/\n\n/g, "</p><p>")}</p>`;
    decTranscriptEl.innerHTML = html;
    decExportRtfButton.disabled = false;
    setStatus(decStatus, "Transcript decrypted.");
  } catch (e) {
    decryptedPlaintext = "";
    decTranscriptEl.textContent = "";
    decExportRtfButton.disabled = true;
    decExportEncryptedButton.disabled = !!loadedEncryptedFile ? false : true;
    setStatus(decStatus, "Decryption failed. Check password and salt.");
  }
}

function rtfEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/\{/g, "\\{").replace(/\}/g, "\\}");
}

function decorateTranscriptForRtf(text) {
  const entries = NigerianDictionary && NigerianDictionary.entries ? NigerianDictionary.entries : null;
  const dict = entries ? Object.keys(entries) : (NigerianDictionary && Array.isArray(NigerianDictionary.terms) ? NigerianDictionary.terms : []);
  if (!dict.length) {
    return rtfEscape(text);
  }
  let result = text;
  dict.forEach((term) => {
    if (!term || typeof term !== "string") {
      return;
    }
    const meaning = entries ? entries[term] : "";
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b(${escapedTerm})\\b`, "gi");
    result = result.replace(pattern, (match) => {
      const annBold = `__RTF_BOLD_START__${match}__RTF_BOLD_END__`;
      const annMeaning = meaning ? ` (${meaning})` : "";
      return `${annBold}${annMeaning}`;
    });
  });
  result = rtfEscape(result);
  result = result.replace(/__RTF_BOLD_START__/g, "\\b ").replace(/__RTF_BOLD_END__/g, " \\b0");
  return result;
}

function handleExportDecryptedRtf() {
  if (!decryptedPlaintext) {
    setStatus(decStatus, "Nothing to export.");
    return;
  }
  const withPunctuation = applyBasicPunctuation(decryptedPlaintext);
  const capitalized = capitalizeSentences(withPunctuation);
  const dateHeader = new Date().toLocaleString();
  const decorated = decorateTranscriptForRtf(capitalized);
  const paragraphs = decorated.split(/\n\n/).map(p => `${p}\\par`).join("\\par ");
  const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Segoe UI;}}\\fs22 ${rtfEscape(dateHeader)}\\par\\par ${paragraphs}}`;
  const blob = new Blob([rtf], { type: "application/rtf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `audioshield-decrypted-${timestamp}(${exportCounter}).rtf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  exportCounter += 1;
  setStatus(decStatus, "Decrypted transcript exported as RTF.");
}

async function handleExportEncryptedOriginal() {
  if (!loadedEncryptedFile) {
    setStatus(decStatus, "No encrypted file loaded.");
    return;
  }
  try {
    const buffer = await loadedEncryptedFile.arrayBuffer();
    const blob = new Blob([buffer], { type: loadedEncryptedFile.type || "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    anchor.href = url;
    anchor.download = `audioshield-encrypted-${timestamp}(${exportCounter}).audioshield`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    exportCounter += 1;
    setStatus(decStatus, "Encrypted transcript exported.");
  } catch {
    setStatus(decStatus, "Export failed. Try again.");
  }
}

function wireEvents() {
  tabs.transcribe.addEventListener("click", () => switchTab("transcribe"));
  tabs.decrypt.addEventListener("click", () => switchTab("decrypt"));
  tabs.transcribe.addEventListener("keydown", handleTabKeydown);
  tabs.decrypt.addEventListener("keydown", handleTabKeydown);

  txSetKeyButton.addEventListener("click", handleSetEncryptionKey);
  txStartButton.addEventListener("click", handleStartListening);
  txStopButton.addEventListener("click", handleStopListening);
  txClearButton.addEventListener("click", handleClearTranscription);
  txExportEncryptedButton.addEventListener("click", handleExportEncryptedTranscript);
  txCopySaltButton.addEventListener("click", handleCopySalt);

  decLoadFileButton.addEventListener("click", openFilePicker);
  if (hiddenFileInput) {
    hiddenFileInput.addEventListener("change", handleFileChosen);
  }
  decDecryptButton.addEventListener("click", handleDecryptTranscript);
  decClearButton.addEventListener("click", handleClearDecryptor);
  decExportRtfButton.addEventListener("click", handleExportDecryptedRtf);
  decExportEncryptedButton.addEventListener("click", handleExportEncryptedOriginal);
}

wireEvents();
