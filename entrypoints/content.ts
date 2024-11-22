export default defineContentScript({
  matches: ["*://x.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.command === "followAll") {
        // Extracts all the profile links from the home feed
        const avatarLinks = document.querySelectorAll(
          'div[data-testid="Tweet-User-Avatar"] a[href^="/"]'
        );

        if (avatarLinks.length === 0) {
          console.log("No profile links found.");
          return;
        }

        const links = Array.from(avatarLinks).map(
          (link) => (link as HTMLAnchorElement).href
        );

        // Sends the list of links to the background script
        browser.runtime.sendMessage({ command: "startProcess", links });
      }

      if (message.command === "clickButton") {
        const tryClickButton = () => {
          const button = document.querySelector(
            ".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-2yi16.r-1qi8awa.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l"
          );

          if (button) {
            // Safety check if the button exists before accessing it
            const ariaLabel = button.getAttribute("aria-label");

            // Check for Follow button
            if (ariaLabel && ariaLabel.split(" ")[0] == "Follow") {
              (button as HTMLElement).click();
              console.log("Follow button clicked successfully.");

              // Waiting for the action and send message
              setTimeout(() => {
                browser.runtime.sendMessage({ command: "tabCompleted" });
                sendResponse({ success: true });
              }, 2000);

              // Checking for Subscribe button
            } else if (ariaLabel && ariaLabel.split(" ")[0] == "Subscribe") {
              console.log("Subscribe button found. Closing the tab.");

              setTimeout(() => {
                browser.runtime.sendMessage({ command: "tabCompleted" });
                sendResponse({ success: true });
              }, 2000);

              // Check for Unfollow button
            } else if (ariaLabel && ariaLabel.split(" ")[0] == "Following") {
              console.log("Unfollow button found. Closing the tab.");

              setTimeout(() => {
                browser.runtime.sendMessage({ command: "tabCompleted" });
                sendResponse({ success: true });
              }, 2000);
            }
          } else {
            console.log("Button not found. Retrying...");
            // Retries after a delay if the button is not found
            setTimeout(tryClickButton, 2000);
          }
        };

        setTimeout(() => {
          tryClickButton();
        }, 1000);
      }
    });
  },
});
