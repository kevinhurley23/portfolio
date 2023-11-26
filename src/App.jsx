import { useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/about.css";
import "./styles/projects.css";
import "./styles/contact.css";
import TextCircles from "./components/TextCircles";
import About from "./components/About";
import ProjectGrid from "./components/ProjectGrid";
import Switch from "./components/Switch";
import Contact from "./components/Contact";

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [animationsOn, setAnimationsOn] = useState(!prefersReducedMotion);
  const toggleAnimations = () => setAnimationsOn(!animationsOn);

  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <div className="App transition" data-theme={darkMode ? "dark" : "light"}>
      <motion.div id="progress-bar" style={{ scaleX }} />
      <motion.div
        id="navbar"
        className="transition"
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div id="animation-toggle" className="toggle-container">
          <Switch state={animationsOn} func={toggleAnimations} />
          <div
            className="transition"
            style={animationsOn ? { color: "var(--primary)" } : {}}
          >
            Animations
          </div>
        </div>
        <nav className="flex-center">
          <a href="#about" className="transition">
            About
          </a>
          <a href="#projects" className="transition">
            Projects
          </a>
          <a href="#contact" className="transition">
            Contact
          </a>
        </nav>
        <div id="dark-mode-toggle" className="toggle-container">
          <div>
            <i
              className="fa-solid fa-sun transition"
              style={darkMode ? {} : { color: "var(--primary)" }}
            ></i>
          </div>
          <Switch state={darkMode} func={toggleDarkMode} />
          <div>
            <i
              className="fa-solid fa-moon transition"
              style={darkMode ? { color: "var(--primary)" } : {}}
            ></i>
          </div>
        </div>
      </motion.div>
      <section id="hero">
        <TextCircles animationsOn={animationsOn} />
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
            // transition={{ delay: 0.2, duration: 1 }}
            className="transition"
          >
            Web Developer
          </motion.h2>
        </div>
      </section>
      <main>
        <div className="container">
          <About />
          <section id="projects">
            <h2>Projects</h2>
            <ProjectGrid />
          </section>
          <Contact />
        </div>
      </main>
    </div>
  );
}
