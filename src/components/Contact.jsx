import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="flex-center">
      <h2>Contact Me</h2>
      <p>
        Looking for someone capable to join your web team? Need a freelance
        developer to create a bespoke website for your business? Let's get in
        touch.
      </p>
      <div id="contact-buttons" className="flex-center">
        <div className="button-and-label flex-center">
          <div className="contact-button">
            <a href="mailto:kevinhurley23@gmail.com" target="blank">
              <motion.i
                whileHover={{ scale: 1.2 }}
                className="fa-regular fa-envelope"
              ></motion.i>
            </a>
          </div>
          <div className="contact-label">Email</div>
        </div>
        <div className="button-and-label flex-center">
          <div className="contact-button">
            <a href="https://github.com/kevinhurley23" target="blank">
              <motion.i
                whileHover={{ scale: 1.2 }}
                className="fa-brands fa-github"
              ></motion.i>
            </a>
          </div>
          <div className="contact-label">GitHub</div>
        </div>
        <div className="button-and-label flex-center">
          <div className="contact-button">
            <a
              href="https://linkedin.com/in/kevin-hurley-35a23843"
              target="blank"
            >
              <motion.i
                whileHover={{ scale: 1.2 }}
                className="fa-brands fa-linkedin-in"
              ></motion.i>
            </a>
          </div>
          <div className="contact-label">LinkedIn</div>
        </div>
      </div>
    </section>
  );
}
