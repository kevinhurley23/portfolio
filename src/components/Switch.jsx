import { motion } from "framer-motion";

export default function Switch({ id, state, func }) {
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div id={id} className="switch" data-isOn={state} onClick={func}>
      <motion.div className="handle" layout transition={spring} />
    </div>
  );
}
