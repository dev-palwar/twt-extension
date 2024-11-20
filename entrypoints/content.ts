export default defineContentScript({
  matches: ["*://twitter.com/*"],
  main() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.command === "followAll") {
        // Target the element with id "SIvCob" and change its color to red
        const element = document.getElementById("SIvCob");
        if (element) {
          element.style.color = "red";
        } else {
          console.log('Element with ID "SIvCob" not found.');
        }
      }
    });
  },
});
