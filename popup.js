(() => {
  const btn = document.getElementById('openPanelBtn');

  btn.addEventListener('click', async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted.");
    } catch (err) {
      console.warn("Mic permission denied or delayed:", err);
    }

    chrome.runtime.sendMessage({ type: 'OPEN_AUDIO_SHIELD_PANEL' }, (resp) => {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 400);
    });
  });
})();
