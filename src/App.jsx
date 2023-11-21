import "./App.css";
import TextCircles from "./components/TextCircles";
import ProjectGrid from "./components/ProjectGrid";
import { motion, useScroll, useSpring } from "framer-motion";
import profilePic from "./img/Portrait-Photo-9-27-22-small.jpg";

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
      <main>
        <section id="hero">
          <TextCircles />
          <div id="hero-text">
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
        <section id="about">
          <h2>About Me</h2>
          <div className="container">
            <div className="left">
              <img src={profilePic} />
            </div>
            <div className="middle">
              <p>
                I started my professional life as a music teacher. In the summer
                of 2022 I decided to use my vacation time to pick up a new
                skill, so I started learning web development. I liked it so much
                I decided to change careers, and in less than I year I got my
                first coding job! Now I create and maintain websites fulltime
                for Bryant University, but I'm available for freelance work as
                well. If you're looking for someone passionate and skilled to
                design, build and deploy a quality website for you, get in
                touch!
              </p>
              <h3 className="experience">Experience</h3>
              <div className="job">
                <div className="job-title">
                  Web Developer - Bryant University
                </div>
                <div className="job-length">February 2023 - Present</div>
                <p className="job-description">
                  I maintain and improve the school's Drupal and Wordpress
                  sites, writing in HTML, Twig, Sass, PHP, and JavaScript. I
                  have created a custom WordPress theme for the university's
                  event sites, and am overseeing the trasition of all WordPress
                  sites from hosting on local servers to WP Engine. I work on
                  templates for a variety of different Drupal entity types.
                </p>
              </div>
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
                <li>Git</li>
              </ul>
            </div>
          </div>
        </section>
        <section id="projects">
          <div className="container">
            <h2>Projects</h2>
            <ProjectGrid />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
