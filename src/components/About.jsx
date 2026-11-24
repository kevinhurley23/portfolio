import profilePic from "../img/Portrait-Photo-9-7-24_03.jpg";
import { experience } from "../content/experience/experience.js";

export default function About() {
  return (
    <section id="about">
      <h2>About Me</h2>
      <div className="row">
        <div className="left">
          <img src={profilePic} />
        </div>
        <div className="middle">
          <div className="prose">
            {/* src\content\aboutMe.md */}
          </div>
          <h3>Technical Approach</h3>
          <div className="prose">
            {/* src\content\technicalApproach.md */}
          </div>
          <h3 className="experience">Experience</h3>
          {experience.map(role => (
            <div key={role.id} className="job">
              <div className="job-title">{role.title} - {role.employer}</div>
              <div className="job-length">{role.start} - {role.end || 'Present'}</div>
              <div className="prose">
                {/* description from .md file referenced in role.description */}
              </div>
            </div>
          ))}
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
            <li>Svelte</li>
            <li>Astro</li>
            <li>PHP</li>
            <li>Drupal</li>
            <li>WordPress</li>
            <li>Git</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
