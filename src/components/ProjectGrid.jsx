import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { projects } from "./projectsArray";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-300px 0px",
  });

  const [transitionTime, setTransitionTime] = useState("");

  useEffect(() => {
    const projectDetails = document.querySelector(".project-details");
    if (projectDetails) {
      const computedStyle = window.getComputedStyle(projectDetails);
      const duration = parseFloat(computedStyle.transition) * 1000;
      setTransitionTime(duration);
    }
  }, []); // Empty dependency array ensures this runs once after the component mounts

  function setModalStyles(card, modal, opening) {
    // the 'opening' parameter is a boolean
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
    card.style.opacity = 0;
    backdrop.style.zIndex = 2;
    backdrop.style.opacity = 100;
    setTimeout(() => {
      detailsModal.removeAttribute("style");
      detailsModal.classList.add("expanded");
    }, 20);
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
      card.style.opacity = 100;
      backdrop.style.zIndex = "";
    }, transitionTime - 150);
    setTimeout(() => {
      detailsModal.style.display = "none";
    }, transitionTime);
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <div class="modal-backdrop" onClick={() => closeDetailsModal()}></div>
      <motion.div
        id="project-grid"
        variants={gridVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        ref={ref}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            tags={project.tags}
            buildLink={project.buildLink}
            srcLink={project.srcLink}
            description={project.description}
            openDetailsModal={openDetailsModal}
            closeDetailsModal={closeDetailsModal}
          />
        ))}
      </motion.div>
    </>
  );
}
