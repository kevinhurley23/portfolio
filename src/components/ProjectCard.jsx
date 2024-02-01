import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import thumbFallback from "../img/code-300.png";
import largeFallback from "../img/code-500.png";

export default function ProjectCard({
  title,
  tags,
  buildLink,
  srcLink,
  description,
}) {
  function importAll(r) {
    return r.keys().map(r);
  }

  const thumbs = importAll(require.context("../img/project-thumb"));
  const largeImgs = importAll(require.context("../img/project-large"));
  const regex = new RegExp(title);
  let thumb = thumbs.find((value) => regex.test(value));
  let largeImg = largeImgs.find((value) => regex.test(value));
  if (!thumb) {
    thumb = thumbFallback;
  }
  if (!largeImg) {
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

  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <motion.div
        className={"project-card " + tags.join(" ")}
        variants={cardVariants}
        layoutId={title}
        onClick={() => setSelectedId(title)}
      >
        <img src={thumb} />
        <div className="project-title">
          <motion.h3>{title}</motion.h3>
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedId && (
          <motion.div className="modal-wrapper flex-center">
            <motion.div layoutId={selectedId} className="project-details">
              <motion.button onClick={() => setSelectedId(null)}>
                <i className="fa-solid fa-x"></i>
              </motion.button>
              <motion.img src={largeImg} />
              <motion.div className="detail-text">
                <a href={buildLink} target="blank" className="build-link">
                  <motion.h3>{title}</motion.h3>
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
