import fallback from "../img/code.PNG";

function ProjectCard({ title, tags, buildLink, srcLink, description }) {
  function importAll(r) {
    return r.keys().map(r);
  }

  const thumbs = importAll(require.context("../img/project-thumb"));
  const regex = new RegExp(title);
  let image = thumbs.find((value) => regex.test(value));
  if (!image) {
    image = fallback;
  }

  return (
    <div className={"project-card " + tags.join(" ")}>
      <img src={image} />
      <div className="project-title">
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default ProjectCard;
