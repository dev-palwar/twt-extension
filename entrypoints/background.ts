export default defineBackground(() => {
  console.log("Background script loaded.");

  // Listen for messages from popup (App.tsx) or other sources
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "followAll") {
      // Send a message to the content script (active tab)
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          browser.tabs.sendMessage(tabs[0].id, { command: "followAll" });
        }
      });
    }
  });
});
