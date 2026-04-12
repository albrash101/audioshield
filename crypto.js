const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const PBKDF2_ITERATIONS = 250000;
const KEY_LENGTH_BITS = 256;
const AES_GCM_TAG_LENGTH = 128;

function hexFromBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  const hex = [];
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i].toString(16).padStart(2, "0");
    hex.push(byte);
  }
  return hex.join("");
}

function bufferFromHex(hex) {
  const length = hex.length / 2;
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    const byte = hex.substr(i * 2, 2);
    result[i] = parseInt(byte, 16);
  }
  return result.buffer;
}

async function deriveKeyFromPassword(password, saltHex) {
  const salt = bufferFromHex(saltHex);
  const passwordBytes = textEncoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256"
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: KEY_LENGTH_BITS
    },
    false,
    ["encrypt", "decrypt"]
  );
  passwordBytes.fill(0);
  return key;
}

function generateRandomSaltHex(lengthBytes = 16) {
  const salt = new Uint8Array(lengthBytes);
  crypto.getRandomValues(salt);
  return hexFromBuffer(salt.buffer);
}

function generateRandomIv() {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  return iv;
}

async function encryptTextToJsonBlob(plaintext, password, existingSaltHex) {
  const saltHex = existingSaltHex && existingSaltHex.trim() ? existingSaltHex.trim() : generateRandomSaltHex();
  const key = await deriveKeyFromPassword(password, saltHex);
  const iv = generateRandomIv();
  const data = textEncoder.encode(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: AES_GCM_TAG_LENGTH
    },
    key,
    data
  );
  const cipherBytes = new Uint8Array(cipherBuffer);
  const base64 = btoa(String.fromCharCode(...cipherBytes));
  cipherBytes.fill(0);
  const payload = {
    version: 1,
    createdAt: new Date().toISOString(),
    crypto: {
      algorithm: "AES-GCM",
      keyDerivation: "PBKDF2",
      hash: "SHA-256",
      iterations: PBKDF2_ITERATIONS,
      keyLength: KEY_LENGTH_BITS,
      tagLength: AES_GCM_TAG_LENGTH,
      saltHex,
      ivHex: hexFromBuffer(iv.buffer)
    },
    data: base64
  };
  const json = JSON.stringify(payload, null, 2);
  return {
    blob: new Blob([json], { type: "application/json" }),
    saltHex
  };
}

async function decryptJsonFileToText(file, password, overrideSaltHex) {
  const text = await file.text();
  const payload = JSON.parse(text);
  if (!payload || !payload.crypto || !payload.data) {
    throw new Error("Invalid encrypted file");
  }
  const saltHex = overrideSaltHex && overrideSaltHex.trim() ? overrideSaltHex.trim() : payload.crypto.saltHex;
  const ivHex = payload.crypto.ivHex;
  if (!saltHex || !ivHex) {
    throw new Error("Missing cryptographic metadata");
  }
  const key = await deriveKeyFromPassword(password, saltHex);
  const cipherString = atob(payload.data);
  const cipherBytes = new Uint8Array(cipherString.length);
  for (let i = 0; i < cipherString.length; i += 1) {
    cipherBytes[i] = cipherString.charCodeAt(i);
  }
  const iv = new Uint8Array(bufferFromHex(ivHex));
  const plainBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: AES_GCM_TAG_LENGTH
    },
    key,
    cipherBytes
  );
  cipherBytes.fill(0);
  const plaintext = textDecoder.decode(plainBuffer);
  return {
    plaintext,
    saltHex
  };
}

export const CryptoUtils = {
  hexFromBuffer,
  bufferFromHex,
  deriveKeyFromPassword,
  generateRandomSaltHex,
  encryptTextToJsonBlob,
  decryptJsonFileToText
};
