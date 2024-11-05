export default function Contact() {
  return (
    <section id="contact" className="flex-center">
      <h2>Contact Me</h2>
      <p>
        Looking for someone capable to join your web team? Need a freelance
        developer to create a bespoke website for your business?
        <br />
        Let's get in touch.
      </p>
      <div id="contact-buttons" className="flex-center">
        <a href="mailto:kevinhurley23@gmail.com" target="blank">
          <i className="fa-regular fa-envelope"></i>
          <span className="contact-label">Email</span>
        </a>
        <a href="https://github.com/kevinhurley23" target="blank">
          <i className="fa-brands fa-github"></i>
          <span className="contact-label">GitHub</span>
        </a>
        <a href="https://linkedin.com/in/kevin-hurley-35a23843" target="blank">
          <i className="fa-brands fa-linkedin-in"></i>
          <span className="contact-label">LinkedIn</span>
        </a>
      </div>
    </section>
  );
}
