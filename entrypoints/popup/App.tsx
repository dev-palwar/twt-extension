import "./App.css";

function App() {
  const handleClick = () => {
    browser.runtime.sendMessage({ command: "followAll", limit: 5 });
  };

  return (
    <div>
      <h2>Follow all</h2>
      <button onClick={handleClick}>Click to Follow</button>
    </div>
  );
}

export default App;
