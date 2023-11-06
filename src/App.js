import "./App.css";
import TextCircles from "./components/TextCircles";

function App() {
  return (
    <div className="App">
      <div id="hero">
        <TextCircles />
        <div id="hero-text">
          <h1>Kevin Hurley</h1>
          <h3>Web Developer</h3>
        </div>
        <div id="overlay-upper"></div>
        <div id="overlay-lower"></div>
      </div>
    </div>
  );
}

export default App;
