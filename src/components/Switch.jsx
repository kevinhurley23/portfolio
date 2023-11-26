import { motion } from "framer-motion";

export default function Switch({ state, func }) {
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div className="switch" data-ison={state} onClick={func}>
      <motion.div className="handle" layout transition={spring} />
    </div>
  );
}
