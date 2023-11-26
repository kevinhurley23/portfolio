import profilePic from "../img/Portrait-Photo-9-27-22-small.jpg";

export default function About() {
  return (
    <section id="about">
      <h2>About Me</h2>
      <div className="row">
        <div className="left">
          <img src={profilePic} />
        </div>
        <div className="middle">
          <p id="introduction">
            I started my professional life as a music teacher. In the summer of
            2022 I decided to use my vacation time to pick up a new skill, so I
            started learning web development. I liked it so much I decided to
            change careers, and in less than I year I got my first coding job!
            Now I create and maintain websites fulltime for Bryant University,
            but I'm available for freelance work as well. If you're looking for
            someone passionate and skilled to design, build and deploy a quality
            website for you, get in touch!
          </p>
          <h3 className="experience">Experience</h3>
          <div className="job">
            <div className="job-title">Web Developer - Bryant University</div>
            <div className="job-length">February 2023 - Present</div>
            <p className="job-description">
              I maintain and improve the school's Drupal and Wordpress sites,
              writing in HTML, Twig, Sass, PHP, and JavaScript. I have created a
              custom WordPress theme for the university's event sites, and am
              overseeing the trasition of all WordPress sites from hosting on
              local servers to WP Engine. I work on templates for a variety of
              different Drupal entity types.
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
  );
}
