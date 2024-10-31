import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import thumbFallback from "../img/code-300.png";
import largeFallback from "../img/code-500.png";

export default function ProjectCard({
  title,
  tags,
  buildLink,
  srcLink,
  description,
}) {
  const [transitionTime, setTransitionTime] = useState("");

  useEffect(() => {
    const projectDetails = document.querySelector(".project-details");
    if (projectDetails) {
      const computedStyle = window.getComputedStyle(projectDetails);
      const duration = parseFloat(computedStyle.transition) * 1000;
      setTransitionTime(duration);
    }
  }, []); // Empty dependency array ensures this runs once after the component mounts

  function importAll(r) {
    return r.keys().map(r);
  }

  function setModalStyles(card, modal, opening) {
    // the opening parameter is a boolean
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const cardXPos = card.getBoundingClientRect().left;
    const cardYPos = card.getBoundingClientRect().top;

    const styles = {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      left: `${cardXPos}px`,
      top: `${cardYPos}px`,
      transform: "translate(0)",
    };

    if (opening) {
      styles.display = "block";
      styles.transition = "0s";
    }

    Object.keys(styles).forEach((key) => {
      modal.style[key] = styles[key];
    });
  }

  function openDetailsModal(event) {
    const card = event.currentTarget;
    const id = card.id;
    const detailsModal = document.querySelector(
      `.project-details[data-id="${id}"]`
    );
    const backdrop = document.querySelector(".modal-backdrop");

    setModalStyles(card, detailsModal, true);
    detailsModal.classList.add("expanded");
    card.style.opacity = 0;
    backdrop.style.zIndex = 2;
    backdrop.style.opacity = 100;
    setTimeout(() => detailsModal.removeAttribute("style"), 20);
  }

  function closeDetailsModal() {
    const detailsModal = document.querySelector(".project-details.expanded");
    const id = detailsModal.dataset.id;
    const card = document.querySelector(`#${id}`);
    const backdrop = document.querySelector(".modal-backdrop");

    setModalStyles(card, detailsModal, false);
    detailsModal.classList.remove("expanded");
    backdrop.style.opacity = "";
    setTimeout(() => {
      detailsModal.style.display = "none";
      card.style.opacity = 100;
      backdrop.style.zIndex = "";
    }, transitionTime * 0.9);
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

  const spacelessTitle = title.replace(/\s/g, "-");

  return (
    <>
      <motion.div
        id={spacelessTitle}
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
        data-id={spacelessTitle}
        style={{ display: "none" }}
      >
        <button onClick={() => closeDetailsModal()}>
          <i className="fa-solid fa-x"></i>
        </button>
        <img src={largeImg} />
        {/* <div className="detail-text">
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
        </div> */}
      </div>
    </>
  );
}
