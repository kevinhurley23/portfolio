import "./App.css";
import TextCircles from "./components/TextCircles";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="App">
      <main>
        <section id="hero">
          {/* <TextCircles /> */}
          <div id="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Kevin Hurley
            </motion.h1>
            <motion.h3
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              Web Developer
            </motion.h3>
          </div>
          <div id="overlay-upper"></div>
          <div id="overlay-lower"></div>
        </section>
        <section id="about">
          <div className="container">
            <div className="left">
              <img src="img/Portrait-Photo-9-27-22-small.jpg" alt="" />
            </div>
            <div className="middle">
              <h3>About Me</h3>
              <p>
                I started my professional life as a music teacher. In the summer
                of 2022 I decided to use my vacation time to pick up a new
                skill, so I started learning web development. I liked it so much
                I decided to change careers, and in less than I year I got my
                first coding job!
              </p>
            </div>
            <div className="right">
              <h3>Skills</h3>
              <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>Sass</li>
                <li>Bootstrap</li>
                <li>JavaScript</li>
                <li>jQuery</li>
                <li>React</li>
                <li>Drupal</li>
                <li>WordPress</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
