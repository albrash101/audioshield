chrome.runtime.onInstalled.addListener(() => {});

chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL("panel.html");
  if (chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url });
  }
});

