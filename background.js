chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_AUDIO_SHIELD_PANEL') {
    const panelUrl = chrome.runtime.getURL('panel.html');
    // Fixed-ish panel size for reliability
    const width = 700;
    const height = 520;
    chrome.windows.create({
      url: panelUrl,
      type: 'popup',
      left: 100,
      top: 100,
      width: width,
      height: height
    }, (win) => {
      sendResponse({ ok: true, id: win?.id });
    });
    return true;
  }
});