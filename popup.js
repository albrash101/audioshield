const openPanelBtn = document.getElementById("open-panel");

function openPanel() {
  const url = chrome.runtime.getURL("panel.html");
  if (chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url });
  } else if (chrome.windows && chrome.windows.create) {
    chrome.windows.create({ url, type: "popup", width: 900, height: 700 });
  }
}

if (openPanelBtn) {
  openPanelBtn.addEventListener("click", openPanel);
}

