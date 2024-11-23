export default defineBackground(() => {
  let links: string[] = [];
  let currentIndex = 0;

  // Listens for messages from popup or content script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "followAll") {
      // Triggers fetching links
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.sendMessage(tabs[0].id, { command: "followAll" });
        }
      });
    }

    if (message.command === "startProcess") {
      // Receives links and start the process
      links = message.links;
      currentIndex = 0;
      openNextTab();
      sendResponse({ success: true });
    }

    if (message.command === "tabCompleted") {
      // Closes the current tab and opens the next link
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.remove(tabs[0].id, () => {
            console.log("Tab closed. Proceeding to the next link...");
            openNextTab();
          });
        }
      });
    }
  });

  function openNextTab() {
    if (currentIndex < links.length) {
      const link = links[currentIndex];
      currentIndex++;
      console.log(`Opening link: ${link}`);

      browser.tabs.create({ url: link }, (tab) => {
        if (tab?.id) {
          // Ensures the content script is loaded before sending the message
          setTimeout(() => {
            browser.tabs.sendMessage(tab.id!, {
              command: "clickButton",
            });
          }, 1000);
        }
      });
    } else {
      console.log("All links processed.");
    }
  }
});
