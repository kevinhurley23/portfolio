import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { projects } from "./projectsArray";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-300px 0px",
  });

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
        />
      ))}
    </motion.div>
  );
}
