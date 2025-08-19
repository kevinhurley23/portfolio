import { motion } from "framer-motion";
import thumbFallback from "../img/code-300.png";
import largeFallback from "../img/code-500.png";

export default function ProjectCard({
  title,
  id,
  tags,
  buildLink,
  srcLink,
  description,
  openDetailsModal,
  closeDetailsModal,
}) {
  let thumb;
  let largeImg;
  try {
    thumb = require(`../img/project-thumb/${id}.jpg`);
  } catch (e) {
    thumb = thumbFallback;
  }
  try {
    largeImg = require(`../img/project-large/${id}.jpg`);
  } catch (e) {
    largeImg = largeFallback;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 200 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // const spacelessTitle = title.replace(/\s/g, "-");

  return (
    <>
      <motion.div
        id={id}
        className={"project-card " + tags.join(" ")}
        variants={cardVariants}
        onClick={(event) => openDetailsModal(event)}
      >
        <img src={thumb} />
        <div className="project-title">
          <h3>{title}</h3>
        </div>
      </motion.div>
      <div
        className="project-details"
        data-id={id}
        style={{ display: "none" }}
      >
        <button onClick={() => closeDetailsModal()}>
          <i className="fa-solid fa-x"></i>
        </button>
        <div className="image">
          <img className="large-img" src={largeImg} />
          <img className="thumb" src={thumb} />
        </div>
        <div className="project-title">
          <h3>{title}</h3>
        </div>
        <div className="detail-text">
          <a href={buildLink} target="blank" className="build-link">
            <h3>{title}</h3>
          </a>
          {srcLink && (
            <a href={srcLink} target="blank">
              Source Code
            </a>
          )}
          <div className="tag-row">
            {tags.map((tag) => (
              <div className="tag">{tag}</div>
            ))}
          </div>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
}
