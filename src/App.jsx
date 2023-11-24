import "./styles/global.css";
import "./styles/hero.css";
import "./styles/about.css";
import "./styles/projects.css";
import TextCircles from "./components/TextCircles";
import About from "./components/About";
import ProjectGrid from "./components/ProjectGrid";
import { motion, useScroll, useSpring } from "framer-motion";

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <div className="App">
      <motion.div id="progress-bar" style={{ scaleX }} />
      <div id="navbar">
        <div id="animation-toggle">Animations</div>
        <nav className="flex-center">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <div id="dark-mode-toggle">Light Mode | Dark Mode</div>
      </div>
      <main>
        <section id="hero">
          <TextCircles />
          <div id="hero-text" className="flex-center">
            <motion.h1
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Kevin Hurley
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              Web Developer
            </motion.h2>
          </div>
          <div id="overlay-upper"></div>
          <div id="overlay-lower"></div>
        </section>
        <About />
        <section id="projects">
          <div className="container">
            <h2>Projects</h2>
            <ProjectGrid />
          </div>
        </section>
        <section id="contact">
          <h2>Contact Me</h2>
        </section>
      </main>
    </div>
  );
}

export default App;
