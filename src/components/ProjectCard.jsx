import { motion } from "framer-motion";
import fallback from "../img/code.PNG";

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
  const regex = new RegExp(title);
  let image = thumbs.find((value) => regex.test(value));
  if (!image) {
    image = fallback;
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

  return (
    <motion.div
      className={"project-card " + tags.join(" ")}
      variants={cardVariants}
    >
      <img src={image} />
      <div className="project-title">
        <h3>{title}</h3>
      </div>
    </motion.div>
  );
}
