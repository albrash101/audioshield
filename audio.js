import { NigerianDictionary } from "./dictionary.js";

const AudioState = {
  stream: null,
  audioContext: null,
  mediaStreamSource: null,
  recognition: null,
  isListening: false,
  shouldAutoRestart: false,
  sensitivityHigh: false
};

function getSpeechRecognitionConstructor() {
  const globalScope = typeof window !== "undefined" ? window : self;
  return globalScope.SpeechRecognition || globalScope.webkitSpeechRecognition || null;
}

async function createAudioStream() {
  const constraints = {
    audio: AudioState.sensitivityHigh
      ? {
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: true,
          channelCount: 1
        }
      : {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
          channelCount: 1
        }
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream;
}

function buildGrammarList() {
  const GrammarCtor = window.SpeechGrammarList || window.webkitSpeechGrammarList || null;
  if (!GrammarCtor) return null;
  const entries = NigerianDictionary && NigerianDictionary.entries ? NigerianDictionary.entries : {};
  const terms = Object.keys(entries).filter((t) => typeof t === "string" && !/\s/.test(t)).slice(0, 500);
  if (!terms.length) return null;
  const grammar = `#JSGF V1.0; grammar dict; public <term> = ${terms.join(" | ")} ;`;
  const list = new GrammarCtor();
  try {
    list.addFromString(grammar, 1.0);
    return list;
  } catch {
    return null;
  }
}

function ensureAudioContext(stream) {
  if (!AudioState.audioContext) {
    AudioState.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: "interactive"
    });
  }
  if (!AudioState.mediaStreamSource) {
    AudioState.mediaStreamSource = AudioState.audioContext.createMediaStreamSource(stream);
    const dest = AudioState.audioContext.createGain();
    dest.gain.value = 0;
    AudioState.mediaStreamSource.connect(dest);
    dest.connect(AudioState.audioContext.destination);
  }
}

function stopAudioStream() {
  if (AudioState.stream) {
    AudioState.stream.getTracks().forEach((track) => track.stop());
    AudioState.stream = null;
  }
  if (AudioState.mediaStreamSource) {
    AudioState.mediaStreamSource.disconnect();
    AudioState.mediaStreamSource = null;
  }
  if (AudioState.audioContext) {
    AudioState.audioContext.close();
    AudioState.audioContext = null;
  }
}

function stopRecognition() {
  if (AudioState.recognition) {
    AudioState.recognition.onresult = null;
    AudioState.recognition.onerror = null;
    AudioState.recognition.onend = null;
    try {
      AudioState.recognition.stop();
    } catch (e) {}
    AudioState.recognition = null;
  }
}

async function startListening(onResult, onStatus) {
  if (AudioState.isListening) {
    return { supported: true };
  }
  const RecognitionCtor = getSpeechRecognitionConstructor();
  if (!RecognitionCtor) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { supported: false };
    }
    try {
      AudioState.stream = await createAudioStream();
      ensureAudioContext(AudioState.stream);
      AudioState.isListening = true;
      if (onStatus) {
        onStatus("listening-no-stt");
      }
      return { supported: false };
    } catch (e) {
      stopAudioStream();
      return { supported: false };
    }
  }
  AudioState.stream = await createAudioStream();
  ensureAudioContext(AudioState.stream);
  const recognition = new RecognitionCtor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = "en-NG";
  try {
    await AudioState.audioContext.resume();
  } catch {}
  const grammars = buildGrammarList();
  if (grammars) {
    recognition.grammars = grammars;
  }
  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        transcript += " ";
      }
    }
    onResult(transcript, event);
  };
  recognition.onaudiostart = () => {
    if (onStatus) onStatus("audio-start");
  };
  recognition.onsoundstart = () => {
    if (onStatus) onStatus("sound-start");
  };
  recognition.onspeechstart = () => {
    if (onStatus) onStatus("speech-start");
  };
  recognition.onsoundend = () => {
    if (onStatus) onStatus("sound-end");
  };
  recognition.onspeechend = () => {
    if (onStatus) onStatus("speech-end");
  };
  recognition.onerror = (event) => {
    const err = event.error || "Speech recognition error";
    if (err === "no-speech" || err === "no-match" || err === "aborted" || err === "network") {
      if (onStatus) onStatus("recovering", err);
      return;
    }
    if (onStatus) onStatus("error", err);
  };
  recognition.onend = () => {
    AudioState.isListening = false;
    stopAudioStream();
    if (onStatus) {
      onStatus("stopped");
    }
    if (AudioState.shouldAutoRestart) {
      startListening(onResult, onStatus).catch(() => {});
    }
  };
  AudioState.recognition = recognition;
  AudioState.isListening = true;
  AudioState.shouldAutoRestart = true;
  recognition.start();
  if (onStatus) {
    onStatus("listening");
  }
  return { supported: true };
}

function stopListening() {
  AudioState.isListening = false;
  AudioState.shouldAutoRestart = false;
  stopRecognition();
  stopAudioStream();
}

function setSensitivityMode(high) {
  AudioState.sensitivityHigh = !!high;
}

export const AudioUtils = {
  startListening,
  stopListening,
  getSpeechRecognitionConstructor,
  setSensitivityMode
};
