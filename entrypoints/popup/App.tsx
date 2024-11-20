import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
  const handleClick = () => {
    browser.runtime.sendMessage({ command: "followAll" });
  };

  return (
    <div>
      <h2>Follow all</h2>
      <button onClick={handleClick}>Click to Follow</button>
    </div>
  );
}

export default App;
